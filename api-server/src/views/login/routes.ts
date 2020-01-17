import { links, RouteFunc, transition } from '../../routing';
import { IStores } from '../../stores';

const login: RouteFunc = (stores) => {
    const route = links.login().path;
    return {
        $: route,
        enter: () => transition(
            {
                route,
                module: 'login',
                stores,
                nav: ['login'],
            },
        ),
    };
};

export const routes = (stores?: IStores) => ([
    login(stores),
]);
