// services/user.service.js

const { User, Chapter } = require("../db/models");

async function getAll() {
  return User.findAll({
    order: ["last_login"],
    include: [
      {
        model: Chapter,
        through: { attributes: [] }
      }
    ]
  });
}

async function getById(id) {
  return User.findByPk(id);
}

async function create(data) {
  return User.create(data);
}

async function update(id, data) {
  await User.update(data, {
    where: { id_user: id }
  });

  return User.findByPk(id);
}

async function remove(id) {
  const user = await User.findByPk(id);
  if (!user) return null;

  await User.destroy({
    where: { id_user: id }
  });

  return user;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};