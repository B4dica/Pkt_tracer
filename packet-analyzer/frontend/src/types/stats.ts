export interface ProtocolStats {
  [protocol: string]: number
}

export interface StatsResponse {
  running: boolean
  total: number
  protocols: ProtocolStats
  updated_at?: string
}

export interface CaptureResponse {
  ok: boolean
  message: string
}
