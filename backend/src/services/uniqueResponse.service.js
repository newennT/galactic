// services/uniqueResponse.service.js

const { UniqueResponse, Exercise } = require("../db/models");

async function getAll() {
  return UniqueResponse.findAll({
    order: ["id_page"],
    include: [{ model: Exercise }]
  });
}

async function getById(id) {
  return UniqueResponse.findByPk(id, {
    include: [{ model: Exercise }]
  });
}

async function create(data) {
  return UniqueResponse.create(data);
}

async function update(id, data) {
  await UniqueResponse.update(data, {
    where: { id_response: id }
  });

  return UniqueResponse.findByPk(id);
}

async function remove(id) {
  const item = await UniqueResponse.findByPk(id);
  if (!item) return null;

  await UniqueResponse.destroy({
    where: { id_response: id }
  });

  return item;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};