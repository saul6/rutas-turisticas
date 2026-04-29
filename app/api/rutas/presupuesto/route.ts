import { NextRequest, NextResponse } from 'next/server';
import { rutaEnPresupuesto } from '@/lib/prolog';

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Cuerpo de la petición inválido' },
      { status: 400 }
    );
  }

  const { origen, destino, presupuesto } = body as Record<string, unknown>;

  if (typeof origen !== 'string' || typeof destino !== 'string' || !origen || !destino) {
    return NextResponse.json(
      { error: 'Se requieren los campos origen y destino (string)' },
      { status: 400 }
    );
  }

  const presupuestoNum = Number(presupuesto);
  if (!Number.isFinite(presupuestoNum) || presupuestoNum < 0) {
    return NextResponse.json(
      { error: 'El campo presupuesto debe ser un número positivo' },
      { status: 400 }
    );
  }

  try {
    const rutas = await rutaEnPresupuesto(origen, destino, presupuestoNum);
    return NextResponse.json({ rutas });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error interno';
    const status = mensaje.includes('no válida') ? 400 : 500;
    return NextResponse.json({ error: mensaje }, { status });
  }
}
