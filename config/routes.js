export default [
  {
    path: "/",
    component: "../layouts",
    routes: [
      {
        path: "/",
        redirect: "/home",
      },
      {
        path: "/home",
        name: "首页",
        component: "./Home",
      },
    ],
  },
];
