const { books, sales, withdrawals } = require("./data");

// total sold of a book
function getTotalSold(bookId) {
  return sales
    .filter((s) => s.book_id === bookId)
    .reduce((sum, s) => sum + s.quantity, 0);
}

// total royalty of a book
function getTotalRoyalty(book) {
  const totalSold = getTotalSold(book.id);
  return totalSold * book.royalty_per_sale;
}

// author total earnings
function getAuthorTotalEarnings(authorId) {
  const authorBooks = books.filter((b) => b.author_id === authorId);

  return authorBooks.reduce((sum, book) => {
    return sum + getTotalRoyalty(book);
  }, 0);
}

// total withdrawals amount
function getAuthorTotalWithdrawals(authorId) {
  return withdrawals
    .filter((w) => w.author_id === authorId)
    .reduce((sum, w) => sum + w.amount, 0);
}

// current balance
function getAuthorCurrentBalance(authorId) {
  const earnings = getAuthorTotalEarnings(authorId);
  const withdrawn = getAuthorTotalWithdrawals(authorId);

  return earnings - withdrawn;
}

module.exports = {
  getTotalSold,
  getTotalRoyalty,
  getAuthorTotalEarnings,
  getAuthorCurrentBalance
};
