import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./styles/app.css";
import "./styles/fred.css";
// import Antd from 'ant-design-vue';
// import 'ant-design-vue/dist/reset.css';
import { useLocaleStore } from "@/stores/locale";

async function main() {
  const app = createApp(App);
  const pinia = createPinia();

  app.use(router);
  // app.use(Antd);
  app.use(pinia);

  //初始化语言
  const localeStore = useLocaleStore();
  localeStore.initLang();

  app.mount("#app");
}
main();
