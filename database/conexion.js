//Archivo de configuración para la base de datos

//Importar el modulo mysql
const mysql = require('mysql')

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'hospital'
})

conexion.connect(function(error){
    if(error){
        console.log(`Ocurrió un error en la conexión ${error}`)
        return;
    } else {
        console.log('Conexion exitosa')
    }
})

module.exports = {conexion}