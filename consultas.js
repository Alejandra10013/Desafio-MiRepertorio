const { Pool } = require("pg")

const config = {
    user: "postgres",
    host: "localhost",
    password: "12345",
    database: "repertorio",
    port: "5432",
    max: 20,
    idleTimeoutMillis: 4000,
    connectionTimeoutMillis: 0
}

const pool = new Pool(config);

const agregarCancion = async (datos) => {
    const consulta = {
        text: "insert into canciones (titulo, artista, tono) values ($1, $2, $3)",
        values: datos,
    };
    try {
        const resultado = await pool.query(consulta);
        return resultado;
    } catch (error) {
        console.log(error.code);
        return error;
    }
}

const obtenerCanciones = async () => {
    try {
        const consulta = "select * from canciones;";
        const resultado = await pool.query(consulta);
        return resultado.rows;
    } catch (error) {
        console.log(error.code);
        return error
    }
}

const editarCancion = async (datos) => {
    const consulta = {
        text: "update canciones set titulo = $2, artista = $3, tono = $4 where id = $1 returning *",
        values: datos,
    };
    try {
        const resultado = await pool.query(consulta);
        return resultado;
    } catch (error) {
        console.log(error.code);
        return error
    }
}

const eliminarCancion = async (id) => {
    try {
        const resultado = await pool.query(`delete from canciones where id = ${id};`);
        return resultado
    } catch (error) {
        console.log(error.code);
        return error
    }
}


module.exports = { agregarCancion, obtenerCanciones, editarCancion, eliminarCancion };