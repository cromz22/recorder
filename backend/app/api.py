from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import base64
import subprocess

app = FastAPI()

origins = ["http://localhost:3000", "localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "connected to backend"}

@app.post("/save-audio")
async def save_audio(taskjson: dict) -> dict:
    for utt in taskjson["utterances"]:
        uttid = utt["uttid"]
        blob = utt["audio"]

        with open(f"audio/orig/{uttid}.webm", "wb") as f:
            f.write(base64.b64decode(blob))

        # convert to wav
        input_file = f"audio/orig/{uttid}.webm"
        output_file = f"audio/wav/{uttid}.wav"
        subprocess.call(["ffmpeg", "-i", input_file, "-c:a", "pcm_s16le", output_file])

    return taskjson
