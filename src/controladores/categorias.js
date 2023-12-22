const knex = require('../conexao')

const listarCategorias = async (req, res) => {
    try {
        const listagemCategorias = await knex('categorias');

        return res.status(200).json(listagemCategorias);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

module.exports = { listarCategorias };