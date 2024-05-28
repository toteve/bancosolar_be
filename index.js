const express = require('express');
const morgan = require('morgan');
const app = express();

// importar funciones del modulo consultas.js
//const {insertar, actualizar, verTodos, eliminar} = require('./consultas/consultas.js');

const {
    guardarUsuario,
    getUsuarios,
    editUsuario,
    eliminarUsuario,
    registrarTransferencia,
    getTransferencias,
  } = require("./consultas");

console.log("Valor de getUsuarios: ", getUsuarios);

app.listen(3000, ()=> console.log("Server listening on port 3000"))


app.use(express.json());
app.use(morgan('dev'));

// ruta raiz devuelve el index.html listo
app.get('/', (req, res) => {
    console.log(__dirname + '/index.html')
    res.sendFile(__dirname + '/index.html');
})

// RUTAS ASOCIADAS CON TRANSFERENCIAS

// ruta POST ingresar transaccion Transferencia recibe un body
app.post('/transferencia', async (req, res) => {
    try {
        const datos = Object.values(req.body);
        const datos1 = Object.keys(req.body);

        const datosNumeros = datos.map((dato) => Number(dato));

        console.log("Valor de datos en body: ",datos);
        console.log("Valor de datosNumeros convertidos: ",datosNumeros);
        console.log("Valor de keys en body: ",datos1);

        // enviado como un arreglo a registrarTransferencia
        const respuesta = await registrarTransferencia(datosNumeros);
        console.log("Respuesta registro de transferencia agregado: ",respuesta);

        res.json(respuesta);

    } catch (err) {
        console.log("Error en Transaccion Backend: ", err);
        console.log("Error en Transaccion Backend: ", err.message);
        res.status(500).send(err.message);
    }


});

// ruta GET consultar todas las transferencias
app.get('/transferencias', async (req, res) => {

    try {

        const respuesta = await getTransferencias();
        console.log("Respuesta Lista de Transferencias: ",respuesta);

        res.json(respuesta);

    } catch (err) {
        console.log("Error al consultar ruta: ", err);
        res.status(500).send(err.message);
    }


});

// RUTAS ASOCIADAS CON USUARIOS

// ruta POST ingresar usuario listo
app.post('/usuario', async (req, res) => {
    //console.log("Valor de req en Backend ruta: ", req);
    try {
        //console.log("Valor de req en Backend ruta: ", req);
        const datos = Object.values(req.body);
        const datos1 = Object.keys(req.body);

        console.log("Valor de datos en body: ",datos);
        console.log("Valor de keys en body: ",datos1);

        const respuesta = await guardarUsuario(datos);
        console.log("Respuesta registro agregado: ",respuesta);

        res.json(respuesta);

    } catch (err) {
        console.log("Error: ", err);
        res.status(500).send(err.message);
    }


});

// ruta PUT Modificar un registro listo
app.put('/usuario', async (req, res) => {
    try {
        // recibe un querystring por la ruta y un body
        const datos = Object.values(req.body);
        const datos1 = Object.keys(req.body);
        const id = req.query.id;

        console.log("Valor de datos en body: ",datos);
        console.log("Valor de keys en body: ",datos1);

        const respuesta = await editUsuario(datos,id);

        console.log("Respuesta registro modificado: ",respuesta);

        res.json(respuesta);

    } catch (err) {
        console.log("Error: ", err);
        res.status(500).send(err.message);
    }

});

// ruta GET consultar todos los usuarios listo
app.get('/usuarios', async (req, res) => {

    try {

        const respuesta = await getUsuarios();
        console.log("Respuesta Lista de Registros: ",respuesta);

        res.json(respuesta);

    } catch (err) {
        console.log("Error al consultar ruta: ", err);
        res.status(500).send(err.message);
    }


});

// ruta DELETE para eliminar un registro de usuario listo
app.delete('/usuario', async (req, res) => {
    try {
        // recibe un id por querystring
        const id = req.query.id;

        console.log("Valor del query.id  de la ruta: ",id);

        const respuesta = await eliminarUsuario(id);
        console.log("Respuesta registro eliminado: ",respuesta);

        res.json(respuesta);

    } catch (err) {
        console.log("Error: ", err);
        console.log("Error: ", err.message);
        res.status(500).send(err.message);
    }


});