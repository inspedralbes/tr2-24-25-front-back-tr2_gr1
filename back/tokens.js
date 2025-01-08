import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import { connectToDatabase } from "./index.js";
async function hashPassword(contrasenya){
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(contrasenya, salt);
  return hashedPassword
}

export function login(db, SECRET_KEY) {

  // const db = connectToDatabase();

  return (req, res) => {
    const { correu, contrasenya } = req.body;

    if (!correu || !contrasenya) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const query = `SELECT * FROM USUARI WHERE correu = ?`;
    db.query(query, [correu], async (err, results) => {
      console.log("Query:", query, "Params:", correu);
      if (err) {
        console.log('aaa');
        console.log(err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length === 0) {
        console.log('results.length = 0');
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = results[0];
      console.log(user.contrasenya, contrasenya)
      const isMatch = await bcrypt.compare(contrasenya, user.contrasenya);
      console.log(isMatch)
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign(
        { id: user.id, correu: user.correu },
        SECRET_KEY,
        { expiresIn: '1h' }
      );
    // db.end();

    // const db2 = connectToDatabase();
      const query2 = 'SELECT idAsso FROM USUARI_ASSOCIACIO WHERE idUsu = ?';
      // db2.query(query2, [user.id], (err, assocResults) => {
      db.query(query2, [user.id], (err, assocResults) => {
        console.log("Query:", query2, "Params:", user.id);
        if (err) {
          console.log(err);
          return res.status(500).json({ error: 'Database error' });
        }

        const associacionsId = assocResults.map((row) => row.idAsso);

        res.status(200).json({
          id: user.id,
          token: token,
          id: user.id,
          nom: user.nom,
          cognoms: user.cognoms,
          correu: user.correu,
          contrasenya: user.contrasenya,
          imatge: user.imatge,
          permisos: user.permisos,
          associacionsId: associacionsId,
        });
      });
    // db2.end();
    });
  };
}

export function verifyToken(SECRET_KEY, req) {
  console.log('Header Auth: ', req.headers.authorization);
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Token de Sessió: ', token);
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
}
