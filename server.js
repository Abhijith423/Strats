const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.json());

// SQLite setup
const db = new sqlite3.Database('./messages.db', (err) => {
  if (err) console.error(err.message);
  else console.log('Connected to SQLite DB');
});

// Create table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Endpoint to receive messages
app.post('/api/messages', (req, res) => {
  const { name, email, message } = req.body;
  console.log('Received message:', req.body); // logs in terminal

  db.run(
    `INSERT INTO messages (name, email, message) VALUES (?, ?, ?)`,
    [name, email, message],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
