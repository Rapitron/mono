import { Change, Injector } from '@rapitron/core';
import { $StyleSheet, classes, For, If, inject, useState } from '@rapitron/react';
import React, { Component } from 'react';
import { IStoreExplorerAction } from './action.interface';
import { ChromeExtension } from './chrome-extension.service';

export interface IStoreExploreActionListComponentProps {
    actions: IStoreExplorerAction[];
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

export const StoreExplorerActionListComponent = inject<IStoreExploreActionListComponentProps>((props) => {
    const extension = props.injector.get(ChromeExtension);
    const [state, updateState] = useState<IStoreExplorerActionListComponentState>({});

    return (
        <div className={styles.list}>
                <For items={props.actions}>
                    {action => (
                        <div
                            className={classes(
                                styles.item,
                                { selected: state.selectedAction === action }
                            )}
                            onClick={() => {
                                updateState({
                                    selectedAction: state.selectedAction === action ? null : action,
                                    selectedChange: null
                                });
                                props.onSelectionChange(state.selectedAction === action ? null : action, null);
                            }}>
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
                                        action.breakpoint = !action.breakpoint;
                                        extension.send('breakpoint', {
                                            storeIndex: 0,
                                            action: action.name
                                        });
                                        updateState({});
                                    }}
                                />
                            </div>
                            <div>
                                <If condition={state.selectedAction === action}>
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
                                                        { selected: state.selectedChange === change }
                                                    )}
                                                    onClick={event => {
                                                        event.stopPropagation();
                                                        updateState({
                                                            selectedChange: change
                                                        });
                                                        props.onSelectionChange(action, change);
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
            </div>
    );
});
