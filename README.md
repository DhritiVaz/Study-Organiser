# Study Organiser

A lightweight academic workspace for organising your courses and study material. Upload lecture documents (PDF / PPTX) and the backend automatically classifies them by **subject** and detects the **module/unit**, while the frontend lets you manage courses, documents, and syllabi.

## Features

- **Document upload** — accepts `.pdf` and `.pptx` files.
- **Automatic subject classification** — keyword-based detection across subjects (DSA, OS, DBMS, Math).
- **Module detection** — finds `module`/`unit`/`chapter` references in the text.
- **Course management** — add courses, attach syllabi, and filter documents by course (persisted in the browser via `localStorage`).

## Tech Stack

| Layer    | Technology                                            |
| -------- | ----------------------------------------------------- |
| Backend  | Python, FastAPI, Uvicorn                              |
| Parsing  | pdfplumber (PDF), python-pptx (PPTX)                  |
| ML/Utils | scikit-learn, numpy                                   |
| Frontend | Vanilla HTML / CSS / JavaScript                       |

## Project Structure

```
Study-Organiser/
├── backend/
│   ├── main.py                  # FastAPI app + /upload endpoint
│   ├── requirements.txt
│   ├── classifier/
│   │   ├── extract_pdf.py        # PDF text extraction
│   │   ├── extract_ppt.py        # PPTX text extraction
│   │   ├── subject_classifier.py # Keyword-based subject classifier
│   │   └── module_detector.py    # Module/unit/chapter detector
│   └── storage/                  # Uploaded files (git-ignored)
└── frontend/
    ├── index.html
    ├── app.js
    └── style.css
```

## Getting Started

### Prerequisites

- Python 3.10+
- pip

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000` and interactive docs at `http://127.0.0.1:8000/docs`.

### Frontend

The frontend is fully static. Open `frontend/index.html` directly in a browser, or serve it:

```bash
cd frontend
python -m http.server 5500
```

Then visit `http://127.0.0.1:5500`.

## API

### `POST /upload`

Upload a document for classification.

**Request:** `multipart/form-data` with a `file` field (`.pdf` or `.pptx`).

**Response:**

```json
{
  "filename": "Module 1.pdf",
  "subject": "DSA",
  "module": "module 1"
}
```

## Notes

- CORS is currently open (`allow_origins=["*"]`) for local development. Restrict this before deploying to production.
- Uploaded files are written to `backend/storage/`, which is git-ignored.

## License

This project is currently unlicensed. Add a `LICENSE` file if you intend to share or open-source it.
