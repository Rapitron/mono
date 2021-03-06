import { IEntity, IPoint, json, Store, tryParseJson } from '@rapitron/core';
import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export interface ITasks extends IEntity {
    type: 'LeftDown' | 'LeftUp' | 'Click' | 'DoubleClick' | 'RightDown' | 'RightUp' | 'MiddleDown' | 'MiddleUp';
    position: IPoint;
    duration: number;
}

export interface IMacro extends IEntity {
    name: string;
    defaultInterval: number;
    executionCount: number;
    taskIds: string[];
}

export interface IMacroState {
    macros: IMacro[];
    tasks: ITasks[];
    selectedMacroId?: string;
}

export class MacroService extends Store<IMacroState> {

    public readonly macros = this.createEntityAdaptor(state => state.macros);
    public readonly tasks = this.createEntityAdaptor(state => state.tasks);
    public readonly selectedMacroId = this.createAdaptor(state => state.selectedMacroId);
    public readonly querySelectedMacro = this.macros.query(macros => macros.find(macro => macro.id === this.selectedMacroId.get()));
    public readonly querySelectedMacroTasks = this.querySelectedMacro.query(macro => this.tasks.get(macro?.taskIds ?? []));

    constructor() {
        super({
            state: tryParseJson(localStorage.getItem('state')) ?? {
                macros: [],
                tasks: []
            }
        });
        this.on().subscribe(() => {
            localStorage.setItem('state', json(this.state));
        });
    }

    public execute(id: string) {
        const macro = this.macros.get(id);
        let script = '';
        for (let i = 0; i < macro.executionCount; i++) {
            for (const task of this.tasks.get(macro.taskIds)) {
                script += `${task.type} ${task.position.x} ${task.position.y}\nWait ${task.duration}\n`;
            }
        }
        console.log(script);
        fs.writeFileSync(path.resolve('./net5.0/script.macro'), script, {});
        execFileSync(path.resolve('./net5.0/Macro.exe'), [path.resolve('./net5.0/script.macro')]);
    }

    public getTaskColor(type: string) {
        switch (type) {
            case 'Click': return 'lime';
            case 'DoubleClick': return 'green';
            case 'LeftDown': return 'dodgerblue';
            case 'LeftUp': return 'blue';
            case 'MiddleDown': return 'pink';
            case 'MiddleUp': return 'purple';
            case 'RightDown': return 'red';
            case 'RightUp': return 'orange';
        }
    }

}