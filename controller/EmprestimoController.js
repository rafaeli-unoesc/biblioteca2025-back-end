import Emprestimo from "../model/EmprestimoModel.js";
import Livro from "../model/LivroModel.js";
import Usuario from "../model/UsuarioModel.js";
import moment from 'moment';

async function listar(req, res) {
    const respostaBanco = await Emprestimo.findAll();
    res.json(respostaBanco);
}

async function listarPendentes(req, res) {
    const respostaBanco = await Emprestimo.findAll({ where: { devolucao: null } });
    res.json(respostaBanco);
}

async function selecionar(req, res) {
    const id = req.params.id;
    const respostaBanco = await Emprestimo.findByPk(id);
    res.json(respostaBanco);
}

async function emprestar(req, res) {
    //Lendo os paramentros
    const idlivro = req.body.idlivro;
    const idusuario = req.body.idusuario;

    //verifica se existe o paramentro idlivro
    if (!idlivro) {
        res.status(422).send('O parâmetro idlivro é obrigatório.');
    }

    //verifica se existe o paramentro idusuario
    if (!idusuario) {
        res.status(422).send('O parâmetro idusuario é obrigatório.');
    }

    //verifica se o livro existe
    const livroBanco = await Livro.findByPk(idlivro);
    if (!livroBanco) {
        res.status(404).send('Livro não encontrado.');
    }

    //verifica se o usuário existe
    const usuarioBanco = await Usuario.findByPk(idusuario);
    if (!usuarioBanco) {
        res.status(404).send('Usuário não encontrado.');
    }

    //verifica se o livro está inativo
    if (!livroBanco.ativo) {
        res.status(422).send('Este livro está inativo.');
    }

    //verifica se o livro está emprestado
    if (livroBanco.emprestado) {
        res.status(422).send('Este livro já está emprestado.');
    }

    //verifica se o usuário tem um empréstimo pendente
    //falta fazer

    //setando data de emprestimo e data de vencimento
    const emprestimo = moment().format('YYYY-MM-DD');
    const vencimento = moment().add(15, 'days').format('YYYY-MM-DD');

    //inserindo o emprestimo no banco
    const respostaBanco = await Emprestimo.create({ idlivro, idusuario, emprestimo, vencimento });

    //alterando o campo emprestado do livro para true
    const emprestado = true;
    await Livro.update(
        { emprestado },
        { where: { idlivro } });

    res.json(respostaBanco);


    //res.json(respostaBanco);
}

async function devolver(req, res) {
    //Lendo os paramentros
    const idemprestimo = req.params.id;

    //verifica se existe o paramentro idemprestimo
    if (!idemprestimo) {
        res.status(422).send('O parâmetro idemprestimo é obrigatório.');
        return;
    }

    //verifica se o empréstimo existe
    const emprestimoBanco = await Emprestimo.findByPk(idemprestimo);
    if (!emprestimoBanco) {
        res.status(404).send('Empréstimo não encontrado.');
        return;
    }

    //verifica se o empréstimo já foi devolvido
    if (emprestimoBanco.devolucao != null) {
        res.status(422).send('Empréstimo já foi devolvido.');
        return;
    }

    //pega o código do livro emprestado
    const idlivro = emprestimoBanco.idlivro;

    //setando data de devolução
    const devolucao = moment().format('YYYY-MM-DD');

    //atualizando data de devolução do emprestimo no banco
    const respostaBanco = await Emprestimo.update(
        { devolucao },
        { where: {idlivro}});

    //alterando o campo emprestado do livro para false
    const emprestado = false;
    await Livro.update(
        { emprestado },
        { where: { idlivro } });

    res.json(respostaBanco);
}

export default { listar, selecionar, emprestar, devolver, listarPendentes };