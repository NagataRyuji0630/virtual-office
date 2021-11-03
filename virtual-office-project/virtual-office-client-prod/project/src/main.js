import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VModal from 'vue-js-modal'
import Vue2Editor from "vue2-editor"
import Amplify from "aws-amplify"
import config from './aws-exports'
import './css/la-line-scale.css'
import './css/ball-grid-pulse.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import "@aws-amplify/ui-vue";
// import style (>= Swiper 6.x)
// import 'swiper/swiper-bundle.css'

// import style (<= Swiper 5.x)
import 'swiper/css/swiper.css'

Vue.use(VModal)
Vue.use(Vue2Editor);
Vue.use(VueAwesomeSwiper, {})

Vue.config.productionTip = false
Vue.config.errorHandler = function (error) {
    if (error.name === 'NavigationDuplicated') {
        // routerで遷移する時、同じページに遷移しようとすると起こるエラーを回避
        return
    }
}
Amplify.configure(config)

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')