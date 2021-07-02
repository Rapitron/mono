import React from 'react';
import ReactDOM from 'react-dom';
import { StoreExplorerComponent } from './store-explorer/store-explorer.component';
import './index.scss';

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
    <App />,
    document.getElementById("root")
);