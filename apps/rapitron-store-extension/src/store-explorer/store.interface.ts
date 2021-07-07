import { IStoreExplorerAction } from './action.interface';

export interface IStoreExplorerStore {
    index: number;
    name: string;
    initialState: {};
    actions: IStoreExplorerAction[];
}
