import { Play, Stop, RefreshCw } from "lucide-react"
import { useCapture, useStats } from "../api/client"

export default function CaptureControls() {
  const { data: stats } = useStats()
  const { start, stop, reset } = useCapture()
  const running = stats?.running ?? false

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h2 className="text-lg font-semibold text-gray-900">
        Controle de Captura
      </h2>
      <div className="flex gap-2">
        <button
          onClick={() => start.mutate({ iface: "eth0", bpf: "ip" })}
          disabled={running || start.isPending}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 transition"
        >
          <Play className="w-4 h-4" /> Iniciar
        </button>
        <button
          onClick={() => stop.mutate()}
          disabled={!running || stop.isPending}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 transition"
        >
          <Stop className="w-4 h-4" /> Parar
        </button>
        <button
          onClick={() => reset.mutate()}
          disabled={reset.isPending}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 flex items-center gap-2 transition"
        >
          <RefreshCw className="w-4 h-4" /> Reset
        </button>
      </div>
      {start.isError && (
        <p className="text-red-500 text-sm">Erro ao iniciar captura</p>
      )}
      {stop.isError && (
        <p className="text-red-500 text-sm">Erro ao parar captura</p>
      )}
    </div>
  )
}
