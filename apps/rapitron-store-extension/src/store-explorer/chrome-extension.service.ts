import { Injectable, Store } from '@rapitron/core';
import { Observable } from 'rxjs';
import { DevtoolsStore } from './devtools-store.util';

declare const chrome: any;

@Injectable()
export class ChromeExtension {

    public send(type: string, data: any) {
        if (chrome.tabs) {
            chrome.tabs.query({ active: true, currentWindow: true }, ([tab]: any[]) => {
                chrome.tabs.sendMessage(tab.id, {
                    data: {
                        type,
                        data
                    }
                });
            });
        } else {
            document.dispatchEvent(new MessageEvent('rse', {
                data: {
                    type,
                    data
                }
            }));
        }
    }

    public on<T>(type: string): Observable<T> {
        return new Observable(subscriber => {
            if (chrome.runtime) {
                chrome.runtime.onMessage.addListener((event: any) => {
                    if (event.type === type) {
                        subscriber.next(event.data);
                    }
                });
            } else {
                document.addEventListener('rse', event => {
                    const message = (event as MessageEvent).data;
                    if (message.type === type) {
                        subscriber.next(message.data);
                    }
                });
            }
        });
    }

    public static testing: boolean = ((test: boolean) => {
        class TestStore extends Store<{ value: string }> {

            public readonly value = this.createAdaptor(state => state.value);

            constructor() {
                super({
                    state: {
                        value: null
                    }
                });
            }

        }
        DevtoolsStore.init();
        new TestStore()
        return test;
    })(true);
}
