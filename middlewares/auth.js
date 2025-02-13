import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "No existe el token de autenticación, inicia sesión",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    delete payload.iat;
    delete payload.exp;

    req.user = payload;

    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "El token ha expirado, inicia sesión nuevamente",
    });
  }
};

export default auth;
