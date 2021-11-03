<template>
  <div class="chat_main_container flex_box">
    <router-view />
  </div>
</template>

<script>
import commonMixin from "../../../mixin/commonMixin";
export default {
  name: "EventBoard",
  data() {
    return {
      // dialog: false,
      // isScheduleOpen: false,
      // isJoinOpen: false,
      eventInfo: null,
    };
  },
  mixins: [commonMixin],
  components: {},
  created: async function () {
    if (this.$store.getters["commonStore/getEventInfo"].length === 0) {
      await this.getEventInfo();

      let self = this;
      if (this.eventInfo.length !== 0) {
        await self.$store.dispatch("commonStore/setEventInfo", this.eventInfo);
        return self.$router.push({
          name: "EventListPage",
        });
      } else {
        return this.$router.push({
          name: "NoEventPage",
        });
      }
    }

    return this.$router.push({
      name: "EventListPage",
    });
  },
  methods: {
    getEventInfo: async function () {
      let payload = {
        userId: this.$store.getters["commonStore/getUserId"],
      };

      try {
        let result = await this.axiosService(payload, "scan-meeting");
        this.eventInfo = result.data.Items;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style>
.flex_box {
  display: flex;
  justify-content: center;
  align-items: center;
}

.direction_row {
  flex-direction: row;
}

.direction_column {
  flex-direction: column;
}

.chat_main_container {
  width: 100%;
  height: 100%;
}

.card_container {
  width: 50%;
  height: 100%;
}

.card_wrap {
  width: 100%;
  height: 40%;
}

.btn {
  box-shadow: 6px 6px 10px #000000a3;
  border-radius: 35px;
}

.card_title {
  text-align: center;
}

.meeting_list_container {
  width: 50%;
  height: 100%;
}
</style>