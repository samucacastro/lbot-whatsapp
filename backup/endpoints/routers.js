import { Router } from 'express';
import { obterStatusGrupo, dadosGrupo, contadorMensagensGrupo, todosGrupos } from '../controllers/grupo.js';
import { todosUsuarios } from '../controllers/usuario.js';

export const rota = Router();
rota.get("/gg", (req, res) => {
    return res.send("ggg");
});

rota.get("/grupo/:id", dadosGrupo);
rota.get("/grupo/status/:id", obterStatusGrupo);
rota.get("/contagem/:id", contadorMensagensGrupo);
rota.get("/usuarios", todosUsuarios);
rota.get("/grupos", todosGrupos);