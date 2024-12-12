import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export function login(db, SECRET_KEY) {
  return (req, res) => {
    const { correu, contrasenya } = req.body;

    if (!correu || !contrasenya) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const query = 'SELECT * FROM USUARI WHERE correu = ?';
    db.query(query, [correu], async (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length === 0) {
        console.log('results.length = 0');
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = results[0];

      const isMatch = await bcrypt.compare(contrasenya, user.contrasenya);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, correu: user.correu },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      const query2 = 'SELECT idAssociacio FROM USUARI_ASSOCIACIO WHERE idUsu = ?';
      db.query(query2, [user.id], (err, assocResults) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        const associacionsId = assocResults.map((row) => row.idAssociacio);

        res.status(200).json({
          token: token,
          nom: user.nom,
          cognoms: user.cognoms,
          correu: user.correu,
          associacionsId: associacionsId,
        });
      });
    });
  };
}

export function verifyToken(SECRET_KEY) {
  return (req) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return { message: "Token is required", login: false, user: null, status: 401 };
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      return { message: "Valid token", login: false, user: decoded, status: 200 };
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return { message: "Token has expired. Please log in again.", login: true, user: null, status: 401 };
      }
      return { message: "Invalid token", login: false, user: null, status: 401 };
    }
  };
}
