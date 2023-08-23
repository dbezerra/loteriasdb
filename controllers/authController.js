const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');

exports.autenticarUsuario = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const user = await Usuario.findOne({ email });
        const senhaCorreta = await bcrypt.compare(senha, user.senha);
        
        if (!user || !senhaCorreta) {
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }

        const payload = {
            id: user._id,
            uid: user.id_usuario,
            nome: user.nome,
            email: user.email
        };

        jwt.sign(payload, process.env.SECRET_JWT_KEY, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({
                token: 'Bearer ' + token
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro no servidor.");
    }
};
