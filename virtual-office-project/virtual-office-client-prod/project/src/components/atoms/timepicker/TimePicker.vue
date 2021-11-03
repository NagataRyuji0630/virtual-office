<template>
  <v-menu v-model="menu" offset-y :close-on-content-click="false">
    <template v-slot:activator="{ on }">
      <v-btn icon color="primary" dark elevation="0" v-on="on">
        <v-icon>mdi-clock-time-four-outline</v-icon>
      </v-btn>
    </template>
    <v-time-picker
      v-model="time"
      format="24hr"
      @click="menu = false"
    ></v-time-picker>
  </v-menu>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      //   default: new Date().toISOString().substr(0, 10),
    },
  },
  data() {
    return {
      menu: false,
    };
  },
  computed: {
    time: {
      get() {
        return this.value;
      },
      set(val) {
        console.log(val);
        this.menu = false;
        this.$emit("input", val);
      },
    },
  },
};
</script>