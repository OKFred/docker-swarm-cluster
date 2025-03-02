import {
  faQuestionCircle,
  faUser,
  faHome,
  faEnvelope,
  faCalendar,
  faThLarge,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

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
};
export { iconMap };
export type iconMapLike = typeof iconMap;
