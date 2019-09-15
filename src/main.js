import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

Vue.use(ElementUI);

const app = new Vue({
  ...App
})
app.$mount()
