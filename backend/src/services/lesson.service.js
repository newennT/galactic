const { Lesson } = require('../db/models');

class LessonService {

    static async create(page, lessonData, transaction) {
        return Lesson.create(
            {
                id_page: page.id_page,
                title: lessonData?.title || "",
                content: lessonData?.content || "",
            },
            {
                transaction,
                hooks: false,
            }
        );
    }


    static async getAll() {
        return Lesson.findAll();
    }

    static async getById(id) {
        return Lesson.findByPk(id);
    }

    static async update(id, data) {
        await Lesson.update(data, { where: { id_page: id } });
        return Lesson.findByPk(id);
    }

    static async delete(id) {
        const lesson = await Lesson.findByPk(id);
        if (!lesson) return null;
        await Lesson.destroy({ where: { id_page: id } });
        return lesson;
    }
}

module.exports = LessonService;