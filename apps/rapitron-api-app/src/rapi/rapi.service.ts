import { guid, IEntity, request, Store } from '@rapitron/core';

export interface IKeyValue extends IEntity {
    key: string;
    value: string;
}

export interface ICollectionItem extends IEntity {
    itemType: 'folder' | 'request';
}

export interface IRequest extends ICollectionItem {
    itemType: 'request';
    name: string;
    method: string;
    url: string;
    parameters: IKeyValue[];
    headers: IKeyValue[];
    body: string;
}

export interface IFolder extends ICollectionItem {
    itemType: 'folder';
    name: string;
    itemIds: string[];
}

export type CollectionItem = IRequest | IFolder;

export interface ICollection extends IEntity {
    name: string;
    itemIds: string[];
}

export interface IRapiState {
    collections: ICollection[];
    items: CollectionItem[];
    selectedRequestId?: string;
}

export class RapiService extends Store<IRapiState> {

    public collections = this.createEntityAdaptor(state => state.collections);
    public items = this.createEntityAdaptor(state => state.items);
    public selectedRequestId = this.createAdaptor(state => state.selectedRequestId);

    constructor() {
        super({
            state: {
                collections: [
                    {
                        id: guid(),
                        name: 'Collection',
                        itemIds: ['users', 'pages']
                    }
                ],
                items: [
                    {
                        id: 'users',
                        itemType: 'folder',
                        name: 'Users',
                        itemIds: ['u1', 'u2', 'u3']
                    },
                    {
                        id: 'u1',
                        itemType: 'request',
                        name: 'GetById',
                        method: 'GET',
                        url: '',
                        parameters: [],
                        headers: [],
                        body: ''
                    },
                    {
                        id: 'u2',
                        itemType: 'request',
                        name: 'GetAll',
                        method: 'GET',
                        url: '',
                        parameters: [],
                        headers: [],
                        body: ''
                    },
                    {
                        id: 'u3',
                        itemType: 'request',
                        name: 'DeleteById',
                        method: 'DELETE',
                        url: '',
                        parameters: [],
                        headers: [],
                        body: ''
                    },
                    {
                        id: 'pages',
                        itemType: 'folder',
                        name: 'Pages',
                        itemIds: ['p1', 'p2', 'p3']
                    },
                    {
                        id: 'p1',
                        itemType: 'request',
                        name: 'GetById',
                        method: 'GET',
                        url: '',
                        parameters: [],
                        headers: [],
                        body: ''
                    },
                    {
                        id: 'p2',
                        itemType: 'request',
                        name: 'GetAll',
                        method: 'GET',
                        url: '',
                        parameters: [],
                        headers: [],
                        body: ''
                    },
                    {
                        id: 'p3',
                        itemType: 'request',
                        name: 'DeleteById',
                        method: 'DELETE',
                        url: '',
                        parameters: [],
                        headers: [],
                        body: ''
                    },
                ]
            }
        });
    }

    public selectRequest(id: string) {
        this.update(
            'Select Request',
            this.selectedRequestId.update(id)
        );
    }

    public async pullCollection() {
        const apis = (await request({
            url: 'http://localhost:5000/_/apis'
        })).data;
        const collections: ICollection[] = [];
        const folders: IFolder[] = [];
        const requests: IRequest[] = [];
        for (const route in apis) {
            for (const controller of apis[route].controllers) {
                for (const handler of controller.handlers) {
                    requests.push({
                        itemType: 'request',
                        id: guid(),
                        name: route,
                        method: 'GET',
                        url: handler.route,
                        parameters: [],
                        headers: [],
                        body: ''
                    });
                }
                folders.push({
                    itemType: 'folder',
                    id: guid(),
                    name: route,
                    itemIds: requests.map(request => request.id)
                });
            }
            collections.push({
                id: guid(),
                name: route,
                itemIds: folders.map(folder => folder.id)
            });
        }
        this.update(
            'Sync',
            {
                collections: [],
                items: []
            },
            this.collections.create(...collections),
            this.items.create(...folders),
            this.items.create(...requests)
        );
    }

}
