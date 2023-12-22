const joi = require('joi');

const schemaCliente = joi.object({
    nome: joi.string().required().messages({
        'string.base': 'O campo nome precisa ser um texto',
        'any.required': 'O campo nome é obrigatório',
        'string.empty': 'O campo nome é obrigatório'
    }),
    email: joi.string().email().required().messages({
        'string.base': 'O campo email precisa ser um texto',
        'any.required': 'O campo email é obrigatório',
        'string.empty': 'O campo email é obrigatório',
        'string.email': 'Informe um email válido'
    }),
    cpf: joi.string().required().messages({
        'string.base': 'O campo cpf precisa ser um texto',
        'any.required': 'O campo cpf é obrigatório',
        'string.empty': 'O campo cpf é obrigatório'
    }),
    cep: joi.string().messages({
        'string.base': 'O campo cep precisa ser um texto',
        'string.empty': 'Informe o cep'
    }),
    rua: joi.string().messages({
        'string.base': 'O campo rua precisa ser um texto',
        'string.empty': 'Informe a rua'
    }),
    numero: joi.string().messages({
        'string.base': 'O campo numero precisa ser um texto',
        'string.empty': 'Informe o número'
    }),
    bairro: joi.string().messages({
        'string.base': 'O campo bairro precisa ser um texto',
        'string.empty': 'Informe o bairro'
    }),
    cidade: joi.string().messages({
        'string.base': 'O campo cidade precisa ser um texto',
        'string.empty': 'Informe a cidade'
    }),
    estado: joi.string().messages({
        'string.base': 'O campo estado precisa ser um texto',
        'string.empty': 'Informe o estado'
    })
});

module.exports = schemaCliente;