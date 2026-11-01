import type { StatsResponse } from "../types/stats"

interface StatsCardProps {
  stats: StatsResponse
}

export default function StatsCard({ stats }: StatsCardProps) {
  const top = Object.entries(stats.protocols)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Estatísticas
      </h2>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-500 uppercase text-xs tracking-wider">
            Total de pacotes
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.total}
          </div>
        </div>
        <div>
          <div className="text-gray-500 uppercase text-xs tracking-wider">
            Status
          </div>
          <div className={`flex items-center gap-2 text-sm font-medium ${
            stats.running ? "text-green-600" : "text-red-600"
          }`}>
            <span
              className={`w-2 h-2 rounded-full ${
                stats.running ? "bg-green-500 animate-pulse" : "bg-red-500"
              }`}
            ></span>
            {stats.running ? "Capturando" : "Parado"}
          </div>
        </div>
      </div>
      {top.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <div className="text-gray-500 uppercase text-xs tracking-wider mb-2">
            Principais protocolos
          </div>
          <ul className="space-y-2">
            {top.map(([proto, count]) => (
              <li key={proto} className="flex justify-between text-sm">
                <span className="text-gray-600">{proto}</span>
                <span className="font-medium">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
