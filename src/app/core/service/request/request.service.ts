import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import 'rxjs/add/operator/map';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConnectionService } from 'ng-connection-service';
import { UtilService } from './../util.service';

const hostname = environment.baseUrl;

@Injectable({
    providedIn: 'root'
})
export class RequestService {

    options;
    isConnected = true;

    constructor(
        private http: HttpClient,
        private utilService: UtilService,
        private connectionService: ConnectionService
    ) {
        const headers = new HttpHeaders();
        // headers.append('Access-Control-Allow-Origin', '*');
        // headers.append('Content-Type', 'application/x-www-form-urlencoded');
        // headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PATCH');
        // headers.append('Authorization', `Bearer ${localStorage.getItem('access_token')}`);
        this.options = { headers: headers };

        this.checkConnection();
    }

    /**
     * Check internet connection
     */
    checkConnection() {
        this.connectionService.monitor().subscribe(isConnected => {
            this.isConnected = isConnected;
        });
    }

    /**
    * Used for calling GET method on server and pass API url in calling function
    * @param endpoint
    */
    get(endpoint) {
        return new Promise((resolve, reject) => {
            this.http.get(hostname + endpoint, this.options).map((res) => res)
                .subscribe(res => {
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
        });
    }

    /**
    * Used for calling POST method on server and pass API url/ POST Data / Header Options in calling function
    * @param endpoint
    */
    post(endpoint, body, headers = []) {
        this.isConnected = navigator.onLine;
        if (headers.length) {
            const that = this;
            headers.forEach(function (key, val) {
                that.options.headers.set(key.key, key.name);
            });
        }
        return new Promise((resolve, reject) => {
            if (this.isConnected) {
                this.http.post(hostname + endpoint, body, this.options).map((res) => res, (err) => err)
                    .subscribe(res => {
                        resolve(res);
                    }, (err) => {
                        reject(err);
                    });
            } else {
                this.utilService.showError('Error', 'Please check your internet connection');
                reject();
            }
        });
    }

    /**
    * Used for calling PUT method on server and pass API url/ POST Data / Header Options in calling function
    * @param endpoint
    */
    put(endpoint, body, headers = []) {
        this.isConnected = navigator.onLine;
        if (headers.length) {
            const that = this;
            headers.forEach(function (key, val) {
                that.options.headers.set(key.key, key.name);
            });
        }
        return new Promise((resolve, reject) => {
            if (this.isConnected) {
                this.http.put(hostname + endpoint, body, this.options).map((res) => res)
                .subscribe(res => {
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
            } else {
                this.utilService.showError('Error', 'Please check your internet connection');
                reject();
            }
        });
    }

    /**
    * Used for calling DELETE method on server and pass API url/ POST Data / Header Options in calling function
    * @param endpoint
    */
    delete(endpoint, body, headers = []) {
        this.isConnected = navigator.onLine;
        if (headers.length) {
            const that = this;
            headers.forEach(function (key, val) {
                that.options.headers.set(key.key, key.name);
            });
        }
        this.options.body = body;
        return new Promise((resolve, reject) => {
            if (this.isConnected) {
                this.http.delete(hostname + endpoint, this.options).map((res) => res)
                .subscribe(res => {
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
            } else {
                this.utilService.showError('Error', 'Please check your internet connection');
                reject();
            }
        });
    }
}
