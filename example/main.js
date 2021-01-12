import Vue from 'vue';
import App from './app.vue';

// 开启debug模式
Vue.config.debug = true;

new Vue({
    render: h => h(App)
}).$mount('#app');