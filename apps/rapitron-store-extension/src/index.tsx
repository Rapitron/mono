import { ReactInjector } from '@rapitron/react';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { ChromeExtension } from './store-explorer/chrome-extension.service';
import { StoreExplorerComponent } from './store-explorer/store-explorer.component';

function App(props: any) {
    return (
        <div style={{
            height: '100%',
            display: 'grid'
        }}>
            <StoreExplorerComponent />
        </div>
    );
}

ReactDOM.render(
    <ReactInjector types={[ChromeExtension]}>
        {() => <App />}
    </ReactInjector>,
    document.getElementById("root")
);