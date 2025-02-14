import Playlist from "../models/playlist.js";
import path from "path";
import fs from "fs";

const save = async (req, res) => {
  const name = req.body.name;
  const file = req.file;

  const ext = path.extname(file.filename);

  if (ext != ".jpg" && ext != ".png" && ext != ".jpeg" && ext != ".webp") {
    try {
      await fs.promises.unlink(path.join(file.destination, file.filename));

      return res.status(401).json({
        status: "error",
        message: "Extensión de archivo inválida",
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Error al eliminar el archivo inválido",
      });
    }
  }

  if (!name || !file) {
    return res.status(401).json({
      status: "error",
      message: "Faltan datos por enviar",
    });
  }

  try {
    const playlistFound = await Playlist.find({ name });

    if (playlistFound.length > 0) {
      await fs.promises.unlink(path.join(file.destination, file.filename));
      return res.status(401).json({
        status: "error",
        message: "El nombre ya existe",
      });
    }

    const playlistCreated = new Playlist({
      name,
      user: req.user.id,
      image: path.join(file.destination, file.filename),
    });

    await playlistCreated.save();

    return res.status(200).json({
      status: "success",
      message: "Playlist creada con éxito",
      playlist: playlistCreated,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error a crear playlist",
    });
  }
};

const remove = async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;

  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Se requiere un id para eliminar la playlist",
    });
  }

  try {
    const playlistDeleted = await Playlist.findOne({ _id: id, user: userId });

    console.log(playlistDeleted);

    if (!playlistDeleted) {
      return res.status(404).json({
        status: "error",
        message: "Playlist no encontrada",
      });
    }

    await playlistDeleted.deleteOne();

    await fs.promises.unlink(`./${playlistDeleted.image}`);

    return res.status(200).json({
      status: "success",
      message: "Playlist eliminada con éxito",
      playlist: playlistDeleted,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      status: "error",
      message: "Error al eliminar la playlist",
    });
  }
};

export default {
  save,
  remove,
};
