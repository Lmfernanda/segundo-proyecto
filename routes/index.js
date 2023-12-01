var express = require('express');
var router = express.Router();
const { conexion } = require('../database/conexion')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

//Enrutamiento para visualizar los medicos de la base de datos
router.get('/listado-medicos', (req, res) => {
  conexion.query('SELECT * FROM medicos;', (error, resultado) => handleErrorListing(error, resultado, undefined, undefined, 'medicos', res))
})

//Enrutamiento para agregar un medico a la base de datos
router.post('/agregar-medico', (req, res) => {
  const {nombres, apellidos, cedula, consultorio, telefono, correo, especialidad} = req.body

  conexion.query(`INSERT INTO medicos (cedula, nombres, apellidos, especialidad, consultorio, correo, telefono) VALUES (${cedula}, '${nombres}', '${apellidos}', '${especialidad}', '${consultorio}', '${correo}', '${telefono}')`, (error) => handleErrorSaving(error, undefined, undefined, 'listado-medicos', res))
});

//Enrutamiento para visualizar los pacientes de la base de datos
router.get('/listado-pacientes', (req, res) => {
  conexion.query('SELECT * FROM pacientes;', (error, resultado) => handleErrorListing(error, resultado, undefined, undefined, 'pacientes', res))
})

//Enrutamiento para visualizar las citas agendadas
router.get('/listado-citas', (req, res) => {
  conexion.query('SELECT fecha_cita, pacientes.nombres, pacientes.apellidos, pacientes.telefono, medicos.especialidad, medicos.consultorio, medicos.nombres nombresMedico, medicos.apellidos apellidosMedico FROM cita_medica, pacientes, medicos WHERE cedula_medico=medicos.cedula AND cedula_paciente=pacientes.cedula;', (error, resultado) => handleErrorListing(error, resultado, undefined, undefined, 'citas', res))
})

//Enrutamiento para agregar un paciente a la base de datos
router.post('/agregar-paciente', (req, res) => {
  const {nombres, apellidos, cedula, fecha_nacimiento, telefono} = req.body

  conexion.query(`INSERT INTO pacientes (cedula, nombres, apellidos, fecha_nacimiento, telefono) VALUES (${cedula}, '${nombres}', '${apellidos}', '${fecha_nacimiento}','${telefono}')`, (error) => handleErrorSaving(error, undefined, undefined, 'listado-pacientes', res))
});

router.get('/consulta-cita', (req, res) => {
  
  const especialidad = req.query.especialidad

  conexion.query(`SELECT * FROM medicos WHERE especialidad='${especialidad}';`, (error, resultado) => handleErrorListing(error, resultado, undefined, undefined, 'agenda-citas', res))
})

router.post('/agregar-cita', (req, res) => {
  const {cedula, fecha_cita, especialista} = req.body
  
  console.log(req.body)
  conexion.query(`INSERT INTO cita_medica (cedula_medico, cedula_paciente, fecha_cita) VALUES (${especialista}, ${cedula}, '${fecha_cita}')`, (error) => handleErrorSaving(error, undefined, undefined, '/listado-citas', res))
})

const handleErrorListing = (
  error, resultado, statusError= 500, statusRes= 200, view, response,
) => {
  if(error) {
    console.log(error)
    response.status(statusError).send('Ocurrio un error obteniendo la información de la base de datos')
  } else {
    console.log(resultado)
    response.status(statusRes).render(view, { resultado })
  }
}

const handleErrorSaving = (
  error, statusError=500, statusRes=200, view, response,
) => {
  if(error) {
    console.log(error)
    response.status(statusError).send('Ocurrio un error guardando la información de la base de datos')
  } else {
    response.status(statusRes).redirect(view)
  }
}

module.exports = router;
