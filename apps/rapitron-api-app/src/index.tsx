import { Adaptor, ArrayAdaptor, getDefaults, guid, Update } from '@rapitron/core';
import { Button, ButtonTypes, classes, ContextMenu, For, Icon, Icons, If, inject, ReactInjector, StyledElement, Switch, SwitchCase, useState } from '@rapitron/react';
import { DevtoolsStore } from './devtools-store.util';
import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { KeyValueComponent } from './rapi/key-value.component';
import { MonacoEditor } from './rapi/monaco-editor.component';
import { RapiService } from './rapi/rapi.service';
import { RequestTreeComponent } from './rapi/request-tree.component';

DevtoolsStore.init();

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

export const TreeViewNodeIndexToken = Symbol();
export const TreeViewStateToken = Symbol();

export const TreeViewNode = inject<{
    id?: string,
    icon: Icons,
    text: string,
    onClick?: (event: React.MouseEvent) => void,
    onRightClick?: (event: React.MouseEvent) => void,
    onSelect?: () => void,
    onDeselect?: () => void
}>((props) => {
    props = getDefaults(props, {
        id: guid(),
        onClick: () => { },
        onSelect: () => { },
        onDeselect: () => { }
    });
    const [state] = useState({
        id: props.id
    });
    const [treeState, updateTreeState] = props.injector.get<any>(TreeViewStateToken);
    const index = props.injector.get<number>(TreeViewNodeIndexToken, true) ?? 0;
    const selected = treeState.selectedNodes.includes(state.id);
    const expanded = treeState.expandedNodes.includes(state.id);

    return <>
        <StyledElement
            styles={{
                display: 'grid',
                gridTemplateColumns: 'max-content max-content auto',
                gap: '5px',
                padding: '2.5px 10px',
                paddingLeft: `${10 * index}px`,
                '&:hover': {
                    cursor: 'pointer',
                    background: TreeViewTheme.item.hover.background,
                    color: TreeViewTheme.item.hover.color
                },
                '&.selected': {
                    background: TreeViewTheme.item.selected.background,
                    color: TreeViewTheme.item.selected.color
                }
            }}
            onClick={(event) => {
                updateTreeState({
                    expandedNodes: ArrayAdaptor.toggle(treeState.expandedNodes, state.id),
                    selectedNodes: [state.id]
                });
                props.onClick(event);
                if (!selected) {
                    props.onSelect();
                } else {
                    props.onDeselect();
                }
            }}
            onContextMenu={event => props.onRightClick(event)}
            className={classes({
                selected
            })}
        >
            <Icon icon={!expanded ? Icons.ChevronRight : Icons.ChevronDown} />
            <Icon icon={props.icon} />
            <span>{props.text}</span>
        </StyledElement>
        <If condition={expanded}>
            {() => (
                <ReactInjector inject={injector => injector.addToken({ type: TreeViewNodeIndexToken, value: index + 1 })}>
                    {props.children}
                </ReactInjector>
            )}
        </If>
    </>;
});

const TreeViewTheme = {
    background: '#282C34',
    color: '#ABB2BF',
    item: {
        hover: {
            background: '#2C313A',
            color: '#C1CCAD',
        },
        selected: {
            background: '#333842',
            color: '#C1CCAD',
        }
    }
};

export const TreeView = function (props: { children: ReactNode }) {
    const state = useState({
        selectedNodes: [],
        expandedNodes: []
    });
    return (
        <div style={{
            overflow: 'auto',
            background: TreeViewTheme.background,
            color: TreeViewTheme.color
        }}>
            <ReactInjector inject={injector => injector.addToken({ type: TreeViewStateToken, value: state })}>
                {props.children}
            </ReactInjector>
        </div>
    );
};
new RapiService();

ReactDOM.render(
    <ReactInjector inject={injector => injector.addType(RapiService)}>
        <TreeView>
            <TreeViewNode icon={Icons.Flag} text='Test'>
                <TreeViewNode icon={Icons.Flag} text='Test' onRightClick={(event) => {
                    ContextMenu.show({
                        location: { x: event.clientX, y: event.clientY },
                        render: () => <div>Test</div>
                    });
                    event.preventDefault();
                }}>

                </TreeViewNode>
            </TreeViewNode>
        </TreeView>
    </ReactInjector>,
    document.getElementById("root")
);