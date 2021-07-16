import { Button, ButtonTypes, classes, For, Icon, Icons, If, inject, ReactInjector, StyledElement, Switch, SwitchCase } from '@rapitron/react';
import React, { Component, useState } from 'react';
import { createRef } from 'react';
import { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { $Reflection, Injector } from '../../../libs/core/src';
import './index.scss';
import { KeyValueComponent } from './rapi/key-value.component';
import { MonacoEditor } from './rapi/monaco-editor.component';
import { RapiService } from './rapi/rapi.service';
import { RequestTreeComponent } from './rapi/request-tree.component';

export enum StyleVars {
    Primary = 'var(--primary)',
    Secondary = 'var(--secondary)',

}

export const Theme = {
    Colors: {
        Primary: '#6E87EB',
        Secondary: '#394774',
        Background: {
            Primary: '#3D4B78',
            Secondary: '#263051',
            Tertiary: '#1C233F'
        }
    },
    TextColors: {
        Primary: '#FFFFF5',
        Secondary: '#F0F9FF',
        Background: {
            Primary: '#BCC9F1',
            Secondary: '#BCC9F1',
            Tertiary: '#6E87EB'
        }
    },
    Gradients: {
        Primary: 'linear-gradient(to bottom, #6E87EB, #394774)',
        Secondary: 'linear-gradient(to bottom, #394774, #323F6B)',
        Background: {
            Primary: 'linear-gradient(to bottom right, #3D4B78, #253050)',
            Secondary: 'linear-gradient(to bottom right, #2C3860, #181E34)'
        }
    },
    Shadows: {
        Default: '0px 0px 5px #1C233F'
    }
};

export interface IActionBarProps {
    actions: string[];
}

function AppSidebarMenu() {
    const items = [
        {
            icon: Icons.Flag,
            selected: true
        },
        {
            icon: Icons.Bolt
        },
        {
            icon: Icons.Database
        }
    ];
    return (
        <div style={{
            display: 'grid',
            gridAutoRows: 'max-content',
            gap: '5px',
            background: Theme.Colors.Background.Tertiary,
            color: Theme.TextColors.Background.Tertiary,
            padding: '5px'
        }}>
            <For items={items}>
                {item => (
                    <>
                        <StyledElement styles={{
                            padding: '10px',
                            borderRadius: '5px',
                            '&:hover': {
                                cursor: 'pointer',
                                background: Theme.Gradients.Secondary,
                                color: Theme.TextColors.Secondary
                            },
                            '&.selected': {
                                background: Theme.Gradients.Primary,
                                color: Theme.TextColors.Primary,
                            }
                        }} className={classes({ selected: item.selected })}>
                            <Icon icon={item.icon} />
                        </StyledElement>
                    </>
                )}
            </For>
        </div>
    );
}

function AppHeader() {
    return (
        <div>

        </div>
    );
}

function App(props: any) {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'max-content auto',
            height: '100%'
        }}>
            <AppSidebarMenu />
            <div style={{
                display: 'grid',
                gridTemplateColumns: '250px auto',
                gap: '10px'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateRows: 'max-content auto',
                    borderRadius: '5px',
                    background: Theme.Gradients.Background.Secondary,
                    color: Theme.TextColors.Background.Secondary,
                    padding: '10px'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'auto max-content',
                        borderRadius: '5px',
                        overflow: 'hidden',
                        background: Theme.Colors.Background.Secondary,
                        color: Theme.TextColors.Background.Secondary,
                        boxShadow: Theme.Shadows.Default
                    }}>
                        <p style={{
                            padding: '5px 10px'
                        }}>
                            Requests
                        </p>
                        <Icon icon={Icons.Ellipsis} styles={{
                            padding: '5px 10px',
                            '&:hover': {
                                background: Theme.Gradients.Secondary,
                                color: Theme.TextColors.Secondary,
                            }
                        }} />
                    </div>
                    <RequestTreeComponent />
                </div>
                <div>
                </div>
            </div>
        </div>
    );
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
                <RequestTreeComponent />
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
                            padding: '5px',
                            borderRadius: '0px 5px 5px 0px',
                        }}
                        type={ButtonTypes.Select}
                        icon={Icons.PaperPlane}
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
    // <ReactInjector inject={injector => injector.addToken({ type: Test, value: 'A' })}>
    <ReactInjector inject={injector => injector.addType(RapiService)}>
        <App />
    </ReactInjector>,
    document.getElementById("root")
);