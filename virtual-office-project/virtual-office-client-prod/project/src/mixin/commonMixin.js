import axios from 'axios';

export const commonMixin = {
    data() {
        return {
            apiURL: "https://yubmc31dsb.execute-api.ap-northeast-1.amazonaws.com/prod/",
            prevPageName: '',
        }
    },
    methods: {
        axiosService: async function(data, uri) {
            const axiosConfig = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            let payload = data;

            try {
                let response = await axios.post(
                    this.apiURL + uri,
                    JSON.stringify(payload),
                    axiosConfig
                );
                return response;
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    watch: {
        prevPageName: function(value) {
            this.$store.dispatch("commonStore/setBeforePagePath", value)
        }
    },
}

export default commonMixin;