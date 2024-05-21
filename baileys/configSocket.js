import pino from 'pino'
import {recuperarMensagem} from '../controle/mensagensControle.js'
import {isJidBroadcast, makeCacheableSignalKeyStore} from '@whiskeysockets/baileys'

export default function configSocket (state, version){
    return {
        printQRInTerminal: true,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({level : "silent"}))
        },
        version,
        keepAliveIntervalMs: 20000,
        emitOwnEvents: true,
        logger: pino({level : "silent"}),
        shouldIgnoreJid: jid => isJidBroadcast(jid) || jid.endsWith('@newsletter'),
        getMessage: async (key) => {
            const mensagem = await recuperarMensagem(key.remoteJid, key.id)
            return mensagem || undefined
        }
    }
}
