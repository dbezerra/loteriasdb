const Pedido = require('../models/pedido');
const Counter = require('../models/counter');

async function getNextSequence(sequenceName) {
    const counter = await Counter.findOneAndUpdate(
        { _id: sequenceName },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return counter.seq;
}

// Cria um pedido
exports.createPedido = async (req, res) => {
    try {
        const { id_usuario } = req.body;

        // Verificar se já existe um pedido com status 1 para esse usuário
        const pedidoExistente = await Pedido.findOne({ id_usuario, status_compra: 1 });
        if (pedidoExistente) {
            return res.status(400).send("Usuário já tem uma compra com status 'aberto'.");
        }

        // Obter o próximo ID de pedido
        const nextId = await getNextSequence('pedido');

        // Atribua o ID ao pedido e crie-o
        req.body.id_compra = nextId;
        const pedido = new Pedido(req.body);
        await pedido.save();

        res.status(201).send(pedido);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

// Inclui um jogo em um pedido
exports.addJogoToPedido = async (req, res) => {
    try {
        const id_compra = req.params.id;
        const { id_usuario, jogo } = req.body;

        // Obter id para o próximo jogo
        const nextJogoId = await getNextSequence('jogo'); 
        jogo.id_jogo = nextJogoId;

        // Atualize o pedido para adicionar o novo jogo
        const pedidoUpdated = await Pedido.findOneAndUpdate(
            { id_compra: id_compra, id_usuario: id_usuario }, 
            { $push: { jogos: jogo } },
            { new: true }
        );

        if (!pedidoUpdated) {
            return res.status(404).send('Pedido não encontrado ou você não tem permissão para alterá-lo.');
        }

        res.status(200).send(pedidoUpdated);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

// Alterar o status do pedido
exports.changeStatusPedido = async(req, res) =>{
    try {
        const { status_compra, id_usuario } = req.body;

        // Validação do status enviado na requisição
        if (![2, 3].includes(status_compra)) {
            return res.status(400).send('Status inválido.');
        }

        // Busca pedido com o id_compra e id_usuario especificados
        const pedido = await Pedido.findOneAndUpdate(
            { id_compra: req.params.id, id_usuario: id_usuario },
            { status_compra: status_compra },
            { new: true }
        );

        if (!pedido) {
            return res.status(404).send('Pedido não encontrado ou você não tem permissão para alterá-lo.');
        }

        res.status(200).send(pedido);
    } catch (err) {
        res.status(400).send(err.message);
    }
}

// Obter os pedidos do usuário
exports.getUserPedidos = async(req, res)=>{
    try {
        const userIdFromToken = req.user.id_usuario; 
        // Busca todos os pedidos com o id_usuario especificado
        const pedidos = await Pedido.find({ id_usuario: userIdFromToken });

        if (pedidos.length === 0) {
            return res.status(404).send('Nenhum pedido encontrado para este usuário.');
        }

        res.status(200).send(pedidos);
    } catch (err) {
        res.status(400).send(err.message);
    }
}


// Deleta um jogo de um pedido
exports.deleteJogo = async(req, res)=>{
    try {
        const { pedidoId, usuarioId, jogoId } = req.params;
        // Encontre o pedido que corresponde ao id_compra e id_usuario fornecidos e delete o jogo especificado pelo id_jogo
        const pedidoUpdated = await Pedido.findOneAndUpdate(
            { id_compra: pedidoId, id_usuario: usuarioId },
            { $pull: { jogos: { id_jogo: Number(jogoId) } } },
            { new: true }
        );

        if (!pedidoUpdated) {
            return res.status(404).send('Pedido não encontrado, jogo não encontrado ou você não tem permissão para alterar.');
        }
        res.status(200).send(pedidoUpdated);
    } catch (err) {
        res.status(400).send(err.message);
    }
}