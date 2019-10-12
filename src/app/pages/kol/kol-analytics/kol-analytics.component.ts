import { Component, OnInit, HostListener } from '@angular/core';
import { KolsService } from '../../../core/service/kols/kols.service';
import * as moment from 'moment';
import { HomeService } from 'src/app/core/service/home/home.service';
import { MessageService } from 'src/app/core/service/message/message.service';

declare var $: any;

@Component({
  selector: 'app-kol-analytics',
  templateUrl: './kol-analytics.component.html',
  styleUrls: ['./kol-analytics.component.scss']
})
export class KolAnalyticsComponent implements OnInit {

  kolsData: any = [];
  dateArr: any = [{
    name: 'Last 7 Days',
    value: 7,
  }, {
    name: 'Last 15 Days',
    value: 15,
  }, {
    name: 'Last 30 Days',
    value: 30,
  }, {
    name: 'Last 90 Days',
    value: 90,
  }, {
    name: 'Last 6 Months',
    value: '6Months',
  }, {
    name: 'Last One Year',
    value: '1Year',
  }];
  isDateShow = false;
  postObj: any = {};
  isDateFilter = false;
  showArea = false;
  areaType = false;
  searchCount = 0;
  areaSearchCount: Number = 0;
  areaKeyword = '';
  frequentAreaList: any = [];
  allArearList: any;
  searchAreaList: any;
  selectArea = false;
  allFrequentAreaList: any = [];
  existAreaSearch: any = [];
  existArearIds: any = [];
  isClearArea = false;
  existAreaList: any = [];
  isAreaPage = false;
  areaPage = 1;
  selectedDate = 'Date';
  isApiLoad = false;

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    console.log(event.srcElement.className);
    if (event.srcElement.className.indexOf('area') === -1) {
      if (this.showArea) {
        this.showArea = false;
      }
    }

    if (event.srcElement.className.indexOf('date') === -1) {
      if (this.isDateShow) {
        this.isDateShow = false;
      }
    }

