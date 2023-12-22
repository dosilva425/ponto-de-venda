const validadorCorpoRequisicao = joiSchema => async (req, res, next) => {
    try {
        if (req.body.quantidade_estoque !== undefined) {
            req.body.quantidade_estoque = Number(req.body.quantidade_estoque);
        }
        if (req.body.valor !== undefined) {
            req.body.valor = Number(req.body.valor);
        }
        if (req.body.categoria_id !== undefined) {
            req.body.categoria_id = Number(req.body.categoria_id);
        }
        await joiSchema.validateAsync(req.body);
        next();
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

module.exports = validadorCorpoRequisicao;
