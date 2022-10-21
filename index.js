const http = require("http");
const fs = require("fs");
const url = require("url");
const { agregarCancion, obtenerCanciones, editarCancion, eliminarCancion } = require("./consultas");

http.createServer(async (req, res) => {
    
    if (req.url == "/" && req.method == "GET") {
        res.setHeader("content-type", "text/html")
        res.statusCode = 200
        const html = fs.readFileSync("index.html", "utf8")
        res.end(html)

    } else if ((req.url == "/canciones" && req.method == "GET")) {
        let resultado = await obtenerCanciones()
        res.end(JSON.stringify(resultado))

    } else if ((req.url == "/cancion" && req.method == "POST")) {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", async () => {
            try {
                const datos = Object.values(JSON.parse(body));
                const respuesta = await agregarCancion(datos);
                res.statusCode = 201;
                res.end(JSON.stringify(respuesta));
            } catch (error) {
                res.end(JSON.stringify({
                    code: error.code,
                    message: "Error inesperado. Contacte al administrador.",
                }));
            }
        })

    } else if (req.url == "/cancion" && req.method == "PUT") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", async () => {
            try {
                const datos = Object.values(JSON.parse(body));
                const respuesta = await editarCancion(datos);
                res.statusCode = 201;
                res.end(JSON.stringify(respuesta));

            } catch (error) {
                res.end(JSON.stringify({
                    code: error.code,
                    message: "Error inesperado. Contacte al administrador.",
                }));
            }
        })
    }

    if (req.url.startsWith("/cancion?") && req.method == "DELETE") {
        try {
            const { id } = url.parse(req.url, true).query;
            const respuesta = await eliminarCancion(id);
            res.statusCode = 200;
            res.end(JSON.stringify(respuesta));
        } catch (error) {
            res.end(JSON.stringify({
                code: error.code,
                message: "Error inesperado. Contacte al administrador.",
            }));
        }
    }

}).listen(3000, () => { console.log("Server ON! http://localhost:3000") })