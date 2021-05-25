import { Store } from '@rapitron/core';

export interface IAppState {
    activePage: string;
}

export class AppService extends Store<IAppState> {

    public readonly activePage = this.createAdaptor(state => state.activePage);

    constructor() {
        super({
            state: {
                activePage: 'pages'
            }
        });
    }

}
