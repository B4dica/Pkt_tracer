import os


class Config:
    IFACE: str = os.getenv("SNIFF_IFACE", "eth0")
    BPF_FILTER: str = os.getenv("SNIFF_BPF", "ip")
    TIME_WINDOW_SECONDS: int = int(os.getenv("SNIFF_WINDOW", "60"))
