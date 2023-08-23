require('dotenv').config();
const express = require('express');
const mongoose = require('./config/database');
const passport = require('passport'); // Importa o Passport

const pedidoRoutes = require('./routes/pedidoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

require('./config/passportConfig')(passport); 
app.use(passport.initialize());

app.use(express.json());
app.use('/pedidos', pedidoRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/api', authRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
