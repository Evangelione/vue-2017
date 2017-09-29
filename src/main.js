// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-my/index.css'
import App from './App'
import router from './router'

// 引入axios
// import api from './api/index.js'
import axios from 'axios'
// 绑定到vue全局使用
Vue.prototype.$axios = axios

import utils from './utils'
Vue.prototype.$utils = utils

Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
