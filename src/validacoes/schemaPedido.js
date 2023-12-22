const joi = require('joi');

const schemaPedido = joi.object({
    cliente_id: joi.number().strict(true).positive().integer().required().messages({
        'any.required': 'O campo cliente_id é obrigatório',
        'number.base': 'O campo cliente_id precisa ser um número',
        'number.positive': 'O campo cliente_id precisa ser um número positivo',
        'number.integer': 'O campo cliente_id precisa ser um número inteiro'
    }),
    observacao: joi.string().messages({
        'string.base': 'O campo observacao precisa ser um texto',
        'string.empty': 'Informe a observacao'
    }),
    pedido_produtos: joi.array().min(1).required().items(
        joi.object({
            produto_id: joi.number().strict(true).positive().integer().required().messages({
                'any.required': 'O campo produto_id é obrigatório',
                'number.base': 'O campo produto_id precisa ser um número',
                'number.positive': 'O campo produto_id precisa ser um número positivo',
                'number.integer': 'O campo produto_id precisa ser um número inteiro'
            }),
            quantidade_produto: joi.number().strict(true).positive().integer().required().messages({
                'any.required': 'O campo quantidade_produto é obrigatório',
                'number.base': 'O campo quantidade_produto precisa ser um número',
                'number.positive': 'O campo quantidade_produto precisa ser um número positivo',
                'number.integer': 'O campo quantidade_produto precisa ser um número inteiro'
            })
        })
    ).messages({
        'any.required': 'O campo pedido_produtos é obrigatório',
        'array.min': 'Informe pelo menos um pedido em pedido_produtos'
    })
});

module.exports = schemaPedido;