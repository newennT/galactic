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
    const levelInstances = await Promise.all(
        levels.map(level =>
            models.Level.create({
                id_level: level.id_level,
                title: level.title
            }).then(level => console.log(level.toJSON()))
        )
    );

    // Chapters 
    const chapterInstances = await Promise.all(
        chapters.map(chapter =>
            models.Chapter.create({
                id_chapter: chapter.id_chapter,
                title: chapter.title,
                title_fr: chapter.title_fr,
                abstract: chapter.abstract,
                order: chapter.order,
                id_level: chapter.id_level,
                isPublished: true
            }).then(chapter => console.log(chapter.toJSON()))
        )
    );

    // Pages
    const pageInstances = await Promise.all(
        pages.map(page =>
            models.Page.create({
                id_page: page.id_page,
                title: page.title,
                id_chapter: page.id_chapter,
                order_index: page.order_index,
                type: page.type
            }).then(page => console.log(page.toJSON()))
        )
    );

    // Lessons
    const lessonInstances = await Promise.all(
        lessons.map(lesson =>
            models.Lesson.create({
                id_page: lesson.id_page,
                title: lesson.title,
                content: lesson.content
            }).then(lesson => console.log(lesson.toJSON()))
        )
    );

    // Exercises
    const exerciseInstances = await Promise.all(
        exercises.map(exercise =>
            models.Exercise.create({
                id_page: exercise.id_page,
                title: exercise.title,
                question: exercise.question,
                feedback: exercise.feedback,
                type: exercise.type,
                media_url: exercise.media_url,
                media_type: exercise.media_type
            }).then(exercise => console.log(exercise.toJSON()))
        )
    );

    // UniqueResponses
    const uniqueResponseInstances = await Promise.all(
        uniqueResponses.map(uniqueResponse =>
            models.UniqueResponse.create({
                id_page: uniqueResponse.id_page,
                content: uniqueResponse.content,
                is_correct: uniqueResponse.is_correct
            }).then(uniqueResponse => console.log(uniqueResponse.toJSON()))
        )
    );

    // Pairs
    const pairsInstances = await Promise.all(
        pairs.map(pair =>
            models.Pairs.create({
                id_page: pair.id_page,
                content: pair.content,
                pair_key: pair.pair_key
            }).then(pair => console.log(pair.toJSON()))
        )
    );

    // PutInOrder
    const putInOrderInstances = await Promise.all(
        putInOrder.map(putInOrder =>
            models.PutInOrder.create({
                id_page: putInOrder.id_page,
                content: putInOrder.content,
                mixed_order: putInOrder.mixed_order,
                correct_order: putInOrder.correct_order
            }).then(putInOrder => console.log(putInOrder.toJSON()))
        )
    );

    // Users
    const userInstances = await Promise.all(
        users.map(user =>
            models.User.create({
                id_user: user.id_user,
                username: user.username,
                email: user.email,
                password: user.password,
                is_admin: user.is_admin,
                last_login: user.last_login
            }).then(user => console.log(user.toJSON()))
        )
    );

    // UserChapters
    const userChapterInstances = await Promise.all(
        userChapters.map(userChapter =>
            models.UserChapter.create({
                id_user: userChapter.id_user,
                id_chapter: userChapter.id_chapter,
                last_chapter_id: userChapter.last_chapter_id
            }).then(userChapter => console.log(userChapter.toJSON()))
        )
    );

    // UserExercises
    const userExercisesInstances = await Promise.all(
        userExercises.map(userExercise =>
            models.UserExercise.create({
                id_user: userExercise.id_user,
                id_page: userExercise.id_page,
                is_correct: userExercise.is_correct,
                is_done: userExercise.is_done
            }).then(userExercise => console.log(userExercise.toJSON()))
        )
    );
}

module.exports = initDb;