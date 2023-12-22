const knex = require('../conexao');
const send = require('../servicos/email');
const compiladorHtml = require('../utilitarios/compiladorHtml');

const cadastrarPedido = async (req, res) => {
    const { cliente_id, observacao, pedido_produtos } = req.body;

    try {
        const clienteValido = await knex('clientes').select('*').where('id', cliente_id).first();
        if (!clienteValido) {
            return res.status(404).json({ mensagem: 'Cliente não encontrado' });
        }
        for (let item of pedido_produtos) {
            const produtoValido = await knex('produtos').select('*').where('id', item.produto_id).first();
            if (!produtoValido) {
                return res.status(404).json({ mensagem: `Produto com produto_id = ${item.produto_id} não foi encontrado` });
            }
        }

        for (let produto1 = 0; produto1 < pedido_produtos.length; produto1++) {
            for (let produto2 = produto1 + 1; produto2 < pedido_produtos.length; produto2++) {
                if (pedido_produtos[produto1].produto_id == pedido_produtos[produto2].produto_id) {
                    pedido_produtos[produto1].quantidade_produto += pedido_produtos[produto2].quantidade_produto;
                    pedido_produtos.splice(produto2, 1);
                    produto2--;
                }
            }
        }

        for (let item of pedido_produtos) {
            const quantidadeValida = await knex('produtos').select('*').where('id', item.produto_id)
                .andWhere('quantidade_estoque', '>=', item.quantidade_produto).first();

            if (!quantidadeValida) {
                const respostaQuantidadeEstoque = await knex('produtos').select('quantidade_estoque').where('id', item.produto_id).first();

                return res.status(404).json({
                    mensagem: `Não há quantidade em estoque suficiente para o produto_id = ${item.produto_id}. ` +
                        `Só restam ${respostaQuantidadeEstoque.quantidade_estoque} unidades desse produto.`
                });
            }
        }

        let calculoValorTotal = 0;
        for (let item of pedido_produtos) {
            const valorProduto = await knex('produtos').select('valor').where('id', item.produto_id).first();
            calculoValorTotal += valorProduto.valor * item.quantidade_produto;
        }

        const cadastroPedido = await knex('pedidos').insert({
            cliente_id: cliente_id,
            observacao,
            valor_total: calculoValorTotal
        }).returning('id');

        for (let item of pedido_produtos) {
            const valorProduto = await knex('produtos').select('valor').where('id', item.produto_id).first();

            const cadastroPedidoProdutos = await knex('pedido_produtos').insert({
                pedido_id: cadastroPedido[0].id,
                produto_id: item.produto_id,
                quantidade_produto: item.quantidade_produto,
                valor_produto: valorProduto.valor
            });

            const retiradaEstoque = await knex('produtos').where('id', item.produto_id).decrement('quantidade_estoque', item.quantidade_produto);
        }

        const cliente = await knex('clientes').select('*').where('id', cliente_id).first();
        const html = await compiladorHtml('./src/modelos/mensagemEmail.html', {
            nomeCliente: `${cliente.nome}`
        });
        send(`${cliente.email}`, 'Cadastro de Pedido', html);

        const pedidoCriado = await knex('pedidos').select('id', 'cliente_id', 'observacao', 'valor_total').where('id', cadastroPedido[0].id).first();

        return res.status(201).json({
            id: pedidoCriado.id,
            cliente_id: pedidoCriado.cliente_id,
            observacao: pedidoCriado.observacao,
            pedido_produtos: pedido_produtos,
            valor_total: pedidoCriado.valor_total
        });
    }
    catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
};

const listarPedidos = async (req, res) => {
    const { cliente_id } = req.query;

    try {
        if (cliente_id) {
            const clienteExistente = await knex('clientes').select('id').where('id', cliente_id).first();
            if (!clienteExistente) {
                return res.status(404).json({
                    mensagem: 'Cliente não encontrado'
                });
            }
        }

        if (cliente_id) {
            const pedidosClienteIdTabela = await knex('pedidos').select('*').where('cliente_id', cliente_id).returning('*');

            const pedidoProdutosTabela = await knex('pedido_produtos').select('*').returning('*');

            const listagemPedidos = [];

            for (let pedido = 0; pedido < pedidosClienteIdTabela.length; pedido++) {

                const objetoPedido = {
                    pedido: pedidosClienteIdTabela[pedido],
                    pedido_produtos: []
                };

                for (let produto = 0; produto < pedidoProdutosTabela.length; produto++) {
                    if (pedidoProdutosTabela[produto].pedido_id == pedidosClienteIdTabela[pedido].id) {
                        objetoPedido.pedido_produtos.push(pedidoProdutosTabela[produto]);
                    }
                }

                listagemPedidos.push(objetoPedido)
            }

            return res.status(200).json(listagemPedidos);
        }


        const pedidosTabela = await knex('pedidos').select('*').returning('*');

        const pedidoProdutosTabela = await knex('pedido_produtos').select('*').returning('*');

        const listagemPedidos = [];

        for (let pedido = 0; pedido < pedidosTabela.length; pedido++) {
            const objetoPedido = {
                pedido: pedidosTabela[pedido],
                pedido_produtos: []
            };

            for (let produto = 0; produto < pedidoProdutosTabela.length; produto++) {
                if (pedidoProdutosTabela[produto].pedido_id == pedidosTabela[pedido].id) {
                    objetoPedido.pedido_produtos.push(pedidoProdutosTabela[produto]);
                }
            }

            listagemPedidos.push(objetoPedido)
        }

        return res.status(200).json(listagemPedidos);
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro interno do servidor',
        });
    }
};

module.exports = {
    cadastrarPedido,
    listarPedidos
};
