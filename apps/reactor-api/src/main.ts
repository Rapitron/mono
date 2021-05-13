import { Api, HttpMethodTypes, HttpProtocolModule, postman, WebProtocolModule, ApiFileResult, ApiParameterSources } from '@rapitron/api';
import { json } from '@rapitron/core';
import { transpileModule } from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import { Module } from 'module';

export async function main() {
    const api = new Api();
    api.definition = {
        middleware: [
            // async (request, next) => {
            //     request.route = `api/plugin/${request.route}`;
            //     return next();
            // }
        ],
        hubs: [],
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
    const web = new WebProtocolModule(api, { port: 5001 });
}

main();

export function compileModule(options: { code: string, paths: { [path: string]: string | object } }) {
    const req = Module.prototype.require;
    Module.prototype.require = function interceptor(moduleId: string) {
        if (moduleId in options.paths) {
            const dep = options.paths[moduleId];
            return typeof dep === 'string' ? req.apply(this, [dep]) : dep;
        } else {
            for (const path in options.paths) {
                if (moduleId.startsWith(path)) {
                    return req.apply(this, [moduleId.replace(path, options.paths[path] as string)])
                }
            }
            return req.apply(this, arguments);
        }
    } as any;
    const moduleText = transpileModule(options.code, {}).outputText;
    const module = eval(moduleText);
    Module.prototype.require = req;
    return module;
}
