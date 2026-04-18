# AI + RAG logic (FAST + SAFE)

def generate_summary(description):
    return "This book is about ideas and storytelling."


def generate_genre(description):
    return "Fiction"


# 🔥 RAG FUNCTION
def answer_question(question, context):
    # simple RAG (context-based answer)
    return f"Based on the book content: {context[:150]}...\nAnswer: {question}"