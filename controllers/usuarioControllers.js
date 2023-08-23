const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const { getNextSequence } = require('../utils/counters'); 

// Cadastra um novo usuário
exports.cadastrarUsuario = async (req, res) => {
    try {
        const { nome, email, telefone, senha, pix } = req.body;
        const {tipo:pixTipo, valor:pixValor} = pix || {} 
        
        if (!senha){
            return res.status(400).send("Senha é obrigatoria.");
        }

        if (senha.length < 5) {
            return res.status(400).send("A senha deve ter no mínimo 5 caracteres.");
        }

        // Gere o ID do usuário
        const date = new Date();
        const year = date.getFullYear().toString().substr(-2); // Obtém os últimos 2 dígitos do ano
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Obtém o mês e garante que sempre tem 2 dígitos
        const seq = await getNextSequence("usuario");
        const userId = `${year}${month}${seq.toString().padStart(4, '0')}`; // Preenche com zeros à esquerda até obter 4 dígitos

        const salt = await bcrypt.genSalt(10);
        const senhaHashed = await bcrypt.hash(senha, salt);

        const novoUsuario = new Usuario({
            id_usuario: userId,
            nome: nome,
            email: email,
            telefone: telefone,
            senha: senhaHashed,
            pixTipo: pixTipo,      
            pixValor: pixValor   
        });

        await novoUsuario.save();
        res.status(201).send({ userId, nome, email, telefone, pixTipo, pixValor }); // Adicionado campos pixTipo e pixValor na resposta
    } catch (err) {
        res.status(400).send(err.message);
    }
};
