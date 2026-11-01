import threading
from collections import Counter, deque
from datetime import datetime, timezone

from scapy.all import AsyncSniffer, ARP, ICMP, IP, TCP, UDP


class PacketSniffer:
    def __init__(self):
        self._lock = threading.Lock()
        self._contador = Counter()      # contagem por protocolo
        self._total = 0
        self._sniffer = None
        self._running = False
        self._ultimos = deque(maxlen=200)  # ultimos pacotes vistos

    def _processar(self, pkt):
        # chamado na thread do AsyncSniffer
        proto = "OTHER"
        if pkt.haslayer(TCP):
            proto = "TCP"
        elif pkt.haslayer(UDP):
            proto = "UDP"
        elif pkt.haslayer(ICMP):
            proto = "ICMP"
        elif pkt.haslayer(ARP):
            proto = "ARP"
        elif pkt.haslayer(IP):
            proto = "IP"

        with self._lock:
            self._contador[proto] += 1
            self._total += 1
            self._ultimos.appendleft({
                "ts": datetime.now(timezone.utc).isoformat(),
                "proto": proto,
            })

    def start(self, iface="eth0", bpf="ip"):
        if self._running:
            return
        self._sniffer = AsyncSniffer(
            iface=iface,
            filter=bpf,
            store=False,
            prn=self._processar,
        )
        self._sniffer.start()
        self._running = True

    def stop(self):
        if self._sniffer:
            try:
                self._sniffer.stop()
            except Exception:
                pass
        self._sniffer = None
        self._running = False

    def snapshot(self):
        # a API chama isso para obter o estado atual
        with self._lock:
            return {
                "running": self._running,
                "total": self._total,
                "protocols": dict(self._contador),
                "recent": list(self._ultimos),
            }

    def reset(self):
        with self._lock:
            self._contador.clear()
            self._total = 0
            self._ultimos.clear()
