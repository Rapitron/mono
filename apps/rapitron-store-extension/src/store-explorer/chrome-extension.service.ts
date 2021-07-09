import { Observable } from 'rxjs';
import { Injectable } from '@rapitron/core';

declare const chrome: any;

@Injectable()
export class ChromeExtension {

    public send(type: string, data: any) {
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]: any[]) => {
            chrome.tabs.sendMessage(tab.id, {
                data: {
                    type,
                    data
                }
            });
        });
    }

    public on<T>(type: string): Observable<T> {
        return new Observable(subscriber => {
            chrome.runtime.onMessage.addListener((event: any) => {
                if (event.type === type) {
                    subscriber.next(event.data);
                }
            });
        });
    }

}
