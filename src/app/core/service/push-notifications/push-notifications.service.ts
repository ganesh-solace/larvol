import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { apiInfo } from './../../../../environments/environment';
import { RequestService } from './../../service/request/request.service';
import { MessageService } from './../../service/message/message.service';
import { UtilService } from './../../service/util.service';

@Injectable({
    providedIn: 'root'
})
export class PushNotificationsService {

    currentMessage = new BehaviorSubject(null);

    constructor(
        private angularFireDB: AngularFireDatabase,
        private angularFireAuth: AngularFireAuth,
        private angularFireMessaging: AngularFireMessaging,
        private requestService: RequestService,
        private messageService: MessageService,
        private utilService: UtilService
    ) {
        this.angularFireMessaging.messaging.subscribe(
            (_messaging) => {
                _messaging.onMessage = _messaging.onMessage.bind(_messaging);
                _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
            }
        );
    }

    /**
     * update token in firebase database
     * @param userId userId as a key
     * @param token token as a value
     */
    updateToken(userId: any, token: any) {
        // we can change this function to request our backend service
        this.angularFireAuth.authState.pipe(take(1)).subscribe(
            () => {
                const data = {};
                data[userId] = token;
                this.angularFireDB.object('fcmTokens/').update(data);
            });
    }

    /**
     * request permission for notification from firebase cloud messaging
     *
     * @param userId userId
     */
    requestPermission(userId: any) {
        this.angularFireMessaging.requestToken.subscribe(
            (token) => {
                console.log('Notification permission granted.');
                console.log(token);
                // this.updateToken(userId, token);
                // this.messageService.setHttpLoaderStatus(false);
                if (token !== null && token !== '' && token !== undefined) {
                    if (localStorage.getItem('isnotificationallow') === null) {
                        localStorage.setItem('isnotificationallow', 'true');
                        this.utilService.showConfirmNotifications();
                    }
                    localStorage.setItem('kdevice_token', token);
                    this.requestService.put(apiInfo.info.saveToken + '?device_type=web&device_token=' + token, {})
                    .then((res: any) => {
                        console.log(res);
                        this.messageService.setHttpLoaderStatus(true);
                    }).catch((err: any) => {
                        console.log(err);
                        this.messageService.setHttpLoaderStatus(true);
                    });
                }
            },
            (err) => {
                console.error('Unable to get permission to notify.', err);
                localStorage.removeItem('isnotificationallow');
                localStorage.removeItem('kdevice_token');
            }
        );
    }

    /**
     * hook method when new notification received in foreground
     */
    receiveMessage() {
        this.angularFireMessaging.messages.subscribe(
        (payload) => {
            console.log('new message received.', payload);
            this.utilService.showNotifications(payload['notification']);
            this.currentMessage.next(payload);
        });
    }
}