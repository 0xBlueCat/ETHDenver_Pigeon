import { IPODKNN3HackathonMiddlewareRegister } from "../common";
import { PODKNN3HackathonMiddlewareRegister } from "../middlewareRegister";
import { paramsChecker } from "./paramsChecker";
import { whiteListCheck } from "./whiteListChecker";

export function getDefaultMiddlewareRegister(): IPODKNN3HackathonMiddlewareRegister {
  const register = new PODKNN3HackathonMiddlewareRegister();
  register.register(paramsChecker);
  register.register(whiteListCheck);
  return register;
}
