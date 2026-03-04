const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const app = express();
console.log("SIMPLE EXPENSE TRACKER RUNNING");

// ================= DATABASE CONNECTION =================
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 3306
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

// ================= MIDDLEWARE =================
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(express.static("public"));

// ================= ROUTES =================

// Home Page - Show All Expenses
app.get("/", (req, res) => {
  db.query("SELECT * FROM expenses", (err, results) => {
    if (err) throw err;

    const total = results.reduce((sum, row) => sum + parseFloat(row.amount), 0);

    res.render("index", { expenses: results, total });
  });
});

// Show Add Expense Form
app.get("/add", (req, res) => {
  res.render("add");
});

// Add Expense
app.post("/add", (req, res) => {
  const { title, amount, category, date } = req.body;

  const sql = `
    INSERT INTO expenses (title, amount, category, date)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [title, amount, category, date], (err) => {
    if (err) throw err;
    res.redirect("/");
  });
});

// Delete Expense
app.delete("/delete/:id", (req, res) => {
  db.query(
    "DELETE FROM expenses WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) throw err;
      res.redirect("/");
    }
  );
});

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
