import { Component } from 'react';
import { Adaptor, ArrayAdaptor, EntityAdaptor, guid, IMap, Update } from '@rapitron/core';
import React from 'react';
import { Button, ButtonTypes, Classes, For, Icons } from '@rapitron/react';

export type KeyValueEntry = { id: string, key: string, value: string };

export type KeyValueComponentProps = {
    entries: KeyValueEntry[];
    onChange?: (map: IMap<string>) => void;
};

export type KeyValueComponentState = {
    entries: KeyValueEntry[];
};

export class KeyValueComponent extends Component<KeyValueComponentProps, KeyValueComponentState> {

    public state: KeyValueComponentState = {
        entries: []
    };

    constructor(props: KeyValueComponentProps) {
        super(props);
        this.state = {
            entries: props.entries
        };
    }

    public updateState(state: Update<KeyValueComponentState>) {
        this.setState(Adaptor.update(this.state, state));
    }

    public render() {
        return (
            <Classes classes={{
                input: {
                    padding: '5px 10px',
                    border: 'none',
                    background: 'var(--background-secondary-color)',
                    color: 'var(--background-secondary-text-color)',
                    '&:first-child': {
                        borderRight: '1px solid var(--outline-color)',
                        borderRadius: '5px 0px 0px 5px',
                    }
                }
            }}>
                {classes => (
                    <div style={{
                        display: 'grid',
                        gridAutoRows: 'max-content',
                        gap: '5px'
                    }}>
                        <For items={this.state.entries}>
                            {entry => <>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr max-content',
                                    boxShadow: 'var(--shadow)'
                                }}>
                                    <input
                                        className={classes.input}
                                        value={entry.key}
                                        onChange={event => {
                                            entry.key = event.currentTarget.value;
                                            this.forceUpdate();
                                        }}
                                    />
                                    <input
                                        className={classes.input}
                                        value={entry.value}
                                        onChange={event => {
                                            entry.value = event.currentTarget.value;
                                            this.forceUpdate();
                                        }}
                                    />
                                    <Button
                                        type={ButtonTypes.Error}
                                        icon={Icons.Trash}
                                        style={{
                                            borderRadius: '0px 5px 5px 0px',
                                            boxShadow: 'var(--shadow)'
                                        }}
                                        onClick={() => {
                                            this.updateState(state => ({
                                                entries: EntityAdaptor.delete(state.entries, entry.id)
                                            }));
                                        }}
                                    />
                                </div>
                            </>}
                        </For>
                        <Button
                            type={ButtonTypes.Tertiary}
                            icon={Icons.Plus}
                            text='Add'
                            style={{
                                borderRadius: '5px'
                            }}
                            onClick={() => {
                                this.updateState({
                                    entries: this.state.entries.concat({
                                        id: guid(),
                                        key: '',
                                        value: ''
                                    })
                                });
                            }}
                        />
                    </div>
                )}
            </Classes>
        );
    }

}