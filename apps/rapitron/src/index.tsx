import { Injector } from '@rapitron/core';
import { ContextMenu, If, ReactInjector, Switch, SwitchCase } from '@rapitron/react';
import { LoginComponent } from './app/login/login.component';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppService } from './app/app.service';
import { AppletBuilderService } from './app/applet/applet-builder.service';
import { HotbarComponent } from './app/hotbar/hotbar.component';
import { PagesPageComponent } from './app/pages/pages-page.component';
import './index.scss';

function App(props: { injector?: Injector }) {

    const appService = props.injector.get(AppService);
    let menu: any;

    return (
        // <LoginComponent />
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'max-content auto',
            height: '100%'
        }}>
            <HotbarComponent />
            {/* <Switch value={appService.activePage.get()}>
                <SwitchCase value='pages'>
                    {() => <PagesPageComponent />}
                </SwitchCase>
            </Switch> */}
            <LoginComponent />
            {/* <div>
                <button onMouseEnter={e => {
                    menu = ContextMenu.showRelativeTo({
                        element: e.target as HTMLElement,
                        // position: { x: 50, y: 50 },
                        locations: ['right', 'bottom'],
                        render: () => (
                            <div>Test</div>
                        )
                    });
                }} onMouseLeave={() => {
                    menu.close();
                }}>Test</button>
            </div> */}
        </div>
    );
}

ReactDOM.render(
    <ReactInjector types={[
        AppService,
        AppletBuilderService
    ]}>
        {() => <App />}
    </ReactInjector>,
    document.getElementById("root")
);