import { guid, Injector } from '@rapitron/core';
import { Async, TreeView } from '@rapitron/react';
import React, { Component } from 'react';
import { AppletBuilderService } from './applet-builder.service';

export class PluginToolboxComponent extends Component<{ injector?: Injector }> {

    public readonly appletBuilderService = this.props.injector.get(AppletBuilderService);

    public render() {
        return (
            <div style={{
                display: 'grid',
                // gridTemplateRows: 'max-content auto'
            }}>
                <Async select={this.appletBuilderService.toolbox.select()}>
                    {toolbox => (
                        <TreeView
                            title='Toolbox'
                            nodes={toolbox.items.map(item => ({
                                id: item.id,
                                icon: item.icon,
                                text: item.name,
                                actions: [],
                                nodes: []
                            }))}
                        />
                    )}
                </Async>
            </div>
        );
    }

}
