import { library } from "@fortawesome/fontawesome-svg-core";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faQuestionCircle,
  faUser,
  faHome,
  faEnvelope,
  faCalendar,
  faThLarge,
  faCog,
  faGear,
  faRobot,
  faCarrot,
  faLanguage,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";

const iconMap = {
  "fas:question-circle": faQuestionCircle,
  "fas:user": faUser,
  "fas:home": faHome,
  "far:heart": faHeart,
  "fab:github": faGithub,
  "fas:envelope": faEnvelope,
  "fas:calendar": faCalendar,
  "fas:th-large": faThLarge,
  "fas:cog": faCog,
  "fas:gear": faGear,
  "fas:robot": faRobot,
  "fas:carrot": faCarrot,
  "fas:language": faLanguage,
  "fas:sun": faSun,
  "fas:moon": faMoon,
};
export { iconMap };
library.add(
  faQuestionCircle,
  faUser,
  faHome,
  faHeart,
  faGithub,
  faEnvelope,
  faCalendar,
  faThLarge,
  faCog,
);
