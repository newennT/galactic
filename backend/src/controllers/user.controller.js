// controllers/user.controller.js

const service = require("../services/user.service");
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
    res.json({ message: "Liste utilisateurs récupérée", data });
  } catch (error) {
    handleError(res, error, "Erreur récupération users");
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await service.getById(req.params.id);

    if (!data) {
      return res.status(404).json({
        message: "Utilisateur non trouvé"
      });
    }

    res.json({ message: "Utilisateur trouvé", data });
  } catch (error) {
    handleError(res, error, "Erreur récupération user");
  }
};

exports.create = async (req, res) => {
  try {
    const user = await service.create(req.body);

    res.json({
      message: `Utilisateur ${user.username} (${user.email}) créé`,
      data: user
    });
  } catch (error) {
    handleError(res, error, "Erreur création user");
  }
};

exports.update = async (req, res) => {
  try {
    const user = await service.update(req.params.id, req.body);

    if (!user) {
      return res.status(404).json({
        message: "Utilisateur non trouvé"
      });
    }

    res.json({
      message: `Utilisateur ${user.username} modifié`,
      data: user
    });
  } catch (error) {
    handleError(res, error, "Erreur update user");
  }
};

exports.remove = async (req, res) => {
  try {
    const user = await service.remove(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "Utilisateur non trouvé"
      });
    }

    res.json({
      message: `Utilisateur ${user.username} supprimé`,
      data: user
    });
  } catch (error) {
    handleError(res, error, "Erreur suppression user");
  }
};