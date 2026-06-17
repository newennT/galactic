class ChapterValidator {

    validateChapterData(chapterData) {
        if (!chapterData) {
            throw new Error("Données chapitre manquantes");
        }

        if (!chapterData.title || !chapterData.title.trim()) {
            throw new Error("Le titre est obligatoire");
        }

        if (!chapterData.abstract || !chapterData.abstract.trim()) {
            throw new Error("L'abstract est obligatoire");
        }

        if (!chapterData.id_level) {
            throw new Error("Le niveau est obligatoire");
        }
    }

    validatePages(pages) {
        if (!Array.isArray(pages) || pages.length === 0) {
            throw new Error("Le chapitre doit contenir au moins une page");
        }
    }

    validatePageType(type) {
        const allowed = ["LESSON", "EXERCISE"];
        if (!allowed.includes(type)) {
            throw new Error(`Type invalide : ${type}`);
        }
    }

    validateLesson(lesson) {
        if (!lesson?.title?.trim()) {
            throw new Error("Titre de la leçon obligatoire");
        }

        if (!lesson?.content?.trim()) {
            throw new Error("Contenu de la leçon obligatoire");
        }
    }

    
    validateExercise(ex) {
        if (!ex) throw new Error("Exercice obligatoire");

        const allowed = ["UNIQUE", "PAIRS", "ORDER"];
        if (!allowed.includes(ex.type)) {
            throw new Error("Type d'exercice invalide");
        }

        if (!ex.question?.trim()) {
            throw new Error("Question obligatoire");
        }

        if (!ex.feedback?.trim()) {
            throw new Error("Feedback obligatoire");
        }
    }

    validateUniqueExercise(ex) {
        if (!ex.uniqueResponses || ex.uniqueResponses.length < 2) {
            throw new Error("Au moins 2 réponses requises");
        }

        if (!ex.uniqueResponses.some(r => r.is_correct)) {
            throw new Error("Une réponse correcte est obligatoire");
        }
    }

    validatePairsExercise(ex) {
        if (!ex.pairs || ex.pairs.length < 1) {
            throw new Error("Au moins une paire requise");
        }
    }

    validateOrderExercise(ex) {
        const segments = (ex.orderText || "")
            .split(";")
            .map(s => s.trim())
            .filter(Boolean);

        if (segments.length < 2) {
            throw new Error("Au moins 2 segments requis");
        }
    }

}

module.exports = new ChapterValidator();