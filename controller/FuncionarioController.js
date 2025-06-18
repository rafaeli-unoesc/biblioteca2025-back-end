import Funcionario from "../model/FuncionarioModel.js";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

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

async function definirsenha(req, res) {
    //Lendo os parametros
    const idfuncionario = req.params.id;
    const senha = req.body.senha;

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

    if (senha.length < 6 || senha.length > 20) {
        res.status(422).send('Tamanho da senha deve ser de 6 a 20 caracteres');
        return;
    }

    senha = await bcrypt.hash(senha, 10);

    //alterando o campo emprestado do livro para false
    const token = null;
    await Funcionario.update(
        {
            senha,
            token
        },
        { where: { idfuncionario } });

    res.status(200).send('Senha do funcionário alterada com sucesso.');
}

async function login(req, res) {
    //Lendo os parametros
    const email = req.body.email;
    const senha = req.body.senha;

    //verifica se existe o paramentro senha e email
    if (!email || !senha) {
        res.status(422).send('Os parâmetros email e senha são obrigatórios.');
        return;
    }

    //verifica se o funcionário existe
    const funcionarioBanco = await Funcionario.findOne({ where: { email } });
    if (!funcionarioBanco) {
        res.status(404).send('E-mail ou senha inválida.');
        return;
    }

    //verifica se o funcionário já foi demitido
    if (funcionarioBanco.demissao != null) {
        res.status(422).send('Funcionário já foi demitido.');
        return;
    }

    //Compara a senha recebida com a senha criptografada
    const senhavalida = await bcrypt.compare(senha, funcionarioBanco.senha);
    if (!senhavalida) {
        res.status(404).send('E-mail ou senha inválida.');
        return;
    }

    //Gerar um token
    const token = await uuidv4();

    //alterando o campo token do funcionário logado
    const idfuncionario = funcionarioBanco.idfuncionario;

    await Funcionario.update(
        { token },
        { where: { idfuncionario } });

    res.status(200).send(token);
}

async function validarToken(req, res, next) {
    //Lendo os parametros
    const token = req.headers.token;

    //verifica se existe o paramentro senha e email
    if (!token) {
        res.status(422).send('Token é obrigatório.');
        return;
    }

    //verifica se o funcionário existe
    const funcionarioBanco = await Funcionario.findOne({ where: { token } });
    if (!funcionarioBanco) {
        res.status(404).send('Token inválido.');
        return;
    }

    next();
}

export default { listar, selecionar, inserir, alterar, demitir, definirsenha, login, validarToken };