import { Change } from '@rapitron/core';

export interface IStoreExplorerAction {
    id: string;
    timestamp: Date;
    name: string;
    changes: Change[];
    breakpoint?: boolean;
}
