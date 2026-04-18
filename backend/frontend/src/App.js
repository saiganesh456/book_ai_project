import React, { useEffect, useState } from "react";

function App() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // 🤖 AI results
  const [aiResult, setAiResult] = useState({});

  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    rating: 1,
    image: "",
    price: 100,
    genre: "",
  });

  // 🔥 Fetch books
  const fetchBooks = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/books/")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // ➕ Add Book
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://127.0.0.1:8000/books/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    }).then(() => {
      fetchBooks();
      setForm({
        title: "",
        author: "",
        description: "",
        rating: 1,
        image: "",
        price: 100,
        genre: "",
      });
    });
  };

  // ❌ Delete
  const deleteBook = (id) => {
    fetch(`http://127.0.0.1:8000/books/${id}/`, {
      method: "DELETE",
    }).then(() => fetchBooks());
  };

  // 🤖 AI Summary
  const getAI = (id) => {
    fetch(`http://127.0.0.1:8000/books/ai/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setAiResult((prev) => ({
          ...prev,
          [id]: data.summary,
        }));
      });
  };

  // 🔍 Search
  const filteredBooks = books.filter(
    (b) =>
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.author?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold text-center mb-6">
        📚 AI Book Store
      </h1>

      {/* SEARCH */}
      <input
        placeholder="Search books..."
        className="block mx-auto mb-6 p-2 border rounded w-1/2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow max-w-xl mx-auto mb-8"
      >
        <h3 className="font-bold mb-4">Add Book</h3>

        <input
          placeholder="Title"
          className="w-full mb-2 p-2 border"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          placeholder="Author"
          className="w-full mb-2 p-2 border"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="w-full mb-2 p-2 border"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          placeholder="Image URL"
          className="w-full mb-2 p-2 border"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />

        <input
          type="number"
          placeholder="Price"
          className="w-full mb-2 p-2 border"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <input
          placeholder="Genre"
          className="w-full mb-2 p-2 border"
          value={form.genre}
          onChange={(e) => setForm({ ...form, genre: e.target.value })}
        />

        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-3">
          Add Book
        </button>
      </form>

      {/* BOOK LIST */}
      {loading ? (
        <p className="text-center">Loading books...</p>
      ) : filteredBooks.length === 0 ? (
        <p className="text-center text-gray-500">No books found</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div key={book.id} className="bg-white p-4 rounded shadow">

              {/* 🔥 IMAGE FIX */}
              <img
                src={
                  book.image && book.image.startsWith("http")
                    ? book.image
                    : `https://picsum.photos/200/300?random=${book.id}`
                }
                alt={book.title}
                className="w-full h-48 object-cover mb-2 rounded"
              />

              <h3 className="text-lg font-bold">{book.title}</h3>

              <p className="text-gray-600">{book.author}</p>

              <p className="text-sm">
                {book.description?.slice(0, 80)}...
              </p>

              <p className="text-yellow-500">⭐ {book.rating}</p>

              <p className="text-green-600 font-bold">
                ₹ {book.price}
              </p>

              <p className="text-xs text-gray-500">{book.genre}</p>

              {/* AI BUTTON */}
              <button
                onClick={() => getAI(book.id)}
                className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
              >
                AI Summary
              </button>

              {/* AI RESULT */}
              {aiResult[book.id] && (
                <p className="text-sm mt-2 text-blue-600">
                  🤖 {aiResult[book.id]}
                </p>
              )}

              {/* DELETE */}
              <button
                onClick={() => deleteBook(book.id)}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;