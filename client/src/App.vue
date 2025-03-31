<template>
  <div class="container mt-4">
    <h2 class="mb-3">Questionnaires</h2>
    <div class="input-group mb-4">
      <input
        type="text"
        class="form-control"
        placeholder="Titre du questionnaire"
        v-model="newQuestionnaireTitle"
        @keyup.enter="addQuestionnaire"
      />
      <button class="btn btn-primary" @click="addQuestionnaire">Ajouter</button>
    </div>
    <div>
      <QuestionnaireItem
        v-for="q in questionnaires"
        :key="q.id"
        :questionnaire="q"
        @remove="removeQuestionnaire"
        @update="updateQuestionnaire"
        @refresh="fetchQuestionnaires"
      />
    </div>
  </div>
</template>

<script>
import QuestionnaireItem from './components/QuestionnaireItem.vue'

export default {
  components: { QuestionnaireItem },
  data() {
    return {
      questionnaires: [],
      newQuestionnaireTitle: ''
    }
  },
  methods: {
    fetchQuestionnaires() {
      fetch('http://localhost:3000/api/questionnaires')
        .then(res => res.json())
        .then(data => (this.questionnaires = data))
        .catch(err => console.error(err))
    },
    addQuestionnaire() {
      const title = this.newQuestionnaireTitle.trim()
      if (!title) return
      fetch('http://localhost:3000/api/questionnaires', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      })
        .then(() => {
          this.newQuestionnaireTitle = ''
          this.fetchQuestionnaires()
        })
        .catch(err => console.error(err))
    },
    removeQuestionnaire(id) {
      fetch(`http://localhost:3000/api/questionnaires/${id}`, { method: 'DELETE' })
        .then(() => this.fetchQuestionnaires())
        .catch(err => console.error(err))
    },
    updateQuestionnaire(updated) {
      fetch(`http://localhost:3000/api/questionnaires/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: updated.title })
      })
        .then(() => this.fetchQuestionnaires())
        .catch(err => console.error(err))
    }
  },
  mounted() {
    this.fetchQuestionnaires()
  }
}
</script>
