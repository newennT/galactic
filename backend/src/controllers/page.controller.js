const { ValidationError, UniqueConstraintError } = require('sequelize');
const PageService = require('../services/page.service');

class PageController {

  static async getAll(req, res) {
    try {
      const pages = await PageService.getAll();

      res.json({
        message: "La liste des pages a été récupérée",
        data: pages,
      });

    } catch (error) {
      res.status(500).json({
        message:
          "La liste des pages n'a pas pu'être récupérée. Réessayez dans quelques instants.",
        data: error,
      });
    }
  }

  static async getById(req, res) {
    try {
      const page = await PageService.getById(req.params.id);

      if (!page) {
        return res.status(404).json({
          message: "La page demandée n'a pas été trouvée",
        });
      }

      res.json({
        message: "Une page a bien été trouvée",
        data: page,
      });

    } catch (error) {
      res.status(500).json({
        message:
          "Le chapitre n'a pas pu'être trouvé. Réessayez dans quelques instants.",
        data: error,
      });
    }
  }

  static async create(req, res) {
    try {
      const page = await PageService.create(req.body);

      res.json({
        message: "La page a bien été créée",
        data: page,
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
          "La page n'a pas pu être créée. Réessayez dans quelques instants.",
        data: error,
      });
    }
  }

  static async update(req, res) {
    try {
      const page = await PageService.update(
        req.params.id,
        req.body
      );

      if (!page) {
        return res.status(404).json({
          message:
            "La page demandée n'a pas été trouvée. Réessayez avec un autre identifiant.",
        });
      }

      res.json({
        message: "La page a bien été modifiée",
        data: page,
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
          "Le chapitre n'a pas pu être modifié. Réessayez dans quelques instants.",
        data: error,
      });
    }
  }

  static async delete(req, res) {
    try {
      const page = await PageService.delete(req.params.id);

      if (!page) {
        return res.status(404).json({
          message:
            "La page demandée n'a pas été trouvée. Réessayez avec un autre identifiant.",
        });
      }

      res.json({
        message: "La page a bien été supprimée",
        data: page,
      });

    } catch (error) {
      res.status(500).json({
        message:
          "La page n'a pas pu'être supprimée. Réessayez dans quelques instants.",
        data: error,
      });
    }
  }
}

module.exports = PageController;