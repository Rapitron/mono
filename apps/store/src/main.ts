import { Adaptor, Store, Update } from '@rapitron/core';

export interface IAddress {
    number: number;
    street: string;
}

export interface IUser {
    id: string;
    name: string;
    address?: IAddress;
}

export interface IUserState {
    users: IUser[];
}

export class UserStore extends Store<IUserState> {

    public readonly users = this.createEntityAdaptor(state => state.users);
    public readonly queryUserAddress = this.query((props: { userId: string }) => this.users.get(props.userId).address);

    constructor() {
        super({
            state: {
                users: []
            }
        });
    }

    public updateAdress(userId: string, address: Update<IAddress>) {
        this.update('',
            this.users.update(userId, user => ({
                address: Adaptor.update(user.address, address)
            }))
        );
    }
}

export async function main() {
    const store = new UserStore();
    store.update('', { users: [{ id: '0', name: 'Stefan' }, { id: '1', name: 'Rudi' }, { id: '2', name: 'Rudi' }] });

    const queryUserByName = store
        .query((params: { name: string }) => store.users.get(user => user.name === params.name))
        .query((users, params: { id: string }) => users.find(user => user.id === params.id));
    queryUserByName.select({ id: '1', name: 'Rudi' }).subscribe(console.log);
    store.updateAdress('1', {
        number: 0
    });
    const q = store.query((parms: {}) => []);
}

main();
