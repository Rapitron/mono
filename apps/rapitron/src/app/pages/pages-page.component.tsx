import { createPipeMap, guid, Injector, mapPipe } from '@rapitron/core';
import { Alert, Async, Icons, Prompt, TreeView } from '@rapitron/react';
import { AppletBuilderService } from '../applet/applet-builder.service';
import React from 'react';
import { Component } from 'react';

export class PagesPageComponent extends Component<{ injector?: Injector }> {

    public readonly appletBuilderService = this.props.injector.get(AppletBuilderService);

    public render() {
        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: '250px auto 250px',
                gap: '10px',
                padding: '10px',
            }}>
                <div style={{
                    boxShadow: 'var(--shadow)'
                }}>
                    <Async select={createPipeMap().pipe(
                        mapPipe(() => ({ pages: this.appletBuilderService.pages.select() })),
                        mapPipe(() => ({ plugins: this.appletBuilderService.plugins.select() })),
                    )}>
                        {data => (
                            <TreeView
                                title='Pages'
                                actions={[
                                    {
                                        id: guid(),
                                        icon: Icons.Trash,
                                        text: 'Delete',
                                        call: () => { }
                                    },
                                    {
                                        id: guid(),
                                        icon: Icons.Plus,
                                        text: 'Create',
                                        call: async () => {
                                            const name = await Prompt.show({
                                                title: 'Create Page',
                                                text: 'Page Name',
                                                placeholder: 'Page'
                                            });
                                            if (name) {
                                                this.appletBuilderService.update(
                                                    'Create Page',
                                                    this.appletBuilderService.pages.create({
                                                        id: guid(),
                                                        name,
                                                        pluginIds: []
                                                    })
                                                );
                                            }
                                        }
                                    }
                                ]}
                                nodes={data.pages.map(page => ({
                                    id: page.id,
                                    icon: Icons.File,
                                    text: page.name,
                                    actions: [],
                                    nodes: data.plugins
                                        .filter(plugin => page.pluginIds.includes(plugin.id))
                                        .map(plugin => ({
                                            id: plugin.id,
                                            icon: plugin.icon,
                                            text: plugin.name,
                                            actions: [],
                                            nodes: []
                                        }))
                                }))}
                            />
                        )}
                    </Async>
                </div>
                <div style={{
                    boxShadow: 'var(--shadow)'
                }}>

                </div>
                <div style={{
                    boxShadow: 'var(--shadow)'
                }}>

                </div>
            </div>
        );
    }

}
