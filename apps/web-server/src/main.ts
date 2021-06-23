import { WebServer } from '@rapitron/api';
import { } from '@rapitron/api-client';
import { $Tson, Any, ConsoleLogger, guid, Socket } from '@rapitron/core';
import { filter, takeWhile } from 'rxjs/operators';

export class WebClient {

    constructor(private socket: Socket) {

    }

    public request(request: { id: string, schema: string, packet: any }) {
        return WebClient.request(this.socket, request);
    }

    public static request(socket: Socket, request: { id: string, schema: string, packet: any }) {
        const stream = socket.stream.pipe(
            filter(response => response.id === request.id),
            takeWhile(response => !('result' in response || 'error' in response), true)
        );
        socket.send(request);
        return stream;
    }

}

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
            }
        }
    });
    server.start();
    const socket = await Socket.create({
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
