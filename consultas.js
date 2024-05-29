const { Pool } = require("pg");
require('dotenv').config();

const {HOST, USER, DATABASE, PASSWORD, PORT} = process.env

const pool = new Pool({
  user: USER,
  host: HOST,
  password: PASSWORD,
  database: DATABASE,
});

// funcion BD para ingresar un usuario
const guardarUsuario = async (usuario) => {
  const values = Object.values(usuario);
  const consulta = {
    text: "INSERT INTO usuarios (nombre,balance) values ( $1, $2) RETURNING *",
    values,
  };
  const result = await pool.query(consulta);
  return result.rows[0];
};

// funcion BD para mostrar todos los usuarios
const getUsuarios = async () => {
  const result = await pool.query("SELECT * FROM usuarios");
  return result.rows;
};

// funcion BD para editar un usuario, recibe un arreglo y un valor
const editUsuario = async (usuario, id) => {

  // construye un arreglo unico con los datos requeridos
  const values = Object.values(usuario).concat([id]);
  console.log("Arreglo parametros concatenado: ",values);

  const consulta = {
    text:
      "UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3 RETURNING *",
    values,
  };
  const result = await pool.query(consulta);

  return result.rows[0];
};

// funcion BD para eliminar un usuario
const eliminarUsuario = async (id) => {
  const result = await pool.query(`DELETE FROM usuarios WHERE id = ${id} RETURNING *`);
  return result.rows[0];
};

// funcion para realizar Transferencias con Transacciones SQL, recibir con destructuring
const registrarTransferencia = async (datos) => {
  console.log("Valores arreglo al llegar en funcion BD: ", datos);
  emisor = datos[0];
  receptor = datos[1];
  monto = datos[2];
  console.log("Valores separados despues1 en funcion BD: ", emisor,receptor, monto);

  // busquedas SQL previas para ver si existen emisor y receptor
  // const { id: emisorId } = (
  //   await pool.query(`SELECT * FROM usuarios WHERE nombre = '${emisor}'`)
  // ).rows[0];

  // const { id: receptorId } = (
  //   await pool.query(`SELECT * FROM usuarios WHERE nombre = '${receptor}'`)
  // ).rows[0];

  // construccion de los objetos para la transaccion de transferencia
  const registrarTransferenciaQuery = {
    text:
      "INSERT INTO transferencias (emisor, receptor, monto, fecha) values ( $1, $2, $3, NOW())",
    values: [emisor, receptor, monto],
  };

  const actualizarBalanceEmisor = {
    text: "UPDATE usuarios SET balance = balance - $1 WHERE id = $2 RETURNING *",
    values: [monto, emisor],
  };

  const actualizarBalanceReceptor = {
    text: "UPDATE usuarios SET balance = balance + $1 WHERE id = $2 RETURNING *",
    values: [monto, receptor],
  };

  // bloque try/catch para manejar la transaccion
  try {
    await pool.query("BEGIN");
    await pool.query(registrarTransferenciaQuery);
    await pool.query(actualizarBalanceEmisor);
    await pool.query(actualizarBalanceReceptor);
    await pool.query("COMMIT");
    return true;
  } catch (e) {
    console.log(e);
    await pool.query("ROLLBACK");
    throw e;
  }
};

// funcion obtener todas las transferencias
const getTransferencias = async () => {
   //const query = "SELECT * FROM transferencias"
  //CONSTRUYE SQL CON INNER JOIN
  const query = `SELECT 
                  t.fecha, 
                  e.nombre AS nombre_emisor, 
                  r.nombre AS nombre_receptor,
                  t.monto
                FROM 
                  transferencias t
                INNER JOIN 
                  usuarios e ON t.emisor = e.id
                INNER JOIN 
                  usuarios r ON t.receptor = r.id`

  const consulta = {
    text: query,
    rowMode: "array",
  };

  const result = await pool.query(consulta);
  let respuesta = result.rows;

  if (result.rows.length === 0) {
    respuesta = "*** No hay transferencias realizadas ***"
  } 
  
  return respuesta;

};

module.exports = {
  guardarUsuario,
  getUsuarios,
  editUsuario,
  eliminarUsuario,
  registrarTransferencia,
  getTransferencias
};
