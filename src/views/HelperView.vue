<script setup>
import { RouterLink } from "vue-router";
import { ref } from "vue";
import axios from "axios";

// const username = ref("");
// const password = ref("");

// const loginUser = async () => {
//   // Perform data validation and cleaning

//   username.value = username.value.trim();

//   if (!username.value || !password.value) {
//     console.log("Please fill in all fields.");
//     return;
//   }

//   // Send request to backend to create user
//   try {
//     const response = await axios.post("http://127.0.0.1:8000/users/token", {
//       username: username.value,
//       password: password.value,
//     }, {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });

//     console.log("logged in successfully!");
//     console.log(response.data);
//   } catch (error) {
//     console.log("Error logging in");
//     console.log(error);
//   }
// };


const formData = ref({
  username: "",
  password: "",
})

function loginUser(data){
  setTimeout(() => {
    console.log(data)

  }, 5000);
}


</script>

<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <RouterLink to="/" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
        <img class="w-25 h-25 mr-2" src="@/assets/logo.svg" alt="logo">

      </RouterLink>
      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Sign in to your account
          </h1>

          <!-- <FormKit type="form" class="space-y-4 md:space-y-6"> -->
            <FormKit type="form" :value="formData" @submit="loginUser"
            >


              <FormKit type="text" name="username" id="username" label="Email"
                validation="required|email" placeholder="name@company.com" />


              <FormKit type="password" name="password" id="password" label="Password"
                validation="required" placeholder="••••••••" />
<!-- 
            <button type="submit"
            class="w-full mt-4 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
            
            Sign in</button> -->


            <!-- </FormKit> -->

          </FormKit>
          <p class="text-sm font-light text-gray-500 dark:text-gray-400">
            Don't have an account yet?
            <RouterLink to="/signup" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
button{
  color: green !important;
}
</style>