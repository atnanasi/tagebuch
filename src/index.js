import Raven from 'raven-js'
import RavenVuePlugin from 'raven-js/plugins/vue'

import axios from 'axios'
import firebase from '~/firebase'

import Vue from 'vue'
import VueRouter from 'vue-router'
import VueAsyncComputed from 'vue-async-computed'

import '@ajusa/lit/dist/lit.css'
import '~/index.css'

import config from './config'
import App from '~/App.vue'

import NotFound from '~/views/NotFound.vue'
import Index from '~/views/Index.vue'
import Post from '~/views/Post.vue'

const Editor = () => import('~/views/Editor.vue')

Raven
  .config(config.SENTRY_DSN)
  .addPlugin(RavenVuePlugin, Vue)
  .setTagsContext({
    environment: config.ENV
  })
  .install()

async function index () {
  document.title = config.TITLE

  const { data: firebaseAppConfig } = await axios.get('/__/firebase/init.json')
  firebase.initializeApp(firebaseAppConfig)

  Vue.use(VueAsyncComputed)
  Vue.use(VueRouter)

  const router = new VueRouter({
    // HTML5 History Mode
    mode: 'history',
    routes: [
      {
        path: '/',
        component: Index
      },
      {
        path: '/editor',
        component: Editor
      },
      {
        path: '/posts/:id',
        component: Post
      },
      {
        path: '/*',
        component: NotFound
      }
    ]
  })

  /* eslint-disable no-new */
  new Vue({
    el: document.getElementById('root'),
    render: h => h(App),
    router
  })
  /* eslint-enable no-new */
}

index().catch(Raven.captureException.bind(Raven))
