# BookLeaf Publishing - Technical Assignment

This project is a REST API built using "Node.js" and "Express.js" for managing authors, their book sales royalties, and withdrawal requests.

The system calculates total earnings and current balance for each author based on book sales and royalty per sale.

# Live Deployment

**Deployed API Base URL:**  
https://bookleaf-xuw5.onrender.com

---

## Tech Stack

- Node.js
- Express.js
- In-Memory Storage (Seed Data)
- REST API Architecture

---

## Features Implemented

### Authors APIs
- Get all authors with total earnings and current balance
- Get author details including books, total royalty, and earnings summary

### Sales APIs
- Get sales history of an author (sorted by latest sale date)

### Withdrawal APIs
- Create withdrawal request with validations
- Get all withdrawals of an author (sorted by latest request date)

---

##  API Endpoints -- Test on Postman

Test 1: GET Authors
https://bookleaf-xuw5.onrender.com/authors

Test 2: GET Single Author
https://bookleaf-xuw5.onrender.com/authors/1

Test 3: GET Sales History
https://bookleaf-xuw5.onrender.com/authors/1/sales

Test 4: POST Withdrawal
https://bookleaf-xuw5.onrender.com/withdrawals

Body → raw → JSON
{
  "author_id": 1,
  "amount": 500
}


