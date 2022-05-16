'use strict'

const Jornada = require('../models/jornada.model');
const Equipo = require('../models/equipos.models');
const League = require('../models/league.model');
const validate = require('../utils/validate');


exports.test = async(req, res)=>{
    await res.send({message: 'Function test is running'});
}

exports.addJornada = async (req, res) =>{
    try{
        const params = req.body;
        const data = {
            jornada: params.jornada
            
        }
        const msg = validate.validateData(data);
        if(msg) return res.status(400).send(msg);
        const alreadyJornada = await validate.searchJornada(params.jornada);
        if(alreadyJornada) return res.send({message: 'Esta jornada ya ha sido creada'});
        const jornada = new Jornada(data);
        await jornada.save();
        return res.send({message: 'La jornada se creo satisfactoriamente ', });
        
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error saving result'})
    }
}



exports.addResultado = async (req, res) =>{
  try {
      const jornadaId = req.params.id; 
      const params = req.body; 
      let data= {

          league: req.params.league,
          equipo_1: params.equipo_1,
          goles1: params.goles1,
          equipo_2: params.equipo_2,
          goles2: params.goles2
      };
      const msg = validate.validateData(data);

      if(!msg){
          if(await validate.EquiposExist(data.equipo_1, data.equipo_2) === true){
              const jornada = await Jornada.findOne({_id: jornadaId});
              await jornada.resultado.push(data);
              if(data.goles1 > data.goles2){
                const equipo_1 = await Equipo.findOne({_id: data.equipo_1});  
                const Equipo_1Data = {
                    golesFavor: equipo_1.golesFavor + Number.parseInt(data.goles1),
                    golesContra: equipo_1.golesContra + Number.parseInt(data.goles2),
                    difGoles: equipo_1.difGoles + Number.parseInt(data.goles1) - Number.parseInt(data.goles2),
                    partidos: equipo_1.partidos +1,
                    puntos: equipo_1.puntos +3     
                  }
                await Equipo.findOneAndUpdate({_id: equipo_1._id}, Equipo_1Data, {new: true}).lean();
                const equipo_2 = await Equipo.findOne({_id:data.equipo_2}); 
              const Equipo_2Data = {
                  golesFavor: equipo_2.golesFavor + Number.parseInt(data.goles2),
                  golesContra: equipo_2.golesContra + Number.parseInt(data.goles1),
                  difGoles: equipo_2.difGoles + Number.parseInt(data.goles2) - Number.parseInt(data.goles1), 
                  partidos: equipo_2.partidos  + 1,
                  puntos: equipo_2.puntos + 0
              }
              await Equipo.findOneAndUpdate ({_id: equipo_2}, Equipo_2Data, {new: true}).lean();
              }else if(data.goles1 < data.goles2){
                const equipo_1 = await Equipo.findOne({_id: data.equipo_1});  
                const Equipo_1Data = {
                    golesFavor: equipo_1.golesFavor + Number.parseInt(data.goles1),
                    golesContra: equipo_1.golesContra + Number.parseInt(data.goles2),
                    difGoles: equipo_1.difGoles + Number.parseInt(data.goles1) - Number.parseInt(data.goles2),
                    partidos: equipo_1.partidos +1,
                    puntos: equipo_1.puntos + 0    
                  }
                await Equipo.findOneAndUpdate({_id: equipo_1._id}, Equipo_1Data, {new: true}).lean();
                const equipo_2 = await Equipo.findOne({_id:data.equipo_2}); 
              const Equipo_2Data = {
                  golesFavor: equipo_2.golesFavor + Number.parseInt(data.goles2),
                  golesContra: equipo_2.golesContra + Number.parseInt(data.goles1),
                  difGoles: equipo_2.difGoles + Number.parseInt(data.goles2) - Number.parseInt(data.goles1), 
                  partidos: equipo_2.partidos  + 1,
                  puntos: equipo_2.puntos + 3
              }
              await Equipo.findOneAndUpdate ({_id: equipo_2}, Equipo_2Data, {new: true}).lean();
              }else if(data.goles1 === data.goles2){
                const equipo_1 = await Equipo.findOne({_id: data.equipo_1});  
                const Equipo_1Data = {
                    golesFavor: equipo_1.golesFavor + Number.parseInt(data.goles1),
                    golesContra: equipo_1.golesContra + Number.parseInt(data.goles2),
                    difGoles: equipo_1.difGoles + Number.parseInt(data.goles1) - Number.parseInt(data.goles2),
                    partidos: equipo_1.partidos +1,
                    puntos: equipo_1.puntos + 1     
                  }
                await Equipo.findOneAndUpdate({_id: equipo_1._id}, Equipo_1Data, {new: true}).lean();
                const equipo_2 = await Equipo.findOne({_id:data.equipo_2}); 
              const Equipo_2Data = {
                  golesFavor: equipo_2.golesFavor + Number.parseInt(data.goles2),
                  golesContra: equipo_2.golesContra + Number.parseInt(data.goles1),
                  difGoles: equipo_2.difGoles + Number.parseInt(data.goles2) - Number.parseInt(data.goles1), 
                  partidos: equipo_2.partidos  + 1,
                  puntos: equipo_2.puntos + 1
              }
              await Equipo.findOneAndUpdate ({_id: equipo_2}, Equipo_2Data, {new: true}).lean();
            }
              await jornada.save();
              return res.send({ message: 'Resultado agregado satisfactoriamente', data });
          }else{
              return res.status(400).send('Equipo sin resultado');
          }
      }else{
          return res.status(400).send(msg);
      }
  } catch (err) {
    console.log(err);
      return res.status(500).send({ message:'Error guardar el resultado'});     
  }
} 


