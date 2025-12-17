SUBJECT_KEYWORDS = {
    "DSA": ["stack", "queue", "tree", "graph", "sorting"],
    "OS": ["process", "thread", "deadlock", "scheduling"],
    "DBMS": ["sql", "normalization", "transaction", "index"],
    "Math": ["matrix", "integration", "differentiation"]
}

def classify_subject(text):
    text = text.lower()
    scores = {}
    for subject, words in SUBJECT_KEYWORDS.items():
        scores[subject] = sum(1 for w in words if w in text)
    return max(scores, key=scores.get) if max(scores.values()) > 0 else "Unknown"

