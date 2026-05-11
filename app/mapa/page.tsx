import dynamic from 'next/dynamic'

const MapaCliente = dynamic(() => import('../components/MapaCliente'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Cargando mapa...</p>
      </div>
    </div>
  ),
})

export default function MapaPage() {
  return <MapaCliente />
}
