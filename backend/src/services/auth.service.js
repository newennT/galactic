const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const models = require("../db/models");
const privatekey = require("../auth/private_key");

async function login(email, password) {
  const user = await models.User.findOne({
      where: { email },
      attributes: { include: ["password"] }
  });

  if (!user) {
      const err = new Error("L'utilisateur n'existe pas");
      err.status = 401;
      throw err;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
      const err = new Error("Le mot de passe est incorrect");
      err.status = 401;
      throw err;
  }

  await user.update({ last_login: new Date() });

  const token = jwt.sign(
    {
      id_user: user.id_user,
      is_admin: user.is_admin
    },
    privatekey,
    { expiresIn: "24h" }
  );

  return { user, token };
}

async function register(email, password, username) {
  if (!email || !password || !username) {
    const err = new Error("Tous les champs sont obligatoires");
    err.status = 400;
    throw err;
  }

  const existingEmail = await models.User.findOne({ where: { email } });

  if (existingEmail) {
    const err = new Error("L'email est déjà utilisé");
    err.status = 400;
    throw err;
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await models.User.create({
    email,
    password: hash,
    username
  });

  const token = jwt.sign(
    { id_user: user.id_user },
    privatekey,
    { expiresIn: "24h" }
  );

  return { user, token };
}

module.exports = {
  login,
  register
};