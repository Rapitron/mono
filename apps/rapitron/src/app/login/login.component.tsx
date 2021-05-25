import { createStyles, Styles } from '@rapitron/react';
import React, { Component } from 'react';

export class LoginComponent extends Component {

    public static styles = createStyles({
        label: {
            display: 'grid',
            alignContent: 'center',
            borderBottom: '1px solid #0ADEFA',
            paddingLeft: '10px',
            paddingRight: '10px',
            fontWeight: 'bold',
            color: 'white'
        },
        input: {
            border: 'none',
            borderBottom: '1px solid #22A8E2',
            // borderRadius: '5px',
            padding: '5px 10px',
            background: '#1F063F',
            color: 'white'
        },
        control: {
            display: 'grid',
            gridTemplateColumns: 'max-content auto',
            alignContent: 'center',
            // gap: '10px'
        }
    });

    public render() {
        return (
            <Styles styles={LoginComponent.styles}>
                {classes => (
                    <div style={{
                        display: 'grid',
                        gridAutoRows: 'max-content',
                        justifyContent: 'center',
                        alignContent: 'center',
                        height: '100%',
                        background: 'url(assets/login.png) no-repeat',
                        backgroundSize: 'contain 100%'
                    }}>
                        <div style={{
                            display: 'grid',
                            width: '350px',
                            padding: '20px',
                            background: 'rgb(29 7 63 / 75%)',
                            borderRadius: '5px',
                            border: '1px solid #22A8E2',
                            boxShadow: '0px 0px 5px #6818d1'
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
                            <button style={{
                                justifySelf: 'end',
                                border: 'none',
                                borderRadius: '5px',
                                padding: '5px 10px',
                                background: 'linear-gradient(160deg, rgba(0,250,250,1.00) 0%, rgba(50,100,250,1.00) 100%)',
                                color: 'white'
                            }}>
                                Login
                                </button>
                        </div>
                    </div>
                )}
            </Styles>
        );
    }

}
