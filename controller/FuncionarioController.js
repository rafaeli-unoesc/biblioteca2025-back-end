import Funcionario from "../model/FuncionarioModel.js";

async function listar(req, res) {
    const respostaBanco = await Funcionario.findAll();
    res.json(respostaBanco);
}

async function selecionar(req, res) {
    const id = req.params.id;
    const respostaBanco = await Funcionario.findByPk(id);
    res.json(respostaBanco);
}

async function inserir(req, res) {
    const respostaBanco = await Funcionario.create(req.body);
    res.json(respostaBanco);
}

async function alterar(req, res) {
    const nomefuncionario = req.body.nomefuncionario;
    const cpf = req.body.cpf;
    const email = req.body.email;
    const telefone = req.body.telefone;
    const nascimento = req.body.nascimento;
    const salario = req.body.salario;
    const contratacao = req.body.contratacao;

    const idfuncionario = req.params.id;

    const respostaBanco = await Funcionario.update(
        { nomefuncionario, cpf, email, telefone, nascimento, salario, contratacao },
        { where: { idfuncionario } });
    res.json(respostaBanco);
}

async function demitir(req, res) {
    //Lendo os parametros
    const idfuncionario = req.params.id;
    const demissao = req.body.demissao;

    //verifica se existe o paramentro idfuncionario
    if (!idfuncionario) {
        res.status(422).send('O parâmetro idfuncionario é obrigatório.');
        return;
    }

    //verifica se o funcionário existe
    const funcionarioBanco = await Funcionario.findByPk(idfuncionario);
    if (!funcionarioBanco) {
        res.status(404).send('Funcionário não encontrado.');
        return;
    }

    //verifica se o funcionário já foi demitido
    if (funcionarioBanco.demissao != null) {
        res.status(422).send('Funcionário já foi demitido.');
        return;
    }

    //alterando o campo emprestado do livro para false
    const ativo = false;
    await Funcionario.update(
        { ativo, demissao },
        { where: { idfuncionario } });

    res.status(200).send('Funcionário demitido com sucesso.');
}

export default { listar, selecionar, inserir, alterar, demitir };