import { Injectable } from '@angular/core';
import { RequestService } from '../request/request.service';
import { apiInfo } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DrugsService {

  constructor(private service: RequestService) { }

  /**
  * Get all products/drugs list form server to display on home page
  */
  getAllProductsList(postObj: any) {
    const esc = encodeURIComponent;
    let queryStr = Object.keys(postObj)
      .map(k => esc(k) + '=' + esc(postObj[k]))
      .join('&');
    if (queryStr !== '') {
      queryStr = '?' + queryStr;
    }
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.drug.products + queryStr)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Get Product(Drug) detail data by id
  * @param product_id
  */
  getProductDetailById(product_id: number) {
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.drug.products + `/${product_id}`)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Add Product(Drug) as favourite list by id
  * @param product_id
  */
  addFavoriteProductById(product_id: number) {
    return new Promise((resolve, reject) => {
      this.service.put(apiInfo.info.drug.products + `/${product_id}` + apiInfo.info.drug.favourite, {})
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Remove  Product(Drug) from favourite list by id
  * @param product_id
  */
  removeFavoriteProductById(product_id: number) {
    return new Promise((resolve, reject) => {
      this.service.delete(apiInfo.info.drug.products + `/${product_id}` + apiInfo.info.drug.unfavourite, {})
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Get all news/tweets data by product Id
  * @param product_id
  */
  getAllNewsByProductId(product_id: number, postObj: any) {
    const esc = encodeURIComponent;
    let queryStr = Object.keys(postObj)
      .map(k => esc(k) + '=' + esc(postObj[k]))
      .join('&');
    if (queryStr !== '') {
      queryStr = '?' + queryStr;
    }
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.drug.products + `/${product_id}` + apiInfo.info.getNews + queryStr)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Get all Trials data by product Id
  * @param product_id
  */
  getAllTrialsDataByProductId(product_id: number, postObj: any) {
    const esc = encodeURIComponent;
    let queryStr = Object.keys(postObj)
      .map(k => esc(k) + '=' + esc(postObj[k]))
      .join('&');
    if (queryStr !== '') {
      queryStr = '?' + queryStr;
    }
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.drug.products + `/${product_id}` + apiInfo.info.getTrails + queryStr)
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
  getTrailsDetailData(trial_id: number, product_id: number) {
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.getTrails + `/${trial_id}` + `?product_id=${product_id}`)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Get all news data by Trials Id
  * @param trial_id
  */
  getAllNewsByTrailId(trial_id: number, postObj: any) {
    const esc = encodeURIComponent;
    let queryStr = Object.keys(postObj)
      .map(k => esc(k) + '=' + esc(postObj[k]))
      .join('&');
    if (queryStr !== '') {
      queryStr = '?' + queryStr;
    }
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.getTrails + `/${trial_id}` + apiInfo.info.getNews + apiInfo.info.list + queryStr)
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
  * @param product_id
  */
  addBookmarkNewsById(news_id: Number, product_id: Number) {
    return new Promise((resolve, reject) => {
      this.service.put(apiInfo.info.drug.products + apiInfo.info.getNews + `/${news_id}` + apiInfo.info.bookmark + `/${product_id}`, {})
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
      this.service.delete(apiInfo.info.drug.products + apiInfo.info.getNews + `/${news_id}` + apiInfo.info.unbookmark, {})
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
  * @param product_id
  */
  addBookmarkTrailsById(trail_id: Number, product_id: Number) {
    return new Promise((resolve, reject) => {
      this.service.put(apiInfo.info.drug.products + apiInfo.info.getTrails + `/${trail_id}` + apiInfo.info.bookmark + `/${product_id}`, {})
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
      this.service.delete(apiInfo.info.drug.products + apiInfo.info.getTrails + `/${trail_id}` + apiInfo.info.unbookmark, {})
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Update news items last view
  * @param product_id
  */
  updateNewsLastView(product_id: any) {
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.drug.products + `/${product_id}` + apiInfo.info.getNews + apiInfo.info.read)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }


  /**
  * get all existing recent search data for drug
  */
  getRecentSearchData() {
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.drug.products + apiInfo.info.search + apiInfo.info.recent)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Get all search product data by keyword search by user
  */
  getSearchProductList(postObj: any) {
    return new Promise((resolve, reject) => {
      this.service.post(apiInfo.info.drug.products + apiInfo.info.search, postObj)
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
      this.service.post(apiInfo.info.drug.products + apiInfo.info.search + apiInfo.info.save, postObj)
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
      this.service.get(apiInfo.info.drug.products + apiInfo.info.search + apiInfo.info.delete)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Submit Drug request data to server and send it to larvol admin
  * @param postObj
  */
  submitDrugRequest(postObj: any) {
    return new Promise((resolve, reject) => {
      this.service.post(apiInfo.info.drug.products + apiInfo.info.request, postObj)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Update news items last view
  * @param product_id
  */
  updateNewsReadStatus(product_id: any, type: string) {
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.drug.products + `/${product_id}` + apiInfo.info.updatereadstatus + '?type=' + type)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }
  /**
  * Update news items last view
  * @param product_id
  */
  updateTrailNewsReadStatus(product_id: number, trail_id: number) {
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.drug.product + `/${product_id}` + apiInfo.info.getTrails + `/${trail_id}` + apiInfo.info.read)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }
}
