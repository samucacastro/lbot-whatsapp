//REQUERINDO MÓDULOS
import {erroComandoMsg, consoleErro, criarTexto, stickerToPng} from '../lib/util.js'
import * as socket from '../baileys/socket-funcoes.js'
import {MessageTypes} from '../baileys/mensagem.js'
import { downloadMediaMessage } from '@whiskeysockets/baileys'
import fs from 'fs-extra'
import {misturarEmojis, removerFundo, textoParaImagem} from '../lib/api.js'
import {toSticker, StickerTypes} from 'wa-leal-stickers'


export const figurinhas = async(c, mensagemInfoCompleta) => {
    const {msgs_texto} = mensagemInfoCompleta
    const {botInfoJSON} = mensagemInfoCompleta.bot
    const {textoRecebido, command, args, type, id, chatId, mimetype, quotedMsg, seconds, quotedMsgObjInfo, quotedMsgObj} = mensagemInfoCompleta.mensagem
    const {prefixo, nome_pack, nome_bot } = botInfoJSON
    let cmdSemPrefixo = command.replace(prefixo, "")
    
    try{
        switch(cmdSemPrefixo){      
            case 's':
                try{
                    let stickerArg, tipoFigurinha
                    if(args.length > 1) stickerArg = args[1]
                    let argSuportado = ['1', '2'].includes(stickerArg)
                    if(!argSuportado) tipoFigurinha = StickerTypes.DEFAULT
                    if(argSuportado){
                        if(stickerArg == 1) tipoFigurinha = StickerTypes.CIRCLE
                        if(stickerArg == 2) tipoFigurinha = StickerTypes.ROUNDED
                    }
                    let dadosMensagem = {
                        tipo : (quotedMsg) ? quotedMsgObjInfo.type : type,
                        mimetype : (quotedMsg) ? quotedMsgObjInfo.mimetype : mimetype,
                        message: (quotedMsg) ? quotedMsgObj  : id,
                        seconds: (quotedMsg) ? quotedMsgObjInfo.seconds : seconds
                    }
                    if(dadosMensagem.tipo != MessageTypes.image && dadosMensagem.tipo != MessageTypes.video) return await socket.reply(c, chatId, await erroComandoMsg(command) , id)
                    if(dadosMensagem.tipo == MessageTypes.video && dadosMensagem.seconds > 9) return socket.reply(c, chatId, msgs_texto.figurinhas.sticker.video_invalido, id)
                    let bufferMidia = await downloadMediaMessage(dadosMensagem.message, "buffer")
                    await socket.sendSticker(c,chatId, await toSticker(bufferMidia, {pack: nome_pack?.trim(), author: nome_bot?.trim(), fps: 9, type: tipoFigurinha}))
                } catch(err){
                    throw err
                }
                break
            
            case 'simg':
                try{
                    if(quotedMsg && quotedMsgObjInfo.type == MessageTypes.sticker){
                        let mensagemQuoted = quotedMsgObj, imagemSaida
                        mensagemQuoted.message.stickerMessage.url = mensagemQuoted.message.stickerMessage.url == "https://web.whatsapp.net" ? `https://mmg.whatsapp.net${mensagemQuoted.message.stickerMessage.directPath}` : mensagemQuoted.message.stickerMessage.url
                        let bufferMensagem = await downloadMediaMessage(mensagemQuoted, "buffer")
                        let conversaoResultado = await stickerToPng(bufferMensagem)
                        imagemSaida = conversaoResultado.saida
                        if(!conversaoResultado.success){
                            fs.unlinkSync(imagemSaida)
                            await socket.reply(c, chatId, msgs_texto.figurinhas.sticker.erro_conversao, id)
                        } else{
                            await socket.replyFile(c, MessageTypes.image, chatId, imagemSaida, '', id)
                            fs.unlinkSync(imagemSaida)
                        }
                    } else {
                        await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    }
                } catch(err){
                    throw err
                }
                
                break 
                
            case 'emojimix':
                try{
                    if(args.length === 1) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    let usuarioTexto = textoRecebido.slice(10).trim(), emojis = usuarioTexto.split("+")
                    if(emojis.length == 0 || !emojis[0] || !emojis[1]) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    await misturarEmojis(emojis[0], emojis[1]).then(async ({resultado})=>{
                        await socket.sendSticker(c,chatId, await toSticker(resultado, {pack: nome_pack?.trim(), author: nome_bot?.trim()}))
                    }).catch( async err =>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }

                break

            case "ssf":
                try{
                    let dadosMensagem = {
                        tipo : (quotedMsg) ? quotedMsgObjInfo.type : type,
                        mimetype : (quotedMsg) ? quotedMsgObjInfo.mimetype : mimetype,
                        message: (quotedMsg) ? quotedMsgObj  : id,
                        seconds: (quotedMsg) ? quotedMsgObjInfo.seconds : seconds
                    }
                    if(dadosMensagem.tipo != MessageTypes.image) return await socket.reply(c, chatId, msgs_texto.figurinhas.sticker.ssf_imagem , id)
                    await socket.reply(c, chatId, msgs_texto.figurinhas.sticker.ssf_espera , id)
                    let bufferMidia = await downloadMediaMessage(dadosMensagem.message, "buffer")
                    await removerFundo(bufferMidia).then(async ({resultado})=>{
                        await socket.sendSticker(c,chatId, await toSticker(resultado, {pack: nome_pack?.trim(), author: nome_bot?.trim()}))
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break

            case 'tps':
                try{
                    if(args.length == 1) return await socket.reply(c, chatId, await erroComandoMsg(command) , id)
                    let usuarioTexto = textoRecebido.slice(5).trim()
                    await textoParaImagem(usuarioTexto).then(async ({resultado})=>{
                        await socket.sendSticker(c,chatId, await toSticker(resultado, {pack: nome_pack?.trim(), author: nome_bot?.trim()}))
                    }).catch(async err=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break

            case 'atps':
                try{
                    if(args.length == 1) return await socket.reply(c, chatId, await erroComandoMsg(command) , id)
                    let usuarioTexto = textoRecebido.slice(5).trim()
                    await textoParaImagem(usuarioTexto, true).then(async ({resultado})=>{
                        await socket.sendSticker(c,chatId, await toSticker(resultado, {pack: nome_pack?.trim(), author: nome_bot?.trim()}))
                    }).catch(async err=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch (err){
                    throw err
                }
                break
        }

    } catch(err){
        err.message = `${command} - ${err.message}`
        consoleErro(err, "FIGURINHAS")
        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id) 
    }
}

export const autoSticker = async(c, mensagemInfoCompleta)=>{
    try{
        const {chatId, type, id, seconds} = mensagemInfoCompleta.mensagem
        const {botInfoJSON} = mensagemInfoCompleta.bot
        const {nome_bot, nome_pack} = botInfoJSON
        if(type == MessageTypes.image || type == MessageTypes.video){
            if(type == MessageTypes.video && seconds > 9) return
            let bufferMidia = await downloadMediaMessage(id, "buffer")
            await socket.sendSticker(c,chatId, await toSticker(bufferMidia, {pack: nome_pack?.trim(), author: nome_bot?.trim(), fps: 9}))
        }
    } catch(err){
        throw err
    }
}