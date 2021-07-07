import { Change, Injector } from '@rapitron/core';
import { $StyleSheet, classes, For, If } from '@rapitron/react';
import React, { Component } from 'react';
import { IStoreExplorerAction } from './action.interface';

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

export class StoreExplorerActionListComponent extends Component<IStoreExploreActionListComponentProps, IStoreExplorerActionListComponentState> {

    public state: IStoreExplorerActionListComponentState = {};

    public render() {
        return (
            <div className={styles.list}>
                <For items={this.props.actions}>
                    {action => (
                        <div
                            className={classes(
                                styles.item,
                                { selected: this.state.selectedAction === action }
                            )}
                            onClick={() => {
                                this.setState({
                                    ...this.state,
                                    selectedAction: action,
                                    selectedChange: null
                                });
                                this.props.onSelectionChange(action, null);
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
                                {action.path}
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
                                                            ...this.state,
                                                            selectedChange: change
                                                        });
                                                        this.props.onSelectionChange(action, change);
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
    }

}