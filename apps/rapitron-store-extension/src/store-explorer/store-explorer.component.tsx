import { $Changes, Change, tryJson, tryParseJson } from '@rapitron/core';
import { For, If, inject, useState } from '@rapitron/react';
import { cloneDeep, get } from 'lodash';
import React, { createRef, useEffect } from 'react';
import { StoreExplorerActionListComponent } from './action-list.component';
import { IStoreExplorerAction } from './action.interface';
import { ChromeExtension } from './chrome-extension.service';
import { MonacoDiffEditor, MonacoEditor } from './monaco-editor.component';
import { IStoreExplorerStore } from './store.interface';

export interface IStoreExplorerComponentState {
    stores: IStoreExplorerStore[];
    selectedStoreIndex?: number;
    selectedAction?: IStoreExplorerAction;
    selectedChange?: Change;
}

export const StoreExplorerComponent = inject((props) => {
    const [state, updateState] = useState<IStoreExplorerComponentState>({
        stores: []
    });
    const extension = props.injector.get(ChromeExtension);
    useEffect(() => {
        extension.on<{
            index: number,
            name: string,
            initialState: {},
            state: {},
            action: {
                name: string,
                changes: Change[]
            }
        }>('action').subscribe(packet => {
            const store = state.stores.find(store => store.index === packet.index);
            if (!store) {
                updateState({
                    stores: state.stores.concat({
                        index: packet.index,
                        name: packet.name,
                        initialState: packet.initialState,
                        state: packet.state,
                        actions: [{
                            ...packet.action,
                            timestamp: new Date()
                        }]
                    })
                });
            } else {
                if (packet.action.name === '∴') {
                    store.initialState = packet.initialState;
                    store.actions = [{
                        ...packet.action,
                        timestamp: new Date()
                    }];
                } else {
                    store.actions.push({
                        ...packet.action,
                        timestamp: new Date()
                    });
                }
                store.state = packet.state;
                updateState({});
            }
        });
    }, []);
    const monacoEditorRef = createRef<MonacoEditor>();
    const getActionChangeDiff = () => {
        const store = state.stores.find(store => store.actions.includes(state.selectedAction));
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
        const store = state.selectedStoreIndex != null ? state.stores.find(store => store.index === state.selectedStoreIndex) : state.stores.find(store => store.actions.includes(state.selectedAction));
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
                <select
                    style={{
                        width: '100%',
                        border: 'none',
                        boxShadow: '0px 0px 2px black',
                        background: 'var(--background-tertiary-color)',
                        color: 'var(--background-tertiary-text-color)',
                        padding: '5px 10px'
                    }}
                    onChange={event => updateState({
                        selectedStoreIndex: event.target.value === 'all' ? null : Number(event.target.value),
                        selectedAction: null,
                        selectedChange: null
                    })}
                    value={state.selectedStoreIndex}
                >
                    <option selected value={'all'}>-- All --</option>
                    <For items={state.stores}>
                        {store => (
                            <option value={store.index}>{store.name}</option>
                        )}
                    </For>
                </select>
                <StoreExplorerActionListComponent
                    actions={getActions()}
                    onSelectionChange={(action, change) => updateState({
                        selectedAction: action,
                        selectedChange: change
                    })}
                />
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
                                const state = tryParseJson(monacoEditorRef.current.model.getValue());
                                if (state) {
                                    const changes = $Changes.get(getStoreState(), state);
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
    );
});
