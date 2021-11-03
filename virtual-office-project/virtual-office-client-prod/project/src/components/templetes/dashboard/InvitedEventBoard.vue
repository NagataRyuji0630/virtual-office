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
      invitedEventInfo: null,
    };
  },
  mixins: [commonMixin],
  components: {},
  created: async function () {
    try {
      await this.getInvitedEvents();
    } catch (error) {
      console.log(error);
    }

    //ページ遷移判定
    let newEventLength = this.invitedEventInfo.length;
    let eventLength = this.$store.getters["commonStore/getInvitedEventInfo"]
      .length;

    if (eventLength === 0 && newEventLength === 0) {
      // 招待イベント無しページに遷移
      return;
    } else if (newEventLength !== 0) {
      // 差分反映のロジックを記述
      await this.$store.dispatch(
        "commonStore/setInvitedEventInfo",
        this.invitedEventInfo
      );

      this.updateCheckStatus();

      return this.$router.push({
        name: "InvitedEventsPage",
      });
    } else if (eventLength !== 0 && newEventLength === 0) {
      return this.$router.push({
        name: "InvitedEventsPage",
      });
    }
  },
  methods: {
    getInvitedEvents: async function () {
      let isScanned = this.$store.getters["commonStore/getScanned"];
      let myEmail = this.$store.getters["commonStore/getUserEmail"];
      let params = {
        invite_email: myEmail,
      };

      if (isScanned) {
        params.scannedOnce = true;
      } else {
        await this.$store.dispatch("commonStore/setScanned", true);
      }

      let result;
      try {
        result = await this.axiosService(params, "get-invited-event");
        this.invitedEventInfo = result.data.Items;
      } catch (error) {
        console.log(error);
      }
    },
    updateCheckStatus: async function () {
      let checkedEvent = [];
      let keys;
      // TO DO: 取得したデータのcheckedを更新
      this.invitedEventInfo.forEach((eventInfo) => {
        console.log(eventInfo);
        keys = {
          invited_email: eventInfo.invite_email,
          start_date: eventInfo.start_date,
          expired_date: eventInfo.expired_date,
          office_id: eventInfo.office_id,
          password: eventInfo.password,
          title: eventInfo.title,
          from: eventInfo.from,
        };

        checkedEvent.push(keys);
      });

      let params = { keys: checkedEvent };

      let result;
      try {
        result = await this.axiosService(params, "update-check-status");
        console.log(result);
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