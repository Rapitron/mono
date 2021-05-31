import { ArrayAdaptor, guid, Injector } from '@rapitron/core';
import { Async, Button, ButtonTypes, For, Icon, Icons, If, InputComponent, Prompt, Style, Window, WindowState } from '@rapitron/react';
import { remote } from 'electron';
import React, { Component, Fragment } from 'react';
import { MacroService } from './macro.service';
import { TaskOverlayComponent } from './task-overlay.component';

export class AppComponent extends Component<{ injector?: Injector }> {

    public readonly macroService = this.props.injector.get(MacroService);
    public readonly state = {
        showSettings: false
    };

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
                                width={250}
                                onStateChange={state => {
                                    if (state === WindowState.None) {
                                        remote.getCurrentWindow().close();
                                    }
                                }}
                            >
                                <div style={{
                                    display: 'grid',
                                    gridTemplateRows: 'max-content auto',
                                    gap: '10px',
                                    padding: '10px',
                                    height: '100%',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'auto',
                                        gridAutoFlow: 'column',
                                        gridAutoColumns: 'max-content',
                                        boxShadow: 'var(--shadow)'
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
                                        <Button
                                            icon={Icons.Plus}
                                            type={ButtonTypes.Flat}
                                            onClick={async () => {
                                                const name = await Prompt.show({
                                                    title: 'New Macro',
                                                    placeholder: 'Macro',
                                                    value: 'Macro'
                                                });
                                                if (name) {
                                                    const id = guid();
                                                    this.macroService.update(
                                                        'Create Macro',
                                                        this.macroService.macros.create({
                                                            id,
                                                            name,
                                                            taskIds: [],
                                                            defaultInterval: 100,
                                                            executionCount: 1
                                                        }),
                                                        this.macroService.selectedMacroId.update(id)
                                                    );
                                                }
                                            }}
                                        />
                                        <If condition={selectedMacro}>
                                            {() => (
                                                <Fragment>
                                                    <Button
                                                        icon={Icons.Flag}
                                                        type={ButtonTypes.Flat}
                                                        onClick={async () => {
                                                            const win = remote.getCurrentWindow();
                                                            win.hide();
                                                            try {
                                                                this.macroService.execute(selectedMacro.id);
                                                            } finally {
                                                                win.show();
                                                            }
                                                        }}
                                                    />
                                                    <Button
                                                        icon={Icons.Gear}
                                                        type={ButtonTypes.Flat}
                                                        onClick={() => {
                                                            this.setState({
                                                                ...this.state,
                                                                showSettings: !this.state.showSettings
                                                            });
                                                        }}
                                                    />
                                                </Fragment>
                                            )}
                                        </If>
                                    </div>
                                    <If condition={selectedMacro && !this.state.showSettings}>
                                        {() => (
                                            <div style={{
                                                overflow: 'auto',
                                                height: '100%',
                                                boxShadow: 'var(--shadow)'
                                            }}>
                                                <Async select={this.macroService.tasks.select(selectedMacro?.taskIds ?? [])}>
                                                    {tasks => <>
                                                        <If condition={tasks.length}>
                                                            {() => (
                                                                <Style rules={{
                                                                    cursor: 'pointer',
                                                                    display: 'grid',
                                                                    gridTemplateColumns: 'max-content max-content auto max-content max-content',
                                                                    gap: '5px',
                                                                    alignItems: 'center',
                                                                    padding: '5px',
                                                                    borderBottom: '1px solid var(--outline-color)',
                                                                    '&:hover': {
                                                                        backgroundColor: 'var(--background-focus-color)'
                                                                    }
                                                                }}>
                                                                    {className => (
                                                                        <For items={tasks}>
                                                                            {(task, index) => (
                                                                                <div className={className}>
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
                                                                </Style>
                                                            )}
                                                        </If>
                                                        <If condition={!tasks.length}>
                                                            {() => <>
                                                                <div style={{
                                                                    padding: '10px',
                                                                    color: 'var(--placeholder-color)',
                                                                    textAlign: 'center'
                                                                }}>
                                                                    Click on the screen to add a macro action
                                                            </div>
                                                            </>}
                                                        </If>
                                                    </>}
                                                </Async>
                                            </div>
                                        )}
                                    </If>
                                    <If condition={selectedMacro && this.state.showSettings}>
                                        {() => (
                                            <div style={{
                                                display: 'grid',
                                                gridAutoRows: 'max-content',
                                                gap: '10px',
                                                padding: '10px',
                                                boxShadow: 'var(--shadow)',
                                                overflow: 'auto'
                                            }}>
                                                <InputComponent
                                                    label='Name'
                                                    value={selectedMacro.name}
                                                    onValidate={value => value ? null : 'Required'}
                                                    onChange={value => {
                                                        this.macroService.update(
                                                            'Update Name',
                                                            this.macroService.macros.update(selectedMacro.id, {
                                                                name: value
                                                            })
                                                        );
                                                    }}
                                                />
                                                <InputComponent
                                                    label='Default Interval'
                                                    description='The default interval between each macro action'
                                                    placeholder='100'
                                                    type='number'
                                                    value={String(selectedMacro.defaultInterval)}
                                                    onValidate={value => Number(value) !== NaN && Number(value) >= 0 ? null : 'Value can not be less than 0'}
                                                    onChange={value => {
                                                        this.macroService.update(
                                                            'Update Default Interval',
                                                            this.macroService.macros.update(selectedMacro.id, {
                                                                defaultInterval: Number(value) || 100
                                                            })
                                                        );
                                                    }}
                                                />
                                                <InputComponent
                                                    label='Execution Count'
                                                    description='The amount of times to execute the macro'
                                                    placeholder='1'
                                                    type='number'
                                                    value={String(selectedMacro.executionCount)}
                                                    onValidate={value => Number(value) && Number(value) >= 0 ? null : 'Value can not be less than 1'}
                                                    onChange={value => {
                                                        this.macroService.update(
                                                            'Update Execution Count',
                                                            this.macroService.macros.update(selectedMacro.id, {
                                                                executionCount: Number(value) || 1
                                                            })
                                                        );
                                                    }}
                                                />
                                                <Button
                                                    icon={Icons.Trash}
                                                    text='Delete Macro'
                                                    type={ButtonTypes.Error}
                                                    onClick={() => {
                                                        this.macroService.update(
                                                            'Delete Macro',
                                                            this.macroService.tasks.delete(...selectedMacro.taskIds),
                                                            this.macroService.macros.delete(selectedMacro.id)
                                                        );
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </If>

                                </div>
                            </Window>
                        </div>
                    </Fragment>
                )}
            </Async>
        );
    }

}
