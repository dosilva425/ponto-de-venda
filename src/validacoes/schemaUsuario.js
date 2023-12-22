const joi = require('joi');

const schemaUsuario = joi.object({
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
    senha: joi.string().required().messages({
        'string.base': 'O campo senha precisa ser um texto',
        'any.required': 'O campo senha é obrigatório',
        'string.empty': 'O campo senha é obrigatório',
    })
});

module.exports = schemaUsuario;