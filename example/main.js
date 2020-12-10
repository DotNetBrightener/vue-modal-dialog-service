import Vue from 'vue';
import ModalDialogPlugin from '../src';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(ModalDialogPlugin);

new Vue({
  render: h => h(App)
}).$mount('#app')
