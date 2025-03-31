<template>
  <div class="card mb-3">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <div v-if="!editing">
            <h5 class="card-title">{{ questionnaire.title }}</h5>
          </div>
          <div v-else>
            <input
              type="text"
              class="form-control"
              v-model="editTitle"
              @keyup.enter="saveEdit"
            />
          </div>
        </div>
        <div>
          <button class="btn btn-secondary btn-sm me-2" @click="toggleEdit">
            {{ editing ? 'Annuler' : 'Modifier' }}
          </button>
          <button
            class="btn btn-danger btn-sm"
            @click="$emit('remove', questionnaire.id)"
          >
            Supprimer
          </button>
        </div>
      </div>
      <div v-if="editing" class="mt-2">
        <button class="btn btn-primary btn-sm" @click="saveEdit">
          Enregistrer
        </button>
      </div>

      <div class="mt-3">
        <h6>Questions</h6>
        <ul class="list-group">
          <QuestionItem
            v-for="item in questionnaire.questions"
            :key="item.id"
            :question="item"
            :questionnaireId="questionnaire.id"
            @refresh="refreshList"
          />
        </ul>
        <div class="input-group mt-3">
          <input
            type="text"
            class="form-control"
            placeholder="Nouvelle question"
            v-model="newQuestion"
            @keyup.enter="addQuestion"
          />
          <button class="btn btn-outline-primary" @click="addQuestion">
            Ajouter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QuestionItem from './QuestionItem.vue'

export default {
  components: { QuestionItem },
  props: { questionnaire: Object },
  data() {
    return {
      editing: false,
      editTitle: this.questionnaire.title,
      newQuestion: ''
    }
  },
  methods: {
    toggleEdit() {
      this.editing = !this.editing
      if (!this.editing) {
        // On annule la modification
        this.editTitle = this.questionnaire.title
      }
    },
    saveEdit() {
      const newTitle = this.editTitle.trim()
      if (newTitle) {
        this.$emit('update', { id: this.questionnaire.id, title: newTitle })
        this.editing = false
      }
    },
    addQuestion() {
      const text = this.newQuestion.trim()
      if (!text) return
      fetch(`/api/questionnaires/${this.questionnaire.id}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
        .then(() => {
          this.newQuestion = ''
          this.refreshList()
        })
        .catch(err => console.error(err))
    },
    refreshList() {
      this.$emit('refresh')
    }
  }
}
</script>
