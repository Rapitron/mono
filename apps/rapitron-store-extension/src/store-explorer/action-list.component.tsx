import { Change, Injector } from '@rapitron/core';
import { $StyleSheet, classes, For, If } from '@rapitron/react';
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

export class StoreExplorerActionListComponent extends Component<IStoreExploreActionListComponentProps, IStoreExplorerActionListComponentState> {

    private extension = this.props.injector.get(ChromeExtension);
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
                                    selectedAction: this.state.selectedAction === action ? null : action,
                                    selectedChange: null
                                });
                                this.props.onSelectionChange(this.state.selectedAction === action ? null : action, null);
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
                                        this.extension.send('breakpoint', {
                                            action: action.name
                                        });
                                        this.forceUpdate();
                                    }}
                                />
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