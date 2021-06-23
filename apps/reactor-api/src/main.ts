import { Api, HttpMethodTypes, HttpProtocolModule, postman, WebProtocolModule, WebClient, HubService } from '@rapitron/api';
import { HubRemote } from '@rapitron/api-client';
import { Socket, ConsoleLogger } from '@rapitron/core';
import * as fs from 'fs';
import { Module } from 'module';
import { transpileModule } from 'typescript';

export async function main() {
    const api = new Api();
    api.definition = {
        middleware: [
            // async (request, next) => {
            //     request.route = `api/plugin/${request.route}`;
            //     return next();
            // }
        ],
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
                        parameters: [String],
                        invoke: (request, injector) => {
                            const service = injector.get(HubService);
                            service.dispatch('user', 'test', true);
                            request.partial(1);
                            request.partial(2);
                            return 3;
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
                        route: 'plugin/{...route}',
                        guards: [],
                        parameters: [],
                        call: async (request, injector) => {
                            const path = `./src/${request.routeParameters['api']}/main.ts`;
                            const data = fs.readFileSync(path, { encoding: 'utf8' });
                            const module = compileModule({
                                code: data,
                                paths: {
                                    '@plugin': `./${request.routeParameters['api']}`
                                }
                            });
                            const api: Api = module();
                            request.route = request.routeParameters['route'];
                            return api.control(request);
                        }
                    }
                ]
            }
        ]
    };
    // api.bootstrap(ApiServer);
    const http = new HttpProtocolModule(api, { port: 5000 });
    const web = new WebProtocolModule(api.injector, { port: 5001, logger: new ConsoleLogger() });

    const socket = new Socket();
    await socket.connect('ws://localhost:5001');
    try {
        const remote = await HubRemote.connect(socket, { hub: 'user' });
        remote.on('test').subscribe(() => {
            console.log('ALERT');
        });
        remote.invoke('get', 'test').subscribe(
            (result) => {
                console.log(result);
            },
            error => {
                console.log(error);
            },
            () => {
                console.log('Done');
            });
    } catch (error) {
        console.log(error);
    }
}

main();

export function compileModule(options: { code: string, paths: { [path: string]: string | object } }) {
    const require = Module.prototype.require;
    Module.prototype.require = function interceptor(moduleId: string) {
        if (moduleId in options.paths) {
            const dep = options.paths[moduleId];
            return typeof dep === 'string' ? require.apply(this, [dep]) : dep;
        } else {
            for (const path in options.paths) {
                if (moduleId.startsWith(path)) {
                    return require.apply(this, [moduleId.replace(path, options.paths[path] as string)])
                }
            }
            return require.apply(this, arguments);
        }
    } as any;
    const moduleText = transpileModule(options.code, {}).outputText;
    const module = eval(moduleText);
    Module.prototype.require = require;
    return module;
}
