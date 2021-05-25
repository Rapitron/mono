import { ArrayAdaptor, guid, Injector } from '@rapitron/core';
import { Async } from '@rapitron/react/src';
import React from 'react';
import { Component, createRef } from 'react';
import { MacroService } from './macro.service';

export class TaskOverlayComponent extends Component<{ injector?: Injector }> {

    public readonly macroService = this.props.injector.get(MacroService);
    public readonly canvasRef = createRef<HTMLCanvasElement>();

    public componentDidMount() {
        this.macroService.querySelectedMacro
            .select({})
            .subscribe(() => {
                this.draw();
            });
    }

    public draw() {
        const macro = this.macroService.querySelectedMacro.get({});
        console.log('draw', macro);
        if (macro) {
            const tasks = this.macroService.tasks.get(macro.taskIds);
            const canvas = this.canvasRef.current;
            const ctx = canvas.getContext('2d');
            const rect = document.body.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const [index, task] of tasks.entries()) {
                ctx.beginPath();
                ctx.fillStyle = this.macroService.getTaskColor(task.type);
                ctx.arc(task.position.x, task.position.y, 5, 0, 2 * Math.PI);
                ctx.fill();
                ctx.fillText((index + 1).toString(), task.position.x + 5, task.position.y + 10);
                ctx.shadowColor = '#21252B'
                ctx.shadowBlur = 5;
                ctx.fill();
            }
        }
    }

    public render() {
        return (
            <canvas
                ref={this.canvasRef}
                onClick={event => {
                    const id = guid();
                    const macro = this.macroService.querySelectedMacro.get({});
                    this.macroService.update(
                        'Create Task',
                        this.macroService.macros.update(macro.id, macro => ({
                            taskIds: ArrayAdaptor.add(macro.taskIds, id)
                        })),
                        this.macroService.tasks.create({
                            id,
                            type: 'Click',
                            position: {
                                x: event.clientX,
                                y: event.clientY
                            },
                            duration: 100
                        })
                    );
                }}
            />
        );
    }

}

// export function TaskOverlayComponent(props: { injector?: Injector }) {

// }
