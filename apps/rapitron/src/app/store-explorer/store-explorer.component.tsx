import { $Changes, $Reflection, Change, Injector, IStoreAction, json, Store } from '@rapitron/core';
import { $StyleSheet, classes, For, If } from '@rapitron/react';
import { cloneDeep, get } from 'lodash';
import * as monaco from 'monaco-editor';
import React, { Component, createRef, useLayoutEffect } from 'react';
import { PureComponent } from 'react';

export class ME extends PureComponent<{ original?: string, value: string }> {

    private containerRef = createRef<HTMLDivElement>();

    public editor: monaco.editor.IStandaloneDiffEditor;
    public original = monaco.editor.createModel('');
    public value = monaco.editor.createModel('');

    public componentDidMount() {
        this.editor = monaco.editor.createDiffEditor(this.containerRef.current, {
            automaticLayout: true,
            theme: 'vs-dark',
            renderSideBySide: false
        });
        this.original.setValue(this.props.original);
        this.value.setValue(this.props.value);
        this.editor.setModel({
            original: this.original,
            modified: this.value
        });
    }

    public componentDidUpdate() {
        this.original.setValue(this.props.original);
        this.value.setValue(this.props.value);
    }

    public render() {
        return (
            <div
                ref={this.containerRef}
                style={{
                    height: '100%',
                    overflow: 'hidden'
                }}
            />
        );
    }

}

const styles = $StyleSheet.create({
    list: {
        display: 'grid',
        gridAutoRows: 'max-content',
        gap: '5px',
        padding: '5px',
        background: 'var(--background-secondary-color)',
        color: 'var(--background-secondary-text-color)',
        overflow: 'auto'
    },
    item: {
        padding: '10px',
        background: 'var(--background-tertiary-color)',
        color: 'var(--background-tertiary-text-color)',
        boxShadow: '0px 0px 2px black',
        borderLeft: '2px solid transparent',
        '&.selected, .&:hover': {
            borderLeft: '2px solid var(--select-focus-color)'
        }
    },
    change: {
        '&.selected, .&:hover': {
            outline: '2px solid var(--select-focus-color)'
        }
    }
});

export class StoreExplorerComponent extends Component<{ injector?: Injector }> {

    public state: {
        selectedStore?: string,
        selectedAction?: IStoreAction<any> & { changes: Change[] },
        selectedChange?: Change
    } = {};

    public getSelectedStore() {
        const stores = (window as any).stores as Store[];
        return stores.find(store => $Reflection.getType(store).name === this.state.selectedStore);
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
                            selectedStore: event.target.value
                        })}
                        value={this.state.selectedStore}
                    >
                        <option disabled selected value={null}>-- Select Store --</option>
                        <For items={(window as any).stores || []}>
                            {store => (
                                <option value={$Reflection.getType(store).name}>{$Reflection.getType(store).name}</option>
                            )}
                        </For>
                    </select>
                    <div className={styles.list}>
                        <If condition={this.getSelectedStore()}>
                            {() => (
                                <For items={this.getSelectedStore().changes}>
                                    {action => (
                                        <div
                                            className={classes(
                                                styles.item,
                                                { selected: this.state.selectedAction === action }
                                            )}
                                            onClick={() => {
                                                this.setState({
                                                    selectedAction: action,
                                                    selectedChange: null
                                                });
                                            }}>
                                            <div style={{
                                                borderBottom: '1px solid var(--select-color)',
                                                padding: '2px'
                                            }}>
                                                {action.name}
                                            </div>
                                            <div style={{
                                                color: 'var(--placeholder-color)',
                                                padding: '2px'
                                            }}>
                                                {action.path || 'repo'}
                                            </div>
                                            <div>
                                                <If condition={this.state.selectedAction === action}>
                                                    {() => (
                                                        <For items={action.changes}>
                                                            {change => (
                                                                <div
                                                                    style={{
                                                                        display: 'grid',
                                                                        gridTemplateColumns: '50px auto'
                                                                    }}
                                                                    className={classes(
                                                                        styles.change,
                                                                        { selected: this.state.selectedChange === change }
                                                                    )}
                                                                    onClick={event => {
                                                                        event.stopPropagation();
                                                                        this.setState({
                                                                            selectedAction: action,
                                                                            selectedChange: change
                                                                        });
                                                                    }}>
                                                                    <div style={{
                                                                        padding: '5px',
                                                                        background: 'var(--background-select-color)',
                                                                        color: 'var(--background-select-text-color)',
                                                                        textAlign: 'center'
                                                                    }}>
                                                                        {change.operator}
                                                                    </div>
                                                                    <div style={{
                                                                        padding: '5px',
                                                                        background: 'var(--background-focus-color)',
                                                                        color: 'var(--background-focus-text-color)',
                                                                    }}>
                                                                        {change.path || 'this'}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </For>
                                                    )}
                                                </If>
                                            </div>
                                        </div>
                                    )}
                                </For>
                            )}
                        </If>
                    </div>
                </div>
                <If condition={this.state.selectedAction && !this.state.selectedChange}>
                    {() => (
                        <ME original={json(this.getActionState().previousState)} value={json(this.getActionState().state)} />
                    )}
                </If>
                <If condition={this.state.selectedChange}>
                    {() => (
                        <ME original={json(this.getActionChange().previousState)} value={json(this.getActionChange().state)} />
                    )}
                </If>
            </div>
        );
    }

    public getActionChange() {
        const store = this.getSelectedStore();
        let previousState = {};
        let state = cloneDeep(store.initialState);
        for (const action of store.changes) {
            for (const change of action.changes) {
                state = $Changes.apply(state, [change]);
                if (change === this.state.selectedChange) {
                    break;
                }
            }
            if (action === this.state.selectedAction) {
                break;
            }
            previousState = cloneDeep(state);
        }
        return this.state.selectedChange.path ? {
            previousState: get(previousState, this.state.selectedChange.path),
            state: get(state, this.state.selectedChange.path)
        } : {
            previousState,
            state
        };
    }

    public getActionState() {
        const store = this.getSelectedStore();
        let previousState = {};
        let state = cloneDeep(store.initialState);
        for (const action of store.changes) {
            state = $Changes.apply(state, action.changes);
            if (action === this.state.selectedAction) {
                break;
            }
            previousState = cloneDeep(state);
        }
        return {
            previousState,
            state
        };
    }

}
