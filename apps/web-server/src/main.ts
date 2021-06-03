import { WebServer } from '@rapitron/api';
import { $Tson, Any, ConsoleLogger } from '@rapitron/core';

export async function main() {
    const server = new WebServer({
        logger: new ConsoleLogger(),
        controller: {
            ping: {
                schema: String,
                call: (request) => {
                    console.log(request.packet);
                }
            },
            log: {
                schema: {
                    _: {
                        message: Any
                    }
                },
                call: request => {
                    console.log(request.packet);
                }
            },
            sum: {
                schema: {
                    _: {
                        a: Number,
                        b: Number
                    }
                },
                call: (request) => {
                    request.reject('Test');
                    return request.packet.packet.a + request.packet.packet.b;
                }
            },
            info: {
                call: () => Object.keys(server.controller).reduce((info, schema) => ({ ...info, [schema]: $Tson.describeSchema(server.controller[schema].schema) }), {})
            }
        }
    });
    server.start();
}

main();
