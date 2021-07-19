import { $Changes, $Reflection, Change, Store } from '@rapitron/core';

type DevtoolsMessage<TType extends string, TData = any> = { type: TType, data: TData };
type UpdateMessage = DevtoolsMessage<'update', {
    index: number,
    changes: Change[]
}>;
type BreakpointMessage = DevtoolsMessage<'breakpoint', {
    storeIndex: number,
    action: string
}>;
type DevtoolsMessages = UpdateMessage | BreakpointMessage;

export class DevtoolsStore {

    public static win: Window & { stores: Store[] } = window as any;
    public static breakpoints: { storeIndex: number, action: string }[] = [];

    private static onMessage(message: DevtoolsMessages) {
        switch (message.type) {
            case 'update':
                const { index, changes } = message.data;
                const store = this.win.stores[index];
                if (store) {
                    store.update('•', state => $Changes.apply(state, changes));
                }
                break;
            case 'breakpoint':
                const { storeIndex, action } = message.data;
                const breakpoint = this.breakpoints.find(breakpoint => breakpoint.storeIndex === storeIndex && breakpoint.action === action);
                if (breakpoint) {
                    this.breakpoints.remove(breakpoint);
                } else {
                    this.breakpoints.push({
                        storeIndex,
                        action
                    });
                }
                break;
        }
    }

    public static inspect(store: Store) {
        this.win.stores.push(store);
        store.before().subscribe(action => {
            if (this.breakpoints.find(breakpoint => breakpoint.action === action.name)) {
                debugger;
            }
        });
        store.on().subscribe((action) => {
            document.dispatchEvent(new MessageEvent('rse', {
                data: {
                    type: 'action',
                    data: {
                        index: this.win.stores.indexOf(store),
                        name: $Reflection.getType(store).name,
                        initialState: store.initialState,
                        state: store.state,
                        action: {
                            name: action.name,
                            changes: action.changes
                        }
                    }
                }
            }));
        });
    }

    public static init() {
        this.win.stores = [];
        document.addEventListener('rse', event => {
            const message = (event as any).data;
            this.onMessage(message);
        });
        Store.onRegister.subscribe(store => DevtoolsStore.inspect(store));
    }

}
