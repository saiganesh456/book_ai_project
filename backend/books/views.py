from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer
import requests


# 📚 GET + POST
@api_view(['GET', 'POST'])
def get_books(request):

    if request.method == 'GET':
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        data = request.data

        book = Book.objects.create(
            title=data.get('title'),
            author=data.get('author'),
            description=data.get('description'),
            rating=float(data.get('rating', 1)),
            image=data.get('image'),
            price=float(data.get('price', 100)),
            genre=data.get('genre')
        )

        return Response({"message": "Book added"})


# 📄 GET + DELETE
@api_view(['GET', 'DELETE'])
def get_book_detail(request, id):
    try:
        book = Book.objects.get(id=id)

        if request.method == 'GET':
            serializer = BookSerializer(book)
            return Response(serializer.data)

        elif request.method == 'DELETE':
            book.delete()
            return Response({"message": "Deleted"})

    except Book.DoesNotExist:
        return Response({"error": "Not found"}, status=404)


# 🤖 AI SUMMARY (NEW)
@api_view(['GET'])
def ai_summary(request, id):
    try:
        book = Book.objects.get(id=id)

        response = requests.post(
            "http://127.0.0.1:1234/v1/chat/completions",
            json={
                "model": "tinyllama-1.1b-chat-v1.0",
                "messages": [
                    {
                        "role": "user",
                        "content": f"Give a short summary of this book: {book.title}"
                    }
                ]
            }
        )

        data = response.json()
        summary = data['choices'][0]['message']['content']

        return Response({"summary": summary})

    except Exception as e:
        return Response({"error": str(e)})