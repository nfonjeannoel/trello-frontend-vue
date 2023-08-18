<script setup>
import { RouterLink } from "vue-router";
import { ref } from "vue";
import axios from "axios";
import router from "@/router";
import { useAuthStore } from '@/stores/auth.store';
import Footer from '@/components/Footer.vue'

const username = ref("");
const password = ref("");
let loading = ref(false)

// const loginUser = async () => {
//   // Perform data validation and cleaning

//   username.value = username.value.trim();

//   if (!username.value || !password.value) {
//     console.log("Please fill in all fields.");
//     return;
//   }

//   // Send request to backend to create user
//   loading.value = true
//   try {
//     const response = await axios.post("http://127.0.0.1:8000/users/token", {
//       username: username.value,
//       password: password.value,
//     }, {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });


//     userStore.setUser(response.data)

//     // navigate to login page
//     router.push({
//       name: 'boards',
//     })
//     loading.value = false


//     console.log("logged in successfully!");
//     // console.log(response.data);
//   } catch (error) {
//     console.log("Error logging in");
//     console.log(error);
//     loading.value = false
//   }
// };

function loginUser() {
  const authStore = useAuthStore();
  if (!username.value || !password.value) {
    console.log("Please fill in all fields.");
    return;
  }
  return authStore.login(username.value, password.value)
    .catch(error => {
      console.log(error)
    });
}

</script>

<template>
  <main >
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

            <form @submit.prevent="loginUser" method="post">
              <h1 class="h3 my-3 fw-light text-center">Login to Trello</h1>

              <div class="form-floating my-4">
                <input type="email" v-model="username" name="username" id="username" class="form-control"  placeholder="name@example.com" required>
                <label for="floatingInput">Email address</label>
              </div>
              <div class="form-floating my-4">
                <input type="password" v-model="password" name="password" id="password" class="form-control" required placeholder="Password">
                <label for="floatingPassword">Password</label>
              </div>


              <button class="btn btn-primary w-100 py-2 my-4 mb-5 " :disabled="loading"
              type="submit">{{ loading ? "Please wait..." : "Sign in" }}</button>

              <div style="font-size: 14px;">
                <RouterLink class="text-decoration-none me-2" to="/">Can't Login?</RouterLink> <RouterLink class="text-decoration-none"
                  to="/signup">Create an account</RouterLink>

              </div>
            </form>
          </div>
        </div>
        <div class="col-auto col-lg-auto d-none d-lg-block"></div>
      </div>



    </div>
    <Footer />
  </div>

    
  </main>
</template>

<style scoped></style>