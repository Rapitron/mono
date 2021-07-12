import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { guid, request } from '@rapitron/core';
import { $StyleSheet, Button, ButtonTypes, Classes, classes, For, Icons, If, StyledElement, Switch, SwitchCase, TreeView, TreeViewNode } from '@rapitron/react';
import { useState } from 'react';
import { MonacoEditor } from './rapi/monaco-editor.component';
import { } from '@rapitron/react';
import { KeyValueComponent } from './rapi/key-value.component';

function App(props: any) {
    const [state, setState] = useState({
        nodes: [],
        tab: 'Parameters'
    });
    const updateState = (updates: any) => setState({ ...state, ...updates });
    return (
        <div style={{
            height: '100%',
            display: 'grid',
            gridTemplateColumns: '250px auto'
        }}>
            <div style={{
                height: '100%',
                borderRight: '1px solid var(--outline-color)'
            }}>
                <TreeView
                    title='API Modules'
                    actions={[
                        {
                            id: guid(),
                            icon: Icons.Refresh,
                            text: 'Sync',
                            call: async () => {
                                const apis = await request({
                                    url: 'http://localhost:5000/_/apis'
                                });
                                updateState({
                                    nodes: Object.keys(apis.data).map(route => ({
                                        id: guid(),
                                        icon: Icons.Network,
                                        text: route,
                                        actions: [],
                                        nodes: apis.data[route].controllers.map((controller: any) => ({
                                            id: guid(),
                                            icon: Icons.Diagram,
                                            text: controller.route,
                                            actions: [] as any,
                                            nodes: controller.handlers.map((handler: any) => ({
                                                id: guid(),
                                                icon: Icons.Flag,
                                                text: handler.route,
                                                actions: [] as any,
                                                nodes: [] as any
                                            }))
                                        }))
                                    }))
                                });

                            }
                        }
                    ]}
                    nodes={state.nodes}
                />
            </div>
            <div style={{
                display: 'grid',
                gridTemplateRows: 'max-content auto'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'max-content auto max-content',
                    padding: '10px',
                    background: 'var(--background-secondary-color)',
                    color: 'var(--background-secondary-text-color)'
                }}>
                    <StyledElement
                        element='select'
                        styles={{
                            padding: '5px',
                            border: 'none',
                            borderRadius: '5px 0px 0px 5px',
                            background: 'var(--background-select-color)',
                            color: 'var(--background-select-text-color)'
                        }}
                    >
                        <option>ANY</option>
                        <option>GET</option>
                    </StyledElement>
                    <input
                        style={{
                            padding: '5px 10px',
                            border: 'none',
                            background: 'var(--background-tertiary-color)',
                            color: 'var(--background-tertiary-text-color)'
                        }}
                        value='http://localhost:5000/_/apis'
                    />
                    <Button
                        styles={{
                            padding: '5px 10px',
                            borderRadius: '0px 5px 5px 0px',
                        }}
                        type={ButtonTypes.Select}
                        text='Send'
                    />
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateRows: 'max-content auto'
                }}>
                    <div style={{
                        display: 'grid',
                        gridAutoFlow: 'column',
                        gridAutoColumns: 'max-content',
                        justifyContent: 'center',
                        background: 'var(--background-secondary-color)',
                        color: 'var(--background-secondary-text-color)',
                        padding: '10px'
                    }}>
                        <For items={['Parameters', 'Headers', 'Body']}>
                            {tab => (
                                <StyledElement
                                    styles={{
                                        cursor: 'pointer',
                                        padding: '5px 10px',
                                        background: 'var(--background-tertiary-color)',
                                        color: 'var(--background-tertiary-text-color)',
                                        '&:hover': {
                                            background: 'var(--background-focus-color)',
                                            color: 'var(--background-focus-text-color)',
                                        },
                                        '&.selected': {
                                            background: 'var(--background-select-color)',
                                            color: 'var(--background-select-text-color)',
                                        },
                                        '&:first-child': {
                                            borderRadius: '5px 0px 0px 5px'
                                        },
                                        '&:last-child': {
                                            borderRadius: '0px 5px 5px 0px'
                                        }
                                    }}
                                    className={classes({ selected: state.tab === tab })}
                                    onClick={() => updateState({ tab })}
                                >
                                    {tab}
                                </StyledElement>
                            )}
                        </For>
                    </div>
                    <div style={{
                        padding: '10px'
                    }}>
                        <Switch value={state.tab}>
                            <SwitchCase value={'Parameters'}>
                                {() => (
                                    <KeyValueComponent entries={[]} />
                                )}
                            </SwitchCase>
                        </Switch>
                        <Switch value={state.tab}>
                            <SwitchCase value={'Headers'}>
                                {() => <MonacoEditor value={''} />}
                            </SwitchCase>
                        </Switch>
                        <Switch value={state.tab}>
                            <SwitchCase value={'Body'}>
                                {() => <MonacoEditor value={''} />}
                            </SwitchCase>
                        </Switch>
                    </div>
                </div>
            </div>
        </div>
    );
}

ReactDOM.render(
    <App />,
    document.getElementById("root")
);