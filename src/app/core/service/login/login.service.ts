import { Injectable } from '@angular/core';
import { RequestService } from '../request/request.service';
import { apiInfo } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(private service: RequestService) { }

    /**
    * Login API call using passing data as json format
    * @param postObj
    */
    login(postObj: any) {
        return new Promise((resolve, reject) => {
            const headers = [
                {
                    'key': 'Content-Type',
                    'name': 'application/json',
                },
            ];
            this.service.post(apiInfo.info.login, postObj, headers)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Call send reset password link for forgote password
    * @param postObj
    */
    forgotPassword(postObj: any) {
        return new Promise((resolve, reject) => {
            const headers = [
                {
                    'key': 'Content-Type',
                    'name': 'application/json',
                },
            ];
            this.service.post(apiInfo.info.forgotPassword, postObj, headers)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Call reset password api
    * @param postObj
    */
    resetPassword(postObj: any) {
        return new Promise((resolve, reject) => {
            const headers = [
                {
                    'key': 'Content-Type',
                    'name': 'application/json',
                },
            ];
            this.service.post(apiInfo.info.resetPassword, postObj, headers)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Signup API call using passing data as json format
    * @param postObj
    */
    signup(postObj: any) {
        return new Promise((resolve, reject) => {
            const headers = [
                {
                    'key': 'Content-Type',
                    'name': 'application/json',
                },
            ];
            this.service.post(apiInfo.info.signup, postObj, headers)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Calling Logout API
    */
    logout() {
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.logout)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }
    /**
    * Remove device token when user logout
    */
    removeDeviceToken() {
        return new Promise((resolve, reject) => {
            const headers = [
                {
                    'key': 'Content-Type',
                    'name': 'application/json',
                },
            ];
            this.service.put(apiInfo.info.removeToken + '?device_type=web&device_token=' + localStorage.getItem('kdevice_token'), {}, headers)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }
}
