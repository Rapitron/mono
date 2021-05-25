import { ReactInjector } from '@rapitron/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppComponent } from './components/app.component';
import { MacroService } from './components/macro.service';
import './index.scss';

ReactDOM.render(
    <ReactInjector types={[MacroService]}>
        {() => <AppComponent />}
    </ReactInjector>,
    document.getElementById("root")
);