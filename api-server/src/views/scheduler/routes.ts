import { links, RouteFunc, transition } from '../../routing';
import { IStores } from '../../stores';

const scheduler: RouteFunc = (stores) => {
    const route = links.scheduler().path;

    return {
        $: route,
        enter: () => transition({
                route,
                module: 'scheduler',
                stores,
                nav: ['scheduler'],
            },
            (s) => s.scheduler.fetchRates(),
        ),
    };
};

export const routes = (stores?: IStores) => ([
    scheduler(stores),
]);
