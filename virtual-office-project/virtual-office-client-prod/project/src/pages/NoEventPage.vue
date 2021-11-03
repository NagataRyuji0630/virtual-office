<template>
  <div class="no_event_page_body flex_box direction_column">
    <div class="main_msg_area">
      <div class="main_msg">You haven't created any events yet...</div>
    </div>
    <div class="sub_msg_area">
      <div class="sub_msg">
        While you're waiting why not create one of your own?
      </div>
    </div>
    <div class="btn_area">
      <VuetifyBtn
        btnTitle="Create My First Event!"
        btnColor="#1F9B32"
        pageName="CreateEventPage"
        :isDark="true"
        action="pushPages"
      />
    </div>
  </div>
</template>

<script>
import VuetifyBtn from "../components/atoms/btns/VuetifyBtn";
export default {
  name: "NoEventPage",
  props: {},
  data: () => ({}),
  components: {
    VuetifyBtn,
  },
  created: function () {},
  methods: {},
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
.no_event_page_body {
  width: 100%;
  height: 100%;
}

.main_msg_area {
  margin-bottom: 15px;
}

.main_msg {
  font-size: 30px;
}

.sub_msg_area {
  margin: 15px 0px;
}

.sub_msg {
  color: gray;
}

.btn_area {
  margin: 15px 0px;
}

@media screen and (max-width: 600px) {
  .not_found_form_body {
    width: 80%;
    height: 50%;
  }
  .main_msg {
    font-size: 14px;
  }
  .sub_msg {
    font-size: 10px;
  }
}

@media screen and (min-width: 601px) and (max-width: 1024px) {
  .main_msg {
    font-size: 24px;
  }
  .sub_msg {
    font-size: 14px;
  }
}
</style>
