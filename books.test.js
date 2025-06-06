process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("./app"); 
const db = require("./db");

// Before all tests run, clean up DB 
beforeAll(async () => {
  await db.query("DELETE FROM books");
});

// After all tests, close DB connection
afterAll(async () => {
  await db.end();
});

describe("Books Routes", () => {
  let testBook = {
    isbn: "1234567890",
    title: "Test Book",
    author: "Test Author",
    language: "English",
    pages: 123,
    publisher: "Test Publisher",
    year: 2020,
    amazon_url: "http://amazon.com/test-book"
  };

  // Clean up before each test
  beforeEach(async () => {
    await db.query("DELETE FROM books");
    await db.query(
      `INSERT INTO books (isbn, title, author, language, pages, publisher, year, amazon_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        testBook.isbn,
        testBook.title,
        testBook.author,
        testBook.language,
        testBook.pages,
        testBook.publisher,
        testBook.year,
        testBook.amazon_url,
      ]
    );
  });

  test("GET /books - returns list of books", async () => {
    const res = await request(app).get("/books");
    expect(res.statusCode).toBe(200);
    expect(res.body.books).toHaveLength(1);
    expect(res.body.books[0]).toHaveProperty("isbn", testBook.isbn);
  });

  test("GET /books/:isbn - returns a single book", async () => {
    const res = await request(app).get(`/books/${testBook.isbn}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.book).toHaveProperty("isbn", testBook.isbn);
  });

  test("POST /books - creates a book", async () => {
    const newBook = {
      isbn: "0987654321",
      title: "New Book",
      author: "New Author",
      language: "English",
      pages: 200,
      publisher: "New Publisher",
      year: 2021,
      amazon_url: "http://amazon.com/new-book"
    };

    const res = await request(app).post("/books").send(newBook);
    expect(res.statusCode).toBe(201);
    expect(res.body.book).toHaveProperty("isbn", newBook.isbn);
  });

  test("POST /books - invalid input returns error", async () => {
    const res = await request(app).post("/books").send({ title: "No ISBN" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("PUT /books/:isbn - updates a book", async () => {
    const updateData = { title: "Updated Title" };
    const res = await request(app).put(`/books/${testBook.isbn}`).send(updateData);
    expect(res.statusCode).toBe(200);
    expect(res.body.book).toHaveProperty("title", "Updated Title");
  });

  test("PUT /books/:isbn - invalid update returns error", async () => {
    const res = await request(app).put(`/books/${testBook.isbn}`).send({ pages: -10 });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("DELETE /books/:isbn - deletes a book", async () => {
    const res = await request(app).delete(`/books/${testBook.isbn}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Book deleted");
  });
});
