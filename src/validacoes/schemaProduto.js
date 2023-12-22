const joi = require('joi');

const schemaProduto = joi.object({
    descricao: joi.string().required().messages({
        'string.base': 'O campo descrição precisa ser um texto',
        'any.required': 'O campo descricao é obrigatório',
        'string.empty': 'O campo descricao é obrigatório'
    }),
    quantidade_estoque: joi.number().strict(true).positive().allow(0).integer().required().messages({
        'any.required': 'O campo quantidade_estoque é obrigatório',
        'number.base': 'O campo quantidade_estoque precisa ser um número',
        'number.positive': 'O campo quantidade_estoque precisa ser um número positivo',
        'number.integer': 'O campo quantidade_estoque precisa ser um número inteiro'
    }),
    valor: joi.number().strict(true).positive().integer().required().messages({
        'any.required': 'O campo valor é obrigatório',
        'number.base': 'O campo valor precisa ser um número',
        'number.positive': 'O campo valor precisa ser um número positivo',
        'number.integer': 'O campo valor precisa ser um número inteiro'
    }),
    categoria_id: joi.number().strict(true).positive().integer().required().messages({
        'any.required': 'O campo categoria_id é obrigatório',
        'number.base': 'O campo categoria_id precisa ser um número',
        'number.positive': 'O campo categoria_id precisa ser um número positivo',
        'number.integer': 'O campo categoria_id precisa ser um número inteiro'
    }),
    produto_imagem: joi.boolean().optional().messages({
        'boolean.base': 'Anexe alguma imagem'
    })

});

module.exports = schemaProduto;
