import express from 'express'

const app = express()
app.use((req, res, next)=>{
	const pass = req.query.pass;
	if (!pass || pass !== 'botbackup') {
		return res.status(401).json({message: "SENHA INCORRETA "})
	}
	next()
})

app.get('/backup/bot', async (req, res) => {
  try{
      await res.download('./database/dados_salvos/bot.json')
  } catch(error){
    console.error(error)
    return res.status(500).json({message: "ERRO AO FAZER BACKUP"})
  }
});

app.get('/backup/mensagens', async (req, res) => {
  try{
			await res.download('./database/dados_salvos/mensagens.db')
  } catch(error){
  	console.error(error)
  	return res.status(500).json({message: "ERRO AO FAZER BACKUP"})
  }
});

app.get('/backup/contador', async (req, res) => {
  try{
			await res.download('./database/dados_salvos/contador.db')
  } catch(error){
  	console.error(error)
  	return res.status(500).json({message: "ERRO AO FAZER BACKUP"})
  }
});

app.get('/backup/grupos', async (req, res) => {
  try{
			await res.download('./database/dados_salvos/grupos.db')
  } catch(error){
  	console.error(error)
  	return res.status(500).json({message: "ERRO AO FAZER BACKUP"})
  }
});

app.get('/backup/usuarios', async (req, res) => {
  try{
			await res.download('./database/dados_salvos/usuarios.db')
  } catch(error){
  	console.error(error)
  	return res.status(500).json({message: "ERRO AO FAZER BACKUP"})
  }
});


const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log('server on'))