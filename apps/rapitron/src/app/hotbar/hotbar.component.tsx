import '@rapitron/core';
import { Injector } from '@rapitron/core';
import { ContextMenu, For, Icon, Icons, Position, Router } from '@rapitron/react';
import { HotbarService } from '../app.service';
import React from 'react';
import { Component } from 'react';
import { fromEvent } from 'rxjs';
import { first } from 'rxjs/operators';

export interface IHotbarAction {
    icon: Icons;
    text: string;
    call: () => void;
}

export class HotbarComponent extends Component<{ injector?: Injector }> {

    private readonly router = this.props.injector.get(Router);

    public actions: IHotbarAction[] = [
        {
            icon: Icons.Screen,
            text: 'Pages',
            call: () => {
                this.router.navigate('login', { test: true });
            }
        },
        {
            icon: Icons.Diagram,
            text: 'Microflows',
            call: () => {
                this.router.navigate('test');
            }
        },
        {
            icon: Icons.Database,
            text: 'Data',
            call: () => { }
        },
        {
            icon: Icons.Stack,
            text: 'Extensions',
            call: () => { }
        },
        {
            icon: Icons.User,
            text: 'Account',
            call: () => { }
        },
        {
            icon: Icons.Gear,
            text: 'Settings',
            call: () => { }
        }
    ];

    constructor(props: { injector?: Injector }) {
        super(props);
    }

    public componentDidMount() {
        const hotbarService = this.props.injector.get(HotbarService);
        hotbarService.actions.select().subscribe(actions => {
            this.actions = actions.map(action => ({ ...action, call: () => { } }));
            this.forceUpdate();
        });
    }

    public render() {
        return (
            <div style={{
                display: 'grid',
                gridTemplateRows: 'max-content auto',
                height: '100%',
                background: 'var(--background-tertiary-color)',
                color: 'var(--background-tertiary-text-color)',
                overflow: 'hidden'
            }}>
                <div style={{
                    margin: '5px',
                    marginBottom: '0px',
                    width: '40px',
                    height: '40px'
                }}>
                    <img src='assets/rapitron.png' style={{ width: '100%' }} />
                </div>
                <div style={{
                    overflow: 'hidden',
                    overflowY: 'auto',
                    paddingBottom: '10px',
                }}
                    css={`::-webkit-scrollbar { width: 0px; }`}>
                    <For items={this.actions}>
                        {action => (
                            <div
                                style={{
                                    display: 'grid',
                                    justifyContent: 'center',
                                    alignContent: 'center'
                                }}
                            >
                                <div style={{
                                    justifySelf: 'center',
                                    background: 'var(--select-color)',
                                    height: '10px',
                                    width: '1px'
                                }}></div>
                                <div
                                    style={{
                                        position: 'relative',
                                        display: 'grid',
                                        width: '25px',
                                        height: '25px'
                                    }}
                                >

                                    <div
                                        style={{
                                            zIndex: 1,
                                            display: 'grid',
                                            justifyContent: 'center',
                                            borderRadius: '50%',
                                            background: 'var(--background-secondary-color)',
                                            color: 'var(--background-secondary-text-color)',
                                            fontSize: '10px',
                                            width: '25px',
                                            height: '25px',
                                            boxShadow: '0px 0px 5px var(--background-tertiary-color)'
                                        }}
                                        css={`
                                    :hover {
                                        background-color: #06E2CC!important;
                                        color: var(--select-focus-text-color)!important;
                                    }`
                                        }
                                        onMouseEnter={event => {
                                            const menu = ContextMenu.showRelativeTo({
                                                element: event.currentTarget as any,
                                                render: () => (
                                                    <div style={{
                                                        position: 'relative',
                                                        display: 'grid',
                                                        alignContent: 'center',
                                                        padding: '5px 10px',
                                                        paddingLeft: '20px',
                                                        background: 'var(--select-color)',
                                                        color: 'var(--select-text-color)',
                                                        borderRadius: '0px 5px 5px 0px',
                                                        transform: 'translateY(-50%)'
                                                    }}>
                                                        {action.text}
                                                    </div>
                                                )
                                            });
                                            fromEvent(event.currentTarget, 'mouseleave').pipe(first()).toPromise().then(() => {
                                                menu.close();
                                            });
                                        }}
                                        onClick={() => action.call()}
                                    >
                                        <Icon icon={action.icon} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </For>
                </div>
            </div>
        );
    }

}
