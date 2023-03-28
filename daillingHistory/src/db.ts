import * as mysql from "mysql2";

export const db = mysql.createConnection({
    // host: process.env.DB_HOST,
    // port: Number(process.env.DB_PORT),
    // user: process.env.DB_USER,
    // password: process.env.DB_PWD,
    // database: process.env.DB_NAME
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "beamcity_service"
});
//   host: "localhost",
// port: 3036,
// user: "root",
// password: "",
// database: "beamcity_service"