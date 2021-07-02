import { $Reflection, guid, Injector, json, Store, uid } from '@rapitron/core';
import { ReactInjector, Route, Router } from '@rapitron/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppService } from './app/app.service';
import { AppletBuilderService } from './app/applet/applet-builder.service';
import { HotbarComponent } from './app/hotbar/hotbar.component';
import { LoginComponent } from './app/login/login.component';
import { StoreExplorerComponent } from './app/store-explorer/store-explorer.component';
import './index.scss';

function App(props: { injector?: Injector }) {

    const appService = props.injector.get(AppService);

    appService.update(
        'Create Page',
        appService.pages.create({
            id: 'a',
            name: 'New Page'
        })
    );
    appService.update(
        'Create Page',
        appService.pages.update('a', {
            name: 'Updated Page A'
        }),
        appService.pages.create({
            id: 'b',
            name: 'New Page'
        })
    );
    appService.update(
        'Update Page',
        appService.pages.update('a', {
            name: 'Test Page'
        })
    );
    appService.update(
        'Delete Page',
        appService.pages.delete('a')
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

ReactDOM.render(
    <ReactInjector types={[
        AppService,
        AppletBuilderService,
        Router
    ]}>
        {() => <App />}
    </ReactInjector>,
    document.getElementById("root")
);
