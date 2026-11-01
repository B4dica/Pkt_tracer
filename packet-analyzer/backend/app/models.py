from typing import Dict, Optional

from pydantic import BaseModel


class StatsResponse(BaseModel):
    running: bool
    total: int
    protocols: Dict[str, int]
    updated_at: Optional[str] = None


class StartRequest(BaseModel):
    iface: str = "eth0"
    bpf: str = "ip"


class CaptureResponse(BaseModel):
    ok: bool
    message: str
