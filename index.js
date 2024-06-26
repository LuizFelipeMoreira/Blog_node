const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const Pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta');
const { where } = require('sequelize');

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
  Pergunta.findAll({ raw: true, order: [['id', 'DESC']] }).then((perguntas) => {
    res.render('index', { perguntas });
  });
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
});

app.get('/pergunta/:id', async (req, res) => {
  const id = req.params.id;

  const pergunta = await Pergunta.findOne({ where: { id: id } });

  if (pergunta) {
    try {
      const respostas = await Resposta.findAll({
        where: { perguntaID: pergunta.id },
        order: [['id', 'DESC']],
      });
      res.render('pergunta', { pergunta, respostas });
    } catch (error) {
      console.error(error);
    }
  } else {
    res.redirect('/');
  }
});

app.post('/responder', async (req, res) => {
  const { corpo, pergunta: perguntaID } = req.body;

  try {
    await Resposta.create({ corpo, perguntaID });
    res.redirect(`/pergunta/${perguntaID}`);
  } catch (error) {
    if (error) throw console.error(`Erro ao enviar resposta: ${error}`);
  }
});

app.listen(8181, (error) => console.log('Servidor Iniciado com Sucesso'));
