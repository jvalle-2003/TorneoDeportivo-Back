'use strict'

const Equipo = require('../models/equipos.models');
const League = require('../models/league.model');
const Jornada = require('../models/jornada.model');
const validate = require('../utils/validate');


exports.test = (req, res)=>{
    return res.send({message: 'Function test is running'});
}


exports.saveEquipo = async (req, res) => {
    try {
        const params = req.body;
        const userId = req.user.sub;
        let data = {
            league: req.params.league,
            name: params.name,
            golesFavor: 0,
            golesContra: 0,
            difGoles: 0,
            puntos: 0,
            partidos: 0
        };
        let msg = validate.validateData(data);
        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league });
            if (checkUserLeague === null || checkUserLeague.user != userId) {
                return res.status(400).send({ message: 'You cannot add a team to this league' })
            } else {
                if (checkUserLeague.equipos.length > 9) {
                    return res.status(400).send({ message: 'You can no longer add teams to this league (Limit 10)' })
                } else {
                    let equipo = new Equipo(data);
                    await equipo.save();
                    await League.findOneAndUpdate({ _id: data.league }, { $push: { equipos: equipo._id } }, { new: true });
                    if (checkUserLeague.equipos.length > 0) {
                        const jornada = new Jornada({ name: `Jornada ${checkUserLeague.equipos.length}` });
                        await jornada.save();
                        await checkUserLeague.jornadas.push(jornada);
                        await checkUserLeague.save();
                    }
                    const updatedLeague = await League.findOne({ _id: data.league }).populate('equipos')
                    return res.send({ message: 'Team saved successfully in the league', updatedLeague });
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error al guardar el equipo' });
    }
}

exports.updateEquipo = async (req, res) => {
    try {
        const equipoId = req.params.id;
        const userId = req.user.sub;
        const params = req.body;
        let data = {
            league: req.params.league,
        };
        let msg = validate.validateData(data);
        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league, equipos: equipoId }).lean();

            if (checkUserLeague === null || checkUserLeague.user != userId) {
                return res.status(400).send({ message: 'You cant edit this team' })
            } else {
                const checkUpdated = await validate.checkUpdateEquipos(params);
                if (checkUpdated === false) {
                    return res.status(400).send({ message: 'invalid parameters' })
                } else {
                    const updateEquipo = await Equipo.findOneAndUpdate({ _id: equipoId }, params, { new: true }).lean();
                    if (!updateEquipo) {
                        return res.send({ message: 'Failed to update device' })
                    } else {
                        return res.send({ message: 'updated equipment: ', updateEquipo })
                    }
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error updating the device' });
    }
}

exports.getEquipos = async (req, res) => {
    try {
        const userId = req.user.sub;
        const params = req.body;
        let data = {
            league: req.params.league,
        };
        let msg = validate.validateData(data);
        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league }).populate('equipos').lean();
            const equipos = checkUserLeague.equipos.sort((a, b) => 
                 a.puntos < b.puntos?1: -1
            )
            if (checkUserLeague === null || checkUserLeague.user != userId) {
                return res.status(400).send({ message: 'You cant see the teams' })
            } else {
                return res.send({ messsage: 'Equipos found:', equipos });
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo los equipos' });
    }
}

exports.getEquipo = async (req, res) => {
    try {
        const equipoId = req.params.id;
        const userId = req.user.sub;
        const params = req.body;
        let data = {
            league: req.params.league,
        };

        let msg = validate.validateData(data);
        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league, equipos: equipoId }).populate('equipos').lean();
            if (checkUserLeague === null || checkUserLeague.user != userId) {
                return res.status(400).send({ message: 'You cant see this team' })
            } else {
                const equipo = await Equipo.findOne({ _id: equipoId });
                if (!equipo) {
                    return res.send({ message: 'Equipo not found' });
                } else {
                    return res.send({ messsage: 'Equipo found:', equipo });
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error getting the equipment' });
    }
}

exports.deleteEquipo = async (req, res) => {
    try {
        const equipoId = req.params.id;
        const userId = req.user.sub;
        const params = req.body;
        let data = {
            league: req.params.league,
        };

        let msg = validate.validateData(data);
        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league, equipos: equipoId });
            if (checkUserLeague === null || checkUserLeague.user != userId) {
                return res.status(400).send({ message: 'You cant delete this team' })
            } else {
                const deleteEquipo = await Equipo.findOneAndDelete({ _id: teamId });
                await checkUserLeague.equipos.pull(deleteEquipo);

                const deleteJornada = await Jornada.findOneAndDelete({ _id: checkUserLeague.jornadas.at(-1) });
                await checkUserLeague.jornadas.pull(deleteJornada);
                await checkUserLeague.save();
                if (!deleteEquipo) {
                    return res.status(500).send({ message: 'Equipo not found or already deleted' });
                } else {
                    return res.send({ message: 'Equipo deleted successfully', deleteTeam });
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error when trying to delete the team' });
    }
}

exports.searchEquipos = async(req,res) =>{
    try{
        const params = req.body;
        const data = {
            name: params.name
        };
        const msg = validate.validateData(data);
        if(msg) return res.status(400).send(msg);
        const equipos = await League.find({name: {$regex: params.name, $options: 'i'}})
        .lean()
        .populate('league');
        return res.send({equipos})
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error searching equipo'});
    }
}




