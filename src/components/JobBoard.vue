<template class="background">
  <nav-bar :loginStatus="this.loginStatus"></nav-bar>

  <div class="introBar">
    <!-- Dynamic routing for normal users, since employers need to view employees' profiles -->
    <h2 class="introText">JOB DASHBOARD</h2>
    <div class="profileRoute" v-if="isUser">
      <img src="../../asset/profileIcon.png" width="50" height="50" /><br />
      <router-link
        class="linkToUserProfile"
        :to="{ name: 'profileLink', params: myProfileParams }"
      >
        My Profile
      </router-link>
    </div>
    <!-- General routing for company, since only one company can be logged in at a time -->
    <div class="profileRoute" v-if="isCompany">
      <img src="../../asset/officeIcon.png" width="50" height="50" /><br />
      <router-link class="linkToUserProfile" to="/company">
        My Company
      </router-link>
    </div>
    <!-- No link if user is a guest -->
    <div class="profileRoute" v-if="isGuest">
      <img src="../../asset/guestIcon.png" width="50" height="50" /><br />
      <p>Please Login to access Profile</p>
    </div>
  </div>

  <!-- Wrapper container for all posted jobs in fashboard -->
  <div class="jobPostBox">
    <div class="jobBoardUtilities">
      <!-- Utility section for filtering jobs by industry, call filterByIndustry function once dropdown value changes -->
      <p>
        Filter:
        <select
          id="industryFilter"
          v-model="industryFilter"
          @change="filterByIndustry($event)"
        >
          <option value="All">All</option>
          <option value="Currently Applied">Currently Applied</option>
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
      <p id="disclaimer">
        *Please wait 3 seconds for Apply or Withdraw to process
      </p>
    </div>
    <!-- Display no jobs available if there are no jobs in the selected filter -->
    <div v-if="activeJobCount === 0" class="noJob">
      <p>No available jobs</p>
    </div>

    <!-- Pass job information to child JobPost component -->
    <job-post
      v-for="job in activeJobs"
      :key="job.jobUniqueKey"
      :employerId="job.employerId"
      :companyName="job.jobCompany"
      :jobTitle="job.jobTitle"
      :jobType="job.jobType"
      :jobIndustry="job.jobIndustry"
      :jobDate="job.jobDate"
      :jobDesc="job.jobDesc"
      :jobUniqueKey="job.jobUniqueKey"
    ></job-post>
  </div>
</template>

<script>
import AxiosService from "../services/AxiosService.js";
import JobPost from "./JobPost.vue";
import NavBar from "./NavBar.vue";
import { app } from "../main.js";

export default {
  components: {
    JobPost,
    NavBar,
  },
  data() {
    return {
      loginStatus: app.config.globalProperties.$authenticated,
      activeJobs: [],
      myProfileParams: {
        profileId: app.config.globalProperties.$userIdent,
      },
      isCompany: false,
      isUser: true,
      isGuest: true,
      activeJobCount: 0,
      industryFilter: "All",
    };
  },
  mounted() {
    this.getPostedJobs();
    this.checkAccount();
  },
  methods: {
    getPostedJobs() {
      // Get all posted jobs by every company from the database
      AxiosService.getJobPosts()
        .then((response) => {
          const data = response.data;
          const arr = [];
          for (const objectId in data) {
            const jobObject = {};
            jobObject.employerId = data[objectId].employerId;
            jobObject.jobCompany = data[objectId].jobCompany;
            jobObject.jobTitle = data[objectId].jobTitle;
            jobObject.jobType = data[objectId].jobType;
            jobObject.jobIndustry = data[objectId].jobIndustry;
            jobObject.jobDate = data[objectId].jobDate;
            jobObject.jobDesc = data[objectId].jobDesc;
            jobObject.jobUniqueKey = objectId;
            arr.push(jobObject);
          }
          this.activeJobs = arr;
          this.activeJobCount = this.activeJobs.length;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    checkAccount() {
      // Check if currenly logged in user is an employer/user/ or a guest account type
      if (app.config.globalProperties.$userAccountType === "employer") {
        this.isCompany = true;
        this.isUser = false;
        this.isGuest = false;
      } else if(app.config.globalProperties.$userAccountType === "Guest") {
        this.isUser = false;
        this.isCompany = false;
        this.isGuest = true;
      } else {
        this.isCompany = false;
        this.isUser = true;
        this.isGuest = false;
      }
    },
    filterByIndustry(event) {
      // If all option is selected, do not filter
      if (event.target.value === "All") {
        this.getPostedJobs();
        return;
      }

      // Filter only currently applied jobs
      if(event.target.value === "Currently Applied") {
        AxiosService.getJobPosts()
        .then((response) => {
          const data = response.data;
          const arr = [];
          for (const objectId in data) {
              const jobObject = {};
              jobObject.employerId = data[objectId].employerId;
              jobObject.jobCompany = data[objectId].jobCompany;
              jobObject.jobTitle = data[objectId].jobTitle;
              jobObject.jobType = data[objectId].jobType;
              jobObject.jobIndustry = data[objectId].jobIndustry;
              jobObject.jobDate = data[objectId].jobDate;
              jobObject.jobDesc = data[objectId].jobDesc;
              jobObject.jobUniqueKey = objectId;
              jobObject.jobAppliedUsers = data[objectId].jobAppliedUsers;
              for (const appliedUserIndex in jobObject.jobAppliedUsers){
                if(jobObject.jobAppliedUsers[appliedUserIndex]===app.config.globalProperties.$userIdent){
                    arr.push(jobObject);
                }
              }
            
          }
          this.activeJobs = arr;
          this.activeJobCount = this.activeJobs.length;
        })
        .catch((error) => {
          console.log(error);
        });
      }
      else{
      // Filter retrived array by industry selected from the dropdown box
      AxiosService.getJobPosts()
        .then((response) => {
          const data = response.data;
          const arr = [];
          for (const objectId in data) {
            if (data[objectId].jobIndustry === event.target.value) {
              const jobObject = {};
              jobObject.employerId = data[objectId].employerId;
              jobObject.jobCompany = data[objectId].jobCompany;
              jobObject.jobTitle = data[objectId].jobTitle;
              jobObject.jobType = data[objectId].jobType;
              jobObject.jobIndustry = data[objectId].jobIndustry;
              jobObject.jobDate = data[objectId].jobDate;
              jobObject.jobDesc = data[objectId].jobDesc;
              jobObject.jobUniqueKey = objectId;
              arr.push(jobObject);
            }
          }
          this.activeJobs = arr;
          this.activeJobCount = this.activeJobs.length;
        })
        .catch((error) => {
          console.log(error);
        });
      }
    },
  },
};
</script>

<style scoped>
.background {
  color: grey;
}
.introBar {
  padding-top: 10px;
  margin-top: 0px;
  margin-left: 0px;
  margin-right: 0px;
  margin-bottom: 0px;
  text-align: center;
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.6),
      rgba(255, 255, 255, 0.6)
    ),
    url("../../asset/careerBackground.png");
  background-size: 450px 200px;
  background-color: white;
  background-position: bottom;
}

.introText {
  font-family: Impact;
  font-size: 30px;
}

.profileRoute {
  font-family: Helvetica;
  margin-top: 0px;
  padding-bottom: 15px;
}
.jobPostBox {
  border-radius: 5px;
  background: #d6d6d6;
  padding-top: 0.5px;
  padding-bottom: 0.5px;
  margin-top: 1%;
  margin-right: 10%;
  margin-left: 10%;
}

.jobBoardUtilities {
  font-family: Helvetica;
  padding-left: 2%;
}

.noJob {
  font-family: Helvetica;
  font-size: 18px;
  margin: 1.5%;
  background: white;
  border-radius: 10px;
  height: 55px;
  overflow: auto;
  padding: 50px;
  text-align: center;
}

.linkToUserProfile:hover {
  text-decoration: none;
  color: blue;
  transition-duration: 0.2s;
}

.linkToUserProfile {
  text-decoration: none;
  color: black;
}

#disclaimer {
  padding-top: 5px;
  font-style: italic;
  opacity: 0.5;
  font-size: 13px;
}
</style>
