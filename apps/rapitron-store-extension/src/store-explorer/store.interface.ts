import { IStoreExplorerAction } from './action.interface';

export interface IStoreExplorerStore {
    id: string;
    index: number;
    name: string;
    initialState: {};
    state: {};
    actions: IStoreExplorerAction[];
}
