import { Api, ApiHtmlResult, ApiModule, ApiParameterSources, HttpMethodTypes, HttpProtocolModule } from '@rapitron/api';
import { json } from '@rapitron/core';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

@ApiModule({

})
export class ApiServer {

}

export async function main() {
    const api = new Api({
        middleware: [],
        hubs: [],
        controllers: [
            {
                route: 'test',
                guards: [
                    (request, injector) => {
                        console.log(request.type);
                        // throw new ApiError(request.type, HttpResponseCodes.Unauthorized);
                    }
                ],
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
                    },
                    {
                        method: HttpMethodTypes.GET,
                        route: 'get2',
                        guards: [],
                        parameters: [
                            {
                                name: 'dog',
                                source: ApiParameterSources.Parameter,
                                type: String,
                                // optional: true
                            }
                        ],
                        call: (request, injector) => {
                            return true;
                        }
                    }
                ]
            }
        ]
    });
    const http = new HttpProtocolModule(api, { port: 5000 });
    console.log(json(api.getInfo()));
}

main();
