const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const vendedoresRoutes = require("./routes/vendedores");
const pagesRouter = require("./routes/pages.js");
const districtRouter = require("./routes/distritos.js");

const app = express();
const port = 8080;

// Middleware
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Rutas

app.use("/vendedores", vendedoresRoutes);
app.use("/", pagesRouter);
app.use("/distritos", districtRouter);

// Ruta principal
app.get("/", (req, res) => {
  res.redirect("/vendedores");
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
