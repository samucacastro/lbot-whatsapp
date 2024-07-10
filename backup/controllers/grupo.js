import { obterGrupoInfo, obterTodasContagensGrupo, obterTodosGruposInfo } from '../../controle/gruposControle.js';

export const dadosGrupo = async (req, res) => {
    const idGrupo = req.params.id;
    try {
        const dados = await obterGrupoInfo(idGrupo);
        return res.json(dados);
    } catch (error) {
        return res.send("ERROR");
    }
};

export const todosGrupos = async (req, res) => {
    try {
        const dados = await obterTodosGruposInfo();
        const quantidadeGrupos = dados.length;
        return res.json({ grupos: dados, quantidade: quantidadeGrupos });
    } catch (error) {
        return res.send("ERROR");
    }
}

export const contadorMensagensGrupo = async (req, res) => {
    const idGrupo = req.params.id;
    try {
        const dados = await obterTodasContagensGrupo(idGrupo);
        const resposta = dados.filter((user) => {
            return user.msg > 100;
        })
        return res.json(resposta)
    } catch (error) {
        console.log(error)
        return res.send("ERROR")
    }
};

export const obterStatusGrupo = async (req, res) => {
    const idGrupo = req.params.id;
    try {
        const { mutar, bemvindo, antifake, antilink, antilinkGrupo, contador } = await obterGrupoInfo(idGrupo);
        const statusGrupo = {
            mutar,
            bemvindo,
            antifake,
            antilink,
            antilinkGrupo,
            contador
        }
        return res.json(statusGrupo);
    } catch (error) {
        return res.send("ERROR");
    }
};