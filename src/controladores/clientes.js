const knex = require('../conexao');

const cadastrarCliente = async (req, res) => {
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;

    try {
        const emailFinal = email.toLowerCase();
        const validacaoEmail = await knex('clientes').select('email').where('email', emailFinal).first();
        if (validacaoEmail) {
            return res.status(400).json({
                mensagem: 'Este email já está cadastrado'
            });
        }

        const validacaoCpf = await knex('clientes').select('cpf').where('cpf', cpf).first();
        if (validacaoCpf) {
            return res.status(400).json({
                mensagem: 'Este cpf já está cadastrado'
            });
        }

        const criacaoCliente = await knex('clientes').insert({
            nome,
            email: emailFinal,
            cpf,
            cep,
            rua,
            numero,
            bairro,
            cidade,
            estado
        }).returning('id');

        const clienteCriado = await knex('clientes')
            .select('id', 'nome', 'email', 'cpf', 'cep', 'rua', 'numero', 'bairro', 'cidade', 'estado')
            .where('id', criacaoCliente[0].id)
            .first();

        return res.status(200).json(clienteCriado);

    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro interno do servidor'
        });
    }
};

const editarCliente = async (req, res) => {
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;
    const cliente_id = req.params.id;

    try {
        const clienteValido = await knex('clientes').select('*').where('id', cliente_id).first();
        if (!clienteValido) {
            return res.status(404).json({
                mensagem: 'Cliente não encontrado'
            });
        }

        const emailFinal = email.toLowerCase();
        const validacaoEmail = await knex('clientes').select('*').whereNot('id', cliente_id).where('email', emailFinal).first();
        if (validacaoEmail) {
            return res.status(400).json({
                mensagem: 'Este email já está cadastrado'
            });
        }

        const cpfExiste = await knex('clientes').select('*').whereNot('id', cliente_id).where('cpf', cpf).first();
        if (cpfExiste) {
            return res.status(400).json({
                mensagem: 'Este cpf já está cadastrado'
            });
        }

        const edicaoCliente = await knex('clientes').update({
            nome: nome,
            email: emailFinal,
            cpf: cpf,
            cep: cep || null,
            rua: rua || null,
            numero: numero || null,
            bairro: bairro || null,
            cidade: cidade || null,
            estado: estado || null
        }).where('id', cliente_id).returning('id');

        const clienteEditado = await knex('clientes')
            .select('id', 'nome', 'email', 'cpf', 'cep', 'rua', 'numero', 'bairro', 'cidade', 'estado')
            .where('id', edicaoCliente[0].id)
            .first();

        return res.status(200).json(clienteEditado);
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro interno do servidor'
        });
    }
};

const listarClientes = async (req, res) => {
    try {
        const listagemClientes = await knex('clientes');

        return res.status(200).json(listagemClientes);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

const detalharCliente = async (req, res) => {
    const id = req.params.id;

    try {
        const clienteValido = await knex('clientes').select('*').where('id', id).first();
        if (!clienteValido) {
            return res.status(404).json({
                mensagem: 'Cliente não encontrado'
            });
        }

        return res.status(200).json(clienteValido);
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro interno do servidor'
        });
    }
};

module.exports = {
    cadastrarCliente,
    editarCliente,
    listarClientes,
    detalharCliente
};