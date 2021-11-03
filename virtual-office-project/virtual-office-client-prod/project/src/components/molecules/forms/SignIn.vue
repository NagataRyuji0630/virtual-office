<template>
  <div class="form_body flex_container flex_direction_column">
    <div class="loading_wrapper" v-show="isLoading"></div>

    <div
      class="title_area flex_container flex_direction_column"
      v-show="!isLoading"
    >
      <div class="main_title">VIRTUAL SQUARE</div>
      <div class="sub_title">Welcome back! Please login to your account.</div>
    </div>
    <div class="login_error_msg" v-show="authError">{{ errorMsg }}</div>
    <div
      class="sign_in_form_area flex_container flex_direction_column"
      v-show="!isLoading"
    >
      <form class="sign_in_form">
        <v-text-field
          v-model="name"
          :error-messages="nameErrors"
          label="Name"
          required
          class="form_text_area"
          @input="$v.name.$touch()"
          @blur="$v.name.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="email"
          :error-messages="emailErrors"
          label="E-mail"
          required
          class="form_text_area"
          @input="$v.email.$touch()"
          @blur="$v.email.$touch()"
        ></v-text-field>
        <v-text-field
          type="password"
          v-model="password"
          :error-messages="passwordErrors"
          label="Password"
          required
          class="form_text_area"
          @input="$v.password.$touch()"
          @blur="$v.password.$touch()"
        ></v-text-field>
        <!-- <v-checkbox v-model="checkbox" :error-messages="checkboxErrors" label="Do you agree?" required @change="$v.checkbox.$touch()" @blur="$v.checkbox.$touch()"></v-checkbox> -->
        <div class="btn_area flex_container flex_direction_row">
          <v-btn class="sign_in_btn" dark @click="signIn">Login</v-btn>
          <v-btn class="link_sign_up_btn" color="white" @click="linkSignUp"
            >Sign Up</v-btn
          >
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import { Auth } from "aws-amplify";

export default {
  mixins: [validationMixin],
  validations: {
    name: {
      required,
    },
    email: {
      required,
      email,
    },
    password: {
      required,
    },
    // checkbox: {
    //     checked(val) {
    //         return val
    //     },
    // },
  },
  data: () => ({
    name: "",
    email: "",
    password: "",
    select: null,
    isLoading: false,
    authError: false,
    errorMsg: "",
    // checkbox: false,
  }),
  methods: {
    signInParams() {
      return {
        username: this.email,
        password: this.password,
        attributes: {
          name: this.name,
        },
      };
    },
    signIn() {
      this.isLoading = true;
      this.$v.$touch();

      const self = this;
      Auth.signIn(self.signInParams())
        .then((user) => {
          self.authError = false;
          self.isLoading = false;

          this.$store.dispatch("commonStore/setUserName", user.attributes.name);
          this.$store.dispatch("commonStore/setUserId", user.attributes.sub);
          this.$store.dispatch(
            "commonStore/setUserEmail",
            user.attributes.email
          );

          this.$router.push({
            name: "DefaultLayout",
          });
        })
        .catch((err) => {
          console.error(err);
          self.errorMsg = "メールアドレスまたはパスワードをご確認ください";
          self.authError = true;
          self.isLoading = false;
        });
    },
    linkSignUp() {
      return this.$router.push("/signUp");
    },
  },
  computed: {
    // checkboxErrors() {
    //     const errors = []
    //     if (!this.$v.checkbox.$dirty) return errors
    //     !this.$v.checkbox.checked && errors.push('You must agree to continue!')
    //     return errors
    // },
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.required && errors.push("Name is required.");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.email.required && errors.push("E-mail is required");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push("Password is required");
      return errors;
    },
  },
};
</script>

<style lang="scss" scoped>
.form_body {
  width: 90%;
  height: 90%;
}

.loading_wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login_error_msg {
  color: #ff0303;
}

.signin-form {
  margin: 40px auto 0;
  width: 40vw;

  .input-area {
    line-height: 60px;
    margin: 10px 0;
  }

  .auth-button {
    font-weight: bold;
    margin-top: 20px;
    width: 40%;
  }
}

.title_area {
  width: 100%;
  height: 30%;
}

.main_title {
  text-align: center;
  font: normal normal bold 35px/21px Source Sans Pro;
  letter-spacing: 7px;
  color: #43425d;
}

.sub_title {
  text-align: center;
  font: normal normal normal 18px/13px Source Sans Pro;
  letter-spacing: 0px;
  color: #4d4f5c;
  opacity: 0.5;
  margin-top: 15px;
  margin-bottom: 15px;
}

.sign_in_form_area {
  width: 90%;
  height: 50%;
}

.sign_in_form {
  width: 100%;
  height: 100%;
}

.btn_area {
  margin-top: 30px;
}

.sign_in_btn {
  margin-right: 15px;
}

.link_sign_up_btn {
  margin-left: 15px;
}

.form_text_area {
  height: 30%;
}

@media screen and (max-width: 600px) {
  .title_area {
    height: 20%;
  }

  .login_error_msg {
    font-size: 10px;
  }

  .main_title {
    text-align: center;
    font: normal normal bold 20px Source Sans Pro;
    letter-spacing: 2px;
  }

  .sub_title {
    text-align: center;
    font: normal normal normal 10px Source Sans Pro;
    letter-spacing: 0px;
    opacity: 0.5;
    margin-top: 12px;
    margin-bottom: 12px;
  }

  .sign_in_form_area {
    height: 60%;
  }

  .btn_area {
    margin-top: 12px;
  }
}

@media screen and (min-width: 601px) and (max-width: 1024px) {
  .main_title {
    text-align: center;
    font: normal normal bold 30px Source Sans Pro;
    letter-spacing: 2px;
  }

  .login_error_msg {
    font-size: 8px;
  }

  .sub_title {
    text-align: center;
    font: normal normal normal 16px Source Sans Pro;
    letter-spacing: 0px;
    opacity: 0.5;
    margin-top: 12px;
    margin-bottom: 12px;
  }
}
</style>
