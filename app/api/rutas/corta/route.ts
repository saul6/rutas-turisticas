import { NextRequest, NextResponse } from 'next/server';
import { rutaMasCorta } from '@/lib/prolog';

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
    const ruta = await rutaMasCorta(origen, destino);
    if (!ruta) {
      return NextResponse.json(
        { error: 'No se encontró ruta entre las ciudades indicadas' },
        { status: 404 }
      );
    }
    return NextResponse.json(ruta);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error interno';
    const status = mensaje.includes('no válida') ? 400 : 500;
    return NextResponse.json({ error: mensaje }, { status });
  }
}
