import { Api, HttpMethodTypes } from '@rapitron/api';
import { JsonFilters } from '@plugin/json-filter';

export default function load() {
    return new Api({
        controllers: [
            {
                route: 'test',
                guards: [],
                handlers: [
                    {
                        method: HttpMethodTypes.ANY,
                        route: 'get',
                        guards: [],
                        parameters: [],
                        call: () => [0, 1, 2].filter(JsonFilters.equals(1))
                    }
                ]
            }
        ]
    });
}