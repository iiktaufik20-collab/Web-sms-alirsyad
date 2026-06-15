const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Koneksi ke MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sms_al-irsyad",
});

db.connect((err) => {
  if (err) {
    console.log("Koneksi gagal:", err);
  } else {
    console.log("MySQL terhubung!");
  }
});

app.get("/", (req, res) => {
  res.send("Server SMS Al-Irsyad berjalan");
});

app.listen(5000, () => {
  console.log("Server berjalan di port 5000");
});