import * as socket from '../baileys/socket-funcoes.js'
import { obterGrupoInfo } from './gruposControle.js'
import schedule from 'node-schedule'
import moment from "moment-timezone"
moment.tz.setDefault('America/Sao_Paulo')

export const automacaoGrupos = async (c, idGrupo) =>{
	// Tarefa para as 22h
	const job22h = schedule.scheduleJob({
		timezone: "America/Sao_Paulo",
		rule: '00 23 * * *'
	}, async () => {
// Sua tarefa aqui
		try{
			// const dados = await obterGrupoInfo(idGrupo[0])
			// const dados1 = await obterGrupoInfo(idGrupo[1])
		   //if (!isBotGroupAdmins) return //await socket.reply(c, chatId, msgs_texto.permissao.bot_admin, id)
		   let estadoNovo = true
		   await socket.setGroupToAdminsOnly(c, idGrupo[0], estadoNovo);
		   await socket.setGroupToAdminsOnly(c, idGrupo[1], estadoNovo);
		   await socket.sendText(c, idGrupo[0], "Grupo fechado automaticamente, reabriremos às 06:00. Bom descanso a todos!");
		   await socket.sendText(c, idGrupo[1], "Grupo fechado automaticamente, reabriremos às 06:00. Bom descanso a todos!");
		   console.log("GRUPOS FECHADO AUTOMATICAMENTE")
		 } catch(err){
		 	console.log("AUTOMAÇÃO GRUPOS: "+err);
		 	return
		  }
	});

// Tarefa para as 6h30
	const job6h30 = schedule.scheduleJob({
		timezone: "America/Sao_Paulo",
		rule: '00 09 * * *'
	}, async () => {
		// const dados = await obterGrupoInfo(idGrupo[0])
		// const dados1 = await obterGrupoInfo(idGrupo[1])
  // Sua tarefa aqui
	  try{
		   //if (!isBotGroupAdmins) return //await socket.reply(c, chatId, msgs_texto.permissao.bot_admin, id)
		   let estadoNovo = false
		   await socket.setGroupToAdminsOnly(c, idGrupo[0], estadoNovo);
		   await socket.setGroupToAdminsOnly(c, idGrupo[1], estadoNovo);
		   await socket.sendText(c, idGrupo[0], "Grupo aberto automaticamente!");
		   await socket.sendText(c, idGrupo[1], "Grupo aberto automaticamente!");
		   console.log("GRUPOS ABERTO AUTOMATICAMENTE")
		 } catch(err){
		 	console.log("AUTOMAÇÃO GRUPOS: "+err)
		    return
		  }
 	});
}
