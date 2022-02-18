import { createRouter, createWebHistory } from "vue-router";
import Register from "../components/Register";
import ConfigGame from "../components/ConfigGame";
import Board from "../components/Board";

const routes = [
  {
    path: "/",
    name: "Register",
    component: Register,
    props: true,
  },
  {
    path: "/config",
    name: "Config",
    component: ConfigGame,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/game/:id",
    name: "Game",
    component: Board,
    props: true,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  let session = localStorage.getItem("session");
  session = JSON.parse(session);
  if (to.meta.requiresAuth && (!session || !session.userName)) {
    console.log(to);
    return({
      name: "Register",
      params: { redirect: to.fullPath },
    });
  }
});

export default router;
