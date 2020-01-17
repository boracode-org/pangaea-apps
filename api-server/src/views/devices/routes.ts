import { links, RouteFunc, transition } from "../../routing";
import { IStores } from "../../stores";

const devices: RouteFunc = stores => {
  const route = links.devices().path;

  return {
    $: route,
    enter: () =>
      transition(
        {
          route,
          module: "devices",
          stores,
          nav: ["devices"]
        },
        s => s.appStore.fetchDevices()
      )
  };
};

function createRoutes(stores: IStores | undefined, name: string, moduleName: any = null, navName: any = null) {
  const route = links[name]().path;
  moduleName = moduleName || name;
  navName = navName || name;
  return {
    $: route,
    enter: () =>
      transition(
        {
          route,
          module: moduleName,
          stores,
          nav: [navName]
        },
        s => s.appStore.fetchDevices()
      )
  };
}

export const routes = (stores?: IStores) => [createRoutes(stores, "devices")];
