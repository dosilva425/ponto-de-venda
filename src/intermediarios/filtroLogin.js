const jwt = require('jsonwebtoken');
const knex = require('../conexao');

const hash = process.env.JWT_HASH;

const filtroLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    try {
        const token = authorization.split(' ')[1]

        if (!token) {
            return res.status(401).json({
                mensagem: 'Não autorizado'
            });
        }

        const { id } = jwt.verify(token, hash);

        if (!id) {
            return res.status(400).json({ mensagem: 'Token inválido' });
        }

        const usuarioExiste = await knex('usuarios').where({ id }).first();

        if (!usuarioExiste) {
            return res.status(404).json({
                mensagem: 'Usuário não encontrado'
            });
        }

        const { senha, ...usuario } = usuarioExiste;

        req.usuario = usuario;

        next();
    } catch (error) {
        return res.status(401).json({
            mensagem: 'Não autorizado'
        });
    }
};

module.exports = filtroLogin;