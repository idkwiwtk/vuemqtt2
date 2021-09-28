import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import VueMqtt from 'vue-mqtt'

Vue.config.productionTip = false

var connection = {
  host: '192.168.110.2',
  port: 9001,
  endpoint: '/',
  clean: true, // Reserved session
  connectTimeout: 4000, // Time out
  reconnectPeriod: 4000, // Reconnection interval
  // Certification Information
  clientId: 'webClient1',
  username: 'webClient1',
  password: '1234',
}

const { host, port, endpoint, ...options } = connection
const connectUrl = `ws://${host}:${port}${endpoint}`

Vue.use(VueMqtt, connectUrl, options);

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
