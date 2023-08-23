const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usuarioSchema = new mongoose.Schema({
    id_usuario: {
        type: String,
        required: true,
        unique: true
    },
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    telefone: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true,
        minlength: 5
    },
    pixTipo: {
        type: String,
        enum: ['CPF', 'telefone', 'email', 'aleatoria']
    },
    pixValor: String
});

usuarioSchema.methods.compareSenha = function(password) {
    return bcrypt.compareSync(password, this.senha);
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
