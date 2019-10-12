import { Injectable } from '@angular/core';
import { RequestService } from '../request/request.service';
import { apiInfo } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HomeService {

    constructor(private service: RequestService) { }

    /**
    * Get all kols list form server KAPP user to display on home page
    */
    getAllKAPPKOls(postObj: any) {
        const esc = encodeURIComponent;
        let queryStr = Object.keys(postObj)
            .map(k => esc(k) + '=' + esc(postObj[k]))
            .join('&');
        if (queryStr !== '') {
            queryStr = '?' + queryStr;
        }
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.kappKols + queryStr)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Get all kols list form server LAPP user to display on home page
    */
    getAllLAPPKOls(postObj: any) {
        const esc = encodeURIComponent;
        let queryStr = Object.keys(postObj)
            .map(k => esc(k) + '=' + esc(postObj[k]))
            .join('&');
        if (queryStr !== '') {
            queryStr = '?' + queryStr;
        }
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.lappKols + queryStr)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Get all institute list form server with paginations
    */
    getAllInstituteList(postObj: any) {
        const esc = encodeURIComponent;
        let queryStr = Object.keys(postObj)
            .map(k => esc(k) + '=' + esc(postObj[k]))
            .join('&');
        if (queryStr !== '') {
            queryStr = '?' + queryStr;
        }
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.getInstitute + queryStr)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Get all state list form server
    */
    getAllStateList(postObj: any) {
        const esc = encodeURIComponent;
        let queryStr = Object.keys(postObj)
            .map(k => esc(k) + '=' + esc(postObj[k]))
            .join('&');
        if (queryStr !== '') {
            queryStr = '?' + queryStr;
        }
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.getState + queryStr)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }
    /**
    * Get all country list form server
    */
    getAllCountryList(postObj: any) {
        const esc = encodeURIComponent;
        let queryStr = Object.keys(postObj)
            .map(k => esc(k) + '=' + esc(postObj[k]))
            .join('&');
        if (queryStr !== '') {
            queryStr = '?' + queryStr;
        }
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.getCountry + queryStr)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }


    /**
    * Get all area list form server
    */
    getAllAreaList(postObj: any) {
        const esc = encodeURIComponent;
        let queryStr = Object.keys(postObj)
            .map(k => esc(k) + '=' + esc(postObj[k]))
            .join('&');
        if (queryStr !== '') {
            queryStr = '?' + queryStr;
        }
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.getArea + queryStr)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });

    }

    /**
    * Get all bookmark kols list form server
    */
    getAllBookmarkKOls(postObj: any) {
        const esc = encodeURIComponent;
        let queryStr = Object.keys(postObj)
            .map(k => esc(k) + '=' + esc(postObj[k]))
            .join('&');
        if (queryStr !== '') {
            queryStr = '?' + queryStr;
        }
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.kols + apiInfo.info.bookmarklist + queryStr)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Get all frequent institute list form server
    */
    getAllFrequentInstituteList() {
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.institution + apiInfo.info.frequent)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Get all frequent area list form server
    */
    getAllFrequentAreaList() {
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.getArea + apiInfo.info.frequent)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Get all frequent institute list form server without paginations
    */
    getAllExistingInstituteList() {
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.getInstitute + apiInfo.info.get)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Get all area list form server without paginations
    */
    getAllExistingAreaList() {
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.getArea + apiInfo.info.get)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Get all search kols data by keyword search by user
    */
    getSearchKolsData(postObj: any) {
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
     * save recent search data
     * @param postObj
     */
    saveRecentSearchData(postObj: any) {
        return new Promise((resolve, reject) => {
            this.service.post(apiInfo.info.kols + apiInfo.info.search + apiInfo.info.save, postObj)
            .then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /**
     * get all existing recent search data
     */
    getRecentSearchData() {
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.kols + apiInfo.info.search + apiInfo.info.recent)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
     * delete all existing recent search data
     */
    deleteRecentSearchData() {
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.kols + apiInfo.info.search + apiInfo.info.delete)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
     * get all existing teams and Groups of logged in user
     */
    getGroupsandTeams() {
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.getGroupTeam)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
     * get all existing teams and Groups of Kol which is clicked
     */
    getGroupsandTeamsByKolId(kol_id) {
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.kol + '/' + kol_id + apiInfo.info.getAllGroupTeam)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
     * Add remove kol from group
     */
    addRemoveKolInGroup(postObj) {
        return new Promise((resolve, reject) => {
            this.service.post(apiInfo.info.add, postObj)
            .then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
    }


  /**
    * Get all frequent area list for kol form server
    */
   getAllFrequentAreaListForKol() {
    return new Promise((resolve, reject) => {
        this.service.get(apiInfo.info.kols + apiInfo.info.analytics + apiInfo.info.getArea + apiInfo.info.frequent)
            .then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
    });
}
}
