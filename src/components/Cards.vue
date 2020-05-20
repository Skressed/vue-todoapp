<template>
  <div class="wrapper">
    <div class="row showcase" v-show="cardsShown">
      <div class="card" v-for="(note, index) in notes">
        <div class="card__header">
          <div class="title">{{note.title}}</div>
          <img src="../assets/trash-white.svg" class="deleteBtn" @click="deleteTheNote(index)">
        </div>
        <div class="todos" @click="openTheCard(index)">
          <div v-for="todo in note.todos" class="todo">
            <div class="status">
              <p class="true" v-if="todo.done==true"><img class="mark" src="../assets/yes.svg"></p>
              <p class="false" v-else><img class="mark" src="../assets/no.svg"></p>
            </div>
            <div class="text">{{todo.text}}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="deleteTheNotePromptShown" class="container deleteNote">
      <div class="modal__header delete__modal__header">
        Вы действительно хотите удалить заметку?
      </div>
      <div class="deleteTheNotePrompt__nav">
        <img class="deleteNoteNavBtn" src="../assets/yes.svg" @click="confirmDelete(grabbedId)">
        <img class="deleteNoteNavBtn" src="../assets/no.svg" @click="switchDeleteScreen()">
      </div>
    </div>

    <img class="newNoteBtn" src="../assets/new.svg" @click="newNote()">
  </div>
</template>

<script>

import { bus } from '../main'

export default {
  name: 'App',
  components: {

  },
  data () {
    return {
      cardsShown: true,
      deleteTheNotePromptShown: false,
      grabbedId: 0,
    }
  },
  props: {
    notes: {
      type: Array,
    }
  },
  methods: {
    openTheCard: function(index) {
      window.location.href="/note/" + index;
    },
    deleteTheNote: function(index) {
      this.grabbedId = index;
      this.switchDeleteScreen();
    },
    confirmDelete: function(id) {
      this.notes.splice(id, 1);
      window.localStorage.setItem('notes', JSON.stringify(this.notes));
      this.switchDeleteScreen();
    },
    switchDeleteScreen: function() {
      this.cardsShown = !this.cardsShown;
      this.deleteTheNotePromptShown = !this.deleteTheNotePromptShown;
    },
    newNote: function() {
      bus.$emit('newNote');
    }
  }
}
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.showcase {
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 2vw;
  margin: 2%;
  width: 90%;
}

.card {
  margin-bottom: 16px;
  background-color: white;
  border-radius: 4px;
  transition: 0.4s;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.2);
}

.card:hover {
  transition: 0.4s;
  box-shadow: 0px 0px 15px rgba(0,0,70,0.5);
}

.card__header {
  height: 20%;
  padding: 8px;
  padding-top: 16px;
  padding-bottom: 16px;
  background-color: #363740;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  color: white;
  display: flex; flex-direction: row; justify-content: center; align-items: center;
}

.title {
  width: 80%;
  text-align: center;
}

.deleteBtn {
  width: 32px;
  margin-left: 6px;
}

.todos {
  display: flex;
  flex-direction: column;
  height: auto;
  cursor: pointer;
  padding-bottom: 32px;
}

.todo {
  margin: 4px;
  margin-bottom: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 255, 0.1);
  border-radius: 4px;
}

.status {
  margin-right: 8px;
}

.mark {
  width: 16px;
}

.container {
  margin-top: 16px;
  padding: 16px;
  border-radius: 16px;
  width: auto;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: white;
}

.deleteNote {
  width: auto;
  margin-top: 25%;
  position: absolute;
  z-index: 999;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.delete__modal__header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.deleteTheNotePrompt__nav {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.deleteBtn {
  cursor: pointer;
}

.deleteNoteNavBtn {
  width: 32px;
  margin: 4px;
  cursor: pointer;
}

.newNoteBtn {
  position: fixed;
  right: 5%;
  bottom: 5%;
  cursor: pointer;
  transition: 0.3s;
}

.newNoteBtn:hover {
  transition: 0.3s;
  transform: rotateZ(45deg);
}

@media screen and (max-width: 1080px) {
  .card__header {
    height: auto;
  }

  .title {
    font-size: 12px;
  }
}

</style>
