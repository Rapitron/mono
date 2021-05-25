import { ArrayAdaptor, guid, Injector } from '@rapitron/core';
import { Async, For, Icon, Icons, If, Window, WindowState } from '@rapitron/react';
import React, { Component, Fragment } from 'react';
import { MacroService } from './macro.service';
import { TaskOverlayComponent } from './task-overlay.component';
import { remote } from 'electron';

export class AppComponent extends Component<{ injector?: Injector }> {

    public readonly macroService = this.props.injector.get(MacroService);

    public render() {
        return (
            <Async null={true} select={this.macroService.querySelectedMacro.select({})}>
                {selectedMacro => (
                    <Fragment>
                        <div style={{
                            height: '100%',
                            display: 'grid',
                            background: 'rgba(30, 30, 30, 0.5)'
                        }}>
                            <TaskOverlayComponent />
                            <Window
                                title={'Config'}
                                state={WindowState.Normal}
                                width={200}
                                onStateChange={state => {
                                    if (state === WindowState.None) {
                                        remote.getCurrentWindow().close();
                                    }
                                }}
                            >
                                <div>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'auto max-content max-content max-content'
                                    }}>

                                        <select
                                            style={{
                                                width: '100%',
                                                border: 'none',
                                                background: 'var(--background-color)',
                                                color: 'var(--background-text-color)',
                                                padding: '5px'
                                            }}
                                            value={selectedMacro?.id}
                                            onChange={event => this.macroService.update('Select Macro', this.macroService.selectedMacroId.update(event.target.value))}
                                        >
                                            <Async select={this.macroService.macros.select()}>
                                                {macros => (
                                                    <For items={macros}>
                                                        {macro => <option value={macro.id}>{macro.name}</option>}
                                                    </For>
                                                )}
                                            </Async>
                                        </select>
                                        <div
                                            style={{
                                                cursor: 'pointer',
                                                padding: '5px'
                                            }}
                                            css={`
                                    &:hover {
                                        background: var(--background-focus-color);
                                        color: var(--background-focus-text-color);
                                    }
                                `}
                                            onClick={() => {
                                                const id = guid();
                                                this.macroService.update(
                                                    'Create Macro',
                                                    this.macroService.macros.create({
                                                        id,
                                                        name: 'Test',
                                                        taskIds: []
                                                    }),
                                                    this.macroService.selectedMacroId.update(id)
                                                );
                                            }}
                                        >
                                            <Icon icon={Icons.Plus} />
                                        </div>
                                        <If condition={selectedMacro}>
                                            {() => (
                                                <Fragment>
                                                    <div
                                                        style={{
                                                            cursor: 'pointer',
                                                            padding: '5px'
                                                        }}
                                                        css={`
                                    &:hover {
                                        background: var(--background-focus-color);
                                        color: var(--background-focus-text-color);
                                    }
                                `}
                                                        onClick={() => {
                                                            this.macroService.update(
                                                                'Delete Macro',
                                                                this.macroService.tasks.delete(...selectedMacro.taskIds),
                                                                this.macroService.macros.delete(selectedMacro.id)
                                                            );
                                                        }}
                                                    >
                                                        <Icon icon={Icons.Trash} />
                                                    </div>

                                                    <div
                                                        style={{
                                                            cursor: 'pointer',
                                                            padding: '5px'
                                                        }}
                                                        css={`
                                    &:hover {
                                        background: var(--background-focus-color);
                                        color: var(--background-focus-text-color);
                                    }
                                `}
                                                        onClick={() => {
                                                            const win = remote.getCurrentWindow();
                                                            win.hide();
                                                            this.macroService.execute(selectedMacro.id);
                                                            win.show();
                                                        }}>
                                                        <Icon icon={Icons.Flag} />
                                                    </div>
                                                </Fragment>
                                            )}
                                        </If>
                                    </div>
                                    <Async select={this.macroService.tasks.select(selectedMacro?.taskIds ?? [])}>
                                        {tasks => (
                                            <For items={tasks}>
                                                {(task, index) => (
                                                    <div style={{
                                                        cursor: 'pointer',
                                                        display: 'grid',
                                                        gridTemplateColumns: 'max-content max-content auto max-content max-content',
                                                        gap: '5px',
                                                        alignItems: 'center',
                                                        padding: '5px',
                                                        borderBottom: '1px solid var(--outline-color)'
                                                    }}
                                                        css={`
                                    &:hover {
                                        background-color: var(--background-focus-color);
                                    }
                                `}>
                                                        <span>{index + 1}</span>
                                                        <div style={{
                                                            width: '10px',
                                                            height: '10px',
                                                            background: this.macroService.getTaskColor(task.type),
                                                            borderRadius: '50%',
                                                        }} />
                                                        <span>
                                                            <select
                                                                style={{
                                                                    width: '100%',
                                                                    border: 'none',
                                                                    background: 'var(--background-color)',
                                                                    color: 'var(--background-text-color)'
                                                                }}
                                                                value={task.type}
                                                                onChange={event => {
                                                                    this.macroService.update(
                                                                        'Update Task',
                                                                        this.macroService.tasks.update(task.id, {
                                                                            type: event.target.value as any
                                                                        })
                                                                    );
                                                                }}>
                                                                <option>Click</option>
                                                                <option>DoubleClick</option>
                                                                <option>LeftDown</option>
                                                                <option>LeftUp</option>
                                                                <option>MiddleDown</option>
                                                                <option>MiddleUp</option>
                                                                <option>RightDown</option>
                                                                <option>RightUp</option>
                                                            </select>
                                                        </span>
                                                        <span>
                                                            <input
                                                                style={{
                                                                    width: '30px',
                                                                    border: 'none',
                                                                    background: 'var(--background-color)',
                                                                    color: 'var(--background-text-color)',
                                                                    textAlign: 'center'
                                                                }}
                                                                value={task.duration}
                                                                onChange={event => {
                                                                    this.macroService.update(
                                                                        'Update Task',
                                                                        this.macroService.tasks.update(task.id, {
                                                                            duration: Number(event.target.value) as any
                                                                        })
                                                                    );
                                                                }}
                                                            />
                                                        </span>
                                                        <span>
                                                            <Icon
                                                                icon={Icons.Trash}
                                                                onClick={() => {
                                                                    this.macroService.update(
                                                                        'Delete Task',
                                                                        this.macroService.macros.update(selectedMacro.id, macro => ({
                                                                            taskIds: ArrayAdaptor.remove(macro.taskIds, task.id)
                                                                        })),
                                                                        this.macroService.tasks.delete(task.id)
                                                                    );
                                                                }} />
                                                        </span>
                                                    </div>
                                                )}
                                            </For>
                                        )}
                                    </Async>
                                </div>
                            </Window>
                        </div>
                    </Fragment>
                )}
            </Async>
        );
    }

}
