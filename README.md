# 💰 Expence Tracker

A clean, modular REST API built with **Node.js**, **Express.js**, and **MongoDB** for managing personal finances. It allows you to record income and expense transactions, auto-calculate your real-time balance, and get detailed monthly statistics — all in JSON.

> ⚠️ This system represents a **single user**. No authentication is required.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file at the root of the project:

```dotenv
# Server configuration
PORT=3000

# Database configuration
MONGO_URL=your_cluster_url
MONGO_USER=your_mongodb_username
MONGO_PASSWORD=your_mongodb_password
```

| Variable        | Description                              |
|----------------|------------------------------------------|
| `PORT`          | Port the server will run on              |
| `MONGO_URL`     | MongoDB connection host/cluster URL      |
| `MONGO_USER`    | MongoDB username                         |
| `MONGO_PASSWORD`| MongoDB password                         |

### 4. Start the server

```bash
# Development
npm run dev

# Production
npm start
```

---

## 📡 API Endpoints

Base URL: `http://localhost:<PORT>`

### `POST /transaction`
Add a new transaction (income or expense).

**Body (JSON):**
```json
{
  "title": "Freelance payment",
  "amount": 500,
  "type": "income"
}
```
```json
{
  "title": "Groceries",
  "amount": 80,
  "type": "expense",
  "category": "food"
}
```

> ⚠️ `category` is **required** when `type` is `expense`.  
> ⚠️ A transaction will be **rejected (400)** if it would make the balance negative.

---

### `GET /transaction`
Retrieve transactions with optional filters and pagination.

**Query Parameters:**

| Parameter   | Type   | Description                        |
|------------|--------|------------------------------------|
| `page`      | number | Page number (default: 1)           |
| `limit`     | number | Results per page (default: 10)     |
| `type`      | string | Filter by `income` or `expense`    |
| `category`  | string | Filter by category name            |
| `date`      | string | Filter by exact date (`YYYY-MM-DD`)|
| `startDate` | string | Start of date range                |
| `endDate`   | string | End of date range                  |

**Example:**
```
GET /transaction?type=expense&category=food&page=1&limit=5
```

---

### `GET /transaction/status`
Get the current financial status of the user.

**Response (JSON):**
```json
{
  "totalIncome": 2000,
  "totalExpense": 850,
  "balance": 1150
}
```

> 📌 The balance is **never stored** in the database — it is always calculated dynamically.

---

## 📊 Monthly Statistics

```
GET /transactions/stats?month=3&year=2026
```

Returns:
- Total income for the month
- Total expenses for the month
- Monthly balance
- Breakdown per expense category
- Percentage of each category relative to total expenses

---

## 🧩 Project Structure

```
├── controllers/       # Business logic (add, filter, stats)
├── middlewares/       # express-validator rules + balance check
├── models/            # Mongoose schemas (Transaction, Category, Budget)
├── routes/            # Express route definitions
├── .env               # Environment variables (not committed)
└── server.js          # App entry point
```

---

## 🛠️ Tech Stack

| Tool               | Purpose                        |
|--------------------|-------------------------------|
| Node.js            | Runtime                        |
| Express.js         | HTTP framework                 |
| MongoDB + Mongoose | Database & ODM                 |
| joi                | Input validation               |
| Thunder Client     | API testing                    |
| GitHub             | Version control                |
| VS Code            | Development environment        |

---

## ✅ Business Rules

- `amount` must be strictly positive
- `type` must be `income` or `expense`
- `category` is required for expenses
- Balance = `totalIncome - totalExpense` (dynamic, never stored)
- Balance must always remain **≥ 0**

---