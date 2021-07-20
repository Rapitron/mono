import React from 'react';
import { Async, For, inject } from '@rapitron/react';
import { StoreExplorerService } from './store-explorer.component';

export const StoreExplorerStoreSelectorComponent = inject(({ injector }) => {
    const service = injector.get(StoreExplorerService);
    return (
        <Async select={service.select(state => ({
            selectedStoreId: state.selectedStoreId,
            stores: state.stores
        }))}>
            {({ selectedStoreId, stores }) => (
                <select
                    style={{
                        width: '100%',
                        border: 'none',
                        boxShadow: '0px 0px 2px black',
                        background: 'var(--background-tertiary-color)',
                        color: 'var(--background-tertiary-text-color)',
                        padding: '5px 10px'
                    }}
                    onChange={event => service.selectStore(event.target.value === 'default' ? null : event.target.value)}
                    value={selectedStoreId || 'default'}
                >
                    <option selected disabled value={'default'}>-- Select Store --</option>
                    <For items={stores}>
                        {store => (
                            <option value={store.id}>{store.name}</option>
                        )}
                    </For>
                </select>
            )}
        </Async>
    );
});
