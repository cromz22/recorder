from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import base64

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
    # print(taskjson)
    # print(type(taskjson))
    for elem in taskjson:
        blobs = taskjson[elem]
        for blob in blobs:
            print(blob)
            with open("tmp.wav", "wb") as f:
                f.write(base64.b64decode(blob))
    return taskjson
    # return {"message": "connected to backend"}
