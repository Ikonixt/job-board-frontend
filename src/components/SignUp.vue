<template>
  <nav-bar :loginStatus="this.loginStatus"></nav-bar>

  <div class="successModal" v-if="popupVisible">
    <div class="successDialog">
      Successfully Registered!
      <br />
      <router-link class="loginLinkButton" to="/login">Go to Login</router-link>
      <br />
      <button class="dismissButton" @click="hidePopup">Dismiss</button>
    </div>
  </div>

  <!-- Wrapper container -->
  <div class="pageContainer">
    <h1>Sign Up</h1>
    <p id="welcomeMsg">Welcome to Jobbr!</p>

    <form @submit.prevent="submitForm">
      <!-- Display error messages if error is detected -->
      <h5 class="errorMsg" v-if="!pwdValidStatus">
        Password length must be at least 6 and please include an uppercase,
        lowercase, and a number
      </h5>
      <h5 class="errorMsg" v-if="!pwdMatchStatus">Passwords do not match</h5>
      <h5 class="errorMsg" v-if="!emailValidStatus">Invalid Email</h5>

      <p>
        <label for="name">Name/Company Name: </label>
        <br />
        <input id="name" v-model="name" required />
      </p>
      <p>
        <label for="email">Email:</label>
        <br />
        <input id="email" v-model="email" required />
      </p>
      <p>
        <label for="accountType">Account Type: </label>
        <br />
        <select id="accountType" v-model="accountType">
          <option value="user">User</option>
          <option value="employer">Employer</option>
        </select>
      </p>
      <p>
        <label for="password1">Password:</label>
        <br />
        <!-- If password error detected, outline the border in red -->
        <input
          id="password1"
          type="password"
          class="passwordFieldError"
          v-model="password1"
          v-if="!pwdValidStatus"
          required
        />
        <input
          id="password1"
          type="password"
          v-model="password1"
          v-else
          required
        />
      </p>

      <p>
        <label for="password2">Confirm password:</label>
        <br />
        <input id="password2" type="password" v-model="password2" required />
      </p>
      <button class="registerButton">Register</button>
    </form>
  </div>
</template>

<script>
import AxiosService from "../services/AxiosService.js";
import NavBar from "./NavBar.vue";
import { app } from "../main.js";

export default {
  components: {
    NavBar,
  },
  data() {
    return {
      loginStatus: app.config.globalProperties.$authenticated,
      name: "",
      email: "",
      accountType: "user",
      password1: "",
      password2: "",
      accountId: "",
      pwdValidStatus: true,
      pwdMatchStatus: true,
      emailValidStatus: true,
      popupVisible: false,
    };
  },
  methods: {
    displayPopup() {
      this.popupVisible = true;
    },
    hidePopup() {
      this.popupVisible = false;
    },
    validatePassword() {
      // Test password to display error message if requirements failed
      if (this.password1.length < 6) {
        this.pwdValidStatus = false;
        return;
      }
      if (
        /[a-z]/.test(this.password1) &&
        /[A-Z]/.test(this.password1) &&
        /\d/.test(this.password1)
      ) {
        this.pwdValidStatus = true;
      } else {
        this.pwdValidStatus = false;
        console.log("invalid password");
      }
    },
    submitForm() {
      this.emailValidStatus = true;
      this.validatePassword();
      if (this.pwdValidStatus === false) {
        return;
      }
      if (this.password1 === this.password2) {
        // If both passwords matched
        // generate a unique id for each user and create an account for them
        // If the user is a normal user, the id starts with a "U"
        // If the user is an employer, the id starts with an "E"
        this.pwdMatchStatus = true;
        if (this.accountType === "employer") {
          this.accountId = "E" + Math.floor(Math.random() * 100000).toString();
        } else {
          this.accountId = "U" + Math.floor(Math.random() * 100000).toString();
        }

        fetch(
          "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBEppB0u-nwMgK1YkTN-tPbkMxxT457JR0",
          {
            method: "POST",
            body: JSON.stringify({
              displayName: this.accountId,
              email: this.email,
              password: this.password1,
              returnSecureToken: true,
            }),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.error != null) {
              // Error detected
              console.log(data.error);
              if (data.error.message === "INVALID_EMAIL" || data.error.message === "EMAIL_EXISTS") {
                this.emailValidStatus = false;
              } else {
                // For unaccounted errors
                alert(data.error.message);
              }
            } else {
              // Create database entry for user profile
              // The database containing this entry must be writable without authentication
              // Since this is done while user is not logged not, so no tokens can be used to authenticate
              if (this.accountType === "employer") {
                // Account is an employer
                // Create an account entry for them in accounts.json
                AxiosService.createUserAccount(this.accountId, {
                  name: this.name,
                  email: this.email,
                  accountType: this.accountType,
                  accountId: this.accountId,
                });
                // Display success modal
                this.displayPopup();
              } else {
                // Account is a user
                // Create a profile entry for them in userProfiles.json
                AxiosService.updateProfile(this.accountId, {
                  userName: this.name,
                  userEmail: this.email,
                  userAddress: "",
                  userMobile: "",
                  userSite: "",
                  userAboutMe: "",
                  userInstitution: "",
                  userStudyStatus: "-",
                  userStudyField: "",
                  userAchieve: "",
                  userExperience: "",
                });

                // Create an account entry for them in accounts.json
                AxiosService.createUserAccount(this.accountId, {
                  name: this.name,
                  email: this.email,
                  accountType: this.accountType,
                  accountId: this.accountId,
                });
              }
              // Display success modal
              this.displayPopup();
            }
          })
          .catch((error) => console.log(error));
      } else {
        // If passwords do not match, display error
        this.pwdMatchStatus = false;
      }
    },
  },
};
</script>

<style>
h1 {
  font-weight: bold;
  font-size: 40px;
  margin-bottom: 0px;
  padding-bottom: 0px;
}
p {
  padding: 0px;
  margin: 0.5%;
}
.pageContainer {
  padding-top: 40px;
  padding-bottom: 110px;
  font-size: 13px;
  font-family: Helvetica;
  text-align: center;
}

.passwordFieldError {
  border-color: red;
}

.errorMsg {
  font-family: Helvetica;
  font-weight: lighter;
  margin: 0px;
  padding: 0px;
  color: red;
}

.registerButton {
  width: 150px;
  border: none;
  background-color: #4090eb;
  border-radius: 5px;
  padding: 5px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  transition-duration: 0.2s;
  color: white;
}

.registerButton:hover {
  background-color: #5ea9ff;
  color: white;
}

.loginLinkButton {
  margin-top: 5%;
  width: 100px;
  border: none;
  background-color: #4090eb;
  border-radius: 5px;
  padding: 5px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  transition-duration: 0.2s;
  color: white;
}

.loginLinkButton:hover {
  background-color: #5ea9ff;
  color: white;
}

.dismissButton {
  margin-top: 1%;
  width: 140px;
  border: none;
  background-color: #4090eb;
  border-radius: 5px;
  padding: 5px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  transition-duration: 0.2s;
  color: white;
}

.dismissButton:hover {
  background-color: #5ea9ff;
  color: white;
}

.successDialog {
  font-family: Helvetica;
  font-size: 18px;
  background: white;
  border-radius: 5px;
  border: none;
  z-index: 10;
  width: 25%;
  height: 20%;
  padding-top: 5.5%;
  text-align: center;
}

.successModal {
  /* Modified from https://www.w3schools.com/howto/howto_css_modals.asp */
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

#accountType {
  width: 145px;
}

#welcomeMsg {
  font-size: 17px;
  font-weight: lighter;
  margin-top: 0.5px;
  margin-bottom: 15px;
  padding: 0px;
}
</style>
