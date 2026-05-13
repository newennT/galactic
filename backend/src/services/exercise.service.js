const { Exercise, UniqueResponse, Pairs, PutInOrder} = require('../db/models');

class ExerciseService {

    static async createFull(page, ex = {}, transaction) {
        await Exercise.create(
            {
                id_page: page.id_page,
                question: ex.question || "",
                feedback: ex.feedback || "",
                type: ex.type || "UNIQUE",
                media_url: ex.media_url || null,
                media_type: ex.media_type || null,
            },
            { transaction, hooks: false }
        );

        if (ex.type === 'UNIQUE') {
            await this.createUnique(page.id_page, ex, transaction);
        }

        if (ex.type === 'PAIRS') {
            await this.createPairs(page.id_page, ex, transaction);
        }

        if (ex.type === 'ORDER') {
            await this.createOrder(page.id_page, ex, transaction);
        }
    }

    static async createUnique(id_page, ex, t) {
        for (const r of ex.uniqueResponses || []) {
            await UniqueResponse.create(
                {
                    content: r.content,
                    is_correct: r.is_correct,
                    id_page,
                },
                { transaction: t, hooks: false }
            );
        }
    }

    static async createPairs(id_page, ex, t) {
        for (const pair of ex.pairs || []) {
            await Pairs.create(
                {
                    content: pair.content_left,
                    pair_key: pair.pair_key,
                    id_page,
                },
                { transaction: t, hooks: false }
            );

            await Pairs.create(
                {
                    content: pair.content_right,
                    pair_key: pair.pair_key,
                    id_page,
                },
                { transaction: t, hooks: false }
            );
        }
    }

    static async createOrder(id_page, ex, t) {
        for (const s of ex.putInOrders || []) {
            await PutInOrder.create(
                {
                    content: s.content,
                    mixed_order: s.mixed_order,
                    correct_order: s.correct_order,
                    id_page,
                },
                { transaction: t, hooks: false }
            );
        }
    }

    static baseInclude() {
        return [
            { model: UniqueResponse },
            { model: Pairs },
            { model: PutInOrder },
        ];
    }

    static async getAll() {
        return Exercise.findAll({
            include: this.baseInclude(),
        });
    }

    static async getById(id) {
        return Exercise.findByPk(id, {
            include: this.baseInclude(),
        });
    }

    static async create(data) {
        return Exercise.create(data);
    }

    static async update(id, data) {
        await Exercise.update(data, {
            where: { id_page: id },
        });
        return Exercise.findByPk(id, {
            include: this.baseInclude(),
        });
    }

    static async delete(id) {
        const exercise = await Exercise.findByPk(id);
        if (!exercise) return null;
        await Exercise.destroy({ where: { id_page: id } });
        return exercise;
    }


}

module.exports = ExerciseService;