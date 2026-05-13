const authService = require("../services/auth.service");

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.json({
      message: "Connexion réussie",
      data: result.user,
      token: result.token
    });

  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message
    });
  }
}

async function register(req, res) {
  try {
    const { email, password, username } = req.body;

    const result = await authService.register(email, password, username);

    res.json({
      message: "Utilisateur créé",
      data: result.user,
      token: result.token
    });

  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message
    });
  }
}

module.exports = {
  login,
  register
};