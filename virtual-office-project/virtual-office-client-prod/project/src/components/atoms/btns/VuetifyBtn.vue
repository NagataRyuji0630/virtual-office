<template>
  <div>
    <v-btn
      class="vuetify_simple_btn"
      :color="this.btnColor"
      :dark="this.isDark"
      @click="doBtnAction"
      :loading="this.isLoading"
    >
      {{ btnTitle }}
    </v-btn>
  </div>
</template>

<script>
import commonMixin from "../../../mixin/commonMixin";
import btnActionMixin from "../../../mixin/btnActionMixin";

export default {
  name: "VuetifyBtn",
  props: {
    btnTitle: String,
    btnColor: String,
    isBlock: Boolean,
    isDark: Boolean,
    isDepressed: Boolean,
    isDisabled: Boolean,
    width: String,
    height: String,
    maxHeight: String,
    maxWidth: String,
    minWidth: String,
    minHeight: String,
    pageName: String,
    action: String,
    isLoading: Boolean,
  },
  data: () => ({}),
  created: function () {},
  methods: {
    doBtnAction: function () {
      switch (this.action) {
        case "pushPages":
          this.pushPages();
          break;
        case "backPage":
          this.backPage();
          break;
        case "toResult":
          this.toResult();
          break;
        default:
          return;
      }
    },
  },
  mixins: [commonMixin, btnActionMixin],
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 600px) {
  .vuetify_simple_btn {
    font-size: 10px;
    width: 180px;
  }
}

@media screen and (min-width: 601px) and (max-width: 1024px) {
}
</style>
