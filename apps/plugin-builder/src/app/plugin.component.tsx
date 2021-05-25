import { Injector } from '@rapitron/core';
import { Async, Switch, SwitchCase } from '@rapitron/react';
import React from 'react';
import { Component, memo } from 'react';
import { AppBuilderService } from './app-builder.service';
import { ElementPluginComponent } from './element-plugin.component';
import { onElementDrag } from './on-element-drag.function';
import { ReactPluginComponent } from './react-plugin.component';

export type PluginProps = {
    injector?: Injector;
    id: string;
};

export class PluginComponent extends Component<PluginProps> {

    public state = {};
    public readonly appBuilderService: AppBuilderService = this.props.injector.get(AppBuilderService);

    public render() {
        return (
            <Async select={this.appBuilderService.plugins.select(this.props.id)}>
                {plugin => (
                    <div
                        style={{
                            ...plugin.style,
                            overflow: 'hidden',
                            resize: 'both',
                            position: 'absolute',
                            left: `${plugin.position.x}px`,
                            top: `${plugin.position.y}px`,
                            width: `${plugin.size.width}px`,
                            height: `${plugin.size.height}px`
                        }}
                        css={plugin.css}
                        onMouseDown={event => onElementDrag(
                            event,
                            delta => {
                                this.appBuilderService.update(
                                    '',
                                    this.appBuilderService.plugins.update(
                                        this.props.id,
                                        plugin => ({
                                            position: {
                                                x: plugin.position.x + delta.x,
                                                y: plugin.position.y + delta.y
                                            }
                                        })
                                    )
                                )
                            }
                        )}
                    >
                        {plugin.id}
                        <Switch value={plugin.type}>
                            <SwitchCase value='element'>
                                {() => <ElementPluginComponent id={this.props.id} />}
                            </SwitchCase>
                            <SwitchCase value='react'>
                                {() => <ReactPluginComponent id={this.props.id} />}
                            </SwitchCase>
                        </Switch>
                    </div>
                )}
            </Async>
        );
    }

}

export default memo(PluginComponent);