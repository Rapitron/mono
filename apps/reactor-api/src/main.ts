import * as RapitronApi from '@rapitron/api';
import { Api, HttpMethodTypes, HttpProtocolModule, HubService, postman, WebProtocolModule } from '@rapitron/api';
import { ConsoleLogger, request, IMap, assignDefaults } from '@rapitron/core';
import * as fs from 'fs';
import { Module } from 'module';
import * as path from 'path';
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
                route: '_',
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
                        route: 'info',
                        guards: [],
                        parameters: [],
                        call: async (request, injector) => {
                            return api.getInfo();
                        }
                    },
                    {
                        method: HttpMethodTypes.GET,
                        route: 'apis',
                        guards: [],
                        parameters: [],
                        call: async (request, injector) => {
                            const apis = {};
                            for (const moduleRoute in config.apis) {
                                const file = config.apis[moduleRoute];
                                const module = compileModuleFromFile({
                                    file: path.join(__dirname, 'test', file),
                                    paths: {
                                        '@plugin': `./test`
                                    }
                                });
                                const api: Api = module();
                                apis[moduleRoute] = api.getInfo();
                            }
                            return apis;
                        }
                    }
                ]
            }
        ]
    };
    // api.bootstrap(ApiServer);
    const http = new HttpProtocolModule(api, { port: 5000 });
    const web = new WebProtocolModule(api.injector, { port: 5001, logger: new ConsoleLogger() });

    const config = compileModuleFromFile({ file: './src/test/rapi.config.ts' });

    for (const moduleRoute in config.apis) {
        api.definition.controllers.push({
            route: moduleRoute,
            guards: [],
            handlers: [{
                method: HttpMethodTypes.ANY,
                route: '{...route}',
                guards: [],
                parameters: [],
                call: async (request) => {
                    const { route } = request.routeParameters;
                    request.route = route;
                    const file = config.apis[moduleRoute];
                    const module = compileModuleFromFile({
                        file: path.join(__dirname, 'test', file),
                        paths: {
                            '@plugin': `./test`
                        }
                    });
                    const api = module();
                    return await api.control(request);
                }
            }]
        });
    }


    console.log(config);

    request({
        url: 'http://localhost:5000/api/plugin/test/get',
    })
        .then(result => console.log(result))
        .catch(result => console.log(result));

    // const socket = await Socket.connect({
    //     url: 'ws://localhost:5001'
    // });
    // try {
    //     const remote = await HubRemote.connect(socket, { hub: 'user' });
    //     remote.on('test').subscribe(() => {
    //         console.log('ALERT');
    //     });
    //     remote.invoke('get', 'test').subscribe(
    //         (result) => {
    //             console.log(result);
    //         },
    //         error => {
    //             console.log(error);
    //         },
    //         () => {
    //             console.log('Done');
    //         });
    // } catch (error) {
    //     console.log(error);
    // }
}

main();

export function compileModuleFromFile(options: { file: string, modules?: IMap<object>, paths?: IMap<string> }) {
    assignDefaults(options, {
        modules: {},
        paths: {}
    });
    const code = fs.readFileSync(options.file, { encoding: 'utf8' });
    return compileModule({
        code,
        modules: options.modules,
        paths: options.paths,
        root: path.dirname(options.file)
    });
}

export function compileModule(options: { code: string, root?: string, modules?: IMap<object>, paths?: IMap<string> }) {
    assignDefaults(options, {
        modules: {},
        paths: {}
    });
    const req = Module.prototype.require;
    Module.prototype.require = function (moduleId: string) {
        let [uri] = arguments;
        if (options.root && uri.startsWith('.')) {
            uri = path.join(options.root, uri);
        }
        const load = (uri: string) => {
            try {
                return req.apply(this, [uri]);
            } catch {
                return req.apply(this, [path.join(options.root, 'node_modules', uri)]);
            }
        };
        return options.modules[moduleId] ?? load(uri);
    } as any;
    const umd = transpileModule(options.code, {}).outputText;
    const module = eval(umd);
    Module.prototype.require = req;
    return module
}
