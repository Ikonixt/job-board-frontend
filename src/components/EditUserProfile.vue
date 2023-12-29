<template>
  <nav-bar :loginStatus="this.loginStatus"></nav-bar>
  <form class="inputForms" @submit.prevent="submitEdit">

    <div class="unchangedInfo">
      <h3>{{ userName }}</h3>
    </div>

    <div class="basicInfo">
      <div class="aboutMeDetail">
        <h3>Basic Information</h3>
        <!-- Autofill basic information from registration -->
        <!-- No need to require all input, users are free to edit however they see fit -->
        <!-- Some fields such as email, and mobile number are validated -->
        <p>
          <label for="userEmail">Email: </label>
          <input id="userEmail" v-model="userEmail" disabled="disabled" />
        </p>
        <p>
          <label for="userAddress">Address: </label>
          <br />
          <textarea id="userAddress" v-model="userAddress"></textarea>
        </p>
        <p>
          <label for="userMobile">Mobile: </label>
          <input
            id="userMobile"
            type="tel"
            v-model="userMobile"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            placeholder="091-234-5678"
          />
        </p>
        <p>
          <label for="userSite">Site: </label>
          <input id="userSite" type="url" v-model="userSite" />
        </p>
      </div>
    </div>

    <div class="aboutMe">
      <div class="basicInfoDetail">
        <h3>About Me</h3>
        <textarea id="userAboutMe" v-model="userAboutMe"></textarea>
      </div>
    </div>

    <div class="educationInfo">
      <div class="educationInfoDetail">
        <h3>Education</h3>
        <p>
          <label for="userInstitution">Institution: </label>
          <input id="userInstitution" type="text" v-model="userInstitution" />
        </p>
        <p>
          <label for="userStudyStatus">Current Status: </label>
          <select id="userStudyStatus" v-model="userStudyStatus">
            <option value="-">-</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
            <option value="Graduated">Graduated</option>
          </select>
        </p>
        <p>
          <label for="userStudyField">Field of Study: </label>
          <input id="userStudyField" type="tel" v-model="userStudyField" />
        </p>
        <p>
          <label for="userAchieve">Achievements and Activities: </label>
          <br />
          <textarea id="userAchieve" v-model="userAchieve"></textarea>
        </p>
      </div>
    </div>

    <div class="aboutMe">
      <div class="basicInfoDetail">
        <h3>Experience</h3>
        <textarea id="userExperience" v-model="userExperience"></textarea>
      </div>
    </div>

    <!-- Buttons to go back to user profile or save their edits -->
    <!-- Display success message when users save their changes -->
    <div class="successMessageContainer">
      <p class="successMessage" v-if="saveSuccess === true">Save successful!</p>
    </div>

    <div class="centerButton">
      <router-link
        class="backButton"
        :to="{ name: 'profileLink', params: myProfileParams }"
      >
        Back
      </router-link>
      <button class="saveButton">Save</button>
    </div>

  </form>
</template>

<script>
// Only allow access if authorized, and id is the same
import AxiosService from "../services/AxiosService.js";
import { app } from "../main.js";
import NavBar from "./NavBar.vue";

export default {
  components: {
    NavBar,
  },
  data() {
    return {
      loginStatus: app.config.globalProperties.$authenticated,
      myProfileParams: {
        profileId: app.config.globalProperties.$userIdent,
      },
      userProfileId: "",
      userName: "",
      userEmail: "",
      userAddress: "",
      userMobile: "",
      userSite: "",
      userAboutMe: "",
      userInstitution: "",
      userStudyStatus: "-",
      userStudyField: "",
      userAchieve: "",
      userExperience: "",
      saveSuccess: "false",
    };
  },
  mounted() {
    window.scrollTo(0, 0);
    this.getPrefill();
    this.userProfileId = this.$route.params.routerProfileId;
  },

  methods: {
    // Query information from the database to prefill the form
    getPrefill() {
      AxiosService.getProfile()
        .then((response) => {
          const data = response.data;
          for (const objectId in data) {
            if (objectId === this.userProfileId) {
              console.log(data[objectId]);
              this.userName = data[objectId].userName;
              this.userEmail = data[objectId].userEmail;
              this.userAddress = data[objectId].userAddress;
              this.userMobile = data[objectId].userMobile;
              this.userSite = data[objectId].userSite;
              this.userAboutMe = data[objectId].userAboutMe;
              this.userInstitution = data[objectId].userInstitution;
              this.userStudyStatus = data[objectId].userStudyStatus;
              this.userStudyField = data[objectId].userStudyField;
              this.userAchieve = data[objectId].userAchieve;
              this.userExperience = data[objectId].userExperience;
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // PUT request to update database information
    submitEdit() {
      AxiosService.updateProfile(this.userProfileId, {
        userName: this.userName,
        userEmail: this.userEmail,
        userAddress: this.userAddress,
        userMobile: this.userMobile,
        userSite: this.userSite,
        userAboutMe: this.userAboutMe,
        userInstitution: this.userInstitution,
        userStudyStatus: this.userStudyStatus,
        userStudyField: this.userStudyField,
        userAchieve: this.userAchieve,
        userExperience: this.userExperience,
      });

      this.saveSuccess = true;
      // Hide success message after 1 second
      setTimeout(this.resetSuccess, 1000);
    },
    // Function to momentarily display success message
    resetSuccess() {
      this.saveSuccess = false;
    },
  },
};
</script>

<style scoped>
/* Button styles are modified from https://www.w3schools.com/css/css3_buttons.asp */

p {
  display: table-row;
}
label {
  display: table-cell;
}
input {
  display: table-cell;
}

textarea {
  font-family: Helvetica;
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  resize: vertical;
}

.educationInfo,
.experienceInfo,
.basicInfo,
.aboutMe {
  border-radius: 10px;
  background: white;
  padding-bottom: 0.5px;
  margin-top: 1%;
  margin-right: 4%;
  margin-left: 4%;
}

.educationInfoDetail,
.experienceInfoDetail,
.basicInfoDetail,
.aboutMeDetail {
  border-radius: 10px;
  background: white;
  padding-top: 0.5px;
  padding-bottom: 0.5px;
  margin-top: 1%;
  margin-right: 2%;
  margin-left: 2%;
  margin-bottom: 1%;
}

.backButton:hover {
  background-color: lightgray;
  color: white;
}
.backButton {
  color: #eeeeee;
  border: none;
  text-decoration: none;
  background-color: grey;
  border-radius: 5px;
  padding: 5px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  transition-duration: 0.2s;
  margin-left: 1%;
  margin-right: 1%;
}

.saveButton:hover {
  background-color: #77dd76;
  color: white;
}
.saveButton {
  color: #eeeeee;
  border: none;
  text-decoration: none;
  background-color: #40b65f;
  border-radius: 5px;
  padding: 5px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  transition-duration: 0.2s;
  margin-left: 1%;
  margin-right: 1%;
}

.centerButton {
  margin-top: 0.5%;
  margin-bottom: 1%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.inputForms {
  font-family: Helvetica;
  border-radius: 5px;
  background: #d6d6d6;
  padding-top: 0.5px;
  padding-bottom: 0.5px;
  margin-top: 0%;
  margin-right: 10%;
  margin-left: 10%;
}

.successMessageContainer {
  padding-top: 5px;
  min-height: 20px;
  text-align: center;
}
.successMessage {
  color: green;
  font-size: 13px;
  margin: 0;
  padding: 0;
  display: inline-block;
}

.unchangedInfo {
  text-align: center;
  font-size: 25px;
}

/* Responsive text input box adjustment */
#userAddress,
#userAchieve {
  font-family: Helvetica;
  width: 100%;
}

@media screen and (min-width: 900px) {
  #userAddress,
  #userAchieve {
    font-family: Helvetica;
    width: 200%;
  }
}

@media screen and (min-width: 1200px) {
  #userAddress,
  #userAchieve {
    font-family: Helvetica;
    width: 300%;
  }
}
</style>
