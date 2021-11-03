<template>
  <div class="layout_container">
    <v-navigation-drawer v-model="drawer" app color="#43425D" dark>
      <v-list dense>
        <v-list-item link @click="routerPush('event')">
          <v-list-item-action>
            <v-icon>mdi-calendar</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>My Events</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="routerPush('invited')">
          <v-list-item-action>
            <v-icon>mdi-forum</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Invited Event</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list-item link @click="signOut">
        <v-list-item-action>
          <v-icon>mdi-logout</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>logout</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>

    <v-app-bar app color="white">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" text>{{ userName }}</v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Consulting and support</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Discord community</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-app-bar>

    <v-main class="board_body_wrap">
      <router-view />
    </v-main>
  </div>
</template>

<script>
import { Auth } from "aws-amplify";
import commonMixin from "../../../mixin/commonMixin";

export default {
  data: () => ({
    drawer: null,
    userName: "",
    pageName: "",
    eventInfo: [],
    title: "MY EVENT",
  }),
  mixins: [commonMixin],
  created: async function () {
    this.userName = await this.$store.getters["commonStore/getUserName"];
  },
  methods: {
    signOut() {
      Auth.signOut()
        .then((data) => {
          console.log(data);
          this.$router.push("/");
        })
        .catch((err) => {
          console.error(err);
        });
    },
    setPageTitle(title) {
      this.title = title;
    },
    routerPush(title) {
      const self = this;
      switch (title) {
        case "home":
          self.title = "HOME";
          self.pageName = "HomeBoard";
          break;

        case "event":
          self.title = "MY EVENT";
          self.pageName = "EventBoard";
          break;

        case "invited":
          self.title = "INVITED EVENTS";
          self.pageName = "InvitedEventsPage";
          break;

        default:
          break;
      }

      this.$router.push({
        name: this.pageName,
      });
    },
    changeFooter: function () {
      this.isFooter = !this.isFooter;
    },
  },
};
</script>

<style>
.layout_container {
  width: 100%;
  height: 100%;
  background: linear-gradient(to right);
}

.fill-height {
  width: 100%;
  height: 100%;
}
.board_body_wrap {
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgb(217, 217, 241), #a7adec);
}
</style>
