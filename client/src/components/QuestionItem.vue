<template>
  <li class="list-group-item d-flex justify-content-between align-items-center">
    <div v-if="!editing">{{ question.text }}</div>
    <div v-else>
      <input
        type="text"
        class="form-control"
        v-model="editText"
        @keyup.enter="saveEdit"
      />
    </div>
    <div>
      <button class="btn btn-secondary btn-sm me-1" @click="toggleEdit">
        {{ editing ? 'Annuler' : 'Modifier' }}
      </button>
      <button class="btn btn-danger btn-sm" @click="deleteQuestion">
        Supprimer
      </button>
      <button v-if="editing" class="btn btn-primary btn-sm" @click="saveEdit">
        Enregistrer
      </button>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    question: Object,
    questionnaireId: Number
  },
  data() {
    return {
      editing: false,
      editText: this.question.text
    }
  },
  methods: {
    toggleEdit() {
      this.editing = !this.editing
      if (!this.editing) {
        // On annule la modification
        this.editText = this.question.text
      }
    },
    saveEdit() {
      const newText = this.editText.trim()
      if (newText) {
        fetch(`/api/questions/${this.question.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: newText })
        })
          .then(() => {
            this.editing = false
            this.$emit('refresh')
          })
          .catch(err => console.error(err))
      }
    },
    deleteQuestion() {
      fetch(`/api/questions/${this.question.id}`, { method: 'DELETE' })
        .then(() => this.$emit('refresh'))
        .catch(err => console.error(err))
    }
  }
}
</script>
