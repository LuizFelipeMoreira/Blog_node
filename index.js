const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const Pergunta = require('./database/Pergunta');

connection
  .authenticate()
  .then(() => {
    console.log('conexão feita com sucesso');
  })
  .catch((error) => {
    console.log(error);
  });

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/perguntar', (req, res) => {
  res.render('perguntar');
});

app.post('/salvarpergunta', (req, res) => {
  const titulo = req.body.titulo;
  const description = req.body.descricao;

  // Inserir os dados no banco de dados
  (async () => {
    try {
      const user = await Pergunta.create({ titulo, description });
      res.redirect('/');
    } catch (error) {
      res.send(error);
    }
  })();

  // Pergunta.create({
  //   titulo: req.body.titulo,
  //   description: req.body.descricao,
  // }).then(() => {
  //   res.redirect('/');
  // });
});

app.listen(8181, (error) => console.log('Servidor Iniciado com Sucesso'));
