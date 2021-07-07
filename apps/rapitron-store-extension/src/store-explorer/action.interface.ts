import { Change } from '@rapitron/core';

export interface IStoreExplorerAction {
    timestamp: Date;
    name: string;
    path: string;
    changes: Change[];
}
