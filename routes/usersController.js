// importation pour les controlles et la securite
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/config");

// creation et exportation des routes

module.exports = {
  register: (req, res) => {
    //params

    const pseudo = req.body.pseudo;
    const email = req.body.email;
    const password = req.body.password;

    // check if field is empty
    if (pseudo === undefined || pseudo === null || pseudo.length < 2) {
      res.status(400).json({
        success: false,
        message: "Pseudo invalide",
      });
    }
    if (email === undefined || email === null || email.length < 2) {
      res.status(400).json({
        success: false,
        message: "Email invalide",
      });
    }
    if (password === undefined || password === null || password.length < 4) {
      res.status(400).json({
        success: false,
        message: "Mot de passe invalide",
      });
    }

    // verifier SI le mail exist avec mysql
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
      if (err) throw err;
      if (rows.length > 0) {
        res.status(400).json({
          message: "Cet email est déjà utilisé",
        });
      } else {
        // SI il n'existe pas, on insert dans la base de donnees
        db.query(
          "INSERT INTO users (pseudo, email, password) VALUES (?, ?, ?)",
          [pseudo, email, bcrypt.hashSync(password, 8)],
          (err, rows) => {
            if (err) throw err;
            // nous generons un token pour l'utilisateur
            const token = jwt.sign(
              {
                id: rows.insertId,
                pseudo: pseudo,
                email: email,
              },
              "secret", 
              {
                expiresIn: "2h",
              }
            );
            console.log("voila le token", token);
            res.json({
              token,
              message: "Votre compte a été créé",
            });
          }
        );
      }
    });
  },

  login: (req, res) => {
    // Etape de connexion
    const email = req.body.email;
    const password = req.body.password;
    // check if field is empty
    if (email === undefined || email === null || email.length < 2) {
      res.status(400).json({
        success: false,
        message: "Email invalide",
      });
    }
    if (password === undefined || password === null || password.length < 4) {
      res.status(400).json({
        success: false,
        message: "Mot de passe invalide",
      });
    }
    // verifier SI le mail exist avec mysql
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
      if (err) throw err;
      if (rows.length > 0) {
        const user = rows[0];
        if (bcrypt.compareSync(password, user.password)) {
          // si le mot de passe est bon
          const token = jwt.sign(
            {
              id: user.id,
              pseudo: user.pseudo,
              email: user.email,
            },
            "secret",
            // pour dire que le token secret expire quand
            {
              expiresIn: "2h",
            }
          );
          res.json({
            token,
            message: "Vous êtes connecté",
          });
        } else {
          res.status(400).json({
            success: false,
            message: "Mot de passe invalide",
          });
        }
      } else {
        res.status(400).json({
          success: false,
          message: "Email invalide",
        });
      }
    });
  },
};
