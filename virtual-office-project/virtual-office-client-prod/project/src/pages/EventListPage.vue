<template>
  <div class="event_list_page_body flex_box direction_column">
    <v-dialog v-model="isShareDialogOpened" width="500">
      <div class="share_event_form">
        <validation-observer ref="observer" v-slot="{ invalid }">
          <form @submit.prevent="submit" background-color="white">
            <validation-provider v-slot="{ errors }" name="email" rules="email">
              <v-text-field
                v-model="email"
                :error-messages="errors"
                label="E-mail"
                required
              ></v-text-field>
            </validation-provider>
            <v-btn
              class="mr-4"
              type="submit"
              :disabled="invalid"
              @click="shareEvent()"
            >
              招待
            </v-btn>
            <v-btn @click="clear"> クリア </v-btn>
          </form>
        </validation-observer>
      </div>
    </v-dialog>

    <v-dialog v-model="isSharing" persistent class="loading_dialog" width="60%">
      <div class="flex_box loading_dialog_content">
        <div style="color: #64d6e2" class="la-line-scale la-2x">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <!-- configuration dialogs -->
        <div class="connectiong_msg">イベントを共有中です...</div>
      </div>
    </v-dialog>

    <div class="btn_area">
      <VuetifyBtn
        btnTitle="Create New Event"
        btnColor="#1F9B32"
        pageName="CreateEventPage"
        :isDark="true"
        action="pushPages"
        class="create_event_btn"
      />
    </div>

    <div class="event_list_area flex_box direction_row flex_wrap">
      <v-card
        class="event_card"
        max-width="300"
        :hover="true"
        v-for="(event, index) in getEventList()"
        :key="event.office_id"
      >
        <v-img src="https://picsum.photos/1920/1080?random" height="200px">
          <v-app-bar flat color="rgba(0, 0, 0, 0)">
            <v-spacer></v-spacer>
            <v-menu left bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" color="white">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item
                  @click="showShareDialog(event.title, event.office_id, index)"
                >
                  <v-list-item-title>Share</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-app-bar>
        </v-img>

        <v-card-title> {{ event.title }} </v-card-title>

        <v-card-subtitle>
          <div>
            {{ event.office_id }}
          </div>
          <div>
            {{ event.event_description }}
          </div>
        </v-card-subtitle>

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
import VuetifyBtn from "../components/atoms/btns/VuetifyBtn";
import { email } from "vee-validate/dist/rules";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from "vee-validate";
import commonMixin from "../mixin/commonMixin";

setInteractionMode("eager");
extend("email", {
  ...email,
  message: "Email must be valid",
});

export default {
  name: "EventListPage",
  props: {},
  data: () => ({
    eventInfo: null,
    isShareDialogOpened: false,
    isSharing: false,
    email: "",
    shareEventTitle: "",
    shareOfficeId: "",
    sharePassword: "",
    shareStartDate: "",
    shareExpireDate: "",
    inviteEmail: "",
  }),
  mixins: [commonMixin],
  components: {
    VuetifyBtn,
    ValidationProvider,
    ValidationObserver,
  },
  methods: {
    getEventList: function () {
      this.eventInfo = this.$store.getters["commonStore/getEventInfo"];
      return this.eventInfo;
    },
    pushOffice: async function (index) {
      this.$router.push({
        name: "OfficePage",
        params: {
          index: index,
        },
      });
    },
    showShareDialog: function (title, officeId, index) {
      this.shareEventTitle = title;
      this.shareOfficeId = officeId;
      this.sharePassword = this.$store.getters["commonStore/getEventInfo"][
        index
      ].password;
      this.shareStartDate = this.$store.getters["commonStore/getEventInfo"][
        index
      ].start_date;
      this.shareExpireDate = this.$store.getters["commonStore/getEventInfo"][
        index
      ].expired_date;

      this.isShareDialogOpened = true;
    },
    submit() {
      this.$refs.observer.validate();
    },
    clear() {
      this.email = "";
      this.$refs.observer.reset();
    },
    shareEvent() {
      this.isShareDialogOpened = false;
      this.isSharing = true;
      let param = {
        inviteEmail: this.email,
        startDate: this.shareStartDate,
        expireDate: this.shareExpireDate,
        officeId: this.shareOfficeId,
        password: this.sharePassword,
        title: this.shareEventTitle,
        fromEmail: this.$store.getters["commonStore/getUserEmail"],
      };

      this.axiosService(param, "register-invitation");

      this.isSharing = false;
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

.loading_dialog {
  height: 500px;
}

.loading_dialog_content {
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 500px;
  background-color: white;
}

.connectiong_msg {
  font-size: 24px;
  font-family: system-ui;
  font-weight: bold;
  line-height: 36px;
  margin-top: 30px;
  color: #1a94b1;
  text-align: center;
}

@media screen and (max-width: 600px) {
}

@media screen and (min-width: 601px) and (max-width: 1024px) {
}
</style>
