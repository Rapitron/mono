import { $Reflection, guid, Injector, IProvider, json, Selector, Store, Type, uid } from '@rapitron/core';
import { ReactInjector, Route, Router } from '@rapitron/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppService, HotbarService, UserService } from './app/app.service';
import { AppletBuilderService } from './app/applet/applet-builder.service';
import { HotbarComponent } from './app/hotbar/hotbar.component';
import { LoginComponent } from './app/login/login.component';
import { StoreExplorerComponent } from './app/store-explorer/store-explorer.component';
import './index.scss';

function App(props: { injector?: Injector }) {

    const appService = props.injector.get(AppService);
    const userService = props.injector.get(UserService);

    userService.update(
        'Create User',
        userService.users.create({
            id: 'a',
            name: 'Rudi'
        })
    );
    userService.update(
        'Create Users',
        userService.users.create(
            {
                id: 'b',
                name: 'Carel'
            },
            {
                id: 'c',
                name: 'Herman'
            }
        )
    );
    userService.update(
        'Update and Add User',
        userService.users.update('a', {
            name: 'Ross'
        }),
        userService.users.create({
            id: 'd',
            name: 'Roland'
        })
    );
    userService.update(
        'Delete User',
        userService.users.delete('c')
    );

    return (
        // <LoginComponent />
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'max-content auto',
            height: '100%'
        }}>
            <HotbarComponent />
            <Route path='login'>
                {() => <>
                    <LoginComponent />
                </>}
            </Route>
            <Route path='test'>
                {() => <>
                    <StoreExplorerComponent />
                </>}
            </Route>
        </div>
    );
}

function provideStoreWithBinding<TStoreState extends object, TRepoState extends object>(repo: Type<Store<TRepoState>>, selector: Selector<TRepoState, TStoreState>, store: Type<Store<TStoreState>>): IProvider<Store<TStoreState>> {
    return {
        type: store,
        factory: injector => injector
            .create(store)
            .bind(injector.get(repo), selector)
    };
}

ReactDOM.render(
    <ReactInjector
        types={[
            AppService,
            HotbarService,
            AppletBuilderService,
            Router
        ]}
        providers={[
            provideStoreWithBinding(AppService, state => state.users, UserService),
            // provideStoreWithBinding(AppService, state => state.hotbar, HotbarService)
        ]}
    >
        {() => <App />}
    </ReactInjector>,
    document.getElementById("root")
);
