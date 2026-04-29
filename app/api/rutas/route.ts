import { NextRequest, NextResponse } from 'next/server';
import { consultarRuta } from '@/lib/prolog';

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

  const { origen, destino } = body as Record<string, unknown>;

  if (typeof origen !== 'string' || typeof destino !== 'string' || !origen || !destino) {
    return NextResponse.json(
      { error: 'Se requieren los campos origen y destino (string)' },
      { status: 400 }
    );
  }

  try {
    const rutas = await consultarRuta(origen, destino);
    return NextResponse.json({ rutas });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error interno';
    const status = mensaje.includes('no válida') ? 400 : 500;
    return NextResponse.json({ error: mensaje }, { status });
  }
}
