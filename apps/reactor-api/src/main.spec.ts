import { Api, ApiError, ApiModule, Controller, Handler, HttpMethodTypes } from '@rapitron/api/src';

@Controller({
    route: 'api'
})
export class TestController {
    @Handler()
    get() { return true; }
}
@ApiModule({
    controllers: [TestController]
})
export class TestModule { }

describe('', () => {
    it('', async () => {
        const api = new Api({
            controllers: [
                {
                    guards: [],
                    route: 'api',
                    handlers: [
                        {
                            guards: [],
                            method: HttpMethodTypes.ANY,
                            route: 'get',
                            parameters: [],
                            call: () => {
                                return true;
                            }
                        }
                    ]
                }
            ]
        });
        const result = await api.control({
            route: 'api/get'
        });
        expect(result).toBeTruthy();
        // try {
        // } catch (error) {
        //     expect(error instanceof ApiError).toBeTruthy();
        //     expect(error).toBeDefined();
        // }
    });

    it('', async () => {

        const api = new Api();
        api.bootstrap(TestModule);
        const result = await api.control({
            route: 'api/get'
        });
        expect(result).toBeTruthy();
        // try {
        // } catch (error) {
        //     expect(error instanceof ApiError).toBeTruthy();
        //     expect(error).toBeDefined();
        // }
    });
});