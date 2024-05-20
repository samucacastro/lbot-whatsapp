import * as socket from '../baileys/socket-funcoes.js'
import { obterGrupoInfo } from './gruposControle.js'
import schedule from 'node-schedule'

export const automacaoGrupos = async (c, idGrupo) =>{
	console.log("AQUII 2")
	// Tarefa para as 22h
	const job22h = schedule.scheduleJob({
		timezone: "America/Sao_Paulo",
		rule: '* 06 * * *'
	}, async () => {
// Sua tarefa aqui
		try{
			const dados = await obterGrupoInfo(idGrupo[0])
		   //if (!isBotGroupAdmins) return //await socket.reply(c, chatId, msgs_texto.permissao.bot_admin, id)
		   let estadoNovo = true
		   await socket.setGroupToAdminsOnly(c, idGrupo[0], estadoNovo);
		   await socket.sendText(c, idGrupo[0], "Grupo fechado automaticamente, reabriremos às 18:40. Bom descanso a todos!");
		   console.log("GRUPO FECHADO AUTOMATICAMENTE")
		 } catch(err){
		 	console.log(err)
		    throw err
		  }
	});

// Tarefa para as 6h30
	const job6h30 = schedule.scheduleJob({
		timezone: "America/Sao_Paulo",
		rule: '* 20 * * *'
	}, async () => {
		const dados = await obterGrupoInfo(idGrupo[0])
  // Sua tarefa aqui
	  try{
		   //if (!isBotGroupAdmins) return //await socket.reply(c, chatId, msgs_texto.permissao.bot_admin, id)
		   let estadoNovo = false
		   await socket.setGroupToAdminsOnly(c, idGrupo[0], estadoNovo);
		   await socket.sendText(c, idGrupo[0], "Grupo aberto automaticamente!");
		   console.log("GRUPO ABERTO AUTOMATICAMENTE")
		 } catch(err){
		    throw err
		  }
 	});
}
