import { alterarImagem, buscarPorId, buscarPorNome, deletarFilme, inserirFilme, listarTodosFilmes } from "../repository/filmeRepository.js";

import multer from 'multer'

import { Router } from 'express'
const server = Router();
const upload = multer({
    dest: 'storage/capaFilmes'
})


server.post('/filme', async (req, resp) => {
    try {
        const filmeInserir = req.body;

        if(!filmeInserir.nome)
        {
            throw new Error('Nome do filme é obrigatório!');
        }
        if(filmeInserir.avaliacao == undefined || filmeInserir.avaliacao < 0)
        {
            throw new Error('Avaliação do filme é obrigatória!');
        }
        if(!filmeInserir.lancamento)
        {
            throw new Error('Data de Lançamento do filme é obrigatório!');
        }
        if(!filmeInserir.disponivel)
        {
            throw new Error('Campo disponível é obrigatório!');
        }
        if(!filmeInserir.usuario)
        {
            throw new Error('Usuario não logado!');
        }

        const filme = await inserirFilme(filmeInserir);
        resp.send(filme);
    } catch (err) {
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.put('/filme/:id/capa', upload.single('capa'), async (req, resp) => {
    try{
        const { id } = req.params;
        const image = req.file.path;

        const resposta = await alterarImagem(image, id)
        if(resposta != 1){
            throw new Error('A imagem não pode ser salva!');
        }
        resp.status(204).send();
    }
    catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.get('/filme', async (req, resp) => {
    try{
        const resposta = await listarTodosFilmes();
        resp.send(resposta);
    } catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.get('/filme/busca', async (req, resp) => {
    try{
        const { nome } = req.query;
        const resposta = await buscarPorNome(nome);

        if (resposta.length == 0){
            resp.status(404).send([]);
        }

        resp.send(resposta);
    } catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.get('/filme/:id', async (req, resp) => {
    try{
        const id = Number(req.params.id);
        const resposta = await buscarPorId(id);

        if (!resposta){
            throw new Error('Filme não encontrado!');
        }

        resp.send(resposta);
    } catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.delete('/filme/:id', async (req, resp) => {
    try{
        const { id } = req.params;

        const resposta = await deletarFilme(id);
        if (resposta != 1){
            throw new Error('Filme não encontrado!');
        }
        resp.status(204).send();
    } catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.put('./filme/:id',async (req,resp)=>{
    try{
        const { id }= req.params;
        const filme=req.body;

        if (!filme.nome)
            throw new Error('Nome do filme é obrigatório!');
        
        if (!filme.sinopse)
            throw new Error('Sinopse do filme é obrigatório!');
        
        if (filme.avaliacao == undefined || filme.avaliacao < 0)
            throw new Error('Avaliação do filme é obrigatória!');
    
        if (!filme.lancamento)
            throw new Error('Lançamento do filme é obrigatório!');
        
        if (filme.disponivel == undefined)
            throw new Error('Campo Disponível é obrigatório!');
        
        if (!filme.usuario)
            throw new Error('Usuário não logado!');

        const resposta=await alterarFilme(id,filme);
        if(resposta !=1)
            throw new Error('Filme não pode ser alterado ');
        else
            resp.status(204).send();
    } catch(err){
        resp.status(400).send({
            erro:err.message
        })
    }
})



export default server;