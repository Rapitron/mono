import { Classes, InputComponent, Style, StyleRules } from '@rapitron/react';
import React, { Component } from 'react';

export class LoginComponent extends Component {

    public static styles = {
        label: {
            display: 'grid',
            alignContent: 'center',
            // borderBottom: '1px solid #0ADEFA',
            paddingLeft: '10px',
            paddingRight: '10px',
            fontWeight: 'bold',
            color: 'white',
            background: 'var(--select-color)'
        },
        input: {
            border: 'none',
            // borderBottom: '1px solid #22A8E2',
            // borderRadius: '5px',
            padding: '5px 10px',
            background: 'var(--background-secondary-color)',
            color: 'white',
            width: '100%'
        },
        control: {
            display: 'grid',
            gridTemplateColumns: 'max-content auto',
            alignContent: 'center',
            // gap: '10px'
        }
    };

    public render() {
        return (
            <Classes classes={LoginComponent.styles}>
                {classes => (
                    <div style={{
                        display: 'grid',
                        gridAutoRows: 'max-content',
                        justifyContent: 'center',
                        alignContent: 'center',
                        height: '100%',
                        background: 'var(--background-color)',
                        backgroundSize: 'contain 100%'
                    }}>
                        <div style={{
                            display: 'grid',
                            width: '300px',
                            padding: '20px',
                            background: 'var(--background-tertiary-color)',
                            borderRadius: '5px',
                            // border: '1px solid #22A8E2',
                            // boxShadow: '0px 0px 5px var(--select-color)'
                        }}>
                            <img
                                src="assets/rapitron.png"
                                style={{
                                    justifySelf: 'center',
                                    width: '100px',
                                    height: '100px'
                                }}
                            />
                            <h1 style={{
                                fontFamily: 'Roboto',
                                textAlign: 'center',
                                color: 'white'
                            }}>
                                Rapitron
                            </h1>
                            <div style={{
                                display: 'grid',
                                gap: '5px',
                                padding: '20px 0px'
                            }}>
                                <div className={classes.control}>
                                    <span className={classes.label}>Username</span>
                                    <input className={classes.input} />
                                </div>
                                <div className={classes.control}>
                                    <span className={classes.label}>Password</span>
                                    <input className={classes.input} />
                                </div>
                            </div>
                            <Style rules={{
                                justifySelf: 'end',
                                border: 'none',
                                padding: '5px 10px',
                                background: 'var(--select-color)',
                                color: 'white',
                                fontWeight: 'bold',
                                '&:hover': {
                                    cursor: 'pointer',
                                    background: 'var(--select-focus-color)',
                                }
                            }}>
                                {style => <>
                                    <button className={style}>
                                        Login
                                    </button>
                                </>}
                            </Style>
                        </div>
                    </div>
                )}
            </Classes>
        );
    }

}
