import express from 'express';
import fs from 'fs-extra';
import { rota } from './endpoints/routers.js';
import cors from 'cors';
import { qrCode } from '../app.js';

const app = express();
app.use(cors());
app.use(rota);
app.use((req, res, next) => {
  const pass = req.query.pass;
  if (!pass || pass !== 'botbackup') {
    return res.status(401).json({ message: "SENHA INCORRETA " })
  }
  next()
})

app.get('/backup/bot', async (req, res) => {
  try {
    await res.download('./database/dados_salvos/bot.json')
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "ERRO AO FAZER BACKUP" })
  }
});

app.get('/backup/mensagens', async (req, res) => {
  try {
    await res.download('./database/dados_salvos/mensagens.db')
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "ERRO AO FAZER BACKUP" })
  }
});

app.get('/backup/contador', async (req, res) => {
  try {
    await res.download('./database/dados_salvos/contador.db')
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "ERRO AO FAZER BACKUP" })
  }
});

app.get('/backup/grupos', async (req, res) => {
  try {
    await res.download('./database/dados_salvos/grupos.db')
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "ERRO AO FAZER BACKUP" })
  }
});

app.get('/backup/usuarios', async (req, res) => {
  try {
    await res.download('./database/dados_salvos/usuarios.db')
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "ERRO AO FAZER BACKUP" })
  }
});

app.get('/removeqr', async (req, res) => {
  try {
    await fs.remove('./auth_info_baileys');
    return res.status(200).json({ message: "QR code removido!" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "ERRO AO REMOVER QR CODE" })
  }
});

app.get('/verqr', async (req, res) => {
  try {
    let qrCodeBot = qrCode || "";

    return res.send(`
	<script src="https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js"></script>
	<section class="conteiner">
		<div id="qrcode-2"></div>
		<div id="conectado"></div>
	</section>
<script>
	let qrcodeContainer2 = document.getElementById("qrcode-2");
	const conectado = document.getElementById("conectado");
	const windowWidth = window.innerWidth;
	const windowHeight = window.innerHeight;

	const qrCodeSize = windowWidth < windowHeight ? windowWidth : windowHeight;
	const estaLogado = '${qrCodeBot}' === "" ? '<img class="conectado" src="https://cdn-icons-png.flaticon.com/512/190/190411.png"/>' : "";
	qrcodeContainer2.innerHTML = "";
	qrcodeContainer2.innerHTML += estaLogado;
	const website = '${qrCodeBot}'
	new QRCode(qrcodeContainer2, {
		text: website,
		width: (qrCodeSize - 40),
		height: (qrCodeSize - 40),
		colorDark: "#000000",
		colorLight: "#ffffff",
		correctLevel: QRCode.CorrectLevel.L
	});
</script>
<style type="text/css">
	*{
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}
	.conteiner{
		width: 100%;
		height: 100%;
		background-color: seagreen;
	}

	#qrcode-2{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100% !important;
		height: 100%;
	}

	.conectado{
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 100;
	}
</style>
	`);
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "ERRO AO VER QR CODE" })
  }
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log('server on'))