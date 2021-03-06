<template>
  <div class="wrapper">
    <div class="container" v-show="openCardShown">
      <div class="modal__header">
        <input v-if="titleEdit==true" type="text" class="modal__title titleinput" v-model="titlePlaceholder" @blur="grabbedNote.title=titlePlaceholder;titleEdit = !titleEdit;titlePlaceholder=''; changesMade = true;"/>
        <div v-if="titleEdit==false" class="modal__title">{{grabbedNote.title}}<br><img src="../assets/edit.svg" class="titleEditBtn" @click="titleEdit = !titleEdit"></div>
        <img src="../assets/no-white.svg" class="closeModalBtn" @click="attemptCloseModal()">
      </div>
      <div class="modal__todos">
        <div class="todounit" v-for="(todo, index) in grabbedNote.todos" v-bind:key="todo.todo_id">
          <div class="status">
            <p class="true" v-if="grabbedNote.todos[index].done==true" @click="tickThisOne(index)"><img class="mark" src="../assets/checked.svg"></p>
            <p class="false" v-else @click="tickThisOne(index)"><img class="mark" src="../assets/unchecked.svg"></p>
          </div>
          <input v-bind:class="{todoDone: todo.done}"@focus="changesMade = true; cacheText();" @blur="pushCacheText()" type="text" class="text" v-model="todo.text"/>
          <img src="../assets/trash.svg" class="todoRemoveBtn" @click="removeTodo(index)">
        </div>
        <div class="todo__footer">
            <img src="../assets/undo.svg" class="todoBtn undoBtn" v-bind:class="{undoActive: undoable}" @click="undo()">
            <img src="../assets/redo.svg" class="todoBtn redoBtn" v-bind:class="{redoActive: redoable}" @click="redo()">
            <img src="../assets/add.svg" class="todoBtn active" @click="addTodo()">
            <img src="../assets/trash.svg" class="todoDeleteNote" @click="attemptDelete()"></img>
        </div>
      </div>
    </div>

    <div class="container savePromptContainer" v-show="saveChangesPromptShown">
      <div class="modal__header">
        <div class="modal__title">
          Сохранить изменения?
        </div>
      </div>
      <div class="modal__buttons">
        <img class="modalBtn" src="../assets/yes.svg" @click="updateCloseModal()">
        <img class="modalBtn" src="../assets/no.svg" @click="closeModal()">
      </div>
    </div>

    <div v-show="deleteTheNotePromptShown" class="container deleteNote">
      <div class="modal__header delete__modal__header">
        Вы действительно хотите удалить заметку?
      </div>
      <div class="deleteTheNotePrompt__nav">
        <img class="deleteNoteNavBtn" src="../assets/yes.svg" @click="confirmDelete()">
        <img class="deleteNoteNavBtn" src="../assets/no.svg" @click="declineDelete()">
      </div>
    </div>

  </div>
</template>

<script>


export default {
  name: 'App',
  data () {
    return {
      id: this.$route.params.id,
      grabbedNote: 0,
      titleEdit: false,
      changesMade: false,
      openCardShown: true,
      saveChangesPromptShown: false,
      deleteTheNotePromptShown: false,
      undoable: false,
      redoable: false,
      titlePlaceholder: '',
      cache: [], // кэш для всех действий за этот сеанс
      microCache: '', // используется в кэшировании текста todo для сохранения состояния на момент @focus и его кэширование на @blur
      cacheInstancesBehind: 0, // количество кэшированных версий заметки позади
    }
  },
  created () {
    const currentNote = this.notes.find(({ id }) => id === Number(this.id));
    if (!currentNote) {
      window.location.href = "/";
      return;
    }
    this.grabbedNote = currentNote;
  },
  props: {
    notes: {
      type: Array,
    }
  },
  methods: {
    addTodo: function() {
      this.cacheThis();
      this.grabbedNote.todos.push({todo_id: this.grabbedNote.todos.length, text: '', done: false});
      this.changesMade = true;
    },
    removeTodo: function(index) {
      this.cacheThis();
      this.grabbedNote.todos.splice(index, 1);
      this.changesMade = true;
    },
    tickThisOne: function(index) {
      this.cacheThis();
      this.grabbedNote.todos[index].done = !this.grabbedNote.todos[index].done;
      this.changesMade = true;
    },
    attemptCloseModal: function() {
      if (this.changesMade) {
        this.saveChangesPrompt();
        return
      }
      this.closeModal();
    },
    closeModal: function() {
      this.cache = [];
      window.location.href = "/";
    },
    saveChangesPrompt: function() {
      this.openCardShown = false;
      this.saveChangesPromptShown = true;
    },
    updateCloseModal: function() {
      window.localStorage.setItem('notes', JSON.stringify(this.notes));
      this.closeModal();
    },
    attemptDelete: function() {
      this.openCardShown = false;
      this.deleteTheNotePromptShown = true;
    },
    confirmDelete: function() {
      this.notes.splice(this.id,1);
      this.updateCloseModal();
    },
    declineDelete: function() {
      this.deleteTheNotePromptShown = false;
      this.openCardShown = true;
    },
    cacheThis: function() {
      this.undoable = true;
      this.cache[this.cacheInstancesBehind] = JSON.stringify(this.grabbedNote);
      this.cacheInstancesBehind++;
    },
    cacheText: function() {
      this.microCache = JSON.stringify(this.grabbedNote);
    },
    pushCacheText: function() {
      this.undoable = true;
      this.cache[this.cacheInstancesBehind] = this.microCache;
      this.cacheInstancesBehind++;
    },
    undo: function() {
      this.cache[this.cacheInstancesBehind] = JSON.stringify(this.grabbedNote);
      this.grabbedNote = JSON.parse(this.cache[this.cacheInstancesBehind-1]);
      this.cacheInstancesBehind--;
      if (this.cacheInstancesBehind === 0){
        this.undoable = false;
      }
      this.redoable = true;
    },
    redo: function() {
      this.undoable = true;
      this.grabbedNote = JSON.parse(this.cache[this.cacheInstancesBehind+1]);
      this.cacheInstancesBehind++;
      if ((this.cache.length-1) === (this.cacheInstancesBehind)) {
        this.redoable = false;
      }
    }
  },
}
</script>

