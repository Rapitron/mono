import { Injector } from '@rapitron/core';
import { Async, SwitchCase, For, If, Switch } from '@rapitron/react';
import React from 'react';
import { Component, memo } from 'react';
import { AppBuilderService } from './app-builder.service';
import { ElementPluginComponent } from './element-plugin.component';
import { PluginComponent } from './plugin.component';

export type PageProps = {
    injector?: Injector
    id: string;
};

export class PageComponent extends Component<PageProps> {

    public state = {};
    public readonly appBuilderService = this.props.injector.get(AppBuilderService);

    public render() {
        return (
            <div style={{
                position: 'relative',
                height: '100%'
            }}>
                <Async select={this.appBuilderService.pages.select(this.props.id)}>
                    {page => (
                        <For items={page.pluginIds}>
                            {pluginId => <PluginComponent id={pluginId} />}
                        </For>
                    )}
                </Async>
            </div>
        );
    }

}

export default memo(PageComponent);