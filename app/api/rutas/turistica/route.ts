import { NextRequest, NextResponse } from 'next/server';
import { rutaTuristica } from '@/lib/prolog';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origen = searchParams.get('origen');
  const destino = searchParams.get('destino');

  if (!origen || !destino) {
    return NextResponse.json(
      { error: 'Se requieren los parámetros origen y destino' },
      { status: 400 }
    );
  }

  try {
    const rutas = await rutaTuristica(origen, destino);
    return NextResponse.json({ rutas });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error interno';
    const status = mensaje.includes('no válida') ? 400 : 500;
    return NextResponse.json({ error: mensaje }, { status });
  }
}
