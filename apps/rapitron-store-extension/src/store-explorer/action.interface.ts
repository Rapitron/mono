import { Change } from '@rapitron/core';

export interface IStoreExplorerAction {
    timestamp: Date;
    name: string;
    changes: Change[];
    breakpoint?: boolean;
}
