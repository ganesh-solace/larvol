import { Injectable } from '@angular/core';
import { RequestService } from '../request/request.service';
import { apiInfo } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private service: RequestService) { }

    /**
    * Get login userd detail
    */
    getUserDetail() {
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.profile)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Get all notifiations data for user
    */
    getNotifications(postObj: any) {
        const esc = encodeURIComponent;
        let queryStr = Object.keys(postObj)
            .map(k => esc(k) + '=' + esc(postObj[k]))
            .join('&');
        if (queryStr !== '') {
            queryStr = '?' + queryStr;
        }
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.notification + queryStr)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Send feedback to omni submitted by user
    * @param postData
    */
    sendFeedback(postData) {
        return new Promise((resolve, reject) => {
            const headers = [
                {
                    'key': 'mimeType',
                    'name': 'multipart/form-data',
                },
            ];
            this.service.post(apiInfo.info.feedback, postData, headers)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Get all existing subscriptions plan list and detail for same
    */
    getSubscriptionPlanList(teams: any) {
        return new Promise((resolve, reject) => {
            this.service.get(teams + apiInfo.info.getSubscriptions)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Get team data of subscribed user
    */
    getSubscriptionPlanTeamDetail(id: any) {
        console.log('apiInfo.info.getTeamsSubscriptions', apiInfo.info.getTeamsSubscriptions);
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.getTeamsSubscriptions + '/' + id)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Get all kols list form server LAPP user
    */
    getAllLAPPKOls(postObj: any) {
        return new Promise((resolve, reject) => {
            this.service.post(apiInfo.info.kols + apiInfo.info.search, postObj)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Get all kols list form server LAPP user
    */
    addSubscriptionDetail(postObj: any, teamData: any) {
        return new Promise((resolve, reject) => {
            this.service.post(apiInfo.info.subscription + '/' + teamData['id'], postObj)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Get all groups form server
    */
    getGroupList() {
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.groups)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Add group name to server
    */
    addGroup(postObj: any) {
        return new Promise((resolve, reject) => {
            this.service.post(apiInfo.info.addGroup, postObj)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Remove Kols from favourite list by id
    * @param kol_id
    */
    removeGroupById(group_id: string) {
        return new Promise((resolve, reject) => {
            this.service.delete(apiInfo.info.deleteGroup + `/${group_id}`, {})
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Get terms and service data
    */
    getTermsServiceData() {
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.terms)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Get team data of subscribed user for drug entity
    */
    getSubscriptionPlanTeamDetailForDrug(id: any) {
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.drug.getTeamsSubscriptions + '/' + id)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }
}
