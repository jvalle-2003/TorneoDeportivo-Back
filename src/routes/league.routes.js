'use strict'

const leagueController = require('../controllers/league.controller');
const mdAuth = require('../services/authenticated');
const express = require('express');
const api = express.Router();

//RUTAS PÚBLICAS
api.get('/test', leagueController.test);
api.post('/saveLeague', mdAuth.ensureAuth, leagueController.saveLeague);

//rutas private
// Ver todas las ligas unicamente si es administrador
api.get('/getLeagueByAdmin',  [mdAuth.ensureAuth, mdAuth.isAdmin], leagueController.getLeagueByAdmin);
api.get('/getLeaguesbyAdmin', [mdAuth.ensureAuth, mdAuth.isAdmin],  leagueController.getLeaguesByAdmin);
api.put('/updateLeague/:id', [mdAuth.ensureAuth, mdAuth.isAdmin],  leagueController.updateLeague);
api.delete('/deleteleague/:id', [mdAuth.ensureAuth, mdAuth.isAdmin],  leagueController.deleteLeague);
// Rutas para el usuario cliente
api.get('/getLeague/:id', mdAuth.ensureAuth, leagueController.getLeague);
api.get('/getLeagues',  mdAuth.ensureAuth, leagueController.getLeagues);
api.put('/updateLeagueByUser/:id', mdAuth.ensureAuth, leagueController.updateLeagueByUser);
api.put('/deleteLeagueByUser/:id', mdAuth.ensureAuth, leagueController.deleteLeagueByUser);
api.get('/getLeagueTable/:id',  mdAuth.ensureAuth, leagueController.getLeagueTable);

module.exports = api;  