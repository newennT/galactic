// src/db/initDb.js
const models = require("./models");
const { connectWithRetry } = require("./sequelize");
const chapters = require("./data-mock/chapters");
const levels = require("./data-mock/levels");
const pages = require("./data-mock/pages");
const lessons = require("./data-mock/lessons");
const exercises = require("./data-mock/exercises");
const uniqueResponses = require("./data-mock/uniqueResponses");
const pairs = require("./data-mock/pairs");
const putInOrder = require("./data-mock/putInOrder");
const users = require("./data-mock/users");
const userChapters = require("./data-mock/userChapters");
const userExercises = require("./data-mock/userExercises");

async function initDb(){
    const { sequelize } = require("./sequelize");
    await sequelize.sync({ force: true });
    console.log("La base de données a été synchronisée avec succès");

    // levels
    const levelInstances = await models.Level.bulkCreate(
        levels.map(level => ({
            id_level: level.id_level,
            title: level.title
        })),
        {
            ignoreDuplicates: true
        }
    );

    // Chapters 
    const chapterInstances = await models.Chapter.bulkCreate(
        chapters.map(chapter => ({
                id_chapter: chapter.id_chapter,
                title: chapter.title,
                title_fr: chapter.title_fr,
                abstract: chapter.abstract,
                order: chapter.order,
                id_level: chapter.id_level,
                isPublished: true
            })),
            {
                ignoreDuplicates: true
            }
    );
        

    // Pages
    const pageInstances = await models.Page.bulkCreate(
        pages.map(page => ({
                id_page: page.id_page,
                title: page.title,
                id_chapter: page.id_chapter,
                order_index: page.order_index,
                type: page.type
            })),
            {
                ignoreDuplicates: true
            }
    );

    // Lessons
    const lessonInstances = await models.Lesson.bulkCreate(
        lessons.map(lesson => ({
                id_page: lesson.id_page,
                title: lesson.title,
                content: lesson.content
            })),
            {
                ignoreDuplicates: true
            }
    );

    // Exercises
    const exerciseInstances = await models.Exercise.bulkCreate(
        exercises.map(exercise => ({
                id_page: exercise.id_page,
                title: exercise.title,
                question: exercise.question,
                feedback: exercise.feedback,
                type: exercise.type,
                media_url: exercise.media_url,
                media_type: exercise.media_type
            })),
            {
                ignoreDuplicates: true
            }
    );

    // UniqueResponses
    const uniqueResponseInstances = await models.UniqueResponse.bulkCreate(
        uniqueResponses.map(uniqueResponse => ({
                id_page: uniqueResponse.id_page,
                id_response: uniqueResponse.id_response,
                content: uniqueResponse.content,
                is_correct: uniqueResponse.is_correct
            })),
            {
                ignoreDuplicates: true
            }
    );

    // Pairs
    const pairsInstances = await models.Pairs.bulkCreate(
        pairs.map(pair => ({
                id_page: pair.id_page,
                id_response: pair.id_response,
                content: pair.content,
                pair_key: pair.pair_key
            })),
            {
                ignoreDuplicates: true
            }
    );

    // PutInOrder
    const putInOrderInstances = await models.PutInOrder.bulkCreate(
        putInOrder.map(putInOrder => ({
                id_page: putInOrder.id_page,
                id_response: putInOrder.id_response,
                content: putInOrder.content,
                mixed_order: putInOrder.mixed_order,
                correct_order: putInOrder.correct_order
            })),
            {
                ignoreDuplicates: true
            }
    );

    // Users
    const userInstances = await models.User.bulkCreate(
        users.map(user => ({
                id_user: user.id_user,
                username: user.username,
                email: user.email,
                password: user.password,
                is_admin: user.is_admin,
                last_login: user.last_login
            }))

    );

    // UserChapters
    const userChapterInstances = await models.UserChapter.bulkCreate(
        userChapters.map(userChapter => ({
                id_user: userChapter.id_user,
                id_chapter: userChapter.id_chapter,
                last_chapter_id: userChapter.last_chapter_id
            })),
            {
                ignoreDuplicates: true
            }
    );

    // UserExercises
    const userExercisesInstances = await models.UserExercise.bulkCreate(
        userExercises.map(userExercise => ({
                id_user: userExercise.id_user,
                id_page: userExercise.id_page,
                is_correct: userExercise.is_correct,
                is_done: userExercise.is_done
            })),
            {
                ignoreDuplicates: true
            }
    );
}

module.exports = initDb;