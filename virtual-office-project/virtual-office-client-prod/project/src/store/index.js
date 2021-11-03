import Vue from 'vue'
import Vuex from 'vuex'

import commonStore from './modules/common'
import createEventFormStore from './modules/createEventForm'
import mapStore from './modules/map'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        commonStore,
        createEventFormStore,
        mapStore
    }
})