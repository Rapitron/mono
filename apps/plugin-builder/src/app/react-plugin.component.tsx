import { Injector, ModuleLoader } from '@rapitron/core';
import { Async, For, Portal } from '@rapitron/react';
import React, { createRef, useRef } from 'react';
import * as ReactModule from 'react';
import ReactDOM from 'react-dom';
import { Component, memo } from 'react';
import { AppBuilderService, IElementPlugin } from './app-builder.service';
import { PluginComponent } from './plugin.component';

export type ReactPluginProps = {
    injector?: Injector;
    id: string;
};

export class ReactPluginComponent extends Component<ReactPluginProps> {

    public readonly containerRef = createRef<HTMLDivElement>();
    public state = {
        component: false
    };
    public readonly appBuilderService: AppBuilderService = this.props.injector.get(AppBuilderService);

    async componentDidMount() {
        const module = await ModuleLoader
            .create()
            .addModule({
                namespace: 'react',
                module: ReactModule
            })
            .addModule({
                namespace: '@sybrin',
                module: {
                    AppBuilderService
                }
            })
            .compile(`
            import React, { Component } from 'react';
            import { AppBuilderService } from '@sybrin';

            export default class Test extends Component {

                state = {
                    count: 0
                };

                render() {
                    const appBuilderService = this.props.injector.get(AppBuilderService);
                    return <button onClick={() => this.setState({ count: this.state.count + 1 })}>{this.state.count} {this.props.text} {appBuilderService.plugins.get().length}</button>;
                }

            }
            `);
        this.setState({
            component: module.default
        });
        console.log(module);
    }

    public render() {
        return (
            <div ref={this.containerRef}>
                <Async select={this.appBuilderService.plugins.select(this.props.id)}>
                    {plugin => {
                        const C: any = this.state.component;
                        return C && <C text='Test' service={this.appBuilderService} />
                        // ReactDOM.render(((props) => element.firstChild) as any, this.containerRef.current)
                    }}
                </Async>
            </div>
        );
    }

}

export default memo(ReactPluginComponent);