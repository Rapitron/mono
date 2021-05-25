import { IEntity, IPoint, ISize, Store } from '@rapitron/core';
import { CSSProperties } from 'styled-components';

export interface IPage extends IEntity {
    pluginIds: string[];
}

export interface IPlugin extends IEntity {
    type: string;
    position: IPoint;
    size: ISize;
    style: Partial<CSSProperties>;
    css: string;
}

export interface IElementPlugin extends IPlugin {
    type: 'element';
    pluginIds: string[];
}

export interface IReactPlugin extends IPlugin {
    type: 'react';
}

export type Plugin = IElementPlugin | IReactPlugin;

export interface IAppBuilderState {
    pages: IPage[];
    plugins: Plugin[];
}

export class AppBuilderService extends Store<IAppBuilderState> {

    public readonly pages = this.createEntityAdaptor(state => state.pages);
    public readonly plugins = this.createEntityAdaptor(state => state.plugins);

    constructor() {
        super({
            state: {
                pages: [],
                plugins: []
            }
        });
    }
}