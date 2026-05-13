const { ValidationError, UniqueConstraintError } = require('sequelize');
const LevelService = require('../services/level.service');

class LevelController {

  static async getAll(req, res) {
    try {
      const levels = await LevelService.getAll(req.query);

      const message = req.query.title
        ? `Il y a ${levels.length} niveaux qui correspondent au titre ${req.query.title}`
        : "La liste des niveaux a été récupérée";

      res.json({ message, data: levels });

    } catch (error) {
      res.status(500).json({
        message:
          "La liste des niveaux n'a pas pu'être récupérée. Réessayez dans quelques instants.",
        data: error,
      });
    }
  }

  static async getById(req, res) {
    try {
      const level = await LevelService.getById(req.params.id);

      if (!level) {
        return res.status(404).json({
          message: "Le niveau demandé n'a pas été trouvé",
        });
      }

      res.json({
        message: "Un niveau a bien été trouvé",
        data: level,
      });

    } catch (error) {
      res.status(500).json({
        message:
          "Le niveau n'a pas pu'être trouvé. Réessayez dans quelques instants.",
        data: error,
      });
    }
  }

  static async create(req, res) {
    try {
      const level = await LevelService.create(req.body);

      res.json({
        message: `Le niveau ${req.body.title} a bien été créé`,
        data: level,
      });

    } catch (error) {
      if (
        error instanceof ValidationError ||
        error instanceof UniqueConstraintError
      ) {
        return res.status(400).json({
          message: error.message,
          data: error,
        });
      }

      res.status(500).json({
        message:
          "Le niveau n'a pas pu être créé. Réessayez dans quelques instants.",
        data: error,
      });
    }
  }

  static async update(req, res) {
    try {
      const level = await LevelService.update(
        req.params.id,
        req.body
      );

      if (!level) {
        return res.status(404).json({
          message:
            "Le niveau demandé n'a pas été trouvé. Réessayez avec un autre identifiant.",
        });
      }

      res.json({
        message: `Le niveau ${level.title} a bien été modifié`,
        data: level,
      });

    } catch (error) {
      if (
        error instanceof ValidationError ||
        error instanceof UniqueConstraintError
      ) {
        return res.status(400).json({
          message: error.message,
          data: error,
        });
      }

      res.status(500).json({
        message:
          "Le niveau n'a pas pu être modifié. Réessayez dans quelques instants.",
        data: error,
      });
    }
  }

  static async delete(req, res) {
    try {
      const level = await LevelService.delete(req.params.id);

      if (!level) {
        return res.status(404).json({
          message:
            "Le niveau demandé n'a pas été trouvé. Réessayez avec un autre identifiant.",
        });
      }

      res.json({
        message: `Le niveau ${level.title} a bien été supprimé`,
        data: level,
      });

    } catch (error) {
      res.status(500).json({
        message:
          "Le niveau n'a pas pu'être supprimé. Réessayez dans quelques instants.",
        data: error,
      });
    }
  }
}

module.exports = LevelController;