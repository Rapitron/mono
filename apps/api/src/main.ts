import { Api, HttpMethodTypes } from '@rapitron/api';

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
                        call: () => true
                    }
                ]
            }
        ]
    });
}