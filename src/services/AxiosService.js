import axios from "axios";

const apiClient = axios.create();

apiClient.interceptors.request.use((config) => {
  return config;
});

apiClient.interceptors.response.use((response) => {
  return response;
});

// *accounts.json and userProfiles.json do not require authorization to write
// Since the sign up service must access both database to create an account, during this phase no user is logged in
// Therefore, no token is available to send for authorization

export default {
  postLogin(loginObject) {
    // POST request to log user in
    let url =
    "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBEppB0u-nwMgK1YkTN-tPbkMxxT457JR0";
    return apiClient.post(url, loginObject);
  },
  updateProfile(entryId, profileObject) {
    // PUT request to update existing user profiles to its specfic entry
    let url =
      "https://jobrecruitmentsite-default-rtdb.asia-southeast1.firebasedatabase.app/userProfiles/" +
      entryId +
      ".json";
    return apiClient.put(url, profileObject);
  },
  getProfile() {
    // GET request to retrieve user profile from userProfiles.json
    let url =
      "https://jobrecruitmentsite-default-rtdb.asia-southeast1.firebasedatabase.app/userProfiles.json";
    return apiClient.get(url);
  },
  postJob(jobObject, authToken) {
    // POST request to create a job entry in the jobPosts.json database, requires authorization token to do so
    let url =
      "https://jobrecruitmentsite-default-rtdb.asia-southeast1.firebasedatabase.app/jobPosts.json?auth=" +
      authToken;
    return apiClient.post(url, jobObject);
  },
  deleteJob(entryId, authToken) {
    // DELETE request to remove the job entry from the database, requires authorization token to do so
    let url =
      "https://jobrecruitmentsite-default-rtdb.asia-southeast1.firebasedatabase.app/jobPosts/" +
      entryId +
      ".json?auth=" +
      authToken;
    return apiClient.delete(url);
  },
  getJobPosts() {
    // GET request to retrieve all job posts from the database from jobPosts.json
    let url =
      "https://jobrecruitmentsite-default-rtdb.asia-southeast1.firebasedatabase.app/jobPosts.json";
    return apiClient.get(url);
  },
  updateJobApplicant(authToken, entryId, jobObject) {
    // PUT request to update the job posts entry with the applicant name list in the database
    // Only authorized user can do this
    let url =
      "https://jobrecruitmentsite-default-rtdb.asia-southeast1.firebasedatabase.app/jobPosts/" +
      entryId +
      ".json?auth=" +
      authToken;
    return apiClient.put(url, jobObject);
  },
  getUserAccount() {
    // GET request to retrieve all user accounts from acounts.json database
    let url =
      "https://jobrecruitmentsite-default-rtdb.asia-southeast1.firebasedatabase.app/accounts.json";
    return apiClient.get(url);
  },
  createUserAccount(entryId, accountObject) {
    // PUT request to create a user account entry in the accounts database for a specific ID
    let url =
      "https://jobrecruitmentsite-default-rtdb.asia-southeast1.firebasedatabase.app/accounts/" +
      entryId +
      ".json";
    return apiClient.put(url, accountObject);
  },
};
