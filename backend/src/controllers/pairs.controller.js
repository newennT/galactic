const { ValidationError, UniqueConstraintError } = require('sequelize');
const PairsService = require('../services/pairs.service');

class PairsController {

  static async getAll(req, res) {
    try {
      const pairs = await PairsService.getAll();

      res.json({
        message: "La liste des options a été récupérée",
        data: pairs,
      });

    } catch (error) {
      res.status(500).json({
        message:
          "La liste des options n'a pas pu'être récupérée. Réessayez dans quelques instants.",
        data: error,
      });
    }
  }

  static async getById(req, res) {
    try {
      const pair = await PairsService.getById(req.params.id);

      if (!pair) {
        return res.status(404).json({
          message: "L'option de type pairs demandée n'a pas été trouvée",
        });
      }

      res.json({
        message: "Une option de type pairs a bien été trouvée",
        data: pair,
      });

    } catch (error) {
      res.status(500).json({
        message:
          "L'option de type pairs n'a pas pu être trouvée. Réessayez dans quelques instants.",
        data: error,
      });
    }
  }

  static async create(req, res) {
    try {
      const pair = await PairsService.create(req.body);

      res.json({
        message: "L'option de type pairs a bien été créée",
        data: pair,
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
          "L'option de type pairs n'a pas pu être créée. Réessayez dans quelques instants.",
        data: error,
      });
    }
  }

  static async update(req, res) {
    try {
      const pair = await PairsService.update(
        req.params.id,
        req.body
      );

      if (!pair) {
        return res.status(404).json({
          message:
            "L'option demandée n'a pas été trouvée. Réessayez avec un autre identifiant.",
        });
      }

      res.json({
        message: "L'option de type pairs a bien été modifiée",
        data: pair,
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
          "L'option de type pairs n'a pas pu être modifiée. Réessayez dans quelques instants.",
        data: error,
      });
    }
  }

  static async delete(req, res) {
    try {
      const pair = await PairsService.delete(req.params.id);

      if (!pair) {
        return res.status(404).json({
          message:
            "L'option demandée n'a pas été trouvée. Réessayez avec un autre identifiant.",
        });
      }

      res.json({
        message: "L'option de type pairs a bien été supprimée",
        data: pair,
      });

    } catch (error) {
      res.status(500).json({
        message:
          "L'option de type pairs n'a pas pu être supprimé. Réessayez dans quelques instants.",
        data: error,
      });
    }
  }
}

module.exports = PairsController;