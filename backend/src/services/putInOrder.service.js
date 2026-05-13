// services/putInOrder.service.js

const { PutInOrder, Exercise } = require("../db/models");

async function getAll() {
  return PutInOrder.findAll({
    order: ["id_page"],
    include: [{ model: Exercise }]
  });
}

async function getById(id) {
  return PutInOrder.findByPk(id, {
    include: [{ model: Exercise }]
  });
}

async function create(data) {
  return PutInOrder.create(data);
}

async function update(id, data) {
  await PutInOrder.update(data, {
    where: { id_response: id }
  });

  return PutInOrder.findByPk(id);
}

async function remove(id) {
  const item = await PutInOrder.findByPk(id);
  if (!item) return null;

  await PutInOrder.destroy({
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