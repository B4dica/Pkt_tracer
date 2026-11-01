# Packet Analyzer

Projeto de filtração e análise de pacotes de rede com **Scapy** (backend) e **React + Vite + Tailwind** (frontend).

## Estrutura

```
packet-analyzer/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py        # FastAPI: endpoints + startup/shutdown
│   │   ├── sniffer.py     # AsyncSniffer, contador, fila, lock
│   │   ├── models.py      # Pydantic: schemas de request/response
│   │   └── config.py      # iface, filtro BPF, janela de tempo
│   ├── requirements.txt   # fastapi, uvicorn, scapy
│   └── run.py             # uvicorn entrypoint
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── api/
│   │   │   └── client.ts       # axios + TanStack Query hooks
│   │   ├── components/
│   │   │   ├── ProtocolChart.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   └── CaptureControls.tsx  # start/stop
│   │   └── types/
│   │       └── stats.ts        # tipos compartilhados com backend
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
│
└── README.md
```

## Pré-requisitos

- Python 3.10+
- **Npcap** instalado no Windows (modo de suporte a WinPCap habilitado)
- Node.js 18+ (o usuário prefere `npm` em vez de `pnpm`)
- Executar o terminal como **Administrador** (necessário para captura de pacotes)

## Backend — passo a passo

1. Entre na pasta:
   ```bash
   cd "C:/packet-analyzer/backend"
   ```
2. Crie e ative o ambiente virtual:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   ```
3. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```
4. Inicie a API:
   ```bash
   python run.py
   ```
   A API sobe em `http://localhost:8000`.

### Endpoints

| Método | Caminho | Descrição |
|--------|---------|-----------|
| `GET` | `/stats` | Retorna totais, contagem por protocolo e status da captura |
| `POST` | `/capture/start` | Inicia a captura (`iface`, `bpf`) |
| `POST` | `/capture/stop` | Para a captura |
| `POST` | `/capture/reset` | Zera os contadores |

### Variáveis de ambiente

- `SNIFF_IFACE` — interface de rede (padrão: `eth0`)
- `SNIFF_BPF` — filtro BPF do scapy (padrão: `ip`)
- `SNIFF_WINDOW` — janela de tempo em segundos (padrão: `60`)

## Frontend — passo a passo

1. Entre na pasta:
   ```bash
   cd "C:/packet-analyzer/frontend"
   ```
2. Instale as dependências com npm:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Abra `http://localhost:5173`.

O Vite está configurado com proxy: requisições para `/api` são encaminhadas para `http://localhost:8000`.

## Como o sniffer funciona

`backend/app/sniffer.py` expõe a classe `PacketSniffer`:

- `start(iface, bpf)` — dispara o `AsyncSniffer` do scapy com filtro BPF, sem armazenar pacotes (`store=False`)
- `_processar(pkt)` — executado na thread do `AsyncSniffer`; classifica o pacote em TCP, UDP, ICMP, ARP, IP ou OTHER
- Um `threading.Lock` protege o `Counter` e o total contra condições de corrida
- `snapshot()` — retorna o estado atual consumido pela API FastAPI
- `stop()` / `reset()` — parada e zeragem de contadores

## Notas importantes

- No Windows, a captura de pacotes requer privilégios de administrador e o Npcap com o opção "WinPcap API mode" marcada durante a instalação.
- Scapy captura tráfego em tempo real; nenhuma gravação de arquivo é feita por padrão neste esqueleto.
