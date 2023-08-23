const mongoose = require('mongoose');

const jogoSchema = new mongoose.Schema({
    id_jogo: Number, // identificador único
    loteria: String,
    concurso: Number,
    dezenas: [Number]
});

const pedidoSchema = new mongoose.Schema({
    id_compra: {
        type: String,
        required: true,
        unique: true
    },
    id_usuario: {
        type: String,
        required: true
    },
    data_compra: {
        type: Date,
        default: Date.now
    },
    status_compra: {
        type: Number,
        enum: [1, 2, 3],
        required: true
    },
    jogos: [jogoSchema]
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

module.exports = Pedido;
