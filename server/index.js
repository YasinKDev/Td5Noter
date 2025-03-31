const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let questionnaires = [];
let nextQuestionnaireId = 1;
let nextQuestionId = 1;

// Récupérer tous les questionnaires
app.get('/api/questionnaires', (req, res) => {
  res.json(questionnaires);
});

// Créer un nouveau questionnaire
app.post('/api/questionnaires', (req, res) => {
  const { title } = req.body;
  const questionnaire = { id: nextQuestionnaireId++, title, questions: [] };
  questionnaires.push(questionnaire);
  res.status(201).json(questionnaire);
});

// Mettre à jour un questionnaire
app.put('/api/questionnaires/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title } = req.body;
  const questionnaire = questionnaires.find(q => q.id === id);
  if (questionnaire) {
    questionnaire.title = title;
    res.json(questionnaire);
  } else {
    res.status(404).json({ error: 'Questionnaire non trouvé' });
  }
});

// Supprimer un questionnaire
app.delete('/api/questionnaires/:id', (req, res) => {
  const id = parseInt(req.params.id);
  questionnaires = questionnaires.filter(q => q.id !== id);
  res.status(204).send();
});

// Ajouter une question à un questionnaire
app.post('/api/questionnaires/:id/questions', (req, res) => {
  const questionnaireId = parseInt(req.params.id);
  const questionnaire = questionnaires.find(q => q.id === questionnaireId);
  if (!questionnaire) return res.status(404).json({ error: 'Questionnaire non trouvé' });
  const { text } = req.body;
  const question = { id: nextQuestionId++, text };
  questionnaire.questions.push(question);
  res.status(201).json(question);
});

// Mettre à jour une question
app.put('/api/questions/:id', (req, res) => {
  const questionId = parseInt(req.params.id);
  let questionFound = false;
  questionnaires.forEach(q => {
    q.questions.forEach(question => {
      if (question.id === questionId) {
        question.text = req.body.text;
        questionFound = true;
        res.json(question);
      }
    });
  });
  if (!questionFound) {
    res.status(404).json({ error: 'Question non trouvée' });
  }
});

// Supprimer une question
app.delete('/api/questions/:id', (req, res) => {
  const questionId = parseInt(req.params.id);
  let questionFound = false;
  questionnaires.forEach(q => {
    const index = q.questions.findIndex(question => question.id === questionId);
    if (index !== -1) {
      q.questions.splice(index, 1);
      questionFound = true;
    }
  });
  if (questionFound) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Question non trouvée' });
  }
});

app.listen(port, () => {
  console.log(`REST server démarré sur http://localhost:${port}`);
});
