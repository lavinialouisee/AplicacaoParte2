const { Client } = require('pg');
const express = require('express');
const bodyParser = require('body-parser');

const client = new Client({
    host: 'database-1.cvj1tybqpmhp.us-east-1.rds.amazonaws.com',
    database: 'postgres',
    user: 'professor',
    password: 'professor',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect()
    .then(() => console.log('Conectado!'))
    .catch(err => console.error('Erro ao conectar:', err));

const app = express();
app.use(bodyParser.json());

//ROTAS CRUD PARA A TABELA USUÁRIO

// Inserir Usuário
app.post('/usuario', async (req, res) => {
    const { login, senha, nome, cod_funcionario } = req.body;
    const sql = 'INSERT INTO loja.Usuario (login_, senha, nome, cod_funcionario) VALUES ($1, $2, $3, $4)';
    const campos = [login, senha, nome, cod_funcionario];

    try {
        await client.query(sql, campos);
        res.status(201).send('Usuario inserido com sucesso!');
    } catch (err) {
        console.error('Erro ao inserir usuario:', err);
        res.status(500).send('Erro ao inserir usuario');
    }
});

// Consultar Usuários
app.get('/usuario', async (req, res) => {
    const sql = 'SELECT * FROM loja.Usuario';

    try {
        const result = await client.query(sql);
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao consultar usuarios:', err);
        res.status(500).send('Erro ao consultar usuarios');
    }
});

//Atualizar Usuário
app.put('/usuario/:cod_funcionario', async (req, res) => {
    const { cod_funcionario } = req.params;
    const { login, senha, nome } = req.body;
    const sql = 'UPDATE loja.Usuario SET login_=$1, senha=$2, nome=$3 WHERE cod_funcionario=$4';
    const campos = [login, senha, nome, cod_funcionario];

    try {
        await client.query(sql, campos);
        res.send('Usuario atualizado com sucesso!');
    } catch (err) {
        console.error('Erro ao atualizar usuario:', err);
        res.status(500).send('Erro ao atualizar usuario');
    }
});

//Deletar Usuário
app.delete('/usuario/:cod_funcionario', async (req, res) => {
    const { cod_funcionario } = req.params;
    const sql = 'DELETE FROM loja.Usuario WHERE cod_funcionario=$1';

    try {
        await client.query(sql, [cod_funcionario]);
        res.send('Usuario deletado com sucesso!');
    } catch (err) {
        console.error('Erro ao deletar usuario:', err);
        res.status(500).send('Erro ao deletar usuario');
    }
});

//ROTAS CRUD PARA A TABELA VERIFICA (GERADA DO RELACIONAMENTO ENTRE USUÁRIO E PRODUTO)

//Inserir Verificação
app.post('/verifica', async (req, res) => {
    const { data_verificacao, hora, codigo_produto, cod_funcionario } = req.body;
    const sql = 'INSERT INTO loja.Verifica (data_verificacao, hora, codigo_produto, cod_funcionario) VALUES ($1, $2, $3, $4) RETURNING id_verifica';
    const campos = [data_verificacao, hora, codigo_produto, cod_funcionario];

    try {
        const result = await client.query(sql, campos);
        res.status(201).json({ message: 'Verificação inserida com sucesso!', id_verifica: result.rows[0].id_verifica });
    } catch (err) {
        console.error('Erro ao inserir verificação:', err);
        res.status(500).send('Erro ao inserir verificação');
    }
});

//Consultar Verificações
app.get('/verifica', async (req, res) => {
    const sql = 'SELECT * FROM loja.Verifica';

    try {
        const result = await client.query(sql);
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao consultar verificações:', err);
        res.status(500).send('Erro ao consultar verificações');
    }
});

//Atualizar Verificação
app.put('/verifica/:id', async (req, res) => {
    const { id } = req.params;
    const { data_verificacao, hora, codigo_produto, cod_funcionario } = req.body;
    const sql = 'UPDATE loja.Verifica SET data_verificacao=$1, hora=$2, codigo_produto=$3, cod_funcionario=$4 WHERE id_verifica=$5';
    const campos = [data_verificacao, hora, codigo_produto, cod_funcionario, id];

    try {
        await client.query(sql, campos);
        res.send('Verificação atualizada com sucesso!');
    } catch (err) {
        console.error('Erro ao atualizar verificação:', err);
        res.status(500).send('Erro ao atualizar verificação');
    }
});

//Deletar Verificação
app.delete('/verifica/:id', async (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM loja.Verifica WHERE id_verifica=$1';

    try {
        await client.query(sql, [id]);
        res.send('Verificação deletada com sucesso!');
    } catch (err) {
        console.error('Erro ao deletar verificação:', err);
        res.status(500).send('Erro ao deletar verificação');
    }
});

//ROTAS CRUD PARA A TABELA PRODUTO

//Inserir Produto
app.post('/produto', async (req, res) => {
    const { codigo_produto, quantidade, preco, id_tamanho, id_cor, identificador, id_departamento, descricao, genero, categoria } = req.body;
    const sql = 'INSERT INTO loja.Produto (codigo_produto, quantidade, preco, id_tamanho, id_cor, identificador, id_departamento, descricao, genero, categoria) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
    const campos = [codigo_produto, quantidade, preco, id_tamanho, id_cor, identificador, id_departamento, descricao, genero, categoria];

    try {
        await client.query(sql, campos);
        res.status(201).send('Produto inserido com sucesso!');
    } catch (err) {
        console.error('Erro ao inserir produto:', err);
        res.status(500).send('Erro ao inserir produto');
    }
});

//Consultar Produtos
app.get('/produto', async (req, res) => {
    const sql = 'SELECT * FROM loja.Produto';

    try {
        const result = await client.query(sql);
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao consultar produtos:', err);
        res.status(500).send('Erro ao consultar produtos');
    }
});

//Atualizar Produto
app.put('/produto/:codigo_produto', async (req, res) => {
    const { codigo_produto } = req.params;
    const { quantidade, preco, descricao, genero, categoria } = req.body;
    const sql = 'UPDATE loja.Produto SET quantidade=$1, preco=$2, descricao=$3, genero=$4, categoria=$5 WHERE codigo_produto=$6';
    const campos = [quantidade, preco, descricao, genero, categoria, codigo_produto];

    try {
        await client.query(sql, campos);
        res.send('Produto atualizado com sucesso!');
    } catch (err) {
        console.error('Erro ao atualizar produto:', err);
        res.status(500).send('Erro ao atualizar produto');
    }
});

//Deletar Produto
app.delete('/produto/:codigo_produto', async (req, res) => {
    const { codigo_produto } = req.params;
    const sql = 'DELETE FROM loja.Produto WHERE codigo_produto=$1';

    try {
        await client.query(sql, [codigo_produto]);
        res.send('Produto deletado com sucesso!');
    } catch (err) {
        console.error('Erro ao deletar produto:', err);
        res.status(500).send('Erro ao deletar produto');
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