<style scoped>
.wrapper {
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.container {
  margin-top: 16px;
  border-radius: 16px;
  width: auto;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: white;
  width: 35%;
}

.modal__header {
  background-color: #363740;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 6px;
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  box-shadow: 0px 0px 2px 2px rgba(0, 0, 70, 0.2);
}

.modal__title {
  color: white;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-top: 16px;
  padding-bottom: 16px;
  font-size: 18px;
}

.titleinput {
  color: black;
  transition: 0.3s;
}

.titleEditBtn {
  width: 28px;
  margin-left: 12px;
  cursor: pointer;
}

.closeModalBtn {
  margin-right: 16px;
  width: 24px;
  cursor: pointer;
}

.modal__todos {
  margin-top: 0;
  font-size: 32px;
  padding: 16px;
  width: 80%;
}

.todounit {
  padding-left: 16px;
  padding-right: 16px;
  margin-top: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  transition: 0.3s;
  border: 1px solid rgba(0,0,0,0.2);
}

.todounit:hover {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background-color: rgba(0,0,0,0.1);
  transition: 2s;
}

.text {
  border: 0;
  padding: 1%;
  font-size: 16px;
  width: 100%;
  border-radius: 4px;
  transition: 0.2s;
}

.text:focus {
  transition: 0.2s;
  box-shadow: 2px 2px 2px rgba(0, 60, 120, 0.5);
}

.todoDone {
  text-decoration: line-through;
}

.status {
  height: auto;
}

.true, .false {
  padding: 0; margin: 0;
}

.mark {
  padding-top: 6px;
  margin-right: 6px;
  width: 24px;
  cursor: pointer;
}

.todoRemoveBtn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 32px;
  margin-left: 6px;
  cursor: pointer;
  opacity: 0.7;
  transition: 0.1s;
}

.todoRemoveBtn:hover {
  opacity: 1;
  transition: 0.1s;
}

.todo__footer {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 8px;
  padding-top: 16px;
  padding-right: 0;
}

.todoDeleteNote {
  margin-left: 8px;
  cursor: pointer;
  width: 32px;
  opacity: 0.7;
  transition: 0.1s;
}

.todoDeleteNote:hover {
  opacity: 1;
  transition: 0.1s;
}

.todoTemplate {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.todoBtn {
  cursor: pointer;
  width: 24px;
  margin-left: 10px;
  opacity: 0.3;
}

.active {
  opacity: 0.7;
  transition: 0.1s;
}

.active:hover {
  opacity: 1;
  transition: 0.1s;
}

.undoActive, .redoActive {
  opacity: 0.7;
  transition: 0.2s;
}

.undoActive:hover {
  opacity: 1;
  transform: rotateZ(-360deg);
  transition: 0.5s;
}

.redoActive:hover {
  opacity: 1;
  transform: rotateZ(360deg);
  transition: 0.5s;
}

.modal__buttons {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.modalBtn {
  cursor: pointer;
  padding: 4px;
  width: 64px;
}

.deleteNote {
  width: auto;
  padding: 4px;
}

.delete__modal__header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: white;
}

.deleteTheNotePrompt__nav {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.deleteNoteNavBtn {
  padding: 8px;
  width: 24px;
  cursor: pointer;
}

@media screen and (max-width: 1080px) {
  .container {
    width: 95%;
  }
}
</style>
