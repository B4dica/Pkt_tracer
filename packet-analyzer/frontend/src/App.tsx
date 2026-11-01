import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import CaptureControls from "./components/CaptureControls"
import StatsCard from "./components/StatsCard"
import ProtocolChart from "./components/ProtocolChart"
import { useStats } from "./api/client"

const queryClient = new QueryClient()

const inicial = {
  running: false,
  total: 0,
  protocols: {},
}

export default function App() {
  const { data: stats } = useStats()

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Packet Analyzer</h1>
            <p className="text-gray-600">
              Monitoramento de tráfego de rede com Scapy + FastAPI
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CaptureControls />
              <ProtocolChart stats={stats ?? inicial} />
            </div>
            <div>
              <StatsCard stats={stats ?? inicial} />
            </div>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  )
}
