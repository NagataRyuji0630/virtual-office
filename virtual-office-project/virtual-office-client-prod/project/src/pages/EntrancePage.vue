<template>
  <div class="container">
    <div>
      <amplify-authenticator></amplify-authenticator>
    </div>
  </div>
</template>

<script>
import { onAuthUIStateChange } from "@aws-amplify/ui-components";

export default {
  name: "AuthStateApp",
  created() {
    this.unsubscribeAuth = onAuthUIStateChange((authState, authData) => {
      console.log(authData);
      if (authState === "signedin") {
        this.$store.dispatch("commonStore/setUserName", authData.username);
        this.$store.dispatch("commonStore/setUserId", authData.attributes.sub);
        this.$store.dispatch(
          "commonStore/setUserEmail",
          authData.attributes.email
        );

        console.log("PASS");
        this.$router.push({
          name: "DefaultLayout",
        });
      }
    });
  },
  data() {
    return {
      unsubscribeAuth: undefined,
    };
  },
  beforeDestroy() {
    this.unsubscribeAuth();
  },
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
