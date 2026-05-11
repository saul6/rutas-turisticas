'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const ciudades = [
  {
    nombre: 'Morelia',
    descripcion: 'Capital del estado, Patrimonio de la Humanidad UNESCO. Catedral barroca, acueducto colonial y vibrante vida cultural.',
    emoji: '🏛️',
  },
  {
    nombre: 'Pátzcuaro',
    descripcion: 'A orillas del icónico lago purépecha. Famosa por la Noche de Muertos y sus ricas artesanías.',
    emoji: '🏮',
  },
  {
    nombre: 'Uruapan',
    descripcion: 'La ciudad de la eterna primavera. Parque Nacional, cascadas y la tierra del aguacate.',
    emoji: '🌿',
  },
  {
    nombre: 'Zamora',
    descripcion: 'Ciudad de las fresas y majestuosa catedral neogótica. Centro agrícola y comercial del estado.',
    emoji: '🍓',
  },
  {
    nombre: 'Zitácuaro',
    descripcion: 'Puerta a la Reserva de la Biósfera Mariposa Monarca. Naturaleza espectacular cada invierno.',
    emoji: '🦋',
  },
  {
    nombre: 'Lázaro Cárdenas',
    descripcion: 'Puerto industrial sobre el Pacífico. Playas, mangles y puerto de altura estratégico.',
    emoji: '⚓',
  },
  {
    nombre: 'Apatzingán',
    descripcion: 'Cuna de la Constitución de 1814. Tierra caliente con exuberante producción citrícola.',
    emoji: '📜',
  },
  {
    nombre: 'Sahuayo',
    descripcion: 'Ciudad artesanal famosa por su jarcería y mercado. Centro comercial del occidente michoacano.',
    emoji: '🧺',
  },
  {
    nombre: 'Jacona',
    descripcion: 'Joya colonial con el Parque Hermanos López Rayón. Arquitectura y tradición en el Bajío michoacano.',
    emoji: '🌳',
  },
  {
    nombre: 'Tacámbaro',
    descripcion: 'Pueblo mágico de arquitectura colonial, balnearios naturales y paisajes de montaña.',
    emoji: '🏞️',
  },
  {
    nombre: 'Tingambato',
    descripcion: 'Hogar de la zona arqueológica prehispánica más relevante del estado. Historia viva purépecha.',
    emoji: '🏺',
  },
  {
    nombre: 'Santa Clara del Cobre',
    descripcion: 'Pueblo Mágico del cobre artesanal. Talleres donde se labra el cobre a la manera tradicional.',
    emoji: '🔶',
  },
  {
    nombre: 'Tzintzuntzan',
    descripcion: 'Antigua capital del Imperio Purépecha. Las yácatas y el ex convento franciscano del siglo XVI.',
    emoji: '⛩️',
  },
]

const pasos = [
  {
    numero: '01',
    titulo: 'Elige ciudades',
    descripcion: 'Selecciona tu ciudad de origen y destino en el mapa interactivo de Michoacán.',
    icono: '📍',
  },
  {
    numero: '02',
    titulo: 'Aplica filtros',
    descripcion: 'Configura tu presupuesto, tipo de camino y servicios que necesitas en el trayecto.',
    icono: '⚙️',
  },
  {
    numero: '03',
    titulo: 'Obtén tu ruta óptima',
    descripcion: 'El sistema experto Prolog calcula la mejor ruta según tus preferencias en segundos.',
    icono: '🗺️',
  },
]

const caracteristicas = [
  {
    titulo: 'Rutas más baratas',
    descripcion: 'Minimiza costos de viaje encontrando el camino más económico entre ciudades.',
    icono: '💰',
    color: 'from-green-400 to-emerald-600',
    shadow: 'shadow-green-200',
  },
  {
    titulo: 'Rutas turísticas',
    descripcion: 'Maximiza la experiencia cultural visitando más sitios de interés en tu viaje.',
    icono: '📸',
    color: 'from-teal-400 to-cyan-600',
    shadow: 'shadow-teal-200',
  },
  {
    titulo: 'Control de presupuesto',
    descripcion: 'Define tu límite de gasto y el sistema encuentra rutas que se ajustan a él.',
    icono: '📊',
    color: 'from-emerald-400 to-green-700',
    shadow: 'shadow-emerald-200',
  },
  {
    titulo: 'Mapa interactivo',
    descripcion: 'Visualiza rutas en tiempo real sobre el mapa con tecnología OpenStreetMap.',
    icono: '🗺️',
    color: 'from-green-500 to-teal-700',
    shadow: 'shadow-green-200',
  },
]