    if (event.srcElement.className.indexOf('search-area') === -1) {
      if (this.areaType) {
        this.areaType = false;
      }
    }
  }


  constructor(
    private kolsService: KolsService,
    private homeService: HomeService,
    private messageService: MessageService,
  ) {
    this.getAllKolAnalyticsData();
  }

  ngOnInit() {
    this.getAllAreaList();
    this.getAllFrequentAreaList();
    this.getAllAreaListWithPagination();
  }

  /**
  * Get the list of KOL for showing on kol analytics tab
  */
  getAllKolAnalyticsData() {
    this.kolsData = [];
    this.isApiLoad = false;
    if (this.areaSearchCount > 0) {
      this.searchCount = <any>this.searchCount + this.areaSearchCount;
    }
    if (this.isDateFilter) {
      this.searchCount = <any>this.areaSearchCount + 1;
    }
    this.messageService.setHttpLoaderStatus(true);
    if (this.postObj.hasOwnProperty('areas')) {
      console.log('==>',this.postObj.areas.length);
      if (this.postObj.areas.length === 0) {
        delete this.postObj.areas;
      }
    }
    this.kolsService.getAllKolAnalyticsData(this.postObj)
      .then((res: any) => {
        console.log(res);
        this.kolsData = res.data;
        this.isApiLoad = true;
        $(document).ready(function () {
          const all_list = $('.kol-block');
          // console.log(all_list);
          $('.kol-block').each(function (i) {
            const outer_width = $(this).width();
            const ul_width = $(this).find('ul').width();
            if (ul_width > outer_width ) {
              $(this).addClass('big-element');
            }
          });
        });
      }).catch((err: any) => {
        this.isApiLoad = true;
        console.log(err);
      });
  }

  /**
   * When user add date filter
   * @param item
   */
  onSelectDateFilter(item: any) {
    console.log('item', item);
    let startDate;
    let endDate;
    if (item.value === '6Months' || item.value === '1Year') {
      if (item.value === '6Months') {
        startDate = moment().subtract(6, 'months').format('YYYY-MM-DD');
        endDate = moment().format('YYYY-MM-DD');
      } else {
        startDate = moment().subtract(1, 'year').format('YYYY-MM-DD');
        endDate = moment().format('YYYY-MM-DD');
      }
    } else {
      startDate = moment().subtract(item.value, 'days').format('YYYY-MM-DD');
      endDate = moment().format('YYYY-MM-DD');
    }
    if (startDate !== undefined && endDate !== undefined) {
      this.postObj['start_date'] = startDate;
      this.postObj['end_date'] = endDate;
     // this.postObj['days'] = item.value;
      this.isDateShow = false;
      this.isDateFilter = true;
      this.selectedDate = item.name;
      this.getAllKolAnalyticsData();
    }
  }

  /** apply date filter data */
  applyDateFilter() {
    this.isDateShow = !this.isDateShow;
  }

  /**
  * Clear all the apply filter data
  * @memberof KolAnalyticsComponent
  */
  clearApplyFilter() {
    this.searchCount = 0;
    this.postObj = {};
    this.isDateFilter = false;
    this.kolsData = [];
    this.selectedDate = 'Date';
    this.existAreaSearch = [];
    this.existArearIds = [];
    this.searchCount = 0;
    this.areaSearchCount = 0;
    this.frequentAreaList = [];
    this.allFrequentAreaList.filter((item: any) => {
        item['selected'] = false;
    });
    this.existAreaList.filter((item: any) => {
        item['selected'] = false;
    });
    this.selectArea = false;
    this.getAllKolAnalyticsData();
  }

  /**
  * Get all existing institution list without paginations
  */
  getAllAreaList() {
    this.allArearList = [];
    this.homeService.getAllExistingAreaList()
      .then((res: any) => {
        res['data'].filter(item => {
          item['selected'] = false;
          this.allArearList.push(item);
        });
      }).catch((err: any) => {
        console.log(err);
      });
  }

  /**
    * Get all area list with paginations
    */
   getAllAreaListWithPagination() {
    const postObj = {
        'page': this.areaPage
    };
    const postIds = [];
    this.frequentAreaList.filter((item: any) => {
        if (item['selected']) {
            postIds.push(item.id);
        }
    });
    if (postIds.length > 0) {
        postObj['id'] = postIds.toString();
    }
    this.homeService.getAllAreaList(postObj)
        .then((res) => {
            if (res['success']) {
                this.isAreaPage = res['data']['next_page'];
                if (res['data']['next_page']) {
                    this.areaPage++;
                }
                for (const x of Object.keys(res['data']['data'])) {
                    this.existAreaList.push(res['data']['data'][x]);
                }
            }
        }).catch((err) => {
            console.log(err);
        });
}

  /**
  * Get lit of area that frequent search  by user
  */
  getAllFrequentAreaList() {
    this.homeService.getAllFrequentAreaListForKol()
      .then((res: any) => {
        this.allFrequentAreaList = res['data'];
        this.manageAreaSearchData();
      }).catch((err: any) => {
        console.log(err);
      });
  }

  manageAreaSearchData() {
    if (this.existAreaSearch.length > 0) {
      this.frequentAreaList = this.existAreaSearch.slice(0);
    }
    const res = this.allFrequentAreaList.filter(n => !this.frequentAreaList.some(n2 => n.id === n2.id));
    res.filter((item: any) => {
      if (this.frequentAreaList.length <= 5) {
        item['selected'] = false;
        this.frequentAreaList.push(item);
      }
    });
    if (this.existAreaSearch.length > 0) {
      if (this.isClearArea) {
        this.frequentAreaList.filter((item: any) => {
          item['selected'] = false;
        });
      } else {
        this.selectArea = true;
      }
    }
  }

  /**
  * Hide/Show area list dropdown
  */
  showAreaList() {
    if (this.showArea) {
      this.showArea = false;
    } else {
      this.showArea = true;
      this.manageAreaSearchData();
    }
    this.isDateShow = false;
    this.areaKeyword = '';
    this.areaType = false;
  }

  /**
  * open area suto suggestions list and show match area based on user type
  */
  searchAreaFromList(event: any) {
    if (this.areaKeyword.length > 0) {
      const searchData = [];
      this.allArearList.filter(list => {
        let ifExist = false;
        if (list.name !== null) {
          if (list.name.toLowerCase().includes(this.areaKeyword.toLowerCase())) {
            ifExist = true;
          }
        }
        if (list.abbreviated_name !== null) {
          if (list.abbreviated_name.toLowerCase().includes(this.areaKeyword.toLowerCase())) {
            ifExist = true;
          }
        }
        if (list.search_terms !== null) {
          if (list.search_terms.toLowerCase().includes(this.areaKeyword.toLowerCase())) {
            ifExist = true;
          }
        }
        if (ifExist) {
          searchData.push(list);
        }
      });
      this.searchAreaList = searchData;
      this.areaType = true;
    } else {
      this.searchAreaList = [];
      this.areaType = false;
    }
  }

  selectAreaForSearch(item: any) {
    item.selected = true;
    let array = false;
    this.frequentAreaList.filter(list => {
      if (list['id'] === item['id']) {
        list['selected'] = true;
        array = true;
      }
    });
    if (!array) {
      this.frequentAreaList.push(item);
    }
    let array1 = false;
    this.existAreaList.filter((list: any) => {
      if (list['id'] === item['id']) {
        list['selected'] = true;
        array1 = true;
      }
    });
    if (!array1) {
      this.existAreaList.unshift(item);
    }
    this.areaType = false;
    this.areaKeyword = '';
    this.selectArea = true;
  }

  selectAreaSearch(item: any) {
    this.selectArea = true;
    if (item['selected']) {
      item['selected'] = false;
    } else {
      item['selected'] = true;
    }
    let isSelect = false;

    // tslint:disable-next-line: no-shadowed-variable
    this.frequentAreaList.filter((item: any) => {
      if (item['selected']) {
        isSelect = true;
      }
    });

    if (!isSelect) {
      this.selectArea = false;
    }

  }

  clearAreaASearchData() {

    console.log('this.frequentAreaList', this.frequentAreaList);
    console.log('this.existAreaList', this.existAreaList);
    console.log('this.post', this.postObj);

    this.frequentAreaList.filter(item => {
      item['selected'] = false;
    });
    this.existAreaList.filter((item: any) => {
      item['selected'] = false;
    });
    this.selectArea = false;
    this.isClearArea = true;
  }

  cancelAreaASearchData() {
    this.showArea = false;
    this.isClearArea = false;
    this.frequentAreaList = this.allFrequentAreaList.slice(0);
  }

  /**
    * Load more area list on scroll
    * @param event
    */
   onAreaScroll(event: any) {
    if (this.isAreaPage) {
        this.messageService.setHttpLoaderStatus(false);
        this.getAllAreaListWithPagination();
    }
}

/**
    * Apply area data on search result
    */
   applyAearSearchOnData() {
    this.areaSearchCount = 0;
    this.searchCount = 0;
    this.isClearArea = false;
    this.existAreaSearch = [];
    this.existArearIds = [];
    this.frequentAreaList.filter((item: any) => {
        if (item['selected']) {
            this.existAreaSearch.push(item);
            this.existArearIds.push(item.id);
            this.areaSearchCount = <any>this.areaSearchCount + 1;
        }
    });
    this.showArea = false;
    if (this.existArearIds.length === 0) {
        this.frequentAreaList = [];
    } else {
        if (this.allFrequentAreaList.length === 0) {
            this.allFrequentAreaList = this.existAreaSearch.slice(0);
        }
    }
    console.log(this.existArearIds);
    this.postObj['areas'] = this.existArearIds;
    console.log(this.postObj);
    this.getAllKolAnalyticsData();
}

}
