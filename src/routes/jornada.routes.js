'use strict'

const express = require('express');
const jornadaController = require ('../controllers/jornada.controller') 
const api = express.Router();
const mdAuth = require ('../services/authenticated')
// Rutas Publicas 
api.get('/test', jornadaController.test);

// Rutas Privadas
api.post('/saveJornada', mdAuth.ensureAuth, jornadaController.addJornada);
api.post('/saveJornadaResult/:league/:id', mdAuth.ensureAuth ,jornadaController.addResultado);
api.get('/getJornadas/:league', mdAuth.ensureAuth, jornadaController.getJornadas);
api.get('/getJornada/:league/:id', mdAuth.ensureAuth, jornadaController.getJornada);
api.get('/getResultados/:league/:jornada', mdAuth.ensureAuth, jornadaController.getResults);

module.exports = api; 