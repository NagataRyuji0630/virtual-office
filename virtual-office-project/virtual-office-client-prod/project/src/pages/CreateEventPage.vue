<template>
  <div class="create_form_layout_container flex_box direction_row">
    <div class="form_container flex_box direction_row">
      <!-- <div class="create_progress_box"> -->
      <!-- <div class="humburger_menu_box flex_box"><HumburgerMenu /></div> -->
      <!-- </div> -->
      <div class="create_event_form_body">
        <div class="create_event_form"><CreateEventForm /></div>
        <div class="form_footer">
          <div class="flex_box direction_row create_event_form_btn_container">
            <VuetifyBtn
              btnTitle="Back"
              btnColor="red"
              :isDark="true"
              action="backPage"
            />
            <VuetifyBtn
              btnTitle="Next"
              btnColor="#1F9B32"
              :isDark="true"
              :isLoading="false"
              action="toResult"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="card_container"> -->
    <!-- Event Card -->
    <!-- </div> -->
  </div>
</template>

<script>
// import HumburgerMenu from "../components/organisms/menu/HamburgerMenu";
import CreateEventForm from "../components/molecules/forms/CreateEventForm";
import VuetifyBtn from "../components/atoms/btns/VuetifyBtn";

export default {
  name: "CreateEventFormLayout",
  props: {},
  data: () => ({
    radioGroup: 1,
    eventKind: ["Public Event", "Private Event"],
    eventTitle: "",
    eventTagline: "",
    startTime: "",
    endTime: "",
    eventDescription: "",
    dialog: true,
  }),
  components: {
    // HumburgerMenu,
    CreateEventForm,
    VuetifyBtn,
  },
  created: function () {},
  methods: {},
};
</script>

<style lang="scss">
.flex_box {
  display: flex;
}

.humburger_menu_box {
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background: #ffffff 0% 0% no-repeat padding-box;
}

.direction_row {
  flex-direction: row;
}

.direction_column {
  flex-direction: column;
}

.create_form_layout_container {
  width: 100%;
  height: 100%;
}

.form_container {
  width: 70%;
  height: 100%;
}

.card_container {
  width: 30%;
  height: 100%;
}

.create_progress_box {
  width: 30%;
  height: 100%;
  border-right: 1px solid;
  z-index: 1;
}

.create_event_form_body {
  width: 70%;
  height: 70%;
  z-index: 1;
}

.create_event_form {
  width: 100%;
  height: 100%;
  z-index: 1;
  background: #ffffff 0% 0% no-repeat padding-box;
}

.input_text_box {
  padding: 0 30px;
  width: 100%;
}

.text_field {
  width: 400px;
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

.form_footer {
  width: 100%;
  height: 10%;
  z-index: 999;
}

.create_event_form_btn_container {
  width: 100%;
  height: 100%;
  justify-content: space-between;
  background: #ffffff 0% 0% no-repeat padding-box;
  padding: 0 30px;
  border-top: 1px solid;
}

@media screen and (max-width: 600px) {
}

@media screen and (min-width: 601px) and (max-width: 1024px) {
}
</style>
