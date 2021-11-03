<template>
  <div class="flex_box direction_column create_event_form_container">
    <!-- <v-radio-group v-model="radioGroup" :row="true">
      <v-radio
        v-for="n in 2"
        :key="n"
        :label="eventKind[n - 1]"
        :value="n"
        color="#147623"
      ></v-radio>
    </v-radio-group> -->

    <div class="input_text_box">
      <v-text-field
        class="text_field"
        v-model="eventTitle"
        label="イベント名"
        filled
      >
      </v-text-field>
    </div>

    <div class="input_text_box">
      <v-text-field
        class="text_field"
        v-model="password"
        label="パスワード"
        filled
      ></v-text-field>
    </div>

    <div class="time_input_box">
      <div class="input_text_small_box">
        <v-text-field v-model="startDate" label="開始日を選択" readonly>
          <template v-slot:append-outer>
            <date-picker v-model="startDate" :minDate="today"></date-picker>
          </template>
        </v-text-field>
      </div>
      <div class="input_text_small_box">
        <v-text-field v-model="startTime" label="開始時間を選択" readonly>
          <template v-slot:append-outer>
            <TimePicker v-model="startTime"></TimePicker>
          </template>
        </v-text-field>
      </div>
    </div>

    <div class="time_input_box">
      <div class="input_text_small_box">
        <v-text-field v-model="expireDate" label="終了日を選択" readonly>
          <template v-slot:append-outer>
            <date-picker v-model="expireDate" :minDate="today"></date-picker>
          </template>
        </v-text-field>
      </div>
      <div class="input_text_small_box">
        <v-text-field v-model="expireTime" label="終了時間を選択" readonly>
          <template v-slot:append-outer>
            <TimePicker v-model="expireTime"></TimePicker>
          </template>
        </v-text-field>
      </div>
    </div>

    <div class="input_text_box">
      <v-textarea
        filled
        name="input-7-4"
        v-model="eventDescription"
        label="イベント概要"
      ></v-textarea>
    </div>
  </div>
</template>

<script>
import DatePicker from "../../atoms/datepicker/DatePicker";
import TimePicker from "../../atoms/timepicker/TimePicker";

export default {
  name: "CreateEventForm",
  components: {
    DatePicker,
    TimePicker,
  },
  props: {},
  data: () => ({
    radioGroup: 1,
    eventKind: ["Public Event", "Private Event"],
    eventTitle: "",
    password: "",
    startDate: "",
    startTime: "",
    expireDate: "",
    expireTime: "",
    eventDescription: "",
    today: null,
    nextDay: null,
    time: null,
    time2: null,
    menu2: false,
    menu3: false,
  }),
  created() {
    let day = new Date();
    this.today = day.toISOString().substr(0, 10);
    day.setDate(day.getDate() + 1);
    this.nextDay = day.toISOString().substr(0, 10);
  },
  watch: {
    eventTitle: function (value) {
      this.$store.dispatch("createEventFormStore/setNewEventTitle", value);
    },
    password: function (value) {
      this.$store.dispatch("createEventFormStore/setNewEventPassword", value);
    },
    startDate: function (value) {
      this.$store.dispatch("createEventFormStore/setNewEventStartDate", value);
    },
    startTime: function (value) {
      this.$store.dispatch("createEventFormStore/setNewEventStartTime", value);
    },
    expireDate: function (value) {
      this.$store.dispatch("createEventFormStore/setNewEventExpireDate", value);
    },
    expireTime: function (value) {
      this.$store.dispatch("createEventFormStore/setNewEventExpireTime", value);
    },
    eventDescription: function (value) {
      this.$store.dispatch(
        "createEventFormStore/setNewEventDescription",
        value
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.create_event_form_container {
  width: 100%;
  height: 100%;
  background: #ffffff 0% 0% no-repeat padding-box;
}

.input_text_box {
  padding: 0 30px;
  width: 100%;
}

.text_field {
  width: 100%;
}

.time_input_box {
  width: 100%;
  padding: 0 30px;
  display: flex;
  flex-direction: row;
}

.input_text_small_box {
  width: 50%;
}

.small_text_field {
  width: 200px;
}

@media screen and (max-width: 600px) {
}

@media screen and (min-width: 601px) and (max-width: 1024px) {
}
</style>
