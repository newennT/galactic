const ExerciseService = require("../../src/services/exercise.service");

jest.mock("../../src/db/models", () => ({
    Exercise: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
    },

    UniqueResponse: {
        create: jest.fn(),
    },

    Pairs: {
        create: jest.fn(),
    },

    PutInOrder: {
        create: jest.fn(),
    },
}));

const {
    Exercise,
    UniqueResponse,
    Pairs,
    PutInOrder,
} = require("../../src/db/models");

describe("ExerciseService", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should create UNIQUE exercise", async () => {
        await ExerciseService.createFull(
            { id_page: 1 },
            {
                question: "Question",
                feedback: "Feedback",
                type: "UNIQUE",
                media_url: "url",
                media_type: "image",
                uniqueResponses: [
                    { content: "A", is_correct: true }
                ]
            },
            {}
        );

        expect(Exercise.create).toHaveBeenCalled();

        expect(UniqueResponse.create).toHaveBeenCalledWith(
            {
                content: "A",
                is_correct: true,
                id_page: 1,
            },
            {
                transaction: {},
                hooks: false,
            }
        );
    });

    it("should create PAIRS exercise", async () => {
        await ExerciseService.createFull(
            { id_page: 1 },
            {
                type: "PAIRS",
                pairs: [
                    {
                        content_left: "A",
                        content_right: "B",
                        pair_key: "1",
                    },
                ],
            },
            {}
        );

        expect(Pairs.create).toHaveBeenCalledTimes(2);

        expect(Pairs.create).toHaveBeenNthCalledWith(
            1,
            {
                content: "A",
                pair_key: "1",
                id_page: 1,
            },
            expect.any(Object)
        );
    });

    it("should create ORDER exercise", async () => {
        await ExerciseService.createFull(
            { id_page: 1 },
            {
                type: "ORDER",
                putInOrders: [
                    {
                        content: "A",
                        mixed_order: 2,
                        correct_order: 1,
                    },
                ],
            },
            {}
        );

        expect(PutInOrder.create).toHaveBeenCalledWith(
            {
                content: "A",
                mixed_order: 2,
                correct_order: 1,
                id_page: 1,
            },
            expect.any(Object)
        );
    });

    it("should use fallback values in create", async () => {
        await ExerciseService.createFull(
            { id_page: 1 },
            {},
            {}
        );

        expect(Exercise.create).toHaveBeenCalledWith(
            {
                id_page: 1,
                question: "",
                feedback: "",
                type: "UNIQUE",
                media_url: null,
                media_type: null,
            },
            {
                transaction: {},
                hooks: false,
            }
        );
    });


    it("should create unique responses", async () => {
        await ExerciseService.createUnique(
            1,
            {
                uniqueResponses: [
                    {
                        content: "A",
                        is_correct: true,
                    },
                ],
            },
            {}
        );

        expect(UniqueResponse.create).toHaveBeenCalledWith(
            {
                content: "A",
                is_correct: true,
                id_page: 1,
            },
            {
                transaction: {},
                hooks: false,
            }
        );
    });

    it("should support empty uniqueResponses", async () => {
        await ExerciseService.createUnique(1, {}, {});

        expect(UniqueResponse.create).not.toHaveBeenCalled();
    });


    it("should create pairs", async () => {
        await ExerciseService.createPairs(
            1,
            {
                pairs: [
                    {
                        content_left: "A",
                        content_right: "B",
                        pair_key: "1",
                    },
                ],
            },
            {}
        );

        expect(Pairs.create).toHaveBeenNthCalledWith(
            1,
            {
                content: "A",
                pair_key: "1",
                id_page: 1,
            },
            {
                transaction: {},
                hooks: false,
            }
        );

        expect(Pairs.create).toHaveBeenNthCalledWith(
            2,
            {
                content: "B",
                pair_key: "1",
                id_page: 1,
            },
            {
                transaction: {},
                hooks: false,
            }
        );
    });

    it("should support empty pairs", async () => {
        await ExerciseService.createPairs(1, {}, {});

        expect(Pairs.create).not.toHaveBeenCalled();
    });

  
    it("should create order entries", async () => {
        await ExerciseService.createOrder(
            1,
            {
                putInOrders: [
                    {
                        content: "A",
                        mixed_order: 2,
                        correct_order: 1,
                    },
                ],
            },
            {}
        );

        expect(PutInOrder.create).toHaveBeenCalledWith(
            {
                content: "A",
                mixed_order: 2,
                correct_order: 1,
                id_page: 1,
            },
            {
                transaction: {},
                hooks: false,
            }
        );
    });

    it("should support empty putInOrders", async () => {
        await ExerciseService.createOrder(1, {}, {});

        expect(PutInOrder.create).not.toHaveBeenCalled();
    });


    it("should return base include", () => {
        const result = ExerciseService.baseInclude();

        expect(result).toEqual([
            { model: UniqueResponse },
            { model: Pairs },
            { model: PutInOrder },
        ]);
    });


    it("should return all exercises", async () => {
        Exercise.findAll.mockResolvedValue([{ id: 1 }]);

        const result = await ExerciseService.getAll();

        expect(Exercise.findAll).toHaveBeenCalledWith({
            include: ExerciseService.baseInclude(),
        });

        expect(result).toEqual([{ id: 1 }]);
    });


    it("should return exercise by id", async () => {
        Exercise.findByPk.mockResolvedValue({ id: 1 });

        const result = await ExerciseService.getById(1);

        expect(Exercise.findByPk).toHaveBeenCalledWith(
            1,
            {
                include: ExerciseService.baseInclude(),
            }
        );

        expect(result).toEqual({ id: 1 });
    });


    it("should create exercise entity", async () => {
        Exercise.create.mockResolvedValue({ id: 1 });

        const data = {
            question: "Question",
        };

        const result = await ExerciseService.create(data);

        expect(Exercise.create).toHaveBeenCalledWith(data);

        expect(result).toEqual({ id: 1 });
    });


    it("should update exercise", async () => {
        Exercise.update.mockResolvedValue([1]);

        Exercise.findByPk.mockResolvedValue({
            id: 1,
        });

        const result = await ExerciseService.update(
            1,
            {
                question: "Updated",
            }
        );

        expect(Exercise.update).toHaveBeenCalledWith(
            {
                question: "Updated",
            },
            {
                where: { id_page: 1 },
            }
        );

        expect(Exercise.findByPk).toHaveBeenCalledWith(
            1,
            {
                include: ExerciseService.baseInclude(),
            }
        );

        expect(result).toEqual({ id: 1 });
    });


    it("should delete exercise", async () => {
        const exercise = { id_page: 1 };

        Exercise.findByPk.mockResolvedValue(exercise);

        Exercise.destroy.mockResolvedValue(1);

        const result = await ExerciseService.delete(1);

        expect(Exercise.destroy).toHaveBeenCalledWith({
            where: { id_page: 1 },
        });

        expect(result).toEqual(exercise);
    });

    it("should return null if exercise not found", async () => {
        Exercise.findByPk.mockResolvedValue(null);

        const result = await ExerciseService.delete(1);

        expect(result).toBeNull();
    });

    it("should cover function signature default params", async () => {
        Exercise.create.mockResolvedValue({});

        await ExerciseService.createFull({ id_page: 1 });

        expect(Exercise.create).toHaveBeenCalled();
    });
});