import { Change, Injector } from '@rapitron/core';
import { $StyleSheet, Async, classes, For, If, inject, useState } from '@rapitron/react';
import React, { Component } from 'react';
import { IStoreExplorerAction } from './action.interface';
import { ChromeExtension } from './chrome-extension.service';
import { StoreExplorerService } from './store-explorer.component';
import { IStoreExplorerStore } from './store.interface';

export interface IStoreExploreActionListComponentProps {
    store: IStoreExplorerStore;
    onSelectionChange: (action: IStoreExplorerAction, change?: Change) => void;
    injector?: Injector;
}

export interface IStoreExplorerActionListComponentState {
    selectedAction?: IStoreExplorerAction;
    selectedChange?: Change;
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

export const StoreExplorerActionListComponent = inject(({ injector }) => {
    const service = injector.get(StoreExplorerService);
    return (
        <div className={styles.list}>
            <Async select={service.select(state => ({
                store: service.stores.get(state.selectedStoreId),
                selectedActionId: state.selectedActionId,
                selectedChangeIndex: state.selectedChangeIndex
            }))}>
                {({ store, selectedActionId, selectedChangeIndex }) => (
                    <For items={store.actions}>
                        {action => (
                            <div
                                className={classes(
                                    styles.item,
                                    { selected: selectedActionId === action.id }
                                )}
                                onClick={() => service.selectAction(action.id)}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'auto max-content',
                                    gap: '5px',
                                    alignContent: 'center'
                                }}>
                                    <div style={{
                                        borderBottom: '1px solid var(--select-color)',
                                        padding: '2px'
                                    }}>
                                        {action.name}
                                    </div>
                                    <div
                                        style={{
                                            width: '10px',
                                            height: '10px',
                                            borderRadius: '50%',
                                            background: action.breakpoint ? 'var(--success-color)' : 'var(--outline-color)'
                                        }}
                                        onClick={() => {
                                            // action.breakpoint = !action.breakpoint;
                                            // extension.send('breakpoint', {
                                            //     storeIndex: props.store.index,
                                            //     action: action.name
                                            // });
                                            // updateState({});
                                        }}
                                    />
                                </div>
                                <div>
                                    <If condition={selectedActionId === action.id}>
                                        {() => (
                                            <For items={action.changes}>
                                                {(change, index) => (
                                                    <div
                                                        style={{
                                                            display: 'grid',
                                                            gridTemplateColumns: '50px auto'
                                                        }}
                                                        className={classes(
                                                            styles.change,
                                                            { selected: selectedChangeIndex === index }
                                                        )}
                                                        onClick={event => {
                                                            event.stopPropagation();
                                                            service.selectChange(index)
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
            </Async>
        </div>
    );
});
