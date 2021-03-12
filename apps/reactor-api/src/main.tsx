import { Action, Api, ApiError, ApiHub, ApiModule, ApiParameterSources, Controller, Handler, HttpMethodTypes, HttpProtocolModule, HttpResponseCodes, Hub, HubService, postman, WebProtocolModule } from '@rapitron/api';
import { HubRemote, RemoteEvent, RemoteAction } from '@rapitron/api-client';
import { $Changes, $Tson, Inject, Injector, json, Socket, Store, TsonProperty, TsonValidationError } from '@rapitron/core';
import { Observable } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { JsonFilters } from './json-filter';

@Controller({
    route: 'api'
})
export class ApiController {

    @Inject()
    public hubService: HubService;

    @Handler()
    public get() {
        this.hubService.dispatch('user', 'test', 'rudi');
    }

}

@Hub({
    name: 'user'
})
export class UserHub extends ApiHub {

    @Action()
    public get() {
        return [
            { name: 'Rudi', age: 23 },
            { name: 'Stefan', age: 25 }
        ];
    }

}


@ApiModule({
    controllers: [
        ApiController
    ],
    hubs: [
        UserHub
    ]
})
export class ApiServer {

}

export class UserRemote extends HubRemote {

    @RemoteEvent()
    public test: Observable<any>;

    @RemoteAction()
    public get(query: any): Observable<any[]> { return; }

}

declare global {
    export interface Function {
        serialize: any;
        deserialize: any;
        execute: any;
    }
}

Function.prototype.serialize = function (func: Function) {
    const matches = func.toString().match(/^\s*[^(]*\(([^)]*)\)\s*(?:=>)?\s*{(.*)}\s*$/);
    return [
        'window.Function',
        matches[1].trim().split(/\s*,\s*/),
        matches[2]
    ];
};
Function.prototype.deserialize = function (data: [string, string[], string], globals: string[] = []) {
    let expression = `var { ${globals.join(', ')} } = this.globals;`;
    return (data instanceof Array && data[0] == 'window.Function') ? new (Function.bind.apply(Function, [Function].concat(data[1] as any[], [(globals.length ? `eval('${expression}');\n` : '') + data[2] as any]))) : data;
};

export async function main() {
    const api = new Api();
    api.definition = {
        middleware: [],
        hubs: [
            {
                name: 'user',
                guards: [],
                onConnect: () => { },
                onDisconnect: () => { },
                actions: [
                    {
                        name: 'get',
                        guards: [],
                        parameters: [[]],
                        invoke: (request) => {
                            let query = request.packet.parameters[0];
                            query = query ? Function.deserialize(query, Object.keys(JsonFilters)) : () => true;
                            return [
                                { name: 'Rudi', age: 23 },
                                { name: 'Stefan', age: 25 }
                            ].filter(item => query.apply({ globals: JsonFilters }, [item]));
                        }
                    }
                ]
            }
        ],
        controllers: [
            {
                route: 'api',
                guards: [],
                handlers: [
                    {
                        method: HttpMethodTypes.GET,
                        route: 'postman',
                        guards: [],
                        parameters: [],
                        call: () => postman(api.getPostmanCollection('ReactorApi', 'localhost:5000'))
                    },
                    {
                        method: HttpMethodTypes.GET,
                        route: 'get',
                        guards: [],
                        parameters: [],
                        call: (request, injector) => {
                            const hubService = injector.get(HubService);
                            hubService.dispatch('user', 'test', 'rudi');
                        }
                    }
                ]
            }
        ]
    };
    // // api.bootstrap(ApiServer);
    const http = new HttpProtocolModule(api, { port: 5000 });
    const web = new WebProtocolModule(api, { port: 5001 });
    try {
        const socket = new Socket();
        await socket.connect('ws://localhost:5001');
        const remote = await HubRemote.connect(socket, { hub: 'user' });
        const { and, query, or, starts, equals, not, greater, contains, ends, less } = JsonFilters;
        const users = await remote.invoke('get', Function.serialize(
            (item) => { return query(item => item.name, equals('Rudi'))(item); }
        )).pipe(first()).toPromise();
        console.log(users);
        const users2 = await remote.cast(UserRemote).get(Function.serialize(
            (item) => { return query(item => item.name, equals('Rudi'))(item); }
        )).toPromise();
        console.log(users2);
        remote.on('test').pipe(
            tap(result => console.log(result))
        ).subscribe();
    } catch (error) {
        console.log(error);
    }
}

main();