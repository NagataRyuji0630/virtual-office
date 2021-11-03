export const state = () => ({
    newEventTitle: '',
    newEventPassword: '',
    newEventStartDate: '',
    newEventStartTime: '',
    newEventExpireDate: '',
    newEventExpireTime: '',
    newEventDescription: '',
});

export const getters = {
    getNewEventTitle: (state) => {
        return state.newEventTitle
    },
    getNewEventPassword: (state) => {
        return state.newEventPassword
    },
    getNewEventStartDate: (state) => {
        return state.newEventStartDate
    },
    getNewEventStartTime: (state) => {
        return state.newEventStartTime
    },
    getNewEventExpireDate: (state) => {
        return state.newEventExpireDate
    },
    getNewEventExpireTime: (state) => {
        return state.newEventExpireTime
    },
    getNewEventDescription: (state) => {
        return state.newEventDescription
    },
}

export const mutations = {
    setNewEventTitle: (state, payload) => {
        state.newEventTitle = payload
    },
    setNewEventPassword: (state, payload) => {
        state.newEventPassword = payload
    },
    setNewEventStartDate: (state, payload) => {
        state.newEventStartDate = payload
    },
    setNewEventStartTime: (state, payload) => {
        state.newEventStartTime = payload
    },
    setNewEventExpireDate: (state, payload) => {
        state.newEventExpireDate = payload
    },
    setNewEventExpireTime: (state, payload) => {
        state.newEventExpireTime = payload
    },
    setNewEventDescription: (state, payload) => {
        state.newEventDescription = payload
    },
}

export const actions = {
    setNewEventTitle({ commit }, payload) {
        commit('setNewEventTitle', payload)
    },
    setNewEventPassword({ commit }, payload) {
        commit('setNewEventPassword', payload)
    },
    setNewEventStartDate({ commit }, payload) {
        commit('setNewEventStartDate', payload)
    },
    setNewEventStartTime({ commit }, payload) {
        commit('setNewEventStartTime', payload)
    },
    setNewEventExpireDate({ commit }, payload) {
        commit('setNewEventExpireDate', payload)
    },
    setNewEventExpireTime({ commit }, payload) {
        commit('setNewEventExpireTime', payload)
    },
    setNewEventDescription({ commit }, payload) {
        commit('setNewEventDescription', payload)
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}