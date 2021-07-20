import { $Changes, ArrayAdaptor, Change, guid, Store, tryJson, tryParseJson } from '@rapitron/core';
import { Async, If, inject } from '@rapitron/react';
import { cloneDeep, get } from 'lodash';
import React, { createRef } from 'react';
import { tap } from 'rxjs/operators';
import { StoreExplorerActionListComponent } from './action-list.component';
import { ChromeExtension } from './chrome-extension.service';
import { MonacoDiffEditor, MonacoEditor } from './monaco-editor.component';
import { StoreExplorerStoreSelectorComponent } from './store-selector.component';
import { IStoreExplorerStore } from './store.interface';

export interface IStoreExplorerState {
    stores: IStoreExplorerStore[];
    selectedStoreId?: string;
    selectedActionId?: string;
    selectedChangeIndex?: number;
}

export class StoreExplorerService extends Store<IStoreExplorerState> {

    public readonly stores = this.createEntityAdaptor(state => state.stores);
    public readonly selectedStoreId = this.createAdaptor(state => state.selectedStoreId);
    public readonly selectedActionId = this.createAdaptor(state => state.selectedActionId);
    public readonly selectedChangeIndexId = this.createAdaptor(state => state.selectedChangeIndex);
    public readonly querySelectedStore = this.selectedStoreId.query((id) => this.stores.get(id));

    constructor(private extension: ChromeExtension) {
        super({
            state: {
                stores: [],
            }
        });
    }

    public inspect() {
        return this.extension.on<{
            index: number,
            name: string,
            initialState: {},
            state: {},
            action: {
                name: string,
                changes: Change[]
            }
        }>('action').pipe(
            tap(packet => {
                const id = String(packet.index);
                const store = this.stores.get(id);
                if (store) {
                    this.update(
                        'Add Action',
                        this.stores.update(
                            id,
                            state => ({
                                initialState: packet.initialState,
                                actions: packet.action.name === '∴' ? [] : state.actions
                            }),
                            state => ({
                                actions: ArrayAdaptor.add(state.actions, {
                                    id: guid(),
                                    ...packet.action,
                                    timestamp: new Date()
                                })
                            })
                        )
                    );
                } else {
                    this.update(
                        'Add Store With Action',
                        this.stores.create({
                            id: `${packet.index}`,
                            index: packet.index,
                            name: packet.name,
                            initialState: packet.initialState,
                            state: packet.state,
                            actions: [{
                                id: guid(),
                                ...packet.action,
                                timestamp: new Date()
                            }]
                        })
                    );
                }
            })
        );
    }

    public selectStore(id: string) {
        this.update(
            'Select Store',
            this.selectedStoreId.update(id),
            this.selectedActionId.update(null),
            this.selectedChangeIndexId.update(null)
        );
    }

    public selectAction(id: string) {
        this.update(
            'Select Action',
            this.selectedActionId.update(id),
            this.selectedChangeIndexId.update(null)
        );
    }

    public selectChange(index: number) {
        this.update(
            'Select Change',
            this.selectedChangeIndexId.update(index)
        );
    }

}

export const StoreExplorerComponent = inject((props) => {
    const service = props.injector.get(StoreExplorerService);
    const monacoEditorRef = createRef<MonacoEditor>();
    const getActionChangeDiff = () => {
        const store = state.stores.find(store => store.actions.find(action => action.id === state.selectedAction.id));
        let original = {};
        let value = cloneDeep(store.initialState);
        for (const action of store.actions) {
            for (const change of action.changes) {
                value = $Changes.apply(value, [change]);
                if (change === state.selectedChange) {
                    break;
                }
                original = cloneDeep(value);
            }
            if (action === state.selectedAction) {
                break;
            }
        }
        if (state.selectedChange.path) {
            original = get(original, state.selectedChange.path);
            value = get(value, state.selectedChange.path);
        }
        return {
            original: tryJson(original) ?? '',
            value: tryJson(value) ?? ''
        };
    };

    const getStoreActionDiff = () => {
        const store = state.selectedStoreIndex != null ? state.stores.find(store => store.index === state.selectedStoreIndex) : state.stores.find(store => store.actions.find(action => action.id === state.selectedAction.id));
        let original = {};
        let value = cloneDeep(store.initialState);
        for (const action of store.actions) {
            value = $Changes.apply(value, action.changes);
            if (action === state.selectedAction) {
                break;
            }
            original = cloneDeep(value);
        }
        return {
            original: tryJson(original),
            value: tryJson(value)
        };
    };

    const getStoreState = () => {
        const store = state.stores.find(store => store.index === state.selectedStoreIndex);
        let value = cloneDeep(store.initialState);
        for (const action of store.actions) {
            value = $Changes.apply(value, action.changes);
        }
        return tryJson(value) ?? '';
    };

    const getActions = () => {
        if (state.selectedStoreIndex != null) {
            return state.stores.find(store => store.index === state.selectedStoreIndex).actions;
        } else {
            return state.stores.combine(store => store.actions).order(action => action.timestamp);
        }
    };

    return (
        <Async select={service.inspect()}>
            {() => (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '250px auto',
                    height: '100%',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateRows: 'max-content auto',
                        gap: '10px',
                        padding: '10px',
                        height: '100%',
                        overflow: 'hidden'
                    }}>
                        <StoreExplorerStoreSelectorComponent />
                        <StoreExplorerActionListComponent />
                    </div>
                    <If condition={state.selectedAction && !state.selectedChange}>
                        {() => {
                            const diff = getStoreActionDiff();
                            return <MonacoDiffEditor original={diff.original} value={diff.value} />
                        }}
                    </If>
                    <If condition={state.selectedAction && state.selectedChange}>
                        {() => {
                            const diff = getActionChangeDiff();
                            return <MonacoDiffEditor original={diff.original} value={diff.value} />
                        }}
                    </If>
                    <If condition={state.selectedStoreIndex != null && !state.selectedAction}>
                        {() => (
                            <div style={{
                                display: 'grid',
                                gridTemplateRows: 'auto max-content',
                                gap: '10px',
                                padding: '10px',
                                background: 'var(--background-secondary-color)',
                                color: 'var(--background-secondary-text-color)',
                            }}>
                                <MonacoEditor
                                    ref={monacoEditorRef}
                                    value={getStoreState()}
                                />
                                <button
                                    style={{
                                        cursor: 'pointer',
                                        padding: '5px 10px',
                                        border: 'none',
                                        background: 'var(--select-color)',
                                        color: 'var(--select-text-color)'
                                    }}
                                    onClick={() => {
                                        const value = tryParseJson(monacoEditorRef.current.model.getValue());
                                        if (value) {
                                            const changes = $Changes.get(getStoreState(), value);
                                            extension.send('update', {
                                                index: state.selectedStoreIndex,
                                                changes
                                            });
                                        }
                                    }}>
                                    Update
                                </button>
                            </div>
                        )}
                    </If>
                </div>
            )}
        </Async>
    );
});
