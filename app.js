// Importation des packages
const express = require("express");
// importation de la config de la bdd
const db = require("./config/config.js");
// importation du routeur avec precision a la fin qu'on veut l'objet
// router que on a exporter dans notre fichier apiRouter.js
const apiRouter = require("./apiRouter").router;

//instantiation du serveur
const app = express();

//configuration pour recuperer du json avec express
app.use(express.json());

//connection a la bdd 
db.connect((err) => {
    if (err) {
      console.error("error connecting : ", err.stack);
      return;
    }
    console.log("database connected");
  });
  

//configuration route initial
app.get("/", (req, res) => {
  //configuration pour reconnaitre du code html dans une chaine de caractere
  res.setHeader("Content-Type", "text/html");
  res.status(200).send("<h1>Bonjour sur mon super serveur <h1>");
});

//utilisation des routes

app.use("/api/", apiRouter);

//Lancement du serveur
app.listen(8080, () => {
  console.log("Le serveur est lancé :)");
});
