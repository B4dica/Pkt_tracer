import axios, { AxiosInstance } from "axios"
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type { StatsResponse, CaptureResponse } from "../types/stats"

const API_BASE = import.meta.env.VITE_API_BASE ?? "/api"

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
})

export function useStats() {
  return useQuery<StatsResponse>({
    queryKey: ["stats"],
    queryFn: async () => {
      const { data } = await api.get<StatsResponse>("/stats")
      return data
    },
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
  })
}

export function useCapture() {
  const qc = useQueryClient()

  const start = useMutation({
    mutationFn: (body: { iface?: string; bpf?: string }) =>
      api.post<CaptureResponse>("/capture/start", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["stats"] }),
  })

  const stop = useMutation({
    mutationFn: () => api.post<CaptureResponse>("/capture/stop"),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["stats"] }),
  })

  const reset = useMutation({
    mutationFn: () => api.post<CaptureResponse>("/capture/reset"),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["stats"] }),
  })

  return { start, stop, reset }
}
