export const state = () => ({
    officeMapId: "",
    mapData: null
});

export const getters = {
    getOfficeMapId: (state) => {
        return state.officeMapId
    },
    getMapData: (state) => {
        return state.mapData
    }
}

export const mutations = {
    setOfficeMapId: (state, payload) => {
        state.officeMapId = payload
    },
    setMapData: (state, payload) => {
        state.mapData = payload
    }
}

export const actions = {
    setOfficeMapId({ commit }, payload) {
        commit('setOfficeMapId', payload)
    },
    setMapData({ commit }, payload) {
        commit('setMapData', payload)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}