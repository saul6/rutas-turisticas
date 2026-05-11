import { spawn } from 'child_process';
import path from 'path';

export interface ResultadoRuta {
  ruta: string[];
  costo: number;
  distancia: number;
}

// Whitelist para prevenir inyección en las consultas Prolog
const CIUDADES_VALIDAS = new Set([
  'morelia', 'patzcuaro', 'uruapan', 'zamora', 'zitacuaro',
  'lazaro_cardenas', 'apatzingan', 'sahuayo', 'jacona',
  'tacambaro', 'tingambato', 'santa_clara_del_cobre', 'tzintzuntzan',
]);

const SWIPL = process.env.SWIPL_PATH ?? 'swipl';
const BASE_REGLAS = path.join(process.cwd(), 'base_reglas.pl');
const TIMEOUT_MS = 15_000;

function validarCiudad(ciudad: string): void {
  if (!CIUDADES_VALIDAS.has(ciudad)) {
    throw new Error(`Ciudad no válida: "${ciudad}"`);
  }
}

function ejecutarConsulta(goal: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn(SWIPL, ['-q', '-g', goal, '-t', 'halt', BASE_REGLAS], {
      cwd: path.dirname(BASE_REGLAS),
    });

    let salida = '';

    const timer = setTimeout(() => {
      proc.kill();
      reject(new Error('Consulta Prolog excedió el tiempo límite'));
    }, TIMEOUT_MS);

    proc.stdout.on('data', (data: Buffer) => {
      salida += data.toString();
    });

    proc.on('close', () => {
      clearTimeout(timer);
      // exit code 1 = goal failed (sin soluciones) → resultado vacío
      resolve(salida.trim());
    });

    proc.on('error', (err: NodeJS.ErrnoException) => {
      clearTimeout(timer);
      reject(new Error(`SWI-Prolog no encontrado: ${err.message}`));
    });
  });
}

// Parsea líneas con formato "ciudad1,ciudad2|costo|distancia"
function parsearLineas(salida: string): ResultadoRuta[] {
  if (!salida) return [];
  return salida
    .split('\n')
    .filter(Boolean)
    .map((linea) => {
      const [rutaStr, costoStr, distStr] = linea.split('|');
      return {
        ruta: rutaStr.split(',').map((c) => c.trim()),
        costo: parseFloat(costoStr) || 0,
        distancia: parseFloat(distStr) || 0,
      };
    });
}

// Goal genérico: recolecta todas las rutas con costo y distancia
function goalTodasConCosto(origen: string, destino: string): string {
  return (
    `findall(R-C-D, ruta_con_costo(${origen},${destino},R,C,D), Lista), ` +
    `forall(member(Ruta-Costo-Dist, Lista), ` +
    `(atomic_list_concat(Ruta,',',RS), format("~w|~w|~w~n", [RS,Costo,Dist])))`
  );
}

// Goal genérico: rutas de un predicado filtro + sus costos, sin duplicados
function goalFiltroConCosto(
  predicado: string,
  origen: string,
  destino: string,
  extraArgs = ''
): string {
  const args = extraArgs ? `${origen},${destino},${extraArgs},R` : `${origen},${destino},R`;
  return (
    `findall(R-C-D, ` +
    `(${predicado}(${args}), ruta_con_costo(${origen},${destino},R,C,D)), ` +
    `Lista), sort(Lista, Unica), ` +
    `forall(member(Ruta-Costo-Dist, Unica), ` +
    `(atomic_list_concat(Ruta,',',RS), format("~w|~w|~w~n", [RS,Costo,Dist])))`
  );
}

/**
 * Devuelve todas las rutas entre dos ciudades con costo y distancia.
 * Equivale a ruta_con_costo/5 para todas las soluciones.
 */
export async function consultarRuta(
  origen: string,
  destino: string
): Promise<ResultadoRuta[]> {
  validarCiudad(origen);
  validarCiudad(destino);
  const salida = await ejecutarConsulta(goalTodasConCosto(origen, destino));
  return parsearLineas(salida);
}

/**
 * Ruta con menor distancia total. → ruta_mas_corta/4
 */
export async function rutaMasCorta(
  origen: string,
  destino: string
): Promise<ResultadoRuta | null> {
  validarCiudad(origen);
  validarCiudad(destino);
  const goal =
    `ruta_mas_corta(${origen},${destino},R,D), ` +
    `once(ruta_con_costo(${origen},${destino},R,C,_)), ` +
    `atomic_list_concat(R,',',RS), ` +
    `format("~w|~w|~w~n", [RS,C,D])`;
  const salida = await ejecutarConsulta(goal);
  return parsearLineas(salida)[0] ?? null;
}

/**
 * Ruta con menor costo de casetas. → ruta_mas_barata/4
 */
export async function rutaMasBarata(
  origen: string,
  destino: string
): Promise<ResultadoRuta | null> {
  validarCiudad(origen);
  validarCiudad(destino);
  const goal =
    `ruta_mas_barata(${origen},${destino},R,C), ` +
    `once(ruta_con_costo(${origen},${destino},R,_,D)), ` +
    `atomic_list_concat(R,',',RS), ` +
    `format("~w|~w|~w~n", [RS,C,D])`;
  const salida = await ejecutarConsulta(goal);
  return parsearLineas(salida)[0] ?? null;
}

/**
 * Rutas que pasan por al menos un lugar turístico. → ruta_turistica/3
 * Elimina duplicados (un lugar puede tener múltiples servicios turísticos).
 */
export async function rutaTuristica(
  origen: string,
  destino: string
): Promise<ResultadoRuta[]> {
  validarCiudad(origen);
  validarCiudad(destino);
  const salida = await ejecutarConsulta(
    goalFiltroConCosto('ruta_turistica', origen, destino)
  );
  return parsearLineas(salida);
}

/**
 * Rutas cuyo costo total no supera el presupuesto. → ruta_en_presupuesto/4
 */
export async function rutaEnPresupuesto(
  origen: string,
  destino: string,
  presupuesto: number
): Promise<ResultadoRuta[]> {
  validarCiudad(origen);
  validarCiudad(destino);
  if (!Number.isFinite(presupuesto) || presupuesto < 0) {
    throw new Error('El presupuesto debe ser un número positivo');
  }
  const salida = await ejecutarConsulta(
    goalFiltroConCosto('ruta_en_presupuesto', origen, destino, String(presupuesto))
  );
  return parsearLineas(salida);
}

/**
 * Todas las rutas posibles entre dos ciudades, con sus métricas.
 * → todas_las_rutas/3 + ruta_con_costo/5
 */
export async function todasLasRutas(
  origen: string,
  destino: string
): Promise<ResultadoRuta[]> {
  validarCiudad(origen);
  validarCiudad(destino);
  const salida = await ejecutarConsulta(goalTodasConCosto(origen, destino));
  return parsearLineas(salida);
}
