const express = require('express');
const usersController = require('./routes/usersController');

// configuration de notre router pour gerer nos routes

exports.router = (function () {
    const apiRouter = express.Router();

    // initialisation des routes en appelant les fonctions qui sont dans
    // le fichier controller usersController.js
    apiRouter.route('/users/resgister').post(usersController.register);
    apiRouter.route('/users/login').post(usersController.login);


    return apiRouter;
})();