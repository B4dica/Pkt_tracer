import type { StatsResponse } from "../types/stats"

interface ProtocolChartProps {
  stats: StatsResponse
}

export default function ProtocolChart({ stats }: ProtocolChartProps) {
  const entries = Object.entries(stats.protocols).sort(
    ([, a], [, b]) => b - a
  )
  const max = entries.length ? Math.max(...entries.map(([, c]) => c)) : 1

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Distribuição por Protocolo
      </h2>
      <div className="h-48 flex items-end gap-2">
        {entries.map(([proto, count]) => (
          <div
            key={proto}
            className="flex flex-col items-center gap-1 w-full"
          >
            <div
              className="w-full bg-indigo-600 rounded-t transition-all duration-300"
              style={{ height: `${max > 0 ? (count / max) * 100 : 0}%` }}
            ></div>
            <span className="text-xs text-gray-500">{proto}</span>
            <span className="text-xs font-medium text-gray-900">{count}</span>
          </div>
        ))}
        {entries.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Sem dados
          </div>
        )}
      </div>
    </div>
  )
}
