import { IEntity, Injectable, Store } from '@rapitron/core';

export interface IPage extends IEntity {
    name: string;
}

export interface IAppState {
    pages: IPage[];
}

@Injectable()
export class AppService extends Store<IAppState> {

    public readonly pages = this.createEntityAdaptor(state => state.pages);

    constructor() {
        super({
            state: {
                pages: []
            }
        });
    }

}
