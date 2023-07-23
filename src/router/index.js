import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import SignUpView from '../views/SignUpView.vue'
import LoginView from '../views/LoginView.vue'
import TermsAndConditionsView from '../views/TermsAndConditionsView.vue'
import HelperView from '../views/HelperView.vue'
import BoardsView from '../views/BoardsView.vue'
import BoardDetailsView from '../views/BoardDetailsView.vue'
import CardDetailsView from '../views/CardDetailsView.vue'
import { useAuthStore } from '@/stores/auth.store';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        public: true
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: AboutView,
      meta: {
        public: true
      }
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView,
      meta: {
        hideNavbar: true,
        public: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        hideNavbar: true,
        public: true
      }
    },
    {
      path: '/terms-and-conditions',
      name: 'terms-and-conditions',
      component: TermsAndConditionsView,
      meta: {
        public: true
      }
    },
    {
      path: '/helper',
      name: 'helper',
      component: HelperView,
      meta: {
        hideNavbar: true,
        public: true
      }
    },
    {
      path: '/boards',
      name: 'boards',
      component: BoardsView,
      meta: {
        public: false
      }
    },

    {
      path: '/board/:id', // The route includes ":id" as a parameter to capture the board ID
      name: 'BoardDetails',
      component: BoardDetailsView,
      children: [
        {
          path: "card/:cardId",
          name: "CardDetails",
          component: CardDetailsView
        }
      ]
    },

  ]
})

router.beforeEach(async (to) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const isPublic = to.meta.public || false
  // const authRequired = !publicPages.includes(to.path);
  const auth = useAuthStore();


  if (isPublic) {

  } else {
    if (!auth.user) {
      auth.returnUrl = to.fullPath;
      return '/login';
    }
  }

});

export default router
