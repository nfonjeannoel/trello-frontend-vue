<script setup>
// import SignupButton from '@/components/SignupButton.vue'
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore)
</script>

<template>

  <main>
    <div>
    <header>
      <NavBar />
  </header>
  </div>

  <div class="div" id="radial-bg">
      <div class="container-xl py-0 my-0 pt-5 pt-lg-3">

        <div class="row align-items-md-stretch py-xl-5 py-0 text-center text-lg-start">
          <div class="col-md-6 px-0 py-0 px-xl-3 py-xl-5">
            <div class="h-100 py-5 px-3 text-white">
              <h2 class="display-5"><strong>Trello brings all your tasks, teammates, and tools together</strong></h2>
              <p class="h6 fs-5 my-3">Keep everything in the same place -- even if your team isn't.</p>
             
             
              

              <div v-if="user ? true : false"  class="row"></div>
              <div v-else class="row">
                <div class="col-12 col-lg-8">
                  <input type="email" class="form-control my-3 w-100 fs-6 py-3 d-none d-lg-block" id="floatingInput"
                    placeholder="name@example.com">
                </div>
                <div class="col-12 col-lg-auto">
                  <RouterLink to="/signup" class="btn btn-primary btn-lg my-3 w-100 fs-6 py-3" type="button">Sign up. It's
                    free</RouterLink>
                </div>
              </div>

            </div>
          </div>

          <div class="col-md-6 p-0 p-xl-5">
            <div class="h-100 py-5 px-3">
              <img src="@/assets/img/home_showcase.png" class="d-block mx-lg-auto img-fluid" alt="Bootstrap Themes"
                width="700" height="500" loading="lazy">
            </div>
          </div>


        </div>

      </div>
    </div>


    
  <div>
    <Footer />
  </div>
  </main>


</template>
    
