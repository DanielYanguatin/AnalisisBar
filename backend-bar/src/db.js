// import { createPool } from "mysql2/promise";
// export const pool = createPool({
//     host: "localhost",
//     user: "root",
//     password: "",
//     port: 3306,
//     database: "sistema_pos"
// })

// // export const pool = createPool({
// //   host: "185.236.182.93",
// //   user: "daniel_yanguatin",
// //   password: "1122337238",
// //   port: 3306,
// //   database: "daniel_yanguatin",
// // });

// (async () => {
//   try {
//     const conexion = await pool.getConnection();
//     console.log("Se conectó correctamente a la BD. Puerto 3306");
//     conexion.release();
//   } catch (err) {
//     console.error("Error al conectar con la BD:", err.message);
//   }
// })();

import {createPool} from 'mysql2/promise'
export const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    port: 3306,
    database: "sistema_pos"
})

// export const pool = createPool({
//     host: "185.236.182.93",
//     user: "daniel_yanguatin",
//     password: "1122337238",
//     port: 3306,
//     database: "daniel_yanguatin"
// })
try {
    const conexion = await pool.getConnection();
    console.log("Se conecto correctamente a la bd. Puerto 3306");
    conexion.release(); 
  } catch (err) {
    console.error("Se produjo un error al intentar conectar con la base de datos", err.message);
  }



