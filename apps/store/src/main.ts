import { $Changes, $Reflection, Change, guid, Injector, json, Store } from '@rapitron/core';

export interface IUser {
    id: string;
    name: string;
}

export interface IUsersState {

    users: IUser[];

}

export class UsersStore extends Store<IUsersState> {

    public readonly users = this.createEntityAdaptor(state => state.users);

    constructor() {
        super({
            state: {
                users: []
            }
        });
    }

}

async function test() {

    const injector = new Injector(
        { type: UsersStore }
    );
    const userStore = injector.get(UsersStore);
    userStore.update('', userStore.users.create({
        id: guid(),
        name: 'Rudi'
    }));
    console.log(json(userStore.state));
    const changes = userStore.update('', userStore.users.create({
        id: guid(),
        name: 'Spoon'
    }));
    console.log(changes);
    console.log(json(userStore.users.get()));

}

test();