export default function LandingPage() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'var(--font-geist-sans), Arial, sans-serif' }}>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-green-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="font-bold text-green-800 text-lg tracking-tight">RutasMichoacán</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#ciudades" className="hidden sm:block text-green-700 hover:text-green-900 text-sm font-medium transition-colors">
              Destinos
            </a>
            <a href="#como-funciona" className="hidden sm:block text-green-700 hover:text-green-900 text-sm font-medium transition-colors">
              Cómo funciona
            </a>
            <Link
              href="/mapa"
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              Explorar rutas →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 pt-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-teal-500/5 rounded-full blur-3xl" />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div
          className={`relative z-10 text-center px-4 max-w-5xl mx-auto transition-all duration-1000 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-green-200 text-sm mb-8">
            <span>✨</span>
            <span>Sistema Experto con Motor de Inferencia Prolog</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
            Descubre{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-green-300">
              Michoacán
            </span>
            <br />
            <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-green-100">a tu manera</span>
          </h1>

          <p className="text-xl sm:text-2xl text-green-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            El primer sistema experto de rutas turísticas que usa{' '}
            <strong className="text-white">inteligencia artificial Prolog</strong> para
            encontrar tu ruta ideal entre los 13 destinos más bellos del estado.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/mapa"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-800 hover:bg-green-50 font-bold px-8 py-4 rounded-full text-lg transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 shadow-lg"
            >
              🗺️ Explorar rutas
            </Link>
            <a
              href="#como-funciona"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/40 hover:border-white text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-200 hover:bg-white/10 backdrop-blur-sm"
            >
              ¿Cómo funciona?
            </a>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-4 max-w-sm mx-auto">
            {[
              { valor: '13', label: 'Ciudades' },
              { valor: '3', label: 'Tipos de ruta' },
              { valor: '100%', label: 'Gratuito' },
            ].map((stat) => (
              <div key={stat.label} className="text-center bg-white/10 backdrop-blur-sm rounded-2xl py-4 px-2 border border-white/10">
                <div className="text-3xl font-black text-white">{stat.valor}</div>
                <div className="text-green-300 text-xs mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Simple y rápido
            </span>
            <h2 className="text-4xl font-black text-gray-900 mb-4">¿Cómo funciona?</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Tres simples pasos para descubrir la ruta perfecta en Michoacán
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-14 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 bg-gradient-to-r from-green-300 via-green-500 to-green-300 opacity-40" />

            {pasos.map((paso) => (
              <div
                key={paso.numero}
                className="relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg shadow-green-100 group-hover:scale-110 transition-transform duration-300">
                  {paso.icono}
                </div>
                <div className="absolute top-5 right-6 text-6xl font-black text-green-200 select-none leading-none">
                  {paso.numero}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{paso.titulo}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{paso.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Potenciado por IA
            </span>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Características del sistema</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Motor de inferencia Prolog para calcular rutas óptimas en tiempo real
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {caracteristicas.map((c) => (
              <div
                key={c.titulo}
                className="group relative overflow-hidden rounded-2xl p-6 bg-gray-50 hover:bg-white border border-gray-100 hover:border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${c.color} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-md ${c.shadow} group-hover:scale-110 transition-transform duration-300`}
                >
                  {c.icono}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{c.titulo}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{c.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ciudades */}
      <section id="ciudades" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              13 destinos
            </span>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Explora{' '}
              <span className="text-green-600">Michoacán</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Riqueza cultural, natural e histórica en el corazón de México
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ciudades.map((ciudad) => (
              <div
                key={ciudad.nombre}
                className="group rounded-2xl p-5 border border-gray-100 bg-white hover:bg-gradient-to-br hover:from-green-600 hover:to-emerald-700 hover:border-green-500 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl flex-shrink-0 mt-0.5">{ciudad.emoji}</span>
                  <div className="min-w-0">
                    <h3 className="font-bold text-base mb-1 text-gray-900 group-hover:text-white transition-colors duration-300">
                      {ciudad.nombre}
                    </h3>
                    <p className="text-xs leading-relaxed text-gray-500 group-hover:text-green-100 transition-colors duration-300">
                      {ciudad.descripcion}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              href="/mapa"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-full text-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
            >
              🗺️ Comenzar a explorar
            </Link>
          </div>
        </div>
      </section>

      {/* Prolog Banner */}
      <section className="py-16 bg-gradient-to-r from-green-800 to-emerald-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-4xl mb-4">🧠</div>
          <h2 className="text-3xl font-black text-white mb-4">
            Inteligencia Artificial al servicio del turismo
          </h2>
          <p className="text-green-200 text-lg max-w-2xl mx-auto mb-8">
            Nuestro motor de inferencia SWI-Prolog analiza miles de combinaciones de rutas
            para encontrar la óptima según tus criterios. No es una simple búsqueda —
            es razonamiento lógico computacional.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {['Ruta más corta', 'Ruta más barata', 'Ruta más turística', 'Filtro por presupuesto', 'Servicios requeridos'].map((tag) => (
              <span key={tag} className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🌿</span>
                <span className="font-black text-xl tracking-tight">RutasMichoacán</span>
              </div>
              <p className="text-green-300 text-sm leading-relaxed">
                Sistema experto de rutas turísticas para descubrir la belleza de Michoacán
                de forma inteligente y personalizada.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-green-200 mb-4 text-sm uppercase tracking-wider">Tecnologías</h4>
              <ul className="space-y-2 text-green-300 text-sm">
                {[
                  { icon: '⚙️', text: 'SWI-Prolog — Motor de inferencia' },
                  { icon: '⚛️', text: 'Next.js 14 + TypeScript' },
                  { icon: '🗺️', text: 'Leaflet.js + OpenStreetMap' },
                  { icon: '🎨', text: 'Tailwind CSS' },
                ].map((item) => (
                  <li key={item.text} className="flex items-center gap-2">
                    <span className="text-base">{item.icon}</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-green-200 mb-4 text-sm uppercase tracking-wider">Destinos disponibles</h4>
              <p className="text-green-300 text-sm leading-relaxed">
                Morelia · Pátzcuaro · Uruapan · Zamora · Zitácuaro · Lázaro Cárdenas ·
                Apatzingán · Sahuayo · Jacona · Tacámbaro · Tingambato ·
                Santa Clara del Cobre · Tzintzuntzan
              </p>
            </div>
          </div>

          <div className="border-t border-green-700/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-green-400 text-sm">
              © 2025 Sistema Experto Rutas Turísticas Michoacán
            </p>
            <div className="flex items-center gap-1.5 text-green-400 text-sm">
              <span>Hecho con</span>
              <span className="text-red-400">❤️</span>
              <span>para Michoacán</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