exports.getJornadas = async (req, res) => {
  try {
      const userId = req.user.sub;
      const params = req.body;
      let data = {
          league: req.params.league,
      };
      let msg = validate.validateData(data);
      if (!msg) {
          const checkUserLeague = await League.findOne({ _id: data.league }).populate('jornadas').lean();
          const jornadas = checkUserLeague.jornadas
          if (checkUserLeague === null || checkUserLeague.user != userId) {
              return res.status(400).send({ message: 'No puedes ver las jornadas' })
          } else {
              return res.send({ messsage: 'Jornadas encontradas: ', jornadas });
          }
      } else {
          return res.status(400).send(msg);
      }
  } catch (err) {
      console.log(err);
      return res.status(500).send({ message: 'Error encontrando las jornadas' });
  }
}


exports.getJornada = async (req, res) => {
    try {
        const jornadaId = req.params.id;
        const userId = req.user.sub;
        const params = req.body;
        let data = {
            league: req.params.league,
        };
        let msg = validate.validateData(data);
        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league, jornadas: jornadaId }).populate('jornadas').lean();
            if (checkUserLeague === null || checkUserLeague.user != userId) {
                return res.status(400).send({ message: 'No puedes ver esta jornada' })
            } else {
                const jornada = await Jornada.findOne({ _id: jornadaId }).populate("resultado.equipo_1 resultado.equipo_2");
                if (!jornada) {
                    return res.send({ message: 'La jornada ingresada no ha podido encontrar' });
                } else {
                    return res.send({ messsage: 'Jornada encontrada: ', jornada });
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo la jornada' })
    }
}

exports.getResults = async (req, res) => {
    try {
        const userId = req.user.sub;
        const params = req.body;
        let data = {
            league: req.params.league,
            jornada: req.params.jornada
        };
        console.log(data.jornada)
        let msg = validate.validateData(data);
        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league, jornadas: data.jornada }).populate('jornadas').lean();
            if (checkUserLeague=== null ||  checkUserLeague.user != userId) {
                return res.status(400).send({ message: 'No puedes agregar partidos' })
            } else {
                const jornada = await Jornada.findOne({ _id : data.jornada }).populate('resultado.equipo_1 resultado.equipo_2');
                const resultados = jornada.resultado;
                if (!resultados) {
                    return res.send({ message: 'Partidos no encontrados' });
                } else {
                    return res.send({ messsage: 'Partidos encontrados:', resultados });
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}


