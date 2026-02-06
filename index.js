const express = require("express");
const cors = require("cors");

const { authors, books, sales, withdrawals } = require("./data");
const {
  getTotalSold,
  getTotalRoyalty,
  getAuthorTotalEarnings,
  getAuthorCurrentBalance
} = require("./utils");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json());

// 1) GET-> /authors

app.get("/authors", (req, res) => {
  const result = authors.map((author) => {
    const totalEarnings = getAuthorTotalEarnings(author.id);
    const currentBalance = getAuthorCurrentBalance(author.id);

    return {
      id: author.id,
      name: author.name,
      total_earnings: totalEarnings,
      current_balance: currentBalance
    };
  });

  res.json(result);
});

// 2) GET-> /authors/:id

app.get("/authors/:id", (req, res) => {
  const authorId = parseInt(req.params.id);

  const author = authors.find((a) => a.id === authorId);

  if (!author) {
    return res.status(404).json({ error: "Author not found" });
  }

  const authorBooks = books.filter((b) => b.author_id === authorId);

  const booksData = authorBooks.map((book) => {
    const totalSold = getTotalSold(book.id);
    const totalRoyalty = getTotalRoyalty(book);

    return {
      id: book.id,
      title: book.title,
      royalty_per_sale: book.royalty_per_sale,
      total_sold: totalSold,
      total_royalty: totalRoyalty
    };
  });

  const totalEarnings = getAuthorTotalEarnings(authorId);
  const currentBalance = getAuthorCurrentBalance(authorId);

  res.json({
    id: author.id,
    name: author.name,
    email: author.email,
    total_books: authorBooks.length,
    total_earnings: totalEarnings,
    current_balance: currentBalance,
    books: booksData
  });
});

// 3) GET-> /authors/:id/sales

app.get("/authors/:id/sales", (req, res) => {
  const authorId = parseInt(req.params.id);

  const author = authors.find((a) => a.id === authorId);

  if (!author) {
    return res.status(404).json({ error: "Author not found" });
  }

  const authorBooks = books.filter((b) => b.author_id === authorId);
  const authorBookIds = authorBooks.map((b) => b.id);

  const authorSales = sales
    .filter((s) => authorBookIds.includes(s.book_id))
    .map((sale) => {
      const book = books.find((b) => b.id === sale.book_id);
      const royaltyEarned = sale.quantity * book.royalty_per_sale;

      return {
        book_title: book.title,
        quantity: sale.quantity,
        royalty_earned: royaltyEarned,
        sale_date: sale.sale_date
      };
    })
    .sort((a, b) => new Date(b.sale_date) - new Date(a.sale_date));

  res.json(authorSales);
});

// 4) POST-> /withdrawals

app.post("/withdrawals", (req, res) => {
  const { author_id, amount } = req.body;

  const author = authors.find((a) => a.id === author_id);

  if (!author) {
    return res.status(404).json({ error: "Author not found" });
  }

  if (amount < 500) {
    return res.status(400).json({ error: "Minimum withdrawal amount is ₹500" });
  }

  const currentBalance = getAuthorCurrentBalance(author_id);

  if (amount > currentBalance) {
    return res.status(400).json({ error: "Withdrawal amount exceeds current balance" });
  }

  const newWithdrawal = {
    id: withdrawals.length + 1,
    author_id,
    amount,
    status: "pending",
    created_at: new Date().toISOString()
  };

  withdrawals.push(newWithdrawal);

  const newBalance = getAuthorCurrentBalance(author_id);

  res.status(201).json({
    message: "Withdrawal request created successfully",
    withdrawal: newWithdrawal,
    new_balance: newBalance
  });
});

// 5) GET--> /authors/:id/withdrawals

app.get("/authors/:id/withdrawals", (req, res) => {
  const authorId = parseInt(req.params.id);

  const author = authors.find((a) => a.id === authorId);

  if (!author) {
    return res.status(404).json({ error: "Author not found" });
  }

  const authorWithdrawals = withdrawals
    .filter((w) => w.author_id === authorId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  res.json(authorWithdrawals);
});

// test route

app.get("/", (req, res) => {
  res.send("BookLeaf API Running Successfully");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
