'use strict'

const equiposController = require('../controllers/equipos.controllers');
const mdAuth = require('../services/authenticated');
const express = require('express');
const api = express.Router();


api.get('/test', equiposController.test)

/////////////////////  RUTAS PRIVADAS ////////////////////////////////

api.get('/getEquipos/:league', mdAuth.ensureAuth, equiposController.getEquipos);
api.get('/getEquipo/:league/:id', mdAuth.ensureAuth, equiposController.getEquipo);
api.get('/searchEquipos', mdAuth.ensureAuth, equiposController.searchEquipos);
api.post('/saveEquipo/:league', mdAuth.ensureAuth, equiposController.saveEquipo);
api.put('/updateEquipo/:league/:id', mdAuth.ensureAuth,  equiposController.updateEquipo);
api.delete('/deleteEquipos/:league/:id', mdAuth.ensureAuth,equiposController.deleteEquipo);

module.exports = api;