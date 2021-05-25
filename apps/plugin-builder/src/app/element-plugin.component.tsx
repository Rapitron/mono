import { Injector } from '@rapitron/core';
import { Async, For } from '@rapitron/react';
import React from 'react';
import { Component, memo } from 'react';
import { AppBuilderService, IElementPlugin } from './app-builder.service';
import { PluginComponent } from './plugin.component';

export type ElementPluginProps = {
    injector?: Injector;
    id: string;
};

export class ElementPluginComponent extends Component<ElementPluginProps> {

    public state = {};
    public readonly appBuilderService: AppBuilderService = this.props.injector.get(AppBuilderService);

    public render() {
        return (
            <Async select={this.appBuilderService.plugins.select(this.props.id)}>
                {plugin => (
                    <For items={(plugin as IElementPlugin).pluginIds}>
                        {id => <PluginComponent id={id} />}
                    </For>
                )}
            </Async>
        );
    }

}

export default memo(ElementPluginComponent);