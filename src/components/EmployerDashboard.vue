<template>
  <nav-bar :loginStatus="this.loginStatus"></nav-bar>

<!-- Wrapper div for displaying background image -->
  <div class="bgImage">
    <h1 class="companyNameSection">{{ myCompanyName }}</h1>
    <div class="jobControl">
      <!-- Display success message if job is successfully posted -->
      <div class="successMessageContainer">
        <p class="successMessage" v-if="jobPostSuccess === true">
          Post successful!
        </p>
      </div>

      <!-- Form for employer to input job information -->
      <form @submit.prevent="postJob">
        <div class="jobInputDetail">
          <p>
            <label for="jobTitle">Job: </label>
            <input id="jobTitle" type="text" v-model="jobTitle" required />
          </p>
          <p>
            <label for="jobType">Type: </label>
            <select id="jobType" v-model="jobType">
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </p>
          <p>
            <label for="jobDate">Final Application Date: </label>
            <input id="jobDate" type="date" v-model="jobDate" required />
          </p>
          <p>
            <label for="jobIndustry">Industry: </label>
            <select id="jobIndustry" v-model="jobIndustry">
              <option value="Accounting">Accounting</option>
              <option value="Banking">Banking</option>
              <option value="Marketing">Marketing</option>
              <option value="IT">IT</option>
              <option value="Government">Government</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Legal">Legal</option>
              <option value="Retail">Retail</option>
              <option value="Energy">Energy</option>
              <option value="Insurance">Insurance</option>
              <option value="Other">Other</option>
            </select>
          </p>
          <p>
            <label for="jobDesc">Description: </label>
            <br />
            <textarea id="jobDesc" v-model="jobDesc" required></textarea>
          </p>
          <div class="centerButton">
            <button class="postJobButton">Post</button>
          </div>
        </div>
      </form>
    </div>
  </div>

<!-- Pass information to EmployerJob component for each job post in postedJobs array -->
  <div class="jobPostContainer">
    <employer-job
      @deleteJob="deleteJob"
      v-for="job in postedJobs"
      :key="job.jobUniqueKey"
      :jobTitle="job.jobTitle"
      :jobType="job.jobType"
      :jobDate="job.jobDate"
      :jobDesc="job.jobDesc"
      :jobUniqueKey="job.jobUniqueKey"
      :jobIndustry="job.jobIndustry"
    >
    </employer-job>
  </div>

</template>

<script>
import AxiosService from "../services/AxiosService.js";
import EmployerJob from "./EmployerJob.vue";
import { app } from "../main.js";
import NavBar from "./NavBar.vue";

export default {
  components: {
    EmployerJob,
    NavBar,
  },
  data() {
    return {
      loginStatus: app.config.globalProperties.$authenticated,
      myCompanyName: "",
      userId: "",
      jobTitle: "",
      // Default information
      jobType: "Full-time",
      jobIndustry: "Other",
      jobDate: "",
      jobDesc: "",
      // Placeholder value of 0 to store empty array in firebase json
      jobAppliedUsers: [0],
      // Jobs posted by employer
      postedJobs: [],
      jobPostSuccess: false,
    };
  },
  mounted() {
    window.scrollTo(0, 0);
    this.getPostedJobs();
    this.userId = app.config.globalProperties.$userIdent;
    this.myCompanyName = app.config.globalProperties.$accountName;
  },
  methods: {
    // Posted jobs cannot be updated, only deleted
    // Since users need consistent information to apply
    // Use emitted Id from child component to delete the database entry
    deleteJob(emittedJobUniqueKey) {
      AxiosService.deleteJob(
        emittedJobUniqueKey,
        app.config.globalProperties.$idToken
      );
      // Delay page update for 3 seconds while firebase is deleting the entry
      // This is why there is a small delay when the employer press delete
      setTimeout(this.getPostedJobs, 3000);
    },
    postJob() {
      // Post job to the database
      // console.log("Job Posted");
      AxiosService.postJob(
        {
          employerId: this.userId,

          jobCompany: this.myCompanyName,
          jobTitle: this.jobTitle,
          jobType: this.jobType,
          jobIndustry: this.jobIndustry,
          jobDate: this.jobDate,
          jobDesc: this.jobDesc,
          jobAppliedUsers: this.jobAppliedUsers,
        },
        app.config.globalProperties.$idToken
      )
        .then((response) => {
          console.log(response.status);
          this.getPostedJobs();
          // Function for displaying success message for 1 second
          this.jobPostSuccess = true;
          setTimeout(this.resetSuccess, 1000);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    resetSuccess() {
      // Remove success message after 1 second
      this.jobPostSuccess = false;
    },
    getPostedJobs() {
      // Query the jobs that this company previously posted
      AxiosService.getJobPosts()
        .then((response) => {
          const data = response.data;
          const arr = [];
          for (const objectId in data) {
            // If job belongs to the currently logged in company, add it to the array
            if (data[objectId].employerId === this.userId) {
              const jobObject = {};
              jobObject.employerId = data[objectId].employerId;
              jobObject.jobCompany = data[objectId].myCompanyName;
              jobObject.jobTitle = data[objectId].jobTitle;
              jobObject.jobType = data[objectId].jobType;
              jobObject.jobIndustry = data[objectId].jobIndustry;
              jobObject.jobDate = data[objectId].jobDate;
              jobObject.jobDesc = data[objectId].jobDesc;
              jobObject.jobAppliedUsers = data[objectId].jobAppliedUsers;
              jobObject.jobUniqueKey = objectId;
              arr.push(jobObject);
            }
          }
          this.postedJobs = arr;
          console.log(arr);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.companyNameSection {
  margin-top: 0px;
  padding-top: 15px;
  margin-bottom: 0px;
  padding-bottom: 0px;
  font-family: Helvetica;
  text-align: center;
}

.jobControl {
  border-style: solid;
  border-width: 5px;
  font-family: Helvetica;
  border-radius: 10px;
  background: #ececec;
  padding-top: 0.5px;
  padding-bottom: 0.5px;
  margin-top: 1%;
  margin-right: 10%;
  margin-left: 10%;
}

.jobInputDetail {
  margin: 1.5%;
}

.postJobButton {
  border: none;
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

.postJobButton:hover {
  background-color: #77dd76;
  color: white;
}

.jobInputDetail label {
  font-weight: bold;
}

.centerButton {
  margin-top: 1%;
  margin-bottom: 1%;
  display: flex;
  justify-content: center;
  align-items: center;
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

.jobPostContainer {
  background-color: white;
  border-radius: 15px;
  padding-top: 0.5px;
  padding-bottom: 0.5px;
  margin-top: 1%;
  margin-right: 1%;
  margin-left: 1%;
}

.bgImage {
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.6),
      rgba(255, 255, 255, 0.6)
    ),
    url("../../asset/employerBg.jpg");
  background-size: 750px 500px;
  background-color: white;
  background-position: bottom;
  padding-bottom: 10px;
}

#jobDesc {
  resize: none;
  font-family: Helvetica;
  width: 80%;
  height: 125px;
}

@media screen and (min-width: 800px) {
  #jobDesc {
    resize: none;
    font-family: Helvetica;
    width: 90%;
    height: 125px;
  }
}

@media screen and (min-width: 1200px) {
  #jobDesc {
    resize: none;
    font-family: Helvetica;
    width: 100%;
    height: 125px;
  }
}
</style>
