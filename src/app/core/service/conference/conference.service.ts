import { Injectable } from '@angular/core';
import { RequestService } from '../request/request.service';
import { apiInfo } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ConferenceService {

  constructor(private service: RequestService) { }

  /**
  * Get all Conferences data by KOLs Id
  * @param kol_id: number
  * @param postObj: any
  */
  getAllConferencesDataByKOLsId(kol_id: number, postObj: any) {
    const esc = encodeURIComponent;
    let queryStr = Object.keys(postObj)
      .map(k => esc(k) + '=' + esc(postObj[k]))
      .join('&');
    if (queryStr !== '') {
      queryStr = '?' + queryStr;
    }
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.kols + `/${kol_id}` + apiInfo.info.getConference + queryStr)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Get Conference detail by id
  * @param id: number
  * @param kolId: number
  */
  getConferenceDetailData(kolId: number, id: number) {
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.kols + `/${kolId}` + apiInfo.info.getConference + `/${id}`)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Get all news data by Conference Id
  * @param id
  */
  getAllNewsDataByConferenceId(kolId: number, id: number, postObj: any) {
    const esc = encodeURIComponent;
    let queryStr = Object.keys(postObj)
      .map(k => esc(k) + '=' + esc(postObj[k]))
      .join('&');
    if (queryStr !== '') {
      queryStr = '?' + queryStr;
    }
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.kols + `/${kolId}` + apiInfo.info.getConference + `/${id}` + apiInfo.info.getNews + queryStr)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }
  /**
  * Add News item as bookmark list by id
  * @param conference_id: number
  */
  addBookmarkNewsById(news_id: Number, conference_id: Number) {
    return new Promise((resolve, reject) => {
      this.service.put(apiInfo.info.getConference + apiInfo.info.getNews + `/${news_id}` + apiInfo.info.bookmark + `/${conference_id}`, {})
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Remove News item from bookmark list by id
  * @param news_id
  */
  removeBookmarkNewsById(news_id: Number) {
    return new Promise((resolve, reject) => {
      this.service.delete(apiInfo.info.getConference + apiInfo.info.getNews + `/${news_id}` + apiInfo.info.unbookmark, {})
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * Update news items last view
   * @param kol_id: number
   * @param conference_id: number
   */
  updateNewsLastView(kol_id: number, conference_id: number) {
    return new Promise((resolve, reject) => {
        this.service.get(apiInfo.info.kols + `/${kol_id}` + apiInfo.info.getConference + `/${conference_id}` + apiInfo.info.read)
            .then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
    });
  }

  /**
    * Get all bookmark news list
    * @param postObj
    */
   getAllBookmarkNewsList(postObj: any) {
    const esc = encodeURIComponent;
    let queryStr = Object.keys(postObj)
        .map(k => esc(k) + '=' + esc(postObj[k]))
        .join('&');
    if (queryStr !== '') {
        queryStr = '?' + queryStr;
    }
    return new Promise((resolve, reject) => {
        this.service.get(apiInfo.info.getConference + apiInfo.info.getNews + apiInfo.info.bookmark + queryStr)
            .then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
    });
}
}
