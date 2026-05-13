const ChapterService = require("../../src/services/chapter.service");

function makeChapterService(mocks) {
    return new ChapterService(mocks);
}

module.exports = { makeChapterService };