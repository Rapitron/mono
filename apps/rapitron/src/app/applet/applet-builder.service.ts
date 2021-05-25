import { IEntity, IPoint, ISize, Store } from '@rapitron/core';
import { Icons } from '@rapitron/react';
import { CSSProperties } from 'styled-components';

export interface IPage extends IEntity {
    name: string;
    pluginIds: string[];
}

export interface IToolbox {
    items: IToolboxItem[];
}

export interface IToolboxItem extends IEntity {
    icon: Icons;
    name: string;
    pluginId: string;
    category: string;
}

export interface IPlugin extends IEntity {
    icon: Icons;
    name: string;
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

export interface IAppletBuilderState {
    pages: IPage[];
    plugins: Plugin[];
    toolbox: IToolbox;
}

export class AppletBuilderService extends Store<IAppletBuilderState> {

    public readonly pages = this.createEntityAdaptor(state => state.pages);
    public readonly plugins = this.createEntityAdaptor(state => state.plugins);
    public readonly toolbox = this.createAdaptor(state => state.toolbox);

    constructor() {
        super({
            state: {
                pages: [],
                plugins: [],
                toolbox: {
                    items: []
                }
            }
        });
    }
}