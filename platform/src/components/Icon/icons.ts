import {
  faQuestionCircle,
  faUser,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const iconMap = {
  "fas:question-circle": faQuestionCircle,
  "fas:user": faUser,
  "fas:home": faHome,
  "far:heart": faHeart,
  "fab:github": faGithub,
};
export { iconMap };
export type iconMapLike = typeof iconMap;
