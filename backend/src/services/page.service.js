const {
  Page,
  Lesson,
  Exercise,
} = require('../db/models');

class PageService {

  static baseInclude() {
    return [
      { model: Lesson },
      { model: Exercise },
    ];
  }

  static async getAll() {
    return Page.findAll({
      order: [['order_index', 'ASC']],
      include: this.baseInclude(),
    });
  }

  static async getById(id) {
    return Page.findByPk(id, {
      include: this.baseInclude(),
    });
  }

  static async create(data) {
    return Page.create(data);
  }

  static async update(id, data) {
    await Page.update(data, {
      where: { id_page: id },
    });

    return Page.findByPk(id, {
      include: this.baseInclude(),
    });
  }

  static async delete(id) {
    const page = await Page.findByPk(id);

    if (!page) return null;

    await Page.destroy({
      where: { id_page: id },
    });

    return page;
  }
}

module.exports = PageService;