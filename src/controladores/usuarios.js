const knex = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const hash = process.env.JWT_HASH;

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const emailFinal = email.toLowerCase();
        const validacaoEmail = await knex('usuarios').select('email').where('email', emailFinal).first();
        if (validacaoEmail) {
            return res.status(400).json({
                mensagem: 'Este email já está cadastrado'
            });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const criacaoUsuario = await knex('usuarios').insert({
            nome: nome,
            email: emailFinal,
            senha: senhaCriptografada
        }).returning('id', 'nome', 'email');

        const { id } = criacaoUsuario[0];

        return res.status(200).json({
            id: id,
            nome: nome,
            email: emailFinal
        });
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro interno do servidor'
        });
    }
};

const loginUsuario = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const emailFinal = email.toLowerCase();
        const usuario = await knex('usuarios').where('email', emailFinal).first();
        if (!usuario) {
            return res.status(404).json({
                mensagem: 'O usuario não foi encontrado'
            });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.status(400).json({
                mensagem: 'Email e senha não conferem'
            });
        }

        const token = jwt.sign({ id: usuario.id }, hash, { expiresIn: '8h' });

        const { senha: _, ...dadosUsuario } = usuario;

        return res.status(200).json({
            usuario: dadosUsuario,
            token
        });
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro interno do servidor'
        });
    }

};

const detalharUsuario = async (req, res) => {
    const { authorization } = req.headers;

    try {
        const token = authorization.split(' ')[1];
        const { id } = jwt.verify(token, hash);
        const usuario = await knex('usuarios').select('id', 'nome', 'email').where('id', id).first();

        return res.status(200).json(usuario);
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro interno do servidor'
        });
    }
};

const editarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const emailFinal = email.toLowerCase();
        const validacaoEmail = await knex('usuarios').where('email', emailFinal).andWhereNot('id', req.usuario.id).first();
        if (validacaoEmail) {
            return res.status(400).json({ mensagem: 'Este email já está cadastrado' });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const edicaoUsuario = await knex('usuarios').update({
            nome: nome,
            email: emailFinal,
            senha: senhaCriptografada
        }).where('id', req.usuario.id).returning('id', 'nome', 'email');

        const { id } = edicaoUsuario[0];

        return res.status(200).json({
            id: id,
            nome: nome,
            email: emailFinal
        });
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro interno do servidor'
        });
    }
};

module.exports = {
    cadastrarUsuario,
    loginUsuario,
    detalharUsuario,
    editarUsuario
};


