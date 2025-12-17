import re

def detect_module(text):
    match = re.search(r"(module|unit|chapter)\s*[0-9ivx]+", text.lower())
    return match.group(0) if match else "Unknown"

