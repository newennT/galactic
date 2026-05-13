const { Pairs, Exercise } = require('../db/models');

class PairsService {

  static baseInclude() {
    return [{ model: Exercise }];
  }

  static async getAll() {
    return Pairs.findAll({
      order: [['id_page', 'ASC']],
      include: this.baseInclude(),
    });
  }

  static async getById(id) {
    return Pairs.findByPk(id, {
      include: this.baseInclude(),
    });
  }

  static async create(data) {
    return Pairs.create(data);
  }

  static async update(id, data) {
    await Pairs.update(data, {
      where: { id_response: id },
    });

    return Pairs.findByPk(id, {
      include: this.baseInclude(),
    });
  }

  static async delete(id) {
    const pair = await Pairs.findByPk(id);

    if (!pair) return null;

    await Pairs.destroy({
      where: { id_response: id },
    });

    return pair;
  }
}

module.exports = PairsService;