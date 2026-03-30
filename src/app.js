import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log("ENV TEST:", process.env);
dotenv.config({
  path: path.resolve(__dirname, "../.env")
});

import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import http from "http";

import { connectDB } from "./config/db.js";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

// handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

app.get("/test", (req, res) => {
  res.send("Servidor funcionando ");
});


io.on("connection", (socket) => {
  console.log("Cliente conectado");

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

app.use((err, req, res, next) => {
  console.error("🔥 ERROR GLOBAL:", err.message);

  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Error interno del servidor"
  });
});

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 8080;

    server.listen(PORT, () => {
      console.log(`Servidor escuchando en puerto ${PORT}`);
    });

  } catch (error) {
    console.error("Error iniciando el servidor:", error);
  }
};

startServer();