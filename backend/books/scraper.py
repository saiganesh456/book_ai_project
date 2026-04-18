import requests
from bs4 import BeautifulSoup
from .models import Book


def scrape_books():
    Book.objects.all().delete()
    base_url = "https://books.toscrape.com/"
    response = requests.get(base_url)

    soup = BeautifulSoup(response.text, "html.parser")
    books = soup.find_all("article", class_="product_pod")

    for book in books:
        title = book.h3.a["title"]
        link = book.h3.a["href"]

        # open individual book page
        book_url = base_url + link
        book_page = requests.get(book_url)
        book_soup = BeautifulSoup(book_page.text, "html.parser")

        try:
            description = book_soup.find("meta", {"name": "description"})["content"]
        except:
            description = "No description available"

        Book.objects.create(
            title=title,
            author="Unknown",
            description=description,
            rating=4.0,
            url=book_url
        )