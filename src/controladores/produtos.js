const knex = require('../conexao')
const { arquivoUpload, excluirImagem, obterUrlImagem } = require('../servicos/armazenamento')

const cadastrarProduto = async (req, res) => {
    const { file } = req;
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

    try {
        let arquivo
        let imagemUrl
        let imagemCaminho

        const categoriaValida = await knex('categorias').select('*').where('id', categoria_id).first();

        if (!categoriaValida) {
            return res.status(400).json({
                mensagem: 'A categoria precisa ser válida'
            });
        }

        if (file) {
            arquivo = await arquivoUpload(file, descricao)
            imagemUrl = arquivo.Location
            imagemCaminho = arquivo.Key
        }

        const criacaoProduto = await knex('produtos').insert({
            descricao: descricao,
            quantidade_estoque: quantidade_estoque,
            valor: valor,
            categoria_id: categoria_id,
            produto_imagem: imagemCaminho
        }).returning('id', 'descricao', 'quantidade_estoque', 'valor', 'categoria_id', 'produto_imagem');

        const { id } = criacaoProduto[0];

        const produtoFinal = {
            id: id,
            descricao: descricao,
            quantidade_estoque: quantidade_estoque,
            valor: valor,
            categoria_id: categoria_id,
            produto_imagem: imagemUrl || null
        }

        return res.status(200).json(produtoFinal);
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro interno do servidor'
        });
    }
};


const editarProduto = async (req, res) => {
    const { file } = req;
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
    const produto_id = req.params.id;

    try {
        let arquivo
        let imagemUrl
        let imagemCaminho

        const categoriaValida = await knex('categorias').select('*').where('id', categoria_id).first();

        if (!categoriaValida) {
            return res.status(400).json({
                mensagem: 'A categoria precisa ser válida'
            });
        }

        const idValido = await knex('produtos').select('*').where('id', produto_id).first();

        if (!idValido) {
            return res.status(404).json({
                mensagem: 'Produto não encontrado'
            });
        }

        const imagemAntiga = await knex('produtos').select('produto_imagem').where('id', produto_id).first()
        if (imagemAntiga.produto_imagem !== null) {
            const exclusaoImagem = await excluirImagem(imagemAntiga.produto_imagem)
        }

        if (file) {
            arquivo = await arquivoUpload(file, descricao)
            imagemUrl = arquivo.Location
            imagemCaminho = arquivo.Key
        }

        const edicaoProduto = await knex('produtos').update({
            descricao: descricao,
            quantidade_estoque: quantidade_estoque,
            valor: valor,
            categoria_id: categoria_id,
            produto_imagem: imagemCaminho || null
        }).where('id', produto_id).returning('id', 'descricao', 'quantidade_estoque', 'valor', 'categoria_id', 'produto_imagem');

        const { id } = edicaoProduto[0];

        const produtoAtualizado = {
            id: id,
            descricao: descricao,
            quantidade_estoque: quantidade_estoque,
            valor: valor,
            categoria_id: categoria_id,
            produto_imagem: imagemUrl || null
        }

        return res.status(200).json(produtoAtualizado);
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro interno do servidor'
        });
    }
};

const listarProdutos = async (req, res) => {
    const { categoria_id } = req.query;

    try {
        if (!categoria_id) {
            const listaDeTodosOsProdutos = await knex('produtos').select('*');
            for (const produto of listaDeTodosOsProdutos) {
                if (produto.produto_imagem) {
                    const imagemUrl = await obterUrlImagem(produto.produto_imagem)
                    produto.produto_imagem = imagemUrl.split('?')[0];
                }
            }
            return res.status(200).json(listaDeTodosOsProdutos);
        }

        const categoriaValida = await knex('categorias').select('*').where('id', categoria_id).first();
        if (!categoriaValida) {
            return res.status(404).json({
                mensagem: 'Categoria não encontrada'
            });
        }

        const obterProdutos = await knex('produtos').select('*').where('categoria_id', categoria_id);
        for (const produto of obterProdutos) {
            if (produto.produto_imagem) {
                const imagemUrl = await obterUrlImagem(produto.produto_imagem)
                produto.produto_imagem = imagemUrl.split('?')[0];

            }
        }

        return res.status(200).json(obterProdutos);
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro interno do servidor'
        });
    }
};

const detalharProduto = async (req, res) => {
    const produto_id = req.params.id;

    try {
        const produto = await knex('produtos').select('*').where('id', produto_id).first();

        if (!produto) {
            return res.status(404).json({
                mensagem: 'Produto não encontrado'
            });
        }

        if (produto.produto_imagem) {
            const imagemUrl = await obterUrlImagem(produto.produto_imagem)
            produto.produto_imagem = imagemUrl.split('?')[0];
        }

        return res.status(200).json(produto);
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro interno do servidor'
        });
    }
};

const excluirProduto = async (req, res) => {
    const id = req.params.id;

    try {
        const produtoVinculadoPedido = await knex('pedido_produtos').select('id').where('produto_id', id).first();
        if (produtoVinculadoPedido) {
            return res.status(400).json({
                mensagem: 'Não é possível excluir o produto, pois ele está vinculado a um pedido'
            });
        }

        const produtoExistente = await knex('produtos').select('*').where('id', id).first();
        if (!produtoExistente) {
            return res.status(404).json({
                mensagem: 'Produto não encontrado'
            });
        }

        await knex('produtos').where('id', id).delete();

        if (produtoExistente.produto_imagem) {
            await excluirImagem(produtoExistente.produto_imagem)
        }

        return res.status(200).json({
            mensagem: 'Produto excluído com sucesso'
        });
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro interno do servidor'
        });
    }
};

module.exports = {
    cadastrarProduto,
    editarProduto,
    listarProdutos,
    detalharProduto,
    excluirProduto
};
