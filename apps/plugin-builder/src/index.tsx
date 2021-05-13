import { Alert, Button, Icon, Icons, If, Input, Portal, ReactInjector, Carousel, ContextMenu } from '@rapitron/react';
import React, { Component, Fragment, memo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

function App(props: any) {
    const [state, updateState] = useState({
        test: 'ABSA',
        index: 0,
        alert: false
    });
    const contextMenuRef = useRef<ContextMenu>()
    return (
        <Fragment>
            <Button text='Carousel >>' onClick={() => updateState({ ...state, index: state.index + 1 })} />
            <Button text='Carousel <<' onClick={() => updateState({ ...state, index: state.index - 1 })} />
            <Carousel index={state.index} scrollable={false}>
                <div>A</div>
                <div>B</div>
            </Carousel>
            <Button
                text='Open Context Menu'
                style={{
                    margin: '50px 200px'
                }}
                onClick={async event => {
                    const position = await Alert.show({
                        text: 'Position',
                        buttons: ['left', 'top', 'right', 'bottom', 'center'].map(position => ({
                            text: position,
                            result: position
                        }))
                    });
                    contextMenuRef.current.showRelativeTo(event.target as HTMLElement, position);
                }}
            />
            <ContextMenu ref={contextMenuRef}>
                <h1>Menu</h1>
            </ContextMenu>
            <Button
                text='Show Alert'
                onClick={() => Portal.render(
                    <Alert
                        title={'Alert Title'}
                        text={'This is the alert message.'}
                        onResult={result => { console.log('RR'); }}
                    />
                )}
            />
            <Button text='Show Alert' onClick={() => updateState({ ...state, alert: true })} />
            <If condition={state.alert}>
                {() => <Alert
                    title={'Alert Title'}
                    text={'This is the alert message.'}
                    buttons={[{ text: 'Confirm', result: 'C' }]}
                    onResult={result => { updateState({ ...state, alert: false }) }}
                />}
            </If>
            <Input
                label='Username'
                description='Username'
                placeholder='Username'
                autoFocus={true}
                type='password'
                onValidate={value => value !== 'Rudi' ? 'Not Rudi' : null}
            />
            <Button text='Test' />
            <Icon icon={Icons.Flag}></Icon>
        </Fragment>
    );
}

ReactInjector

ReactDOM.render(
    <ReactInjector>
        {() => <App />}
    </ReactInjector>,
    document.getElementById("root")
);