'use strict'

const mongoose = require('mongoose');

const equiposSchema = mongoose.Schema({
    name: String,
    golesFavor: Number,
    golesContra: Number,
    difGoles: Number,
    partidos: Number,
    puntos: Number
});

module.exports = mongoose.model('Equipo', equiposSchema);