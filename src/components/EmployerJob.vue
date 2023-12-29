<template>
<!-- Overall wrapper containers -->
  <div class="job">
    <div class="jobText">

      <div class="buttonContainer">
        <!-- Style and format the buttons to the right of the description box -->
        <!-- Emit job Id back to the parent component for deletion -->
        <button class="deleteButton" @click="sendDeleteId">Delete</button>
        <!-- Applicant button change depending on whether it is showing or hidden -->
        <button
          class="applicantButton"
          @click="showApplicants"
          v-if="showingApplicants"
        >
          Hide applicants
        </button>
        <button class="applicantButton" @click="showApplicants" v-else>
          Show applicants
        </button>
      </div>

      <div id="jobInformation">
        <h4>Job: </h4>
        <p>{{ jobTitle }}</p>
        <br />
        <h4>Type: </h4>
        <p>{{ jobType }}</p>
        <br />
        <h4>Industry: </h4>
        <p>{{ jobIndustry }}</p>
        <br />
        <h4>Date: </h4>
        <p>{{ jobDate }}</p>
      </div>

      <hr />

      <!-- Show description if applicants are hidden -->
      <div v-if="showingApplicants === false">
        <p style="font-weight: bold">Description:</p>
        <p>{{ jobDesc }}</p>
      </div>
      <!-- Show applicants hides description -->
      <div class="applicants" v-if="showingApplicants === true">
        <p style="font-weight: bold">Applicants:</p>
        <ol>
          <li v-for="applicant in applicantNameAndId" :key="applicant">
            <router-link
              id="applicantProfileLink"
              :to="{
                name: 'profileLink',
                params: { profileId: applicant.applicantId },
              }"
            >
              {{ applicant.applicantName }}
            </router-link>
          </li>
        </ol>
      </div>

    </div>
  </div>
</template>

<script>
import AxiosService from "../services/AxiosService.js";
import { ref, onValue } from "firebase/database";
import { database } from "../services/DatabaseService.js";

export default {
  props: [
    "jobTitle",
    "jobType",
    "jobDate",
    "jobDesc",
    "jobUniqueKey",
    "jobIndustry",
  ],
  data() {
    return {
      currentApplicants: [],
      showingApplicants: false,
      applicantNameAndId: [],
    };
  },
  mounted() {
    this.getApplicants();
  },
  methods: {
    showApplicants() {
      if (this.showingApplicants) {
        this.showingApplicants = false;
      } else {
        this.showingApplicants = true;
      }
    },
    sendDeleteId() {
      // Emit deleted job unique ID to employer dashboard
      this.$emit("delete-job", this.jobUniqueKey);
    },
    getApplicants() {
      AxiosService.getJobPosts()
        .then((response) => {
          const data = response.data;
          for (const objectId in data) {
            // If job belongs to the employer retrieve applicants for that job
            if (objectId === this.jobUniqueKey) {
              let retrievedArr = data[objectId].jobAppliedUsers;
              for (const index in retrievedArr) {
                if (retrievedArr[index] != null) {
                  this.currentApplicants.push(retrievedArr[index]);
                }
              }
              break;
            }
          }
          //   Remove placeholder value of 0 from the array
          this.currentApplicants.shift();

          // Generate links to user profile from the applicants' names
          this.makeProfileLink();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    makeProfileLink() {
      // Generate links to user profile from the applicants' names
      // Directly query applicant from the database
      for (const index in this.currentApplicants) {
        const dbref = ref(
          database,
          "accounts/" + this.currentApplicants[index]
        );
        onValue(dbref, (snapshot) => {
          const value = snapshot.val().name;
          // Make an object for storing name and userId for each applicant
          let nameAndIdObject = {
            applicantName: value,
            applicantId: this.currentApplicants[index],
          };
          this.applicantNameAndId.push(nameAndIdObject);
        });
      }
    },
  },
};
</script>

<style scoped>
h3, h4 {
  margin: 3px;
}

hr {
  border-top: 0.5px;
  color: lightgray;
}

.job {
  border-style: solid;
  border-width: 2px;
  border-color: #cacaca;
  font-family: Helvetica;
  margin: 1.5%;
  background: white;
  border-radius: 15px;
  height: 200px;
  overflow: auto;
}

.jobText {
  margin: 1.5%;
  padding-top: 0.25%;
}

.deleteButton {
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

.deleteButton:hover {
  background-color: #ff6962;
  color: white;
}

.applicantButton {
  border: none;
  float: right;
  background-color: #4090eb;
  border-radius: 5px;
  padding: 5px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  transition-duration: 0.2s;
  color: white;
  margin-left: 0.5%;
  margin-right: 0.75%;
}

.applicantButton:hover {
  background-color: #5ea9ff;
  color: white;
}

#jobInformation h4,
#jobInformation p {
  display: inline;
}

#applicantProfileLink {
  text-decoration: none;
}
</style>
