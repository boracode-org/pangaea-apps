import { IStores } from "stores";
import { routes as LoginRoutes } from "../views/login/routes";
import { routes as CurrencyRoutes } from "../views/scheduler/routes";
import { routes as HomeRoutes } from "../views/home/routes";
import { routes as DevicesRoutes } from "../views/devices/routes";

import { RouteConfig } from "yester";
import { transition } from "./stateful-funcs";
import { lazyLoad } from "fuse-tools";

/**
 * Functions to generate links easily
 */
const links = {
  home: () => ({ path: `/`, name: "Home" }),
  login: () => ({ path: `/login`, name: "Login" }),
  scheduler: () => ({ path: `/scheduler`, name: "Scheduler" }),

  devices: () => ({ path: `/devices`, name: "Devices" })
};

export const asyncRoutes = {
  login: {
    instructions: "views/login/components/**",
    entrypoint: "views/login/components/index.tsx"
  },
  home: {
    instructions: "views/home/components/**",
    entrypoint: "views/home/components/index.tsx"
  },
  scheduler: {
    instructions: "views/scheduler/components/**",
    entrypoint: "views/scheduler/components/index.tsx"
  },
  devices: {
    instructions: "views/devices/components/**",
    entrypoint: "views/devices/components/index.tsx"
  }
};

export type IAsyncRoutes = keyof typeof asyncRoutes;

export type RouteFunc = (stores?: IStores) => RouteConfig;

function notFound(stores?: IStores): RouteConfig {
  return {
    $: "*",
    enter: () => transition({ route: "*", stores }, async s => s.router.setStatus(404))
  };
}

export function Routes(stores?: IStores): RouteConfig[] {
  return [...LoginRoutes(stores), ...CurrencyRoutes(stores), ...HomeRoutes(stores), ...DevicesRoutes(stores), notFound(stores)];
}

export { links, transition };
