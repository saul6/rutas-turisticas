'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import { useState } from 'react'

interface ResultadoRuta {
  ruta: string[]
  costo: number
  distancia: number
}

type TipoRuta = 'corta' | 'barata' | 'turistica' | 'presupuesto'

interface Ciudad {
  nombre: string
  coords: [number, number]
}

const CIUDADES: Record<string, Ciudad> = {
  morelia:               { nombre: 'Morelia',               coords: [19.7069, -101.1945] },
  patzcuaro:             { nombre: 'Pátzcuaro',             coords: [19.5154, -101.6096] },
  uruapan:               { nombre: 'Uruapan',               coords: [19.4197, -102.0597] },
  zamora:                { nombre: 'Zamora',                coords: [19.9830, -102.2836] },
  zitacuaro:             { nombre: 'Zitácuaro',             coords: [19.4328, -100.3552] },
  lazaro_cardenas:       { nombre: 'Lázaro Cárdenas',       coords: [17.9583, -102.1676] },
  apatzingan:            { nombre: 'Apatzingán',            coords: [19.0875, -102.3527] },
  sahuayo:               { nombre: 'Sahuayo',               coords: [20.0653, -102.7231] },
  jacona:                { nombre: 'Jacona',                coords: [19.9736, -102.3214] },
  tacambaro:             { nombre: 'Tacámbaro',             coords: [19.2428, -101.4597] },
  tingambato:            { nombre: 'Tingambato',            coords: [19.5667, -101.8833] },
  santa_clara_del_cobre: { nombre: 'Santa Clara del Cobre', coords: [19.4000, -101.6333] },
  tzintzuntzan:          { nombre: 'Tzintzuntzan',          coords: [19.6333, -101.5833] },
}

const MICHOACAN_CENTER: [number, number] = [19.2, -101.9]

const TIPO_LABELS: Record<TipoRuta, string> = {
  corta:       'Más corta',
  barata:      'Más barata',
  turistica:   'Turística',
  presupuesto: 'Presupuesto',
}

// Custom circular marker icons using DivIcon (avoids the webpack image-path issue)
function crearIcono(tipo: 'normal' | 'origen' | 'destino' | 'ruta') {
  const config: Record<string, { color: string; size: number; ring: string }> = {
    normal:  { color: '#16a34a', size: 13, ring: 'white' },
    origen:  { color: '#2563eb', size: 18, ring: 'white' },
    destino: { color: '#dc2626', size: 18, ring: 'white' },
    ruta:    { color: '#f59e0b', size: 15, ring: 'white' },
  }
  const { color, size } = config[tipo]
  return L.divIcon({
    className: '',
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:${color};border:2px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,0.35);cursor:pointer;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 5)],
  })
}

