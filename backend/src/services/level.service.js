const { Level, Chapter } = require('../db/models');
const { Op } = require('sequelize');

class LevelService {

  static async getAll(query) {
    const include = [{ model: Chapter }];

    // filtre optionnel
    if (query?.title) {
      return Level.findAll({
        where: {
          title: {
            [Op.like]: `%${query.title}%`,
          },
        },
        order: [['title', 'ASC']],
      });
    }

    return Level.findAll({
      include,
      order: [['title', 'ASC']],
    });
  }

  static async getById(id) {
    return Level.findByPk(id, {
      include: [{ model: Chapter }],
    });
  }

  static async create(data) {
    return Level.create(data);
  }

  static async update(id, data) {
    await Level.update(data, {
      where: { id_level: id },
    });

    return Level.findByPk(id);
  }

  static async delete(id) {
    const level = await Level.findByPk(id);

    if (!level) return null;

    await Level.destroy({
      where: { id_level: id },
    });

    return level;
  }
}

module.exports = LevelService;