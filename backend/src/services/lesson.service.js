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
}

module.exports = LessonService;