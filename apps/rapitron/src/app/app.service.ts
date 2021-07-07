import { IEntity, Injectable, Store } from '@rapitron/core';
import { Icons } from '../../../../libs/react/src';

export interface IUser extends IEntity {
    name: string;
}

export interface IAppState {
    users?: IUsersState;
    hotbar?: IHotbarState;
}

@Injectable()
export class AppService extends Store<IAppState> {

    constructor() {
        super({
            state: {}
        });
    }

}

export interface IUsersState {

    users: IUser[];

}

@Injectable()
export class UserService extends Store<IUsersState> {

    public readonly users = this.createEntityAdaptor(state => state.users);

    constructor() {
        super({
            state: {
                users: []
            }
        });
    }

}

export interface IHotbarAction extends IEntity {
    icon: Icons;
    text: string;
}

export interface IHotbarState {

    actions: IHotbarAction[];

}

@Injectable()
export class HotbarService extends Store<IHotbarState> {

    public readonly actions = this.createEntityAdaptor(state => state.actions);

    constructor() {
        super({
            state: {
                actions: []
            }
        });
    }

}