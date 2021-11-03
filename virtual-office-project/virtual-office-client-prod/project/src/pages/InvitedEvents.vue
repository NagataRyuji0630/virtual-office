<template>
  <div class="event_list_page_body flex_box direction_column">
    <div class="event_list_area flex_box direction_row flex_wrap">
      <v-card
        class="event_card"
        max-width="300"
        :hover="true"
        v-for="(event, index) in getInvitedEvents()"
        :key="event.event_id"
      >
        <v-img
          src="https://picsum.photos/1920/1080?random"
          height="200px"
        ></v-img>

        <v-card-title> {{ event.title }} </v-card-title>

        <v-card-subtitle> {{ event.office_id }} </v-card-subtitle>

        <v-card-actions>
          <v-btn color="orange lighten-2" text @click="pushOffice(index)">
            Join
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "EventListPage",
  props: {},
  data: () => ({
    eventInfo: null,
  }),
  methods: {
    getInvitedEvents: function () {
      this.eventInfo = this.$store.getters["commonStore/getInvitedEventInfo"];
      return this.eventInfo;
    },
    pushOffice: async function (index) {
      this.$router.push({
        name: "SharedOfficePage",
        params: {
          meetingId: this.eventInfo[index].event_id,
          index: index,
          isShared: true,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
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

.flex_wrap {
  flex-wrap: wrap;
}

.event_list_page_body {
  width: 100%;
  height: 100%;
}

.btn_area {
  width: 100%;
  height: 10%;
}

.create_event_btn {
  padding: 15px 0 0 15px;
}

.event_list_area {
  width: 100%;
  height: 90%;
}

.event_card {
  margin: 10px;
}

.share_event_form {
  width: 100%;
  height: 150px;
  background-color: white;
  padding: 15px;
}

@media screen and (max-width: 600px) {
}

@media screen and (min-width: 601px) and (max-width: 1024px) {
}
</style>
