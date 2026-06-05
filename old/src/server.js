import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config(); // Załaduj zmienne z .env

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Błąd połączenia z MySQL:', err);
    return;
  }
  console.log('Połączono z MySQL');
});

// Przykład zapytania do bazy
app.get('/getUsers', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json(results);
    }
  });
});

app.get('/getUser', (req, res) => {
  const { username } = req.query;
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    }
    else {
      res.json(results[0]);
    }
  });
});

app.get('/getCubeTypeId', (req, res) => {
  const { cubeType } = req.query;
  db.query('SELECT id FROM solvetypes WHERE name = ?', [cubeType], (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    }
    else {
      res.json(results[0]);
    }
  });
});

app.get('/getCubeTypeById', (req, res) => {
  const { id } = req.query;
  db.query('SELECT name FROM solvetypes WHERE id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    }
    else {
      res.json(results[0].name);
    }
  });
});

app.get('/doesUserExist', (req, res) => {
  try {
    const { username } = req.query; // Parametr z fetcha
    
    if (!username) {
      return res.status(400).json({ error: "Brak nazwy użytkownika w zapytaniu" });
    }
    
    // Sprawdzenie czy uzytkownik juz istnieje w bazie danych
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      
      if (results.length > 0) {
        // Użytkownik znaleziony
        return res.json({ exists: true });
      } else {
        // Użytkownik nie znaleziony
        return res.json({ exists: false });
      }
    });
  }
  catch (err) {
    console.log('Error:' + err)
  }
});

app.get('/login', (req, res) => {
  try {
    const { usernameOrEmail, password } = req.query; // Parametr z fetcha

    if (!usernameOrEmail)
      return res.status(400).json({ error: "Brak nazwy użytkownika w zapytaniu" });
    
    // Sprawdzenie czy uzytkownik juz istnieje w bazie danych
    db.query('SELECT * FROM users WHERE username = ? OR email = ?', [usernameOrEmail, usernameOrEmail], (err, results) => {
      if (err) {
        console.log(err)
        return res.status(500).json({ error: err });
      }
      
      if (results.length > 0) {
        const user = results[0];
        if(password == user.password) {
          return res.json({success: true, message: 'Zalogowano pomyślnie', user: user})
        }
        else {
          return res.json({success: false, message: 'Nieprawidłowe hasło'})
        }
      }
      else {
        // Użytkownik nie znaleziony
        return res.json({ exists: false });
      }
    });
  }
  catch (err) {
    console.log('Error:' + err)
  }
});

app.get('/getUserSessions', (req, res) => {
  try {
    const { userId } = req.query;
    db.query('SELECT * FROM `sessions` WHERE userId = ?', [userId], (err, results) => {
      if (err)
        return res.status(500).json({ error: err });
      if (results.length > 0)
        return res.json(results)
      else
        return res.json({ exists: false });
    });
  }
  catch (error) {
    console.log('Error: ' + error)
  }
})

app.get('/getUserSolves', (req, res) => {
  try {
    const { username } = req.query;
    db.query('SELECT solves.* FROM `solves` INNER JOIN users ON solves.userId = users.id WHERE username = ? ORDER BY endTimestamp ASC', [username], (err, results) => {
      if (err)
        return res.status(500).json({ error: err });
      if (results.length > 0)
        return res.json(results)
      else
        return res.json({ exists: false });
    });
  }
  catch (error) {
    console.log('Error: ' + error)
  }
})

app.get('/getLastSolveId', (req, res) => {
  try {
    db.query('SELECT id FROM `solves` ORDER BY id DESC LIMIT 1', (err, results) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      
      if(results.length != 0) 
        return res.json(results[0].id);
      else
        return res.json(0);
    });
  }
  catch (error) {
    console.log('Error: ' + error)
  }
})

app.post('/addUser', (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Wstawianie użytkownika do bazy danych
    db.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, password],
      (err, result) => {
        if (err) {
          console.error("Błąd bazy danych:", err);
          return res.status(500).json({ error: "Server error" });
        }
        res.status(201).json({ message: "Użytkownik dodany!" });
      }
    );

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Wewnętrzny Server error" });
  }
});

