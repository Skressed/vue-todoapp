<template>
  <div id="app">
    <pgheader/>
    <router-view v-bind:notes="notes"/>

  </div>
</template>

<script>
import Pgheader from './components/Pgheader.vue'
import mockedData from './utils/mockData.json'
import { bus } from './main'

export default {
  name: 'App',
  data () {
    return {
      defaultCards: mockedData,
      notes: [],
    }
  },
  components: {
    'pgheader': Pgheader,
  },
  created () {
    this.notes = this.pickLocalStorageData();
    bus.$on('newNote', (data) => {
      this.newNote();
    });
  },
  methods: {
    pickLocalStorageData: function() {
      if(window.localStorage.getItem('notes')==null)
      {
        window.localStorage.setItem('notes', JSON.stringify(this.defaultCards));
      }
      return JSON.parse(window.localStorage.getItem('notes'));
    },
    newNote() {
      this.notes.push({id: this.notes.length, title: 'New note', todos: [{todo_id: 0, text: 'New todo', done: 'false'}]});
      window.localStorage.setItem('notes', JSON.stringify(this.notes));
    }
  }
}
</script>

<style>

</style>
