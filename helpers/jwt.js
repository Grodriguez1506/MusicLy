import jwt from "jsonwebtoken";
import moment from "moment";

const createAccessToken = (user) => {
  const payload = {
    id: user.id,
    name: user.name,
    surname: user.surname,
    username: user.username,
    email: user.email,
    role: user.role,
    iat: moment().unix(),
    exp: moment().add(1, "hour").unix(),
  };

  return jwt.sign(payload, process.env.JWT_SECRET);
};

export default createAccessToken;
