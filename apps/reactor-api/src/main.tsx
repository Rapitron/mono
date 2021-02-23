import { Api, ApiHtmlResult, HttpMethodTypes, HttpProtocolModule } from '@rapitron/api';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

export async function main() {
    const api = new Api();
    const http = new HttpProtocolModule(api, { port: 5000 });
    api.definition = {
        middleware: [],
        hubs: [],
        controllers: [
            {
                route: 'test',
                guards: [],
                handlers: [
                    {
                        method: HttpMethodTypes.GET,
                        route: 'get',
                        guards: [],
                        parameters: [],
                        call: (request, injector) => {
                            return new ApiHtmlResult({
                                result: ReactDOMServer.renderToString(
                                    <button onClick={() => console.log(123)}>Test</button>
                                )
                            });
                        }
                    }
                ]
            }
        ]
    };
}

main();
