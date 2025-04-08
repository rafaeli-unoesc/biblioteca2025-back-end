import express from "express";
import banco from "./banco.js";
import editora from "./controller/EditoraController.js";

try {
    await banco.authenticate();
    console.log('Conexão com o banco de dados realizada com sucesso.');
} catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
}

const app = express();
app.use(express.json());

app.get('/teste', (req, res) => {
    res.send('Teste ok.');
});

//rotas crud da tabela editora
app.get('/editora', editora.listar);
app.get('/editora/:id', editora.selecionar);
app.post('/editora', editora.inserir);
app.put('/editora/:id', editora.alterar);
app.delete('/editora/:id', editora.excluir);


app.listen(3000, () => { console.log(`Servidor rodando.`) });