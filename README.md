# Ponto de Venda (API REST)

Este é um projeto piloto de criação da API REST de um sistema de ponto de venda (frente de caixa). Ele foi concebido a partir de um trabalho em grupo para o desafio final do curso de desenvolvimento de software back-end da Cubos Academy (Ifood).

Integrantes do grupo: Débora de Oliveira Silva, Renato Pedrozo ([@EurusMaccher](https://github.com/EurusMaccher)), Renata Corrêa ([@Quelzinha89](https://github.com/Quelzinha89)) e Willian Dias ([@WillianDias-BDev](https://github.com/WillianDias-BDev)).

<img src="https://github.com/dosilva425/ponto-de-venda/blob/main/prints/cadastro%20produto.png">
<img src="https://github.com/dosilva425/ponto-de-venda/blob/main/prints/listagem%20pedidos.png">

# Funcionalidades

- Listagem de categorias dos produtos do ponto de venda
- Cadastro de usuário funcionário do ponto de venda (com criptografia de senha)
- Login de usuário funcionário (com geração de token de autenticação)
- Detalhamento do usuário funcionário logado
- Edição de perfil do usuário funcionário logado
- Cadastro de produto (com upload de imagem)
- Edição de produto 
- Listagem de produtos (com filtragem por categoria de produtos)
- Detalhamento de produto 
- Exclusão de produto
- Cadastro de cliente do ponto de venda
- Edição de cliente
- Listagem de clientes
- Detalhamento de cliente
- Cadastro de pedido (com envio de e-mail de confirmação)
- Listagem de pedidos (com filtragem por cliente)

# Tecnologias

- JavaScript
- NodeJS
- Banco de Dados Relacional
- PostgreSQL
- Pg
- Express
- Bcrypt
- Jsonwebtoken
- Knex
- Joi
- Nodemailer
- Handlebars
- Multer
- Aws-sdk 

# Requisitos

- node instalado na sua máquina
- npm instalado na sua máquina

## Preparação

```

git clone git@github.com:dosilva425/ponto-de-venda.git

cd ponto-de-venda

npm install

```

#### Execução

```

npm run dev

```

# Rotas

- [GET]/categoria
- [POST]/usuario
- [POST]/login
- [GET]/usuario
- [PUT]/usuario
- [POST]/produto
- [PUT]/produto/:id
- [GET]/produto
    - [GET]/produto?categoria_id=id de categoria (filtragem de produtos por categoria)
- [GET]/produto/:id
- [DELETE]/produto/:id
- [POST]/cliente
- [PUT]/cliente/:id
- [GET]/cliente
- [GET]/cliente/:id
- [POST]/pedido
- [GET]/pedido
    - [GET]/pedido?cliente_id=id de cliente (filtragem de pedidos por cliente)

# Extras

### Banco de Dados

-   usuarios
    -   id
    -   nome
    -   email (campo único entre usuários)
    -   senha
-   categorias
    -   id
    -   descricao
-   produtos
    -   id
    -   descricao
    -   quantidade_estoque
    -   valor (centavos)
    -   categoria_id
-   clientes
    -   id
    -   nome
    -   email (campo único entre clientes)
    -   cpf (campo único entre clientes) 
    -   cep 
    -   rua
    -   numero
    -   bairro
    -   cidade
    -   estado
-   pedidos
    -   id
    -   cliente_id
    -   observacao
    -   valor_total (centavos)
-   pedido_produtos
    -   id
    -   pedido_id
    -   produto_id
    -   quantidade_produto
    -   valor_produto (centavos)
    -   produto_imagem (caminho da imagem)

# Exemplos de Requisição e Resposta

## Rota Listagem de Categorias de Produtos: `GET` `/categoria`
- Esta rota será utilizada quando o usuário quiser listar todas as categorias cadastradas.
- Envio da requisição: acesso à rota.
- Retorno da requisição: categorias de produtos cadastradas.

#### **Exemplo de requisição**

```javascript
// GET /categoria
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200
[
  {
    "id": 1,
    "descricao": "Informática",
  },
  {
    "id": 2,
    "descricao": "Celulares",
  },
...
]
```

## Rota Cadastro de Usuário Funcionário: `POST` `/usuario`
- Esta rota será utilizada para cadastrar um novo usuário funcionário no sistema.
- Envio da requisição:
	- Body (corpo): é obrigatório informar nome, email (único entre usuários) e senha.
- Retorno da requisição: id, nome e email do usuário funcionário cadastrado.

#### **Exemplo de requisição**

```javascript
// POST /usuario
{
	"nome": "testeusuario",
	"email": "testeusuario@email.com",
	"senha": "teste123"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 201
{
    "id": 1,
    "nome": "testeusuario",
    "email": "testeusuario@email.com"
}
```

```javascript
// HTTP Status 400 
{
    "mensagem": "Já existe usuário cadastrado com o e-mail informado"
}
```

## Rota Login de Usuário Funcionário: `POST` `/login`
- Esta rota será utilizada para o usuário funcionário cadastrado realizar o login no sistema.
- Envio da requisição:
	- Body (corpo): é obrigatório informar email e senha.
- Retorno da requisição: id, nome e email do usuário funcionário que fez o login, além do seu token de autenticação gerado.

#### **Exemplo de requisição**

```javascript
// POST /login
{
    "email": "testeusuario@email.com",
    "senha": "teste123"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200
{
    "usuario": {
        "id": 1,
        "nome": "testeusuario",
        "email": "testeusuario@email.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTcwMzI3NjkyMywiZXhwIjoxNzAzMzA1NzIzfQ.WlRyFl8GtPZxpnYlSQQvIxbsGbN_VZ0ZMxABrbaEyQo"
}
```

```javascript
// HTTP Status 400
{
    "mensagem": "Email e senha não conferem"
}
```

---

## **ATENÇÃO**: Todas as rotas a seguir exigem token de autenticação no header (cabeçalho) da requisição no formato Bearer Token, que pode ser fornecido pelo usuário funcionário logado no sistema.

---

## Rota Detalhamento de Perfil Usuário Funcionário Logado: `GET` `/usuario`
- Esta rota será utilizada quando o usuário funcionário logado quiser obter os dados do seu próprio perfil.
- Envio da requisição:
	- Header (cabeçalho): é obrigatório enviar o token de autenticação (no formato Bearer Token).
- Retorno da requisição: id, nome e email do usuário funcionário cadastrado logado.

#### **Exemplo de requisição**

```javascript
// GET /usuario
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200
{
    "id": 1,
    "nome": "testeusuario",
    "email": "testeusuario@email.com"
}
```

```javascript
// HTTP Status 401 
{
    "mensagem": "Não autorizado"
}
```

## Rota Edição de Perfil do Usuário Funcionário Logado: `PUT` `/usuario`
- Esta rota será utilizada para editar o perfil de um usuário funcionário cadastrado, logado no sistema.
- Envio da requisição:
	- Body (corpo): é obrigatório informar nome, email (único entre usuários) e senha.
   	- Header (cabeçalho): é obrigatório enviar o token de autenticação (no formato Bearer Token).
- Retorno da requisição: id, nome e email do usuário funcionário editado.

#### **Exemplo de requisição**

```javascript
// PUT /usuario
{
    "nome": "testeusuario2",
    "email": "testeusuario2@email.com",
    "senha": "teste12345"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200
{
    "id": 1,
    "nome": "testeusuario2",
    "email": "testeusuario2@email.com"
}
```

```javascript
// HTTP Status 400
{
    "mensagem": "Este email já está cadastrado"
}
```

## Rota Cadastro de Produto: `POST` `/produto`
- Esta rota será utilizada para o usuário funcionário cadastrar um novo produto no sistema.
- Envio da requisição:
	- Body (corpo), enviado em formato multipart-form: é obrigatório informar descricao, quantidade_estoque, valor, categoria_id. Opcional: produto_imagem.
- Retorno da requisição: descricao, quantidade_estoque, valor, categoria_id, produto_imagem (url da imagem ou null).

#### **Exemplo de requisição**

```javascript
// POST /produto
{
	"id": 104,
	"descricao": "Óculos",
	"quantidade_estoque": 10,
	"valor": 200000,
	"categoria_id": 7
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 201
{
	"id": 104,
	"descricao": "Óculos",
	"quantidade_estoque": 10,
	"valor": 200000,
	"categoria_id": 7,
	"produto_imagem": null
}
```

```javascript
// HTTP Status 400 
{
    "mensagem": "O campo descricao é obrigatório"
}
```

## Rota Edição de Produto: `PUT` `/produto/:id`
- Esta rota será utilizada para o usuário funcionário editar um produto cadastrado no sistema.
- Envio da requisição:
	- Body (corpo), enviado em formato multipart-form: é obrigatório informar descricao, quantidade_estoque, valor, categoria_id. Opcional: produto_imagem.
    - - Parâmetro de Url: é obrigatório enviar o id do produto.
- Retorno da requisição: descricao, quantidade_estoque, valor, categoria_id, produto_imagem (url da imagem ou null).

#### **Exemplo de requisição**

```javascript
// POST /produto/104
{
	"id": 104,
	"descricao": "Óculos",
	"quantidade_estoque": 10,
	"valor": 200000,
	"categoria_id": 7,
	"produto_imagem": IMG_2043403332.jpg
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200
{
	"id": 104,
	"descricao": "Óculos",
	"quantidade_estoque": 10,
	"valor": 200000,
	"categoria_id": 7,
	"produto_imagem": "https://deboraverzul.s3.us-east-005.backblazeb2.com/img/%C3%93culos.jpg"
}
```

```javascript
// HTTP Status 400 
{
    "mensagem": "O campo descricao é obrigatório"
}
```

## Rota Listagem de Produtos: `GET` `/produto` ou `GET` `/produto?categoria_id=id de categoria` 
- Esta rota será utilizada quando o usuário funcionário logado quiser listar todos os produtos cadastrados, ou listar os produtos por categoria.
- Envio da requisição:
	- Header (cabeçalho): é obrigatório enviar o token de autenticação (no formato Bearer Token).
   - *Parâmetro de Consulta (opcional)*: Caso o usuário deseje filtrar os produtos por categoria, basta informar o id da categoria como o valor de categoria_id.
- Retorno da requisição: produtos cadastrados ou filtrados por categoria.

#### **Exemplo de requisição**

```javascript
// GET /produto
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 
[
	{
		"id": 104,
		"descricao": "Óculos",
		"quantidade_estoque": 10,
		"valor": 200000,
		"categoria_id": 7,
		"produto_imagem": "https://deboraverzul.s3.us-east-005.backblazeb2.com/img/%C3%93culos.jpg"
	},
	{
		"id": 107,
		"descricao": "Motorola moto g9 plus",
		"quantidade_estoque": 100,
		"valor": 15000,
		"categoria_id": 2,
		"produto_imagem": "https://deboraverzul.s3.us-east-005.backblazeb2.com/img/Motorola%20moto%20g9%20plus.jpeg"
	},
	{
		"id": 108,
		"descricao": "Motorola moto g12 plus",
		"quantidade_estoque": 100,
		"valor": 20000,
		"categoria_id": 2,
		"produto_imagem": null
	},
...
]
```

```javascript
// HTTP Status 200 
[]
```

#### Com filtragem de categoria_id

#### **Exemplo de requisição**

```javascript
// GET /produto?categoria_id=7
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 
[
	{
		"id": 87,
		"descricao": "Asfalto",
		"quantidade_estoque": 0,
		"valor": 200000,
		"categoria_id": 7,
		"produto_imagem": "https://deboraverzul.s3.us-east-005.backblazeb2.com/img/Asfalto.jpg"
	},
	{
		"id": 85,
		"descricao": "Aviao",
		"quantidade_estoque": 0,
		"valor": 200000,
		"categoria_id": 7,
		"produto_imagem": "https://deboraverzul.s3.us-east-005.backblazeb2.com/img/Aviao.jpg"
	},
	{
		"id": 48,
		"descricao": "Relógio",
		"quantidade_estoque": 0,
		"valor": 200000,
		"categoria_id": 7,
		"produto_imagem": "https://deboraverzul.s3.us-east-005.backblazeb2.com/img/Rel%C3%B3gio.jpg"
	}
]
```

```javascript
// HTTP Status 200 
[]
```

## Rota Detalhamento de Produto: `GET` `/produto/:id`
- Esta rota será utilizada quando o usuário funcionário logado quiser obter os dados de um produto cadastrado.
- Envio da requisição:
	- Header (cabeçalho): é obrigatório enviar o token de autenticação (no formato Bearer Token).
    - Parâmetro de Url: é obrigatório enviar o id do produto.
- Retorno da requisição: descricao, quantidade_estoque, valor, categoria_id, produto_imagem (url da imagem ou null).

#### **Exemplo de requisição**

```javascript
// GET /produto/97
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200
{
	"id": 97,
	"descricao": "Motorola moto g9 plus",
	"quantidade_estoque": 100,
	"valor": 15000,
	"categoria_id": 2,
	"produto_imagem": "https://deboraverzul.s3.us-east-005.backblazeb2.com/img/Motorola%20moto%20g9%20plus.jpeg"
}
```

```javascript
// HTTP Status 401 
{
    "mensagem": "Não autorizado"
}
```

## Rota Exclusão de Produto: `DELETE` `/produto/:id`
- Esta rota será utilizada quando o usuario funcionário logado quiser excluir um dos produtos cadastrados. A exclusão só será realizada se o produto não estiver vinculado a algum pedido. 
- Envio da requisição:
	- Header (cabeçalho): é obrigatório enviar o token de autenticação (no formato Bearer Token).
	- Parâmetro de Url: é obrigatório enviar o id do produto.
- Retorno da requisição: Status 200 - produto excluído com sucesso.


```javascript
// DELETE /produto/95
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200
{
	"mensagem": "Produto excluído com sucesso"
}
```

```javascript
// HTTP Status 404
{
    "mensagem": "Produto não encontrado."
}
```

## Rota Cadastro de Cliente: `POST` `/cliente`
- Esta rota será utilizada para o usuário funcionário cadastrar um novo cliente do ponto de venda no sistema.
- Envio da requisição:
	- Body (corpo): é obrigatório informar nome, email (único entre clientes) e cpf (único entre clientes). Opcional: dados de endereço como cep, rua, numero, bairro, cidade, estado.
- Retorno da requisição: nome, email, cpf, cep (enviado ou null), rua (enviado ou null), numero(enviado ou null), bairro (enviado ou null), cidade (enviado ou null), estado (enviado ou null).

#### **Exemplo de requisição**

```javascript
// POST /cliente
{
	"nome": "testecliente",
	"email": "testecliente@email.com",
	"cpf": "25094087652",
	"cep": "35460004",
	"rua": "Dos Anjos",
	"numero": "669"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 201
{
    "id": 21
	"nome": "testecliente",
	"email": "testecliente@email.com",
	"cpf": "25094087652",
	"cep": "35460004",
	"rua": "Dos Anjos",
	"numero": "669",
    "bairro": null,
	"cidade": null,
	"estado": null
}
```

```javascript
// HTTP Status 400 
{
    "mensagem": "O campo cpf é obrigatório"
}
```

## Rota Edição de Perfil de Cliente: `PUT` `/cliente/:id`
- Esta rota será utilizada para o usuário funcionário editar o perfil de um cliente do ponto de venda cadastrado no sistema.
- Envio da requisição:
	- Body (corpo): é obrigatório informar nome, email (único entre clientes) e cpf (único entre clientes). Opcional: dados de endereço como cep, rua, numero, bairro, cidade, estado.
    - Parâmetro de Url: é obrigatório enviar o id do cliente.
- Retorno da requisição: nome, email, cpf, cep (enviado ou null), rua (enviado ou null), numero(enviado ou null), bairro (enviado ou null), cidade (enviado ou null), estado (enviado ou null).

#### **Exemplo de requisição**

```javascript
// POST /cliente/21
{
	"nome": "testecliente",
	"email": "testecliente@email.com",
	"cpf": "25094087652",
	"cep": "35460004",
	"rua": "Dos Anjos",
	"numero": "669",
    "bairro": "Céu",
    "cidade": "Paraíso"
    "estado": "MG"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 201
{
    "id": 21
	"nome": "testecliente",
	"email": "testecliente@email.com",
	"cpf": "25094087652",
	"cep": "35460004",
	"rua": "Dos Anjos",
	"numero": "669",
    "bairro": "Céu",
    "cidade": "Paraíso"
    "estado": "MG"
}
```

```javascript
// HTTP Status 404
{
    "mensagem": "Cliente não encontrado"
}
```

## Rota Listagem de Clientes: `GET` `/cliente`
- Esta rota será utilizada quando o usuário funcionário logado quiser listar todos os  clientes cadastrados no sistema de ponto de venda.
- Envio da requisição:
	- Header (cabeçalho): é obrigatório enviar o token de autenticação (no formato Bearer Token).
- Retorno da requisição: clientes cadastrados no sistema.

#### **Exemplo de requisição**

```javascript
// GET /cliente
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 
[
	{
		"id": 9,
		"nome": "Jose",
		"email": "virginia.pfannerstill51@gmail.com",
		"cpf": "75482325431",
		"cep": "17560320",
		"rua": "Avenida Paulista",
		"numero": "1830",
		"bairro": "Jardim Aeroporto",
		"cidade": "São Paulo",
		"estado": "SP"
	},
	{
		"id": 10,
		"nome": "Jose",
		"email": "freeman74@yahoo.com",
		"cpf": "92731535342",
		"cep": "17560320",
		"rua": "Avenida Paulista",
		"numero": "1830",
		"bairro": "Jardim Aeroporto",
		"cidade": "São Paulo",
		"estado": "SP"
	},
...
]
```

```javascript
// HTTP Status 200 
[]
```

## Rota Detalhamento de Cliente: `GET` `/cliente/:id`
- Esta rota será utilizada quando o usuário funcionário logado quiser obter os dados de um cliente cadastrado.
- Envio da requisição:
	- Header (cabeçalho): é obrigatório enviar o token de autenticação (no formato Bearer Token).
    - Parâmetro de Url: é obrigatório enviar o id do cliente.
- Retorno da requisição: nome, email, cpf, cep, rua, numero, bairro, cidade, estado.

#### **Exemplo de requisição**

```javascript
// GET /cliente/29
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200
{
	"id": 29,
	"nome": "Jose",
	"email": "kristian74@gmail.com",
	"cpf": "76643445736",
	"cep": "17560320",
	"rua": "Avenida Paulista",
	"numero": "1830",
	"bairro": "Jardim Aeroporto",
	"cidade": "São Paulo",
	"estado": "SP"
}
```

```javascript
// HTTP Status 401 
{
    "mensagem": "Não autorizado"
}
```

## Rota Cadastro de Pedido: `POST` `/pedido`
- Esta rota será utilizada para o usuário funcionário cadastrar um novo pedido feito por um cliente no sistema.
- Envio da requisição:
	- Body (corpo): é obrigatório informar cliente_id e pedido_produtos (com produto_id e quantidade_produto). Opcional: observacao.
- Retorno da requisição: cliente_id e pedido_produtos (com produto_id e quantidade_produto), observacao (enviada ou null).

#### **Exemplo de requisição**

```javascript
// POST /pedido
{ "cliente_id": 26,
 "observacao": "Entregue na parte da manhã",
 "pedido_produtos": [
	 {
		 "produto_id": 101,
		 "quantidade_produto": 5
	 },
	 {
		 "produto_id": 101,
		 "quantidade_produto": 5
	 },
	 {
		 "produto_id": 102,
		 "quantidade_produto": 10
	 }
 ]
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 201
{
	"id": 45,
	"cliente_id": 26,
	"observacao": "Entregue na parte da manhã",
	"pedido_produtos": [
		{
			"produto_id": 101,
			"quantidade_produto": 10
		},
		{
			"produto_id": 102,
			"quantidade_produto": 10
		}
	],
	"valor_total": 300000
}
```

```javascript
// HTTP Status 400 
{
	"mensagem": "Não há quantidade em estoque suficiente para o produto_id = 101. Só restam 90 unidades desse produto."
}
```

## Rota Listagem de Pedidos: `GET` `/pedido` ou `GET` `/pedido?cliente_id=id de cliente` 
- Esta rota será utilizada quando o usuário funcionário logado quiser listar todos os pedidos cadastrados, ou listar os pedidos por cliente.
- Envio da requisição:
	- Header (cabeçalho): é obrigatório enviar o token de autenticação (no formato Bearer Token).
   - *Parâmetro de Consulta (opcional)*: Caso o usuário deseje filtrar os pedidos por cliente, basta informar o id do cliente como o valor de cliente_id.
- Retorno da requisição: pedidos cadastrados ou filtrados por cliente.

#### **Exemplo de requisição**

```javascript
// GET /pedido
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 
[
	{
		"pedido": {
			"id": 42,
			"cliente_id": 25,
			"observacao": null,
			"valor_total": 15000
		},
		"pedido_produtos": [
			{
				"id": 46,
				"pedido_id": 42,
				"produto_id": 97,
				"quantidade_produto": 1,
				"valor_produto": 15000
			}
		]
	},
	{
		"pedido": {
			"id": 43,
			"cliente_id": 27,
			"observacao": null,
			"valor_total": 15000
		},
		"pedido_produtos": [
			{
				"id": 47,
				"pedido_id": 43,
				"produto_id": 101,
				"quantidade_produto": 1,
				"valor_produto": 15000
			}
		]
	},
	{
		"pedido": {
			"id": 44,
			"cliente_id": 29,
			"observacao": null,
			"valor_total": 15000
		},
		"pedido_produtos": [
			{
				"id": 48,
				"pedido_id": 44,
				"produto_id": 106,
				"quantidade_produto": 1,
				"valor_produto": 15000
			}
		]
	},
	{
		"pedido": {
			"id": 45,
			"cliente_id": 26,
			"observacao": "Entregue na parte da manhã",
			"valor_total": 300000
		},
		"pedido_produtos": [
			{
				"id": 49,
				"pedido_id": 45,
				"produto_id": 101,
				"quantidade_produto": 10,
				"valor_produto": 15000
			},
			{
				"id": 50,
				"pedido_id": 45,
				"produto_id": 102,
				"quantidade_produto": 10,
				"valor_produto": 15000
			}
		]
	}
]
```

```javascript
// HTTP Status 200 
[]
```

#### Com filtragem de categoria_id

#### **Exemplo de requisição**

```javascript
// GET /cliente?cliente_id=11
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 
[
	{
		"pedido": {
			"id": 34,
			"cliente_id": 11,
			"observacao": null,
			"valor_total": 2099000
		},
		"pedido_produtos": [
			{
				"id": 34,
				"pedido_id": 34,
				"produto_id": 87,
				"quantidade_produto": 5,
				"valor_produto": 200000
			},
			{
				"id": 35,
				"pedido_id": 34,
				"produto_id": 85,
				"quantidade_produto": 5,
				"valor_produto": 200000
			},
			{
				"id": 36,
				"pedido_id": 34,
				"produto_id": 47,
				"quantidade_produto": 10,
				"valor_produto": 9900
			}
		]
	},
	{
		"pedido": {
			"id": 35,
			"cliente_id": 11,
			"observacao": null,
			"valor_total": 49500
		},
		"pedido_produtos": [
			{
				"id": 37,
				"pedido_id": 35,
				"produto_id": 75,
				"quantidade_produto": 5,
				"valor_produto": 9900
			}
		]
	}
]
```

```javascript
// HTTP Status 200 
[]
```
