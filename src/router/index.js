import Vue from 'vue'
import Router from 'vue-router'
import Cards from '../components/Cards.vue'
import Note from '../components/Note.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Cards',
      component: Cards
    },
    { path: '/note/:id',
      name: 'Note',
      component: Note
   },
 ],
 mode: 'history',
})