export default function MapaCliente() {
  const [origen, setOrigen] = useState('')
  const [destino, setDestino] = useState('')
  const [tipoRuta, setTipoRuta] = useState<TipoRuta>('corta')
  const [presupuesto, setPresupuesto] = useState('')
  const [resultados, setResultados] = useState<ResultadoRuta[]>([])
  const [idxActivo, setIdxActivo] = useState(0)
  const [panelAbierto, setPanelAbierto] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const rutaActiva = resultados[idxActivo] ?? null

  const coordsRuta: [number, number][] = rutaActiva
    ? rutaActiva.ruta
        .map((id) => CIUDADES[id]?.coords)
        .filter((c): c is [number, number] => !!c)
    : []

  const tipoIcono = (id: string): 'normal' | 'origen' | 'destino' | 'ruta' => {
    if (id === origen) return 'origen'
    if (id === destino) return 'destino'
    if (rutaActiva?.ruta.includes(id)) return 'ruta'
    return 'normal'
  }

  // First click → origen; second click (different city) → destino; third → reset
  const handleMarcadorClick = (id: string) => {
    if (!origen || (origen && destino)) {
      setOrigen(id)
      setDestino('')
      setResultados([])
      setError('')
    } else if (id !== origen) {
      setDestino(id)
    }
  }

  const limpiar = () => {
    setOrigen('')
    setDestino('')
    setResultados([])
    setError('')
    setIdxActivo(0)
    setPanelAbierto(false)
  }

  const cambiarTipo = (tipo: TipoRuta) => {
    setTipoRuta(tipo)
    setResultados([])
    setError('')
    setIdxActivo(0)
    setPanelAbierto(false)
  }

  const buscarRuta = async () => {
    if (!origen || !destino) {
      setError('Selecciona ciudad de origen y destino')
      return
    }
    if (tipoRuta === 'presupuesto' && (!presupuesto || Number(presupuesto) <= 0)) {
      setError('Ingresa un presupuesto mayor a 0')
      return
    }

    setCargando(true)
    setError('')
    setResultados([])
    setIdxActivo(0)
    setPanelAbierto(false)

    try {
      let nuevasRutas: ResultadoRuta[] = []

      if (tipoRuta === 'corta') {
        const res = await fetch(`/api/rutas/corta?origen=${origen}&destino=${destino}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        nuevasRutas = [data]
      } else if (tipoRuta === 'barata') {
        const res = await fetch(`/api/rutas/barata?origen=${origen}&destino=${destino}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        nuevasRutas = [data]
      } else if (tipoRuta === 'turistica') {
        const res = await fetch(`/api/rutas/turistica?origen=${origen}&destino=${destino}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        nuevasRutas = data.rutas ?? []
      } else {
        const res = await fetch('/api/rutas/presupuesto', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ origen, destino, presupuesto: Number(presupuesto) }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        nuevasRutas = data.rutas ?? []
      }

      if (nuevasRutas.length === 0) {
        setError('No se encontraron rutas con los criterios seleccionados')
      } else {
        setResultados(nuevasRutas)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar con el servidor')
    } finally {
      setCargando(false)
    }
  }

  const nombreCiudad = (id: string) => CIUDADES[id]?.nombre ?? id

  const paradas = rutaActiva ? rutaActiva.ruta.length - 2 : 0

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* ── Header ── */}
      <header className="bg-green-700 text-white px-5 py-3 flex items-center justify-between shadow-md shrink-0 z-10">
        <div>
          <h1 className="text-lg font-bold leading-tight tracking-tight">
            Rutas Turísticas · Michoacán
          </h1>
          <p className="text-green-300 text-xs">Sistema experto · SWI-Prolog + Next.js</p>
        </div>
        <div className="flex gap-1.5">
          {origen && (
            <span className="bg-blue-600 text-white text-xs px-2.5 py-1 rounded-full font-medium">
              {nombreCiudad(origen)}
            </span>
          )}
          {destino && (
            <>
              <span className="text-green-300 text-xs self-center">→</span>
              <span className="bg-red-600 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                {nombreCiudad(destino)}
              </span>
            </>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Side Panel ── */}
        <aside className="w-72 bg-white border-r border-gray-200 flex flex-col overflow-y-auto shrink-0">

          {/* Ciudades */}
          <section className="p-4 border-b border-gray-100">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Ciudades
            </h2>
            <div className="space-y-2">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1.5">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: '#2563eb' }}
                  />
                  Origen
                </label>
                <select
                  value={origen}
                  onChange={(e) => {
                    setOrigen(e.target.value)
                    setResultados([])
                    setError('')
                  }}
                  className={`w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 ${
                    origen
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="" className="bg-white text-gray-400">— Elige o haz clic en el mapa —</option>
                  {Object.entries(CIUDADES).map(([id, c]) => (
                    <option key={id} value={id} className="bg-white text-gray-900">{c.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1.5">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: '#dc2626' }}
                  />
                  Destino
                </label>
                <select
                  value={destino}
                  onChange={(e) => {
                    setDestino(e.target.value)
                    setResultados([])
                    setError('')
                  }}
                  className={`w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 ${
                    destino
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="" className="bg-white text-gray-400">— Elige o haz clic en el mapa —</option>
                  {Object.entries(CIUDADES)
                    .filter(([id]) => id !== origen)
                    .map(([id, c]) => (
                      <option key={id} value={id} className="bg-white text-gray-900">{c.nombre}</option>
                    ))}
                </select>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center italic">
              1er clic = origen · 2do clic = destino
            </p>
          </section>

          {/* Tipo de ruta */}
          <section className="p-4 border-b border-gray-100">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Tipo de ruta
            </h2>
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(TIPO_LABELS) as TipoRuta[]).map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => cambiarTipo(tipo)}
                  className={`text-xs px-2 py-2 rounded-lg border font-medium transition-all ${
                    tipoRuta === tipo
                      ? 'bg-green-600 border-green-600 text-white shadow-sm'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700'
                  }`}
                >
                  {TIPO_LABELS[tipo]}
                </button>
              ))}
            </div>

            {tipoRuta === 'presupuesto' && (
              <div className="mt-3">
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  Presupuesto máximo (MXN)
                </label>
                <input
                  type="number"
                  min="0"
                  value={presupuesto}
                  onChange={(e) => setPresupuesto(e.target.value)}
                  placeholder="Ej: 200"
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            )}
          </section>

          {/* Buscar */}
          <section className="p-4 border-b border-gray-100">
            <button
              onClick={buscarRuta}
              disabled={cargando || !origen || !destino}
              className="w-full py-2.5 bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm shadow-sm"
            >
              {cargando ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Consultando Prolog...
                </span>
              ) : (
                'Buscar ruta'
              )}
            </button>

            {(origen || destino) && (
              <button
                onClick={limpiar}
                className="w-full mt-1.5 py-1.5 text-xs text-gray-500 hover:text-red-600 transition-colors"
              >
                Limpiar selección
              </button>
            )}

            {error && (
              <div className="mt-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <p className="text-red-600 text-xs">{error}</p>
              </div>
            )}
          </section>

          {/* Resultados */}
          {resultados.length > 0 && (
            <section className="p-4 flex-1">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {resultados.length === 1
                  ? 'Ruta encontrada'
                  : `${resultados.length} rutas encontradas`}
              </h2>

              <div className="space-y-2">
                {resultados.map((r, i) => {
                  const activa = i === idxActivo && panelAbierto
                  const previa = i === idxActivo && !panelAbierto
                  return (
                    <div
                      key={i}
                      onClick={() => { setIdxActivo(i); setPanelAbierto(false) }}
                      className={`rounded-xl border p-3 transition-all cursor-pointer ${
                        activa
                          ? 'border-2 border-green-600 bg-green-50 shadow-md'
                          : previa
                          ? 'border-2 border-green-300 bg-green-50 shadow-sm'
                          : 'border border-gray-200 bg-white hover:border-green-300 hover:bg-gray-50'
                      }`}
                    >
                      {/* Cabecera de tarjeta */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-700">
                          {resultados.length > 1 ? `Opción ${i + 1}` : TIPO_LABELS[tipoRuta]}
                        </span>
                        {activa && (
                          <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-medium">
                            en curso
                          </span>
                        )}
                      </div>

                      {/* Métricas */}
                      <div className="grid grid-cols-3 gap-1 mb-2">
                        <div className={`rounded-lg p-1.5 text-center ${activa ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <p className="text-xs font-bold text-gray-800">{r.distancia}</p>
                          <p className="text-xs text-gray-500">km</p>
                        </div>
                        <div className={`rounded-lg p-1.5 text-center ${activa ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <p className="text-xs font-bold text-gray-800">${r.costo}</p>
                          <p className="text-xs text-gray-500">MXN</p>
                        </div>
                        <div className={`rounded-lg p-1.5 text-center ${activa ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <p className="text-xs font-bold text-gray-800">
                            {r.ruta.length - 2 === 0 ? '—' : r.ruta.length - 2}
                          </p>
                          <p className="text-xs text-gray-500">
                            {r.ruta.length - 2 === 0 ? 'directa' : 'paradas'}
                          </p>
                        </div>
                      </div>

                      {/* Recorrido */}
                      <p className="text-xs text-gray-500 leading-relaxed mb-2">
                        {r.ruta.map((id) => nombreCiudad(id)).join(' → ')}
                      </p>

                      {/* Botón Iniciar ruta */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setIdxActivo(i)
                          setPanelAbierto(true)
                        }}
                        className={`w-full py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          activa
                            ? 'bg-green-600 text-white cursor-default'
                            : 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white'
                        }`}
                      >
                        {activa ? 'Ruta activa en el mapa' : 'Iniciar ruta'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </aside>

        {/* ── Mapa ── */}
        <main className="flex-1 relative">
          <MapContainer
            center={MICHOACAN_CENTER}
            zoom={8}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Línea de ruta activa */}
            {coordsRuta.length > 1 && (
              <Polyline
                positions={coordsRuta}
                color="#15803d"
                weight={4}
                opacity={0.85}
                dashArray="14 7"
              />
            )}

            {/* Marcadores de ciudades */}
            {Object.entries(CIUDADES).map(([id, ciudad]) => (
              <Marker
                key={id}
                position={ciudad.coords}
                icon={crearIcono(tipoIcono(id))}
                eventHandlers={{ click: () => handleMarcadorClick(id) }}
              >
                <Popup>
                  <div className="text-sm min-w-[140px]">
                    <p className="font-semibold text-gray-800">{ciudad.nombre}</p>
                    {id === origen && (
                      <p className="text-blue-600 text-xs mt-0.5 font-medium">Origen seleccionado</p>
                    )}
                    {id === destino && (
                      <p className="text-red-600 text-xs mt-0.5 font-medium">Destino seleccionado</p>
                    )}
                    {rutaActiva?.ruta.includes(id) && id !== origen && id !== destino && (
                      <p className="text-amber-600 text-xs mt-0.5 font-medium">Parada intermedia</p>
                    )}
                    {!origen && (
                      <p className="text-gray-400 text-xs mt-0.5">Clic para seleccionar como origen</p>
                    )}
                    {origen && !destino && id !== origen && (
                      <p className="text-gray-400 text-xs mt-0.5">Clic para seleccionar como destino</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Leyenda */}
          <div className="absolute bottom-5 right-3 bg-white rounded-xl shadow-lg border border-gray-100 px-3 py-2.5 z-[1000] text-xs space-y-1.5">
            <p className="font-semibold text-gray-500 text-xs uppercase tracking-wide mb-1">Leyenda</p>
            {[
              { color: '#16a34a', label: 'Ciudad' },
              { color: '#2563eb', label: 'Origen' },
              { color: '#dc2626', label: 'Destino' },
              { color: '#f59e0b', label: 'En ruta' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full border border-white shadow-sm shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-gray-600">{label}</span>
              </div>
            ))}
          </div>

          {/* Panel inferior de resumen — visible al hacer clic en "Iniciar ruta" */}
          {rutaActiva && panelAbierto && (
            <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-white border-t-2 border-green-600 shadow-2xl">
              {/* Barra de título */}
              <div className="flex items-center justify-between bg-green-600 px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span className="text-white text-sm font-semibold">
                    {nombreCiudad(origen)} → {nombreCiudad(destino)}
                  </span>
                  {resultados.length > 1 && (
                    <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                      Opción {idxActivo + 1}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setPanelAbierto(false)}
                  className="text-green-200 hover:text-white text-lg leading-none font-bold transition-colors"
                  title="Cerrar panel"
                >
                  ×
                </button>
              </div>

              {/* Métricas + recorrido */}
              <div className="px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
                {/* Stats */}
                <div className="flex gap-4 shrink-0">
                  <div className="text-center">
                    <p className="text-base font-bold text-gray-800">{rutaActiva.distancia} km</p>
                    <p className="text-xs text-gray-500">Distancia</p>
                  </div>
                  <div className="w-px bg-gray-200 self-stretch" />
                  <div className="text-center">
                    <p className="text-base font-bold text-gray-800">${rutaActiva.costo} MXN</p>
                    <p className="text-xs text-gray-500">Casetas</p>
                  </div>
                  <div className="w-px bg-gray-200 self-stretch" />
                  <div className="text-center">
                    <p className="text-base font-bold text-gray-800">
                      {paradas === 0 ? 'Directa' : paradas}
                    </p>
                    <p className="text-xs text-gray-500">
                      {paradas === 0 ? 'Sin paradas' : `parada${paradas !== 1 ? 's' : ''}`}
                    </p>
                  </div>
                </div>

                <div className="hidden sm:block w-px bg-gray-200 self-stretch" />

                {/* Recorrido detallado */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide font-semibold">Recorrido</p>
                  <div className="flex flex-wrap items-center gap-1">
                    {rutaActiva.ruta.map((id, i) => (
                      <span key={id} className="flex items-center gap-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          id === origen
                            ? 'bg-blue-100 text-blue-700'
                            : id === destino
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {nombreCiudad(id)}
                        </span>
                        {i < rutaActiva.ruta.length - 1 && (
                          <span className="text-gray-300 text-xs">→</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
