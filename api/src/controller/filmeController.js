import { alterarImagem, inserirFilme } from "../repository/filmeRepository.js";

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


export default server;