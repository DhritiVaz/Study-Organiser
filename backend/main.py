from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from classifier.extract_ppt import extract_ppt_text
from classifier.extract_pdf import extract_pdf_text
from classifier.subject_classifier import classify_subject
from classifier.module_detector import detect_module
import shutil
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure storage directory exists
os.makedirs("storage", exist_ok=True)

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    path = f"storage/{file.filename}"
    with open(path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    if file.filename.endswith(".pptx"):
        text = extract_ppt_text(path)
    else:
        text = extract_pdf_text(path)

    subject = classify_subject(text)
    module = detect_module(text)

    return {
        "filename": file.filename,
        "subject": subject,
        "module": module
    }

