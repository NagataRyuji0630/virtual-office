export const commonMixin = {
    methods: {
        pushPages: function() {
            if (this.pageName) {
                this.$router.push({
                    name: this.pageName,
                });
            }
        },
        backPage: function() {
            let backPageName = this.$store.getters['commonStore/getBeforePagePath']
            console.log(this.$store.getters['commonStore/getBeforePagePath'])
            if (backPageName) {
                this.$router.push({ name: backPageName });
            }
        },
        toResult: async function() {
            this.isLoading = true;

            const expireDate = new Date(`${this.$store.getters['createEventFormStore/getNewEventExpireDate']} ${this.$store.getters['createEventFormStore/getNewEventExpireTime']}`);
            const unixTime = expireDate.getTime() / 1000;
            let payload = {
                startDate: `${this.$store.getters['createEventFormStore/getNewEventStartDate']} ${this.$store.getters['createEventFormStore/getNewEventStartTime']}`,
                expiredDate: unixTime,
                password: this.$store.getters['createEventFormStore/getNewEventPassword'],
                title: this.$store.getters['createEventFormStore/getNewEventTitle'],
                userId: this.$store.getters['commonStore/getUserId'],
                event_description: this.$store.getters['createEventFormStore/getNewEventDescription']
            };
            let result;
            try {
                result = await this.axiosService(payload, "register-meeting");
                this.$store.dispatch("commonStore/setEventInfo", [result.data]);
                this.isLoading = false;
                return this.$router.push({
                    name: "EventListPage",
                });
            } catch (error) {
                this.isLoading = false;
                console.log(error);
            }
        },
    },
}

export default commonMixin;