from django.urls import path
from .views import get_books, get_book_detail, ai_summary

urlpatterns = [
    path('', get_books),
    path('<int:id>/', get_book_detail),
    path('ai/<int:id>/', ai_summary),  # 🔥 NEW
]