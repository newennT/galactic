// controllers/putInOrder.controller.js

const service = require("../services/putInOrder.service");
const { ValidationError, UniqueConstraintError } = require("sequelize");

function handleError(res, error, baseMessage) {
  if (error instanceof ValidationError || error instanceof UniqueConstraintError) {
    return res.status(400).json({ message: error.message, data: error });
  }

  return res.status(500).json({
    message: baseMessage,
    data: error
  });
}

exports.getAll = async (req, res) => {
  try {
    const data = await service.getAll();
    res.json({ message: "Liste récupérée", data });
  } catch (error) {
    handleError(res, error, "Erreur récupération liste");
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await service.getById(req.params.id);

    if (!data) {
      return res.status(404).json({
        message: "Option order non trouvée"
      });
    }

    res.json({ message: "Option trouvée", data });
  } catch (error) {
    handleError(res, error, "Erreur récupération option");
  }
};

exports.create = async (req, res) => {
  try {
    const data = await service.create(req.body);
    res.json({ message: "Créé avec succès", data });
  } catch (error) {
    handleError(res, error, "Erreur création");
  }
};

exports.update = async (req, res) => {
  try {
    const data = await service.update(req.params.id, req.body);

    if (!data) {
      return res.status(404).json({
        message: "Option non trouvée"
      });
    }

    res.json({ message: "Mis à jour", data });
  } catch (error) {
    handleError(res, error, "Erreur update");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await service.remove(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "Option non trouvée"
      });
    }

    res.json({ message: "Supprimé", data: deleted });
  } catch (error) {
    handleError(res, error, "Erreur suppression");
  }
};