import { Component } from 'react';
import { createPipeMap, guid, Injector, mapPipe, request, Update } from '@rapitron/core';
import { CollectionItem, IFolder, RapiService } from './rapi.service';
import React from 'react';
import { Async, ContextMenu, For, Icon, Icons, If, inject, Position, StyledElement, TreeViewComponent, TreeViewNodeComponent } from '@rapitron/react';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

export type RequestTreeComponentProps = {
    injector?: Injector;
};
export type RequestTreeComponentState = {};

export const RequestTreeComponent = inject(class RequestTreeComponent extends Component<RequestTreeComponentProps, RequestTreeComponentState> {

    public readonly rapiService = this.props.injector.get(RapiService);

    constructor(props: RequestTreeComponentProps) {
        super(props);
        // this.rapiService.pullCollection();
    }

    public render() {
        return (
            <div style={{
                display: 'grid',
                // gridTemplateRows: 'max-content auto'
                gridAutoRows: 'max-content'
            }}>
                {/* <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto max-content',
                    background: 'var(--background-secondary-color)',
                    color: 'var(--background-secondary-text-color)',
                    padding: '5px 10px'
                }}>
                    <span style={{
                        padding: '5px',
                    }}>
                        Requests
                    </span>
                    <Icon
                        icon={Icons.Ellipsis}
                        styles={{
                            padding: '5px',
                            '&:hover': {
                                cursor: 'pointer',
                                background: 'var(--background-focus-color)',
                                color: 'var(--background-focus-text-color)'
                            }
                        }}
                        onClick={(event) => {
                            ContextMenu.showRelativeTo({
                                element: event.currentTarget,
                                position: Position.Bottom,
                                render: () => (
                                    <div style={{
                                        margin: '5px',
                                        background: 'var(--background-secondary-color)',
                                        color: 'var(--background-secondary-text-color)',
                                        borderRadius: '5px',
                                        overflow: 'hidden',
                                        boxShadow: 'var(--shadow)',
                                        transform: 'translateX(-50%)'
                                    }}>
                                        <For items={['Create New', 'Delete', 'Export Collection']}>
                                            {item => (
                                                <StyledElement styles={{
                                                    padding: '5px 10px',
                                                    '&:hover': {
                                                        cursor: 'pointer',
                                                        background: 'var(--background-focus-color)',
                                                        color: 'var(--background-focus-text-color)'
                                                    }
                                                }}>
                                                    {item}
                                                </StyledElement>
                                            )}
                                        </For>
                                    </div>
                                )
                            });
                        }}
                    />
                </div> */}
                <TreeViewComponent>
                    <Async select={this.rapiService.collections.select()}>
                        {collections => (
                            <For items={collections}>
                                {collection => {
                                    const renderItems = (ids: string[]) => (
                                        <Async select={this.rapiService.items.select(ids)}>
                                            {items => (
                                                <For items={items}>
                                                    {item => (
                                                        <TreeViewNodeComponent
                                                            id={item.id}
                                                            icon={item.itemType === 'request' ? Icons.Bolt : Icons.Folder}
                                                            text={item.name}
                                                            selectable={item.itemType === 'request'}
                                                            disableExpand={item.itemType === 'request'}
                                                            render={item.itemType === 'request' ? () => (
                                                                <div style={{
                                                                    display: 'grid',
                                                                    gridTemplateColumns: 'max-content auto max-content',
                                                                    gap: '5px',
                                                                    alignItems: 'center'
                                                                }}>
                                                                    <Icon icon={Icons.PaperPlane} />
                                                                    <span>{item.name}</span>
                                                                    <span style={{
                                                                        borderRadius: '2px',
                                                                        background: 'var(--background-focus-color)',
                                                                        color: 'var(--background-focus-text-color)',
                                                                        padding: '2px 5px'
                                                                    }}>{item.method}</span>
                                                                </div>
                                                            ) : null}
                                                        >
                                                            {renderItems((item as IFolder).itemIds)}
                                                        </TreeViewNodeComponent>
                                                    )}
                                                </For>
                                            )}
                                        </Async>
                                    );
                                    return <TreeViewNodeComponent
                                        id={collection.id}
                                        icon={Icons.Stack}
                                        text={collection.name}
                                    >
                                        {renderItems(collection.itemIds)}
                                    </TreeViewNodeComponent>
                                }}
                            </For>
                        )}
                    </Async>
                </TreeViewComponent>
            </div>
        );
    }

});
