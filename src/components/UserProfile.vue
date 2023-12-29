<template>
  <nav-bar :loginStatus="this.loginStatus"></nav-bar>
  <div class="profileContainer">
    <div class="profileName">
      <h3>{{ userName }}</h3>
    </div>

    <div class="basicInfo">
      <div class="aboutMeDetail">
        <h3>Basic Information</h3>
        <!-- Autofill basic information from the database -->
        <div id="aboutDetailTexts">
          <h4>Email:</h4>
          <p>{{ userEmail }}</p>
          <br />
          <h4>Address:</h4>
          <p>{{ userAddress }}</p>
          <br />
          <h4>Mobile:</h4>
          <p>{{ userMobile }}</p>
          <br />
          <h4>Site:</h4>
          <p>{{ userSite }}</p>
        </div>
      </div>
    </div>

    <div class="aboutMe">
      <div class="basicInfoDetail">
        <h3>About Me</h3>
        <p>{{ userAboutMe }}</p>
      </div>
    </div>

    <div class="educationInfo">
      <div class="educationInfoDetail">
        <h3>Education</h3>
        <div id="eduDetailTexts">
          <h4>Institution:</h4>
          <p>{{ userInstitution }}</p>
          <br />
          <h4>Current Status:</h4>
          <p>{{ userStudyStatus }}</p>
          <br />
          <h4>Field of Study:</h4>
          <p>{{ userStudyField }}</p>
          <br />
        </div>
        <p style="font-weight: bold">Achievements and Activities</p>
        <p>{{ userAchieve }}</p>
      </div>
    </div>

    <div class="experienceInfo">
      <div class="experienceInfoDetail">
        <h3>Experience</h3>
        <p>{{ userExperience }}</p>
      </div>
    </div>

    <!-- Allow user to edit only if the logged in user is the profile's user -->
    <div class="centerButton">
      <router-link
        class="editProfileButton"
        :to="{ name: 'editProfileLink', params: routerParams }"
        v-if="allowEdit"
      >
        Edit
      </router-link>
      <!-- If an employer is viewing the profile, the back button can bring them back to their page -->
      <router-link class="editProfileButton" to="/company" v-if="allowBack">
        Back
      </router-link>
    </div>
  </div>
</template>

<script>
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
      allowEdit: false,
      allowBack: false,
      profileId: "",
      routerParams: {
        routerProfileId: this.$route.params.profileId,
      },
      userName: "",
      userId: "",
      userEmail: "",
      userAddress: "",
      userMobile: "",
      userSite: "",
      userAboutMe: "",
      userInstitution: "",
      userStudyStatus: "",
      userStudyField: "",
      userAchieve: "",
      userExperience: "",
    };
  },
  mounted() {
    this.getPrefill();
    window.scrollTo(0, 0);
    this.profileId = this.$route.params.profileId;
    this.checkAuthorization();
  },
  methods: {
    getPrefill() {
      // Get profile information from the database
      AxiosService.getProfile()
        .then((response) => {
          const data = response.data;
          for (const objectId in data) {
            console.log(this.profileId);
            if (objectId === this.profileId) {
              console.log(data[objectId]);
              console.log(data[objectId].userEmail);
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
    checkAuthorization() {
      // Check if the current user is the profile's user to allow them the rights to edit
      console.log(app.config.globalProperties.$userIdent);
      console.log(this.profileId);
      if (this.profileId === app.config.globalProperties.$userIdent) {
        this.allowEdit = true;
      } else if (app.config.globalProperties.$userAccountType === "employer") {
        this.allowBack = true;
      }
    },
  },
};
</script>

<style scoped>
h4 {
  margin: 3px 0px 3px;
}

.profileName {
  text-align: center;
  font-size: 25px;
}

.profileContainer {
  font-family: Helvetica;
  border-radius: 5px;
  background: #d6d6d6;
  padding-top: 0.5px;
  padding-bottom: 0.5px;
  margin-top: 0%;
  margin-right: 10%;
  margin-left: 10%;
}

.aboutMeDetail,
.basicInfoDetail,
.educationInfoDetail,
.experienceInfoDetail {
  border-radius: 10px;
  background: white;
  padding-top: 0.5px;
  padding-bottom: 0.5px;
  margin-top: 1%;
  margin-right: 2%;
  margin-left: 2%;
  margin-bottom: 1%;
}

.educationInfo,
.basicInfo,
.aboutMe,
.experienceInfo {
  border-radius: 10px;
  background: white;
  padding-bottom: 0.5px;
  margin-top: 1%;
  margin-right: 4%;
  margin-left: 4%;
}

.editProfileButton:hover {
  background-color: #b6b6b6;
  color: white;
}
.editProfileButton {
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
}

.centerButton {
  margin-top: 1%;
  margin-bottom: 1%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#eduDetailTexts h4,
#eduDetailTexts p {
  display: inline;
  vertical-align: top;
}

#aboutDetailTexts h4,
#aboutDetailTexts p {
  display: inline;
  vertical-align: top;
}
</style>