app.post('/updateUser', (req, res) => {
  try {
    const user = req.body;

    // Wstawianie użytkownika do bazy danych
    db.query(
      'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?',
      [user.username, user.email, user.password, user.id],
      (err, result) => {
        if (err) {
          console.error("Błąd bazy danych:", err);
          return res.status(500).json({ error: "Server error" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Solve not found" });
        }
        res.status(201).json({success: true, message: "Switched Plus Two" });
      }
    );
  }
  catch (error) {
    console.error("Server error: ", error)
  }
})

app.post('/addSession', (req, res) => {
  try {
    const {userId, name } = req.body;

    db.query(
      'INSERT INTO sessions (userId, name) VALUES (?, ?)',
      [userId, name],
      (err, result) => {
        if (err) {
          console.error("Błąd bazy danych:", err);
          return res.status(500).json({ error: "Server error" });
        }
        res.status(201).json({ message: "Dodano czas!" });
      }
    );

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Wewnętrzny Server error" });
  }
});

app.post('/updateSessionName', (req, res) => {
  try {
    const { sessionName, sessionId } = req.body;

    // Wstawianie użytkownika do bazy danych
    db.query(
      'UPDATE sessions SET name = ? WHERE id = ?',
      [sessionName, sessionId],
      (err, result) => {
        if (err) {
          console.error("Błąd bazy danych:", err);
          return res.status(500).json({ error: "Server error" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Session not found" });
        }
        res.status(201).json({success: true, message: "Changed session name" });
      }
    );
  }
  catch (error) {
    console.error("Server error: ", error)
  }
})

app.post('/addSolve', (req, res) => {
  try {
    const { id, typeId, userId, sessionId, solveTime, scramble, endTimestamp } = req.body;

    // Wstawianie użytkownika do bazy danych
    db.query(
      'INSERT INTO solves (id, typeId, userId, sessionId, solveTime, scramble, endTimestamp) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, typeId, userId, sessionId, solveTime, scramble, endTimestamp],
      (err, result) => {
        if (err) {
          console.error("Błąd bazy danych:", err);
          return res.status(500).json({ error: "Server error" });
        }
        res.status(201).json({ message: "Dodano czas!" });
      }
    );

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Wewnętrzny Server error" });
  }
});

app.post('/plusTwo', (req, res) => {
  try {
    const solve = req.body;

    // Wstawianie użytkownika do bazy danych
    db.query(
      'UPDATE solves SET plusTwo = NOT plusTwo WHERE userId = ? AND solveTime = ? AND scramble = ?',
      [solve.userId, solve.solveTime, solve.scramble],
      (err, result) => {
        if (err) {
          console.error("Błąd bazy danych:", err);
          return res.status(500).json({ error: "Server error" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Solve not found" });
        }
        res.status(201).json({success: true, message: "Switched Plus Two" });
      }
    );
  }
  catch (error) {
    console.error("Server error: ", error)
  }
})

app.post('/DNF', (req, res) => {
  try {
    const solve = req.body;

    // Wstawianie użytkownika do bazy danych
    db.query(
      'UPDATE solves SET DNF = NOT DNF WHERE userId = ? AND solveTime = ? AND scramble = ?',
      [solve.userId, solve.solveTime, solve.scramble],
      (err, result) => {
        if (err) {
          console.error("Błąd bazy danych:", err);
          return res.status(500).json({ error: "Server error" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Solve not found" });
        }
        res.status(201).json({success: true, message: "Switched DNF" });
      }
    );
  }
  catch (error) {
    console.error("Server error: ", error)
  }
})

app.post('/deleteUser/', (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    db.query(
      'DELETE FROM users WHERE id = ?',
      [userId],
      (err, result) => {
        if (err) {
          console.error("Błąd bazy danych:", err);
          return res.status(500).json({ error: "Server error" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "User not found" });
        }
        res.status(201).json({success: true, message: "Deleted user" });
      }
    );
  }
  catch (error) {
    console.error("Server error: ", error)
    res.status(500).json({ error: "Server error" });
  }
});

app.post('/deleteSession/', (req, res) => {
  try {
    const { sessionId } = req.body;

    // Wstawianie użytkownika do bazy danych
    db.query(
      'DELETE FROM sessions WHERE id = ?',
      [sessionId],
      (err, result) => {
        if (err) {
          console.error("Błąd bazy danych:", err);
          return res.status(500).json({ error: "Server error" });
        }
        if (result.affectedRows == 0) {
          return res.status(404).json({ error: "Session not found" });
        }
        res.status(201).json({success: true, message: "Session deleted" });
      }
    );
  }
  catch (error) {
    console.error("Server error: ", error)
    res.status(500).json({ error: "Server error" });
  }
})

app.post('/deleteSolve/', (req, res) => {
  try {
    const solve = req.body;

    // Wstawianie użytkownika do bazy danych
    db.query(
      'DELETE FROM solves WHERE id = ?',
      [solve.id],
      (err, result) => {
        if (err) {
          console.error("Błąd bazy danych:", err);
          return res.status(500).json({ error: "Server error" });
        }
        if (result.affectedRows == 0) {
          return res.status(404).json({ error: "Solve not found" });
        }
        res.status(201).json({success: true, message: "Solve deleted" });
      }
    );
  }
  catch (error) {
    console.error("Server error: ", error)
    res.status(500).json({ error: "Server error" });
  }
})

app.post('/bulkDeleteSolves/', (req, res) => {
  try {
    const solves = req.body;
    const ids = solves.map(solve => solve.id);
    // Wstawianie użytkownika do bazy danych
    db.query(
      'DELETE FROM solves WHERE (id) IN (?)',
      [ids],
      (err, result) => {
        if (err) {
          console.error("Błąd bazy danych:", err);
          return res.status(500).json({ error: "Server error" });
        }
      }
    );
  }
  catch (error) {
    console.error("Server error: ", error)
    res.status(500).json({ error: "Server error" });
  }
})

app.post('/bulkPlusTwoSolves/', (req, res) => {
  try {
    const solves = req.body;
    const ids = solves.map(solve => solve.id);
    // Wstawianie użytkownika do bazy danych
    db.query(
      'UPDATE solves SET plusTwo = 1 WHERE (id) IN (?)',
      [ids],
      (err, result) => {
        if (err) {
          console.error("Błąd bazy danych:", err);
          return res.status(500).json({ error: "Server error" });
        }
      }
    );
  }
  catch (error) {
    console.error("Server error: ", error)
    res.status(500).json({ error: "Server error" });
  }
})

app.post('/bulkDNFSolves/', (req, res) => {
  try {
    const solves = req.body;
    const ids = solves.map(solve => solve.id);
    // Wstawianie użytkownika do bazy danych
    db.query(
      'UPDATE solves SET DNF = 1 WHERE (id) IN (?)',
      [ids],
      (err, result) => {
        if (err) {
          console.error("Błąd bazy danych:", err);
          return res.status(500).json({ error: "Server error" });
        }
      }
    );
  }
  catch (error) {
    console.error("Server error: ", error)
    res.status(500).json({ error: "Server error" });
  }
})

app.post('/bulkOKSolves/', (req, res) => {
  try {
    const solves = req.body;
    const ids = solves.map(solve => solve.id);
    // Wstawianie użytkownika do bazy danych
    db.query(
      'UPDATE solves SET plusTwo = 0, DNF = 0 WHERE (id) IN (?)',
      [ids],
      (err, result) => {
        if (err) {
          console.error("Błąd bazy danych:", err);
          return res.status(500).json({ error: "Server error" });
        }
      }
    );
  }
  catch (error) {
    console.error("Server error: ", error)
    res.status(500).json({ error: "Server error" });
  }
})

app.listen(3001, () => console.log('Server działa na porcie 3001'));