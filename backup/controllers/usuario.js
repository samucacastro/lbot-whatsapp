import { obterDadosTodosUsuarios } from '../../controle/usuariosControle.js';

export const todosUsuarios = async (req, res) => {
    try {
        const resposta = await obterDadosTodosUsuarios();
        return res.json({ quantidade: resposta.length })
    } catch (error) {
        return res.send("ERROR")
    }
};