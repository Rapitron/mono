import { WebServer } from '@rapitron/api';
import { WebClient } from '@rapitron/api-client';
import { $Tson, Any, ConsoleLogger, guid, Socket } from '@rapitron/core';
import { filter, takeWhile } from 'rxjs/operators';

export async function main() {
    const server = new WebServer({
        logger: new ConsoleLogger(),
        controller: {
            ping: {
                schema: String,
                guards: [
                    (request) => {
                        // request.respond('INTERCEPTED');
                        // request.packet = request.packet.toUpperCase();
                        // throw new WebError('INTERCEPTED');
                    }
                ],
                middleware: [
                    async (request, next) => {
                        request.packet = request.packet.toUpperCase();
                        const result = await next();
                        return result.toUpperCase();
                    }
                ],
                call: (request) => {
                    console.log(request.packet);
                    request.partial('whoops');
                    return 'pong';
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
            },
            herman: {
                schema: {
                    _: {
                        name: String,
                        age: Number
                    }
                },
                call: ({ packet }: { packet: { name: string, age: number } }) => {
                    return `name: ${packet.name}; age: ${packet.age}`;
                }
            }
        }
    });
    server.start();
    const socket = await Socket.connect({
        url: 'ws://localhost:5001',
        autoReconnect: true
    });
    // socket.stream.subscribe(console.log);
    // socket.send({
    //     id: guid(),
    //     schema: 'ping',
    //     packet: '123'
    // });
    WebClient.request(socket, {
        id: guid(),
        schema: 'ping',
        packet: 'ping'
    }).subscribe(console.log, null, () => {
        console.log('done');
    });
}

main();
