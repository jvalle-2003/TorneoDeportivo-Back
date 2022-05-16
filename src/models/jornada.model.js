'use strict'

const mongoose = require('mongoose');

const jornadaSchema = mongoose.Schema({
    name: String,
    resultado: [{ 
    equipo_1: {type: mongoose.Schema.ObjectId, ref: 'Equipo'},
    goles1: Number,
    equipo_2: {type: mongoose.Schema.ObjectId, ref: 'Equipo'},
    goles2: Number
    }]
});

module.exports = mongoose.model('Jornada', jornadaSchema);