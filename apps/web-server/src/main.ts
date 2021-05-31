import { WebError, WebServer } from '@rapitron/api';
import { $Tson, Any, ConsoleLogger } from '@rapitron/core';

export async function main() {
    const server = new WebServer({
        logger: new ConsoleLogger(),
        controller: {
            schemas: {
                ping: String,
                log: {
                    _: {
                        message: Any
                    }
                },
                sum: {
                    _: {
                        a: Number,
                        b: Number
                    }
                },
                info: null
            },
            handlers: {
                ping: packet => {
                    return 'pong';
                },
                log: packet => {
                    console.log(packet);
                },
                sum: packet => {
                    throw new WebError('Test');
                    return packet.a + packet.b;
                },
                info: () => {
                    return Object.keys(server.controller.schemas).reduce((info, schema) => ({ ...info, [schema]: $Tson.describeSchema(server.controller.schemas[schema]) }), {})
                }
            }
        }
    });
    server.start();
}

main();
