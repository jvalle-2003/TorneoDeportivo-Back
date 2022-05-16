'use strict'

const validate = require('../utils/validate');
const League = require('../models/league.model');
const Equipo = require('../models/equipos.models');
const User = require('../models/user.model');
const Jornadas = require('../models/jornada.model');

exports.test = (req, res) => {
    return res.send({ message: 'Function League is running' });
};

// ------------------------------Para cualquier usuario-------------------------------------------

exports.saveLeague = async (req, res) => {
    try {
        const params = req.body;
        const data = {
            user: req.user.sub,
            name: params.name,
        }
        const msg = validate.validateData(data);
        if (!msg) {
            const league = new League(data);
            await league.save();
            return res.send({ message: 'League Created Successfully', league });
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Failed to save league' });
    }
}

// ---------------------------------------- Administrador--------------
exports.updateLeague = async (req, res) => {
    try {
        const leagueId = req.params.id;
        const params = req.body;
        if (Object.entries(params).length === 0)
            return res.status(400).send({ message: 'Empty parameters' });
        const leagueExist = await League.findOne({ _id: leagueId });
        if (!leagueExist)
            return res.send({ message: 'League not found' });
        const alreadyLeague = await validate.searchLeague(params.name);
        if (alreadyLeague && leagueExist.name != params.name)
            return res.send({ message: 'League already taken' });
        const updateLeague = await League.findOneAndUpdate({ _id: leagueId }, params, { new: true });
        if (!updateLeague)
            return res.send({ message: 'League not updated' });
        return res.send({ message: 'League updated succesfully', updateLeague });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error updating League' });
    }
};

exports.deleteLeague = async (req, res) => {
    try {
        const leagueId = req.params.id;
        const leagueExist = await League.findOne({ _id: leagueId });
        if (!leagueExist) return res.send({ message: 'League not found or already deleted' });
        const leagueDeleted = await League.findOneAndDelete({ _id: leagueId });
        if (!leagueDeleted) return res.send({ message: 'League not deleted or already deleted' });
        return res.send({ message: 'League Deleted succesfully', leagueDeleted });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error deleting League' });
    }
};

exports.getLeagueByAdmin = async (req, res) => {
    try {
        const leagueId = req.params.id;

        const league = await League.findOne({ _id: leagueId });
        if (!league) {
            return res.send({ message: 'league not found' });
        } else {
            return res.send({ messsage: 'league found', league });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error getting league' });
    }
}

exports.getLeaguesByAdmin = async (req, res) => {
    try {
        const leagues = await League.find().populate('user').lean();
        if (!leagues) {
            return res.send({ message: 'leagues not found'});
        } else {
            return res.send({ messsage: 'Leagues found:', leagues });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error getting leagues' });
    }
}


//------------------------------------Usuario Cliente---------------------------------------

exports.getLeague = async (req, res) => {
    try {
        const leagueId = req.params.id;
        const league = await League.findOne({ _id: leagueId }).populate('user').lean();
        if (!league) {
            return res.send({ message: 'league not found' });
        } else {
            return res.send({ messsage: 'league found', league });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error getting league' });
    }
}

exports.getLeagues = async (req, res) => {
    try {
        const userId = req.user.sub
        const leagues = await League.find({ user: userId }).populate('equipos').populate('jornadas')
        if (!leagues) {
            return res.send({ message: 'Leagues not found' });
        } else {
            return res.send({ messsage: 'Leagues found:', leagues });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error getting leagues' });
    }
}

exports.updateLeagueByUser = async (req, res) => {
    try {
        const leagueId = req.params.id;
        const params = req.body;
        const userId = req.user.sub

        const checkUserLeague = await League.findOne({ _id: leagueId })
        if (checkUserLeague.user != userId) {
            return res.status(400).send({ message: 'You cant update this league' })
        } else {
            const checkUpdated = await validate.checkUpdateLeague(params);
            if (!checkUpdated) {
                return res.status(400).send({ message: 'invalid parameters' })
            } else {
                const updateLeague = await League.findOneAndUpdate({ _id: leagueId }, params, { new: true }).lean();
                if (!updateLeague) {
                    return res.send({ message: 'The league could not be updated' })
                } else {
                    return res.send({ message: 'update league', updateLeague })
                }
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error updated league' });
    }
}

exports.deleteLeagueByUser = async (req, res) => {
    try {
        const userId = req.user.sub
        const leagueId = req.params.id;
        const checkUserLeague = await League.findOne({ _id: leagueId })

        if (checkUserLeague.user != userId || checkUserLeague === null) {
            return res.status(400).send({ message: 'You cannot delete this league or it has already been deleted' })
        } else {
            const deleteLeague = await League.findOneAndDelete({ _id: leagueId });
            if (!deleteLeague) {
                return res.status(500).send({ message: 'League not found or has already been deleted' });
            } else {
                return res.send({ message: 'League deleted successfully', deleteLeague });
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error when trying to delete the league' });
    }
}

exports.getLeagueTable = async(req, res)=>{
    try{
        const leagueId = req.params.id;
        const league = await League.findById(leagueId);
        if(!league) return res.send({message: 'The league does not exist'});
        const equipos = await Equipo.find({league: leagueId}).sort({puntos: -1});
        return res.send({equipos});
    }catch(err){
        console.log(err);
        return err;
    }
}