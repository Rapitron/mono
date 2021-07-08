import { $Changes, Change, Injector, json, tryJson, tryParseJson } from '@rapitron/core';
import { For, If } from '@rapitron/react';
import { cloneDeep, get } from 'lodash';
import React, { Component } from 'react';
import { StoreExplorerActionListComponent } from './action-list.component';
import { IStoreExplorerAction } from './action.interface';
import { MonacoDiffEditor, MonacoEditor } from './monaco-editor.component';
import { IStoreExplorerStore } from './store.interface';


export interface IStoreExplorerComponentState {
    stores: IStoreExplorerStore[];
    selectedStoreIndex?: number;
    selectedAction?: IStoreExplorerAction;
    selectedChange?: Change;
}

export class StoreExplorerComponent extends Component<{ injector?: Injector }, IStoreExplorerComponentState> {

    public state: IStoreExplorerComponentState = {
        stores: [],
    };

    constructor(props: any) {
        super(props);
        document.addEventListener('rapitron-store', (e) => {
            const data: {
                index: number,
                name: string,
                initialState: {},
                action: {
                    name: string,
                    path: string,
                    changes: Change[]
                }
            } = (window as any).data;
            const store = this.state.stores.find(store => store.index === data.index);
            if (!store) {
                this.setState({
                    ...this.state,
                    stores: this.state.stores.concat({
                        index: data.index,
                        name: data.name,
                        initialState: data.initialState,
                        actions: [{
                            ...data.action,
                            timestamp: new Date()
                        }]
                    })
                });
            } else {
                if (data.action.name === '∴' && !data.action.path) {
                    store.initialState = data.initialState;
                    store.actions = [{
                        ...data.action,
                        timestamp: new Date()
                    }];
                } else {
                    store.actions.push({
                        ...data.action,
                        timestamp: new Date()
                    });
                }
                this.forceUpdate();
            }
        });
    }

    public getActions() {
        if (this.state.selectedStoreIndex != null) {
            return this.state.stores.find(store => store.index === this.state.selectedStoreIndex).actions;
        } else {
            return this.state.stores.combine(store => store.actions).order(action => action.timestamp);
        }
    }

    public render() {
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
                        onChange={event => this.setState({
                            ...this.state,
                            selectedStoreIndex: event.target.value === 'all' ? null : Number(event.target.value),
                            selectedAction: null,
                            selectedChange: null
                        })}
                        value={this.state.selectedStoreIndex}
                    >
                        <option selected value={'all'}>-- All --</option>
                        <For items={this.state.stores}>
                            {store => (
                                <option value={store.index}>{store.name}</option>
                            )}
                        </For>
                    </select>
                    <StoreExplorerActionListComponent
                        actions={this.getActions()}
                        onSelectionChange={(action, change) => this.setState({
                            ...this.state,
                            selectedAction: action,
                            selectedChange: change
                        })}
                    />
                </div>
                <If condition={this.state.selectedAction && !this.state.selectedChange}>
                    {() => {
                        const diff = this.getStoreActionDiff();
                        return <MonacoDiffEditor original={diff.original} value={diff.value} />
                    }}
                </If>
                <If condition={this.state.selectedAction && this.state.selectedChange}>
                    {() => {
                        const diff = this.getActionChangeDiff();
                        return <MonacoDiffEditor original={diff.original} value={diff.value} />
                    }}
                </If>
                <If condition={this.state.selectedStoreIndex != null && !this.state.selectedAction}>
                    {() => (
                        <MonacoEditor
                            value={this.getStoreState()}
                            onChange={value => {
                                const state = tryParseJson(value);
                                if (state) {
                                    const changes = $Changes.get(this.getStoreState(), state);
                                    document.dispatchEvent(new MessageEvent('rapitron-store-update', {
                                        data: {
                                            index: this.state.selectedStoreIndex,
                                            changes
                                        }
                                    }));
                                }
                            }}
                        />
                    )}
                </If>
            </div>
        );
    }

    public getActionChangeDiff() {
        const store = this.state.stores.find(store => store.actions.includes(this.state.selectedAction));
        let original = {};
        let value = cloneDeep(store.initialState);
        for (const action of store.actions) {
            for (const change of action.changes) {
                value = $Changes.apply(value, [change]);
                if (change === this.state.selectedChange) {
                    break;
                }
                original = cloneDeep(value);
            }
            if (action === this.state.selectedAction) {
                break;
            }
        }
        if (this.state.selectedChange.path) {
            original = get(original, this.state.selectedChange.path);
            value = get(value, this.state.selectedChange.path);
        }
        return {
            original: tryJson(original) ?? '',
            value: tryJson(value) ?? ''
        };
    }

    public getStoreActionDiff() {
        const store = this.state.selectedStoreIndex != null ? this.state.stores.find(store => store.index === this.state.selectedStoreIndex) : this.state.stores.find(store => store.actions.includes(this.state.selectedAction));
        let original = {};
        let value = cloneDeep(store.initialState);
        for (const action of store.actions) {
            value = $Changes.apply(value, action.changes);
            if (action === this.state.selectedAction) {
                break;
            }
            original = cloneDeep(value);
        }
        return {
            original: json(original),
            value: json(value)
        };
    }

    public getStoreState() {
        const store = this.state.stores.find(store => store.index === this.state.selectedStoreIndex);
        let value = cloneDeep(store.initialState);
        for (const action of store.actions) {
            value = $Changes.apply(value, action.changes);
        }
        return tryJson(value) ?? '';
    }
}
