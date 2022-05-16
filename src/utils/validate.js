'use strict'

const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user.model');
const Jornada = require('../models/jornada.model');
const League = require('../models/league.model');
const Equipo = require('../models/equipos.models');

exports.validateData = (data) =>{
    let keys = Object.keys(data), msg = '';

    for(let key of keys){
        if(data[key] !== null && data[key] !== undefined && data[key] !== '') continue;
        msg += `The params ${key} es obligatorio\n`
    }
    return msg.trim();
}

exports.alreadyUser = async (username)=>{
   try{
    let exist = User.findOne({username:username}).lean()
    return exist;
   }catch(err){
       return err;
   }
}

exports.encrypt = async (password) => {
    try{
        return bcrypt.hashSync(password);
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkPassword = async (password, hash)=>{
    try{
        return bcrypt.compareSync(password, hash);
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkPermission = async (userId, sub)=>{
    try{
        if(userId != sub){
            return false;
        }else{
            return true;
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkUpdate = async (user)=>{
    if(user.password || 
       Object.entries(user).length === 0 || 
       user.role){
        return false;
    }else{
        return true;
    }
}

exports.checkUpdateAdmin = async(user)=>{
    if(user.password ||
       Object.entries(user).length === 0){
        return false;
    }else{
        return true;
    }
}

exports.searchJornada = async(jornada)=>{
    try{
        const jornadas = await Jornada.findOne({jornada: jornada}).lean();
        if(!jornadas) return false
        return jornadas;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.searchLeague = async(name)=>{
    try{
        const league = await League.findOne({name: name}).lean();
        if(!league){
            return false;
        }else{
            return league;
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.alreadyLeague = async (name)=>{
    try{
     let exist = League.findOne({name:name}).lean()
     return exist;
    }catch(err){
        return err;
    }
 }  

exports.EquiposExist = async (equipo, equipo_1, equipo_2)=>{
        try {
            const equipo_1Exist = await Equipo.findOne({_id: equipo_1})
            const equipo_2Exist = await Equipo.findOne({_id: equipo_2})
            if (!equipo_1Exist || !equipo_2Exist) {
                const equiposExist = await Equipo.findOne({_id: equipo});
                if(!equiposExist){
                    return false;
                } else {
                    return true;
                }
            }

        } catch (err) {
            console.log(err);
            return err;
        }
    }
      

exports.checkUpdateEquipo = async(equipo)=>{
    if( equipo.golesFavor || equipo.golesContra || equipo.difGoles || equipo.puntos ||
        Object.entries(equipo).length === 0){
          return false;
      }else{
          return true;
      }
}

exports.alreadyEquipo = async (name)=>{
    try{
     let exist = Equipo.findOne({name:name}).lean()
     return exist;
    }catch(err){
        return err;
    }
 }    

 exports.checkUpdateLeague = async (params) => {
    try {
        if (Object.entries(params).length === 0 || params.equipos || params.jornadas || params.user) {
            return false;
        } else {
            return true;
        }
    } catch (err) {
        console.log(err);
        return err;
    }
} 

exports.checkUpdateEquipos = async (params) => {
    try {
        if (Object.entries(params).length === 0 || params.golesFavor || params.golesContra || params.difGoles || params.partidos || params.puntos) {
            return false;
        } else {
            return true;
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

 exports.deleteSensitiveData = async(data)=>{
    try{
        delete data.user.password;
        delete data.user.role;
        return data;
    }catch(err){
        console.log(err);
        return err;
    }
}