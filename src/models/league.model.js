'use strict'

const mongoose = require('mongoose');

const LeagueSchema = mongoose.Schema({
    user: {type: mongoose.Schema.ObjectId, ref: 'User'},
    name: String,
    equipos: [{ type: mongoose.Schema.ObjectId, ref: 'Equipo' }],
    jornadas: [{ type: mongoose.Schema.ObjectId, ref: 'Jornada' }]

    
});

module.exports = mongoose.model('League', LeagueSchema); 

