import { Injectable } from '@angular/core';
import { RequestService } from '../request/request.service';
import { apiInfo } from '../../../../environments/environment';
import { app } from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class KolsService {

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
  * Get all news data by KOLs Id
  * @param kol_id
  */
  getAllNewsByKOLsId(kol_id: number, postObj: any) {
    const esc = encodeURIComponent;
    let queryStr = Object.keys(postObj)
      .map(k => esc(k) + '=' + esc(postObj[k]))
      .join('&');
    if (queryStr !== '') {
      queryStr = '?' + queryStr;
    }
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.kols + `/${kol_id}` + apiInfo.info.getNews + apiInfo.info.list + queryStr)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Get all Trials data by KOLs Id
  * @param kol_id
  */
  getAllTrialsDataByKOLsId(kol_id: number, postObj: any) {
    const esc = encodeURIComponent;
    let queryStr = Object.keys(postObj)
      .map(k => esc(k) + '=' + esc(postObj[k]))
      .join('&');
    if (queryStr !== '') {
      queryStr = '?' + queryStr;
    }
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.kols + `/${kol_id}` + apiInfo.info.getTrails + queryStr)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Add Kols as favourite list by id
  * @param kol_id
  */
  addFavoriteKOLsById(kol_id: number) {
    return new Promise((resolve, reject) => {
      this.service.put(apiInfo.info.kols + `/${kol_id}` + apiInfo.info.favourite, {})
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
  removeFavoriteKOLsById(kol_id: number) {
    return new Promise((resolve, reject) => {
      this.service.delete(apiInfo.info.kols + `/${kol_id}` + apiInfo.info.unfavourite, {})
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Add Liked Status to news by news id
  * @param id
  * @param postObj
  */
  addLikedStatustoNews(id: number, postObj: any) {
    const esc = encodeURIComponent;
    let queryStr = Object.keys(postObj)
      .map(k => esc(k) + '=' + esc(postObj[k]))
      .join('&');
    if (queryStr !== '') {
      queryStr = '?' + queryStr;
    }
    return new Promise((resolve, reject) => {
      this.service.put(apiInfo.info.likes + `/${id}` + `${queryStr}`, {})
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Get All Likes data for news by news id
  * @param id
  */
  getLikedForNews(id: number, postObj: any) {
    const esc = encodeURIComponent;
    let queryStr = Object.keys(postObj)
      .map(k => esc(k) + '=' + esc(postObj[k]))
      .join('&');
    if (queryStr !== '') {
      queryStr = '?' + queryStr;
    }
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.likes + `/${id}` + queryStr)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Get all existing Comments for News by id
  * @param id
  */
  getAllExistingComments(id: number) {
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.getNews + `/${id}` + apiInfo.info.comments)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Get KOLs detail data by id
  * @param id
  */
  getKOLsDetailData(id: number) {
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.kols + `/${id}`)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Add Liked Status to news by news id
  * @param id
  */
  addCommentForNews(id: number, postObj) {
    return new Promise((resolve, reject) => {
      this.service.post(apiInfo.info.getNews + `/${id}` + apiInfo.info.comments, postObj)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Get all news data by Trials Id
  * @param id
  */
  getAllNewsByTrailId(id: number, postObj: any) {
    const esc = encodeURIComponent;
    let queryStr = Object.keys(postObj)
      .map(k => esc(k) + '=' + esc(postObj[k]))
      .join('&');
    if (queryStr !== '') {
      queryStr = '?' + queryStr;
    }
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.getTrails + `/${id}` + apiInfo.info.getNews + apiInfo.info.list + queryStr)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Submit kol request data
  * @param postObj
  */
  submitKOLRequset(postObj: any) {
    return new Promise((resolve, reject) => {
      this.service.post(apiInfo.info.kols + apiInfo.info.request, postObj)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Create new notes by user/kol id
  * @param id
  * @param postObj
  */
  saveNewNote(postObj: any, kol_id: number) {
    return new Promise((resolve, reject) => {
      this.service.post(apiInfo.info.notes + apiInfo.info.kol + `/${kol_id}`, postObj)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Get exist note data by kol id
  * @param kol_id
  */
  getNotesByKOlId(kol_id: number) {
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.notes + apiInfo.info.kol + `/${kol_id}`)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * update new notes by note id
  * @param id
  * @param postObj
  */
  updateNewNote(postObj: any, id: number) {
    return new Promise((resolve, reject) => {
      this.service.put(apiInfo.info.notes + `/${id}`, postObj)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Get exist note data by note id
  * @param id
  */
  getNotesByNoteId(id: number) {
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.notes + `/${id}`)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Get all exist note list
  */
  getAllNotes(postObj: any) {
    const esc = encodeURIComponent;
    let queryStr = Object.keys(postObj)
      .map(k => esc(k) + '=' + esc(postObj[k]))
      .join('&');
    if (queryStr !== '') {
      queryStr = '?' + queryStr;
    }
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.notes + queryStr)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  *  Increase Shared Count
  * @param news_id
  */
  increaseShareCOunt(news_id: number) {
    return new Promise((resolve, reject) => {
      this.service.put(apiInfo.info.getNews + `/${news_id}` + apiInfo.info.share, {})
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Submit counter request to larvol team
  * @param postObj
  */
  submitCounterRequest(postObj) {
    return new Promise((resolve, reject) => {
      this.service.post(apiInfo.info.counterRequest, postObj)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Get Trails detail by id
  * @param trial_id
  */
  getTrailsDetailData(trial_id: number, kol_id: number) {
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.getTrails + `/${trial_id}` + `?kol_id=${kol_id}`)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * get ics file path to open in mail client application
  * @param id
  */
  getICSFileForCalender(id: any) {
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.createics + `/${id}`)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Add Kols as bookmark list by id
  * @param kol_id
  */
  addBookmarkKOLsById(kol_id: Number) {
    return new Promise((resolve, reject) => {
      this.service.put(apiInfo.info.kols + `/${kol_id}` + apiInfo.info.bookmark, {})
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Remove Kols from bookmark list by id
  * @param kol_id
  */
  removeBookmarkKOLsById(kol_id: Number) {
    return new Promise((resolve, reject) => {
      this.service.delete(apiInfo.info.kols + `/${kol_id}` + apiInfo.info.bookmark, {})
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Add News item as bookmark list by id
  * @param news_id
  */
  addBookmarkNewsById(news_id: Number, kol_id: Number) {
    return new Promise((resolve, reject) => {
      this.service.put(apiInfo.info.getNews + `/${news_id}` + apiInfo.info.bookmark + `/${kol_id}`, {})
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
      this.service.delete(apiInfo.info.getNews + `/${news_id}` + apiInfo.info.unbookmark, {})
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Add trails item as bookmark list by id
  * @param trail_id
  */
  addBookmarkTrailsById(trail_id: Number, kol_id: Number) {
    return new Promise((resolve, reject) => {
      this.service.put(apiInfo.info.getTrails + `/${trail_id}` + apiInfo.info.bookmark + `/${kol_id}`, {})
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Remove trails item from bookmark list by id
  * @param trail_id
  */
  removeBookmarkTrailsById(trail_id: number) {
    return new Promise((resolve, reject) => {
      this.service.delete(apiInfo.info.getTrails + `/${trail_id}` + apiInfo.info.unbookmark, {})
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
      this.service.get(apiInfo.info.getNews + apiInfo.info.get + queryStr)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Get all Bookmark Trials data
  * @param postObj
  */
  getAllBookmarkTrailsList(postObj: any) {
    const esc = encodeURIComponent;
    let queryStr = Object.keys(postObj)
      .map(k => esc(k) + '=' + esc(postObj[k]))
      .join('&');
    if (queryStr !== '') {
      queryStr = '?' + queryStr;
    }
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.getTrails + apiInfo.info.get + queryStr)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * get list of user that is used in web mentions for comment
  */
  getUserListForComment() {
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.getUsers)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /*
  * Update news items last view
  * @param kol_id
  */
  updateNewsLastView(kol_id: any) {
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.kols + `/${kol_id}` + apiInfo.info.getNews + apiInfo.info.read)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * delete note by note id
  * @param id
  */
  deleteNewNote(id: number) {
    return new Promise((resolve, reject) => {
      this.service.delete(apiInfo.info.notes + `/${id}`, {})
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Get all kol analytics data
  * @param postObj
  */
  getAllKolAnalyticsData(postObj: any) {
    // const esc = encodeURIComponent;
    // let queryStr = Object.keys(postObj)
    //     .map(k => esc(k) + '=' + esc(postObj[k]))
    //     .join('&');
    // if (queryStr !== '') {
    //     queryStr = '?' + queryStr;
    // }
    return new Promise((resolve, reject) => {
      this.service.post(apiInfo.info.kols + apiInfo.info.analytics, postObj)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Update news items last view
  * @param kol_id
  */
  updateNewsReadStatus(kol_id: any, type: string) {
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.kols + `/${kol_id}` + apiInfo.info.updatereadstatus + '?type=' + type)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Update news items last view
  * @param kol_id
  */
  updateTrailNewsReadStatus(kol_id: any, trail_id) {
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.kols + `/${kol_id}` + apiInfo.info.getTrails + `/${trail_id}` + apiInfo.info.read)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }
}
