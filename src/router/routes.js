const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "typography", component: () => import("pages/Typography.vue") },
      { path: "colors", component: () => import("pages/Colors.vue") },
      { path: "breakpoints", component: () => import("pages/BreakPoints.vue") },
      { path: "flexGrid1", component: () => import("pages/FlexGrid1.vue") },
      { path: "flexGrid2", component: () => import("pages/FlexGrid2.vue") },
      { path: "move", component: () => import("pages/Move.vue") },
      {
        path: "classesVariables",
        component: () => import("pages/ClassesVariables.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
