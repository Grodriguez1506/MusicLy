import express from "express";
import "dotenv/config";
import connectDb from "./database/db.js";
import userRoutes from "./routes/user.routes.js";
import artistRoutes from "./routes/artists.routes.js";
import songRoutes from "./routes/song.routes.js";
import albumRoutes from "./routes/album.routes.js";
import followRoutes from "./routes/follow.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import cookieParser from "cookie-parser";

// Inicializar express mediante la constante app
const app = express();

// Definir el puerto
const port = process.env.PORT || 3900;

// Conectar a la BD
connectDb();

// Configuración para procesar los datos en JSON
app.use(express.json());

// Configuración para procesar los datos enviados desde un formulario
app.use(express.urlencoded({ extended: true }));

// Configuración para acceder a las cookies
app.use(cookieParser());

// Utilizar rutas desde el el directorio Routes
app.use("/api/user", userRoutes);
app.use("/api/artist", artistRoutes);
app.use("/api/song", songRoutes);
app.use("/api/album", albumRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/playlist", playlistRoutes);

app.listen(port, () => {
  console.log("App running on port", port);
});
