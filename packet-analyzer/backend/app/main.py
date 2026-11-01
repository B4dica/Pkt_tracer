from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import Config
from .models import CaptureResponse, StatsResponse, StartRequest
from .sniffer import PacketSniffer


sniffer = PacketSniffer()


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    sniffer.stop()


app = FastAPI(title="Packet Analyzer", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/stats", response_model=StatsResponse)
def get_stats():
    data = sniffer.snapshot()
    data["updated_at"] = datetime.utcnow().isoformat() + "Z"
    return data


@app.post("/capture/start", response_model=CaptureResponse)
def start_capture(req: StartRequest):
    sniffer.stop()
    sniffer.start(iface=req.iface, bpf=req.bpf)
    return CaptureResponse(ok=True, message="Captura iniciada")


@app.post("/capture/stop", response_model=CaptureResponse)
def stop_capture():
    sniffer.stop()
    return CaptureResponse(ok=True, message="Captura parada")


@app.post("/capture/reset", response_model=CaptureResponse)
def reset_capture():
    sniffer.reset()
    return CaptureResponse(ok=True, message="Contadores zerados")
