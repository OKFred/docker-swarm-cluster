import { createRouter, createWebHistory, } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
const modules = import.meta.glob('@/pages/**/index.vue');
const routes: Array<RouteRecordRaw> = [];

for (const path in modules) {
  const routePath = path
    .replace('/src', '')
    .replace('/pages', '')
    .replace('/index.vue', '')
    .toLowerCase();
  const routeName = routePath.split('/').filter(Boolean).map(segment => segment.charAt(0).toUpperCase() + segment.slice(1)).join('');
  routes.push({
    path: routePath || '/',
    name: routeName || 'Index',
    component: modules[path]
  });
}
console.table(routes);
 
const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;