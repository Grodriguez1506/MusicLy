import User from "../models/user.js";
import validators from "../helpers/validate.js";
import bcrypt from "bcrypt";
import createAccessToken from "../helpers/jwt.js";

const register = async (req, res) => {
  let params = req.body;

  if (!params.name || !params.username || !params.email || !params.password) {
    return res.status(404).json({
      status: "error",
      message: "Faltan datos por enviar",
    });
  }

  try {
    validators.validateRegister(params);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }

  try {
    const usernameFound = await User.findOne({ username: params.username });

    if (usernameFound) {
      return res.status(400).json({
        status: "error",
        message: "El nombre de usuario ya existe",
      });
    }

    const emailFound = await User.findOne({ email: params.email });

    if (emailFound) {
      return res.status(400).json({
        status: "error",
        message: "El email ingresado ya existe",
      });
    }

    let pwd = await bcrypt.hash(params.password, 10);
    params.password = pwd;

    const newUser = new User(params);

    newUser.save({ new: true });

    return res.status(200).json({
      status: "success",
      message: "Usuario registrado exitosamente",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al registrar usuario",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({
      status: "error",
      message: "Faltan datos por suministrar",
    });
  }

  try {
    const userFound = await User.findOne({ email }).select("+password +email");

    if (!userFound) {
      return res.status(404).json({
        status: "error",
        message: "Credenciales inválidas",
      });
    }

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch) {
      return res.status(404).json({
        status: "error",
        message: "Credenciales inválidas",
      });
    }

    const token = createAccessToken(userFound);

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
    });

    return res.status(200).json({
      status: "success",
      message: "Incio de sesión exitoso",
      user: userFound,
    });
  } catch (error) {
    return res.status(404).json({
      status: "error",
      message: "Credenciales inválidas",
    });
  }
};

const profile = (req, res) => {
  const userIdentity = req.user;

  return res.status(200).json({
    status: "success",
    message: "Bienvenido al perfil",
    user: userIdentity,
  });
};

const uploadAvatar = async (req, res) => {
  const userId = req.user.id;
  const avatar = req.file.filename;

  try {
    const avatarUpload = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true }
    );

    avatarUpload.save();
    return res.status(200).json({
      status: "success",
      message: "Actualización de foto de perfil exitosa",
      user: avatarUpload,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al cargar foto de perfil",
    });
  }
};

const logout = (req, res) => {
  res.clearCookie("access_token");

  return res.status(200).json({
    status: "error",
    message: "Cierre de sesión exitoso",
  });
};

export default {
  register,
  login,
  profile,
  uploadAvatar,
  logout,
};
