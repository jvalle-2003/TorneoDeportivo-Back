'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const userRoutes = require('../src/routes/user.routes');
const jornadaRoutes = require('../src/routes/jornada.routes');
const leagueRoutes = require('../src/routes/league.routes')
const equipoRoutes = require('../src/routes/equipos.routes')

const app = express(); //instancia

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use('/user', userRoutes);
app.use('/jornada', jornadaRoutes);
app.use('/league', leagueRoutes);
app.use('/equipo', equipoRoutes);
module.exports = app;