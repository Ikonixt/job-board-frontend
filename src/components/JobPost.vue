<template>
  <div class="job">
    <div class="jobText">
      <h2 style="font-weight: bold">{{ companyName }}</h2>
      <!-- Buttons for users apply and withdraw (Only users can see this) -->
      <button
        class="withdrawButton"
        @click="withdrawFromJob"
        v-if="allowWithdraw"
      >
        Withdraw
      </button>
      <button class="applyButton" @click="applyForJob" v-if="allowApply">
        Apply
      </button>

      <!-- Display job information from props -->
      <div id="jobInformation">
        <h4 id="titleText">Job: </h4>
        <p>{{ jobTitle }}</p>
        <br />
        <h4 id="typeText">Type: </h4>
        <p>{{ jobType }}</p>
        <br />
        <h4 id="industryText">Industry: </h4>
        <p>{{ jobIndustry }}</p>
        <br />
        <h4 id="dateText">Apply Until: </h4>
        <p>{{ jobDate }}</p>
        <br />
      </div>
      <hr />
      <p style="font-weight: bold">Description: </p>
      <p class="descText">{{ jobDesc }}</p>
    </div>
  </div>
</template>

<script>
import AxiosService from "../services/AxiosService.js";
import { app } from "../main.js";

export default {
  props: [
    "employerId",
    "companyName",
    "jobTitle",
    "jobType",
    "jobDate",
    "jobDesc",
    "jobUniqueKey",
    "jobIndustry",
  ],
  data() {
    return {
      myProfileId: app.config.globalProperties.$userIdent,
      retrievedJobObject: {},
      allowApply: true,
      allowWithdraw: false,
      currentApplicant: [],
    };
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    applyForJob() {
      // Update appliedUsers array for the respective job entry in the database 
      this.retrievedJobObject.jobAppliedUsers.push(this.myProfileId);
      AxiosService.updateJobApplicant(
        app.config.globalProperties.$idToken,
        this.jobUniqueKey,
        {
          employerId: this.retrievedJobObject.employerId,
          jobCompany: this.retrievedJobObject.jobCompany,
          jobTitle: this.retrievedJobObject.jobTitle,
          jobType: this.retrievedJobObject.jobType,
          jobIndustry: this.retrievedJobObject.jobIndustry,
          jobDate: this.retrievedJobObject.jobDate,
          jobDesc: this.retrievedJobObject.jobDesc,
          jobAppliedUsers: this.retrievedJobObject.jobAppliedUsers,
        }
      );

      // Wait 3 seconds for database to change
      setTimeout(this.getInfo, 3000);
    },
    withdrawFromJob() {
      // Remove user from the AppliedUsers array retrieved from the database
      for (const userIndex in this.retrievedJobObject.jobAppliedUsers) {
        if (
          this.retrievedJobObject.jobAppliedUsers[userIndex] == this.myProfileId
        ) {
          this.retrievedJobObject.jobAppliedUsers.splice(userIndex, 1);
        }
      }

      // PUT the updated job entry back into the database
      AxiosService.updateJobApplicant(
        app.config.globalProperties.$idToken,
        this.jobUniqueKey,
        {
          employerId: this.retrievedJobObject.employerId,
          jobCompany: this.retrievedJobObject.jobCompany,
          jobTitle: this.retrievedJobObject.jobTitle,
          jobType: this.retrievedJobObject.jobType,
          jobIndustry: this.retrievedJobObject.jobIndustry,
          jobDate: this.retrievedJobObject.jobDate,
          jobDesc: this.retrievedJobObject.jobDesc,
          jobAppliedUsers: this.retrievedJobObject.jobAppliedUsers,
        }
      );

      // Wait 3 seconds for database to change
      setTimeout(this.getInfo, 3000);
    },
    getInfo() {
      // Retrieve job information from the database
      AxiosService.getJobPosts()
        .then((response) => {
          const data = response.data;
          for (const objectId in data) {
            // If retrieved job id is equal to the current job
            if (objectId === this.jobUniqueKey) {
              this.retrievedJobObject = data[objectId];
              this.currentApplicant = this.retrievedJobObject.jobAppliedUsers;

              for (const applicantIndex in this.currentApplicant) {
                // If applicant is detected in the job's applicant list, disable the post's apply option
                // and enable the post's withdraw option
                if (
                  this.currentApplicant[applicantIndex] === this.myProfileId
                ) {
                  this.allowApply = false;
                  this.allowWithdraw = true;
                  break;
                } else {
                  this.allowApply = true;
                  this.allowWithdraw = false;
                }
              }
            }
          }

          if (app.config.globalProperties.$userAccountType != "user") {
            this.allowApply = false;
            this.allowWithdraw = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
h2,
h5,
h4 {
  margin: 3px;
}

hr {
  border-top: 0.5px;
  color: lightgray;
}

.applyButton {
  border: none;
  float: right;
  background-color: #40b65f;
  border-radius: 5px;
  padding: 5px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  transition-duration: 0.2s;
  color: white;
}

.applyButton:hover {
  background-color: #77dd76;
  color: white;
}

.withdrawButton {
  border: none;
  font-family: Helvetica;
  float: right;
  background-color: #d43b3b;
  border-radius: 5px;
  padding: 5px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  transition-duration: 0.2s;
  color: white;
}

.withdrawButton:hover {
  background-color: #ff6962;
  color: white;
}

.jobText {
  margin: 1.5%;
  padding-top: 0.25%;
}

.job {
  font-family: Helvetica;
  margin: 1.5%;
  background: white;
  border-radius: 10px;
  height: 200px;
  overflow: auto;
}

.descText {
  font-size: 13px;
}

#jobInformation h4,
#jobInformation p {
  display: inline;
}

#dateText::before {
  content: "📅 ";
}

#titleText::before {
  content: "👔 ";
}

#typeText::before {
  content: "💼 ";
}

#industryText::before {
  content: "🏢 ";
}
</style>
