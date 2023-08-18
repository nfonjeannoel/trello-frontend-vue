<script setup>
import { RouterLink } from "vue-router";
import axios from "axios";
import { ref } from "vue";
import router from "@/router";
import { useAuthStore } from '@/stores/auth.store';
import Footer from '@/components/Footer.vue'
const email = ref("");
const username = ref("");
const password = ref("");
let loading = ref(false)

// const createUser = async (data) => {

//   // Perform data validation and cleaning


//   email.value = email.value.trim();
//   username.value = username.value.trim();
//   password.value = password.value.trim();


//   if (!email.value || !username.value || !password.value) {
//     console.log("Please fill in all fields.");
//     return;
//   }

//   // Send request to backend to create user
//   loading.value = true

//   try {
//     const response = await axios.post("http://127.0.0.1:8000/users/create_user", {
//       email: email.value,
//       username: username.value,
//       password: password.value,
//     });

//     // navigate to login page
//     router.push({
//       name: 'login',
//     })


//     console.log("User created successfully!");
//     // console.log(response.data);
//   } catch (error) {
//     loading.value = false
//     console.log("Error creating user. Please try again later.");
//     console.log(error);
//   }
// };


function createUser() {
  const authStore = useAuthStore();
  return authStore.signup(email.value, username.value, password.value)
    .catch(error => {
      console.log(error)
    });
}

</script>

<template>
 <div class="d-flex flex-column  justify-content-between px-3 pt-5" style="height: 100vh;">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-auto col-lg-auto d-none d-lg-block"></div>
        <div class="col-12 col-md-6 col-lg-4 card py-5 px-lg-3">
          <header class="d-flex justify-content-center py-3">
            <RouterLink class="" to="/">
              <img style="width: 150px; height: auto;" class="img-fluid h-auto"
                src="https://d2k1ftgv7pobq7.cloudfront.net/meta/c/p/res/images/trello-header-logos/167dc7b9900a5b241b15ba21f8037cf8/trello-logo-blue.svg">
            </RouterLink>
          </header>


          <div class="container">

            <form @submit.prevent="createUser" method="post">
              <h1 class="h3 my-3 fw-light text-center">Create an Account</h1>

              <div class="form-floating my-4">
                <input type="email" v-model="email" class="form-control" name="email" id="email" placeholder="name@example.com" required>
                <label for="floatingInput">Email address</label>
              </div>
              <div class="form-floating my-4">
                <input type="text" class="form-control" v-model="username" name="username" id="username" placeholder="John Doe" required>
                <label for="floatingUsername">Your Name</label>
              </div>
              <div class="form-floating my-4">
                <input v-model="password" type="password" class="form-control"  name="password" id="password" required placeholder="Password">
                <label for="floatingPassword">Password</label>
              </div>
              


              <button :disabled="loading" class="btn btn-primary w-100 py-2 my-4 mb-5" type="submit">{{ loading ? "Please wait..." : "Create an account" }}</button>

              <div style="font-size: 14px;">
               <RouterLink class="text-decoration-none" to="/login">Have an account?</RouterLink>
                
              </div>
            </form>
          </div>
        </div>
        <div class="col-auto col-lg-auto d-none d-lg-block"></div>
      </div>



    </div>

    <Footer />
  </div>
</template>

<style scoped>
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>