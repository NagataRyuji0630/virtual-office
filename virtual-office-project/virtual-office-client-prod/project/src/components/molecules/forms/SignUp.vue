<template>
  <div class="form_body flex_container flex_direction_column">
    <div class="title_area flex_container flex_direction_column">
      <div class="main_title">VIRTUAL SQUARE</div>
      <div class="sub_title">Welcome back! Please login to your account.</div>
    </div>
    <div class="sign_up_error_msg" v-show="signUpError">{{ errorMsg }}</div>
    <div class="sign_up_form_area flex_container flex_direction_column">
      <form class="sign_up_form" v-show="signupForm">
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
          class="form_text_area"
          label="E-mail"
          required
          @input="$v.email.$touch()"
          @blur="$v.email.$touch()"
        ></v-text-field>
        <v-text-field
          type="password"
          v-model="password"
          :error-messages="passwordErrors"
          class="form_text_area"
          label="Password"
          required
          @input="$v.password.$touch()"
          @blur="$v.password.$touch()"
        ></v-text-field>
        <v-text-field
          type="password"
          v-model="confirmPassword"
          :error-messages="confirmPasswordErrors"
          class="form_text_area"
          label="Confirm Password"
          required
          @input="$v.confirmPassword.$touch()"
          @blur="$v.confirmPassword.$touch()"
        ></v-text-field>
        <!-- <v-checkbox v-model="checkbox" :error-messages="checkboxErrors" label="Do you agree?" required @change="$v.checkbox.$touch()" @blur="$v.checkbox.$touch()"></v-checkbox> -->
        <div class="btn_area flex_container flex_direction_row">
          <v-btn class="sign_up_btn" dark @click="signUp">Sign Up</v-btn>
        </div>
      </form>
      <form class="sign_up_form" v-show="!signupForm">
        <!-- <v-text-field v-model="name" :error-messages="nameErrors" label="Name" required @input="$v.name.$touch()" @blur="$v.name.$touch()"></v-text-field> -->
        <v-text-field
          v-model="email"
          :error-messages="emailErrors"
          label="E-mail"
          required
          @input="$v.email.$touch()"
          @blur="$v.email.$touch()"
        ></v-text-field>
        <v-text-field
          type="password"
          v-model="verifyCode"
          :error-messages="verifyCodeErrors"
          label="verifyCode"
          required
          @input="$v.verifyCode.$touch()"
          @blur="$v.verifyCode.$touch()"
        ></v-text-field>
        <!-- <v-checkbox v-model="checkbox" :error-messages="checkboxErrors" label="Do you agree?" required @change="$v.checkbox.$touch()" @blur="$v.checkbox.$touch()"></v-checkbox> -->
        <div class="btn_area flex_container flex_direction_row">
          <v-btn class="sign_up_btn" dark @click="userVerify">Activate</v-btn>
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
    confirmPassword: {
      required,
    },
    verifyCode: {
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
    confirmPassword: "",
    signupForm: true,
    verifyCode: "",
    signUpError: false,
    errorMsg: "",
    // checkbox: false,
  }),
  methods: {
    signUpParams() {
      return {
        username: this.email,
        password: this.password,
        attributes: {
          name: this.name,
        },
      };
    },
    signUp() {
      this.$v.$touch();

      const self = this;
      Auth.signUp(self.signUpParams())
        .then((user) => {
          self.signUpError = false;
          self.signupForm = false;
        })
        .catch((err) => {
          console.error(err);
          self.signUpError = true;

          let errorType = err.code;
          switch (errorType) {
            case "UsernameExistsException":
              self.errorMsg = "既に存在するユーザーです";
              break;
            case "InvalidParameterException":
              self.errorMsg =
                "ユーザー名、メールアドレス、パスワードを確認してください";
              break;
            default:
              break;
          }
        });
    },
    userVerify() {
      const self = this;
      Auth.confirmSignUp(self.email, self.verifyCode)
        .then((data) => {
          alert("登録完了しました");
          return self.$router.push("/signIn");
        })
        .catch((err) => {
          console.error(err);

          self.signUpError = true;

          let errorType = err.code;
          switch (errorType) {
            case "CodeMismatchException":
              self.errorMsg = "認証コードに誤りがあります";
              break;
            case "UserNotFoundException":
              self.errorMsg = "メールアドレスに誤りがあります";
              break;
            default:
              break;
          }
        });
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
    confirmPasswordErrors() {
      const errors = [];
      if (!this.$v.confirmPassword.$dirty) return errors;
      !this.$v.confirmPassword.required && errors.push("Password is required");
      return errors;
    },
    verifyCodeErrors() {
      const errors = [];
      if (!this.$v.verifyCode.$dirty) return errors;
      !this.$v.verifyCode.required && errors.push("verifyCode is required");
      return errors;
    },
  },
};
</script>

<style lang="scss" scoped>
.form_body {
  width: 100%;
  height: 90%;
  align-self: center;
}

.sign_up_error_msg {
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
  text-align: left;
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

.sign_up_form_area {
  width: 90%;
  height: 60%;
}

.sign_up_form {
  width: 100%;
  height: 90%;
}

.btn_area {
  margin-top: 30px;
}

.sign_up_btn {
  margin-right: 15px;
}

.link_sign_up_btn {
  margin-left: 15px;
}

.form_text_area {
  height: 20%;
}

@media screen and (max-width: 600px) {
  .form_body {
    align-content: flex-start;
  }

  .sign_up_error_msg {
    font-size: 10px;
  }

  .title_area {
    height: 20%;
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

  .sign_up_form_area {
    height: 60%;
  }

  .btn_area {
    margin-top: 25px;
  }

  .form_text_area {
    height: 22%;
  }
}

@media screen and (min-width: 601px) and (max-width: 1024px) {
  .form_body {
    align-content: flex-start;
  }

  .sign_up_error_msg {
    font-size: 12px;
  }

  .main_title {
    text-align: center;
    font: normal normal bold 30px Source Sans Pro;
    letter-spacing: 2px;
  }

  .sub_title {
    text-align: center;
    font: normal normal normal 16px Source Sans Pro;
    letter-spacing: 0px;
    opacity: 0.5;
    margin-top: 12px;
    margin-bottom: 12px;
  }

  .form_text_area {
    height: 25%;
  }
}
</style>
