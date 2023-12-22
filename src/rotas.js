const express = require('express');
const multer = require('multer')
const { listarCategorias } = require('./controladores/categorias');
const { cadastrarUsuario, loginUsuario, detalharUsuario, editarUsuario } = require('./controladores/usuarios');
const { cadastrarProduto, editarProduto, listarProdutos, detalharProduto, excluirProduto } = require('./controladores/produtos');
const { cadastrarCliente, editarCliente, listarClientes, detalharCliente } = require('./controladores/clientes');
const { cadastrarPedido, listarPedidos } = require('./controladores/pedidos');
const validadorCorpoRequisicao = require('./intermediarios/validadorCorpoRequisicao');
const schemaUsuario = require('./validacoes/schemaUsuario');
const schemaLogin = require('./validacoes/schemaLogin');
const schemaProduto = require('./validacoes/schemaProduto');
const schemaCliente = require('./validacoes/schemaCliente');
const schemaPedido = require('./validacoes/schemaPedido');
const filtroLogin = require('./intermediarios/filtroLogin');

const rota = express();
const upload = multer()

rota.get('/categoria', listarCategorias);
rota.post('/usuario', validadorCorpoRequisicao(schemaUsuario), cadastrarUsuario);
rota.post('/login', validadorCorpoRequisicao(schemaLogin), loginUsuario);

rota.use(filtroLogin);

rota.get('/usuario', detalharUsuario);
rota.put('/usuario', validadorCorpoRequisicao(schemaUsuario), editarUsuario);
rota.post('/produto', upload.single('produto_imagem'), validadorCorpoRequisicao(schemaProduto), cadastrarProduto);
rota.put('/produto/:id', upload.single('produto_imagem'), validadorCorpoRequisicao(schemaProduto), editarProduto);
rota.get('/produto', listarProdutos);
rota.get('/produto/:id', detalharProduto);
rota.delete('/produto/:id', excluirProduto);
rota.post('/cliente', validadorCorpoRequisicao(schemaCliente), cadastrarCliente);
rota.put('/cliente/:id', validadorCorpoRequisicao(schemaCliente), editarCliente);
rota.get('/cliente', listarClientes);
rota.get('/cliente/:id', detalharCliente);
rota.post('/pedido', validadorCorpoRequisicao(schemaPedido), cadastrarPedido);
rota.get('/pedido', listarPedidos);

module.exports = rota;
