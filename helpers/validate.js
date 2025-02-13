import validator from "validator";

const validateRegister = (params) => {
  let name =
    validator.isAlpha(params.name, "es-ES") &&
    validator.isLength(params.name, { min: 3, max: undefined });

  if (!name) {
    throw new Error(
      "El campo nombre solo debe contener letras y una longitud mínima de 3 caracteres"
    );
  }

  let surname =
    validator.isAlpha(params.surname, "es-ES") &&
    validator.isLength(params.surname, { min: 3, max: undefined });

  if (!surname) {
    throw new Error(
      "El campo apellido solo debe contener letras y una longitud mínima de 3 caracteres"
    );
  }

  if (params.username) {
    let username = validator.isLength(params.username, {
      min: 2,
      max: undefined,
    });

    if (!username) {
      throw new Error(
        "El campo usuario debe tener una longitud mínima de 2 caracteres"
      );
    }
  }

  if (params.artisticName) {
    let artisticName = validator.isLength(params.artisticName, {
      min: 2,
      max: undefined,
    });

    if (!artisticName) {
      throw new Error(
        "El campo nombre artístico debe tener una longitud mínima de 2 caracteres"
      );
    }
  }

  let email = validator.isEmail(params.email);

  if (!email) {
    throw new Error("Email inválido");
  }

  let password = validator.isLength(params.password, { min: 6, max: 15 });

  if (!password) {
    throw new Error("El campo contraseña debe contener mínimo 6 caracteres");
  }
};

export default {
  validateRegister,
};
