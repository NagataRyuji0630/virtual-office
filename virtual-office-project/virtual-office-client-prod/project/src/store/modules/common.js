export const state = () => ({
    userName: '',
    userId: '',
    userEmail: '',
    eventInfo: [],
    invitedEventInfo: [],
    nowPagePath: '',
    beforePagePath: '',
    scanned: false,
});

export const getters = {
    getUserName: (state) => {
        return state.userName
    },
    getUserId: (state) => {
        return state.userId
    },
    getUserEmail: (state) => {
        return state.userEmail
    },
    getEventInfo: (state) => {
        return state.eventInfo
    },
    getInvitedEventInfo: (state) => {
        return state.invitedEventInfo
    },
    getNowPagePath: (state) => {
        return state.nowPagePath
    },
    getBeforePagePath: (state) => {
        return state.beforePagePath
    },
    getScanned: (state) => {
        return state.scanned
    },
}

export const mutations = {
    setUserName: (state, payload) => {
        state.userName = payload
    },
    setUserId: (state, payload) => {
        state.userId = payload
    },
    setUserEmail: (state, payload) => {
        state.userEmail = payload
    },
    setEventInfo: (state, payload) => {
        state.eventInfo = state.eventInfo.concat(payload)
    },
    setInvitedEventInfo: (state, payload) => {
        state.invitedEventInfo = state.invitedEventInfo.concat(payload)
    },
    setNowPagePath: (state, payload) => {
        state.nowPagePath = payload
    },
    setBeforePagePath: (state, payload) => {
        state.beforePagePath = payload
    },
    setScanned: (state, payload) => {
        state.scanned = payload
    },
}

export const actions = {
    setUserName({ commit }, payload) {
        commit('setUserName', payload)
    },
    setUserId({ commit }, payload) {
        commit('setUserId', payload)
    },
    setUserEmail({ commit }, payload) {
        commit('setUserEmail', payload)
    },
    setEventInfo({ commit }, payload) {
        commit('setEventInfo', payload)
    },
    setInvitedEventInfo({ commit }, payload) {
        commit('setInvitedEventInfo', payload)
    },
    setNowPagePath({ commit }, payload) {
        commit('setNowPagePath', payload)
    },
    setBeforePagePath({ commit }, payload) {
        commit('setBeforePagePath', payload)
    },
    setScanned({ commit }, payload) {
        commit('setScanned', payload)
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}