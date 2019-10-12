import { Component, OnInit, Renderer2, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DrugsService } from './../../../core/service/drugs/drugs.service';
import { MessageService } from './../../../core/service/message/message.service';
import { Location } from '@angular/common';
import { KolsService } from './../../../core/service/kols/kols.service';
import { KolEntityImageComponent } from './../../common/kol-entity-image/kol-entity-image.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from './../../../core/service/util.service';

declare var $: any;

@Component({
  selector: 'app-drug-trial-related-news',
  templateUrl: './drug-trial-related-news.component.html',
  styleUrls: ['./drug-trial-related-news.component.scss']
})
export class DrugTrialRelatedNewsComponent implements OnInit, OnDestroy {

  @ViewChild('drugInfo') drugInfo: ElementRef;
  trailsData: any;
  productId: any;
  trailId: any;
  currentPage = 1;
  newsSettingsData: any;
  newsData: any = [];
  nextPage = false;
  isPageLoad = false;
  updatedNewsList: any = [];
  allUserList: any = [];
  fromBookmark = false;
  headerTitle = '';
  isInfoLoad = false;
  isTrailsLoad = false;
  isAPIRun = false;
  newsId = 0;
  notificationData: any;
  isFullView = false;

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private drugsService: DrugsService,
    private messageService: MessageService,
    private location: Location,
    private kolsService: KolsService,
    private modalService: NgbModal,
    private utilService: UtilService
  ) {
    if (localStorage.getItem('knews_item') !== null) {
      this.notificationData = <any>JSON.parse(localStorage.getItem('knews_item'));
      this.newsId = this.notificationData['id'];
      localStorage.removeItem('knews_item');
    }
    this.trailsData = JSON.parse(localStorage.getItem('ktrials_data'));
    console.log(this.trailsData);

    if (localStorage.getItem('kbookmarkselected_tab') !== null && localStorage.getItem('kbookmarkselected_tab') !== undefined && localStorage.getItem('kbookmarkselected_tab') !== '') {
      this.fromBookmark = true;
    }
    if (this.fromBookmark) {
      if (this.headerTitle === '') {
        this.headerTitle = localStorage.getItem('header_title');
      }
      localStorage.setItem('header_title', 'Trial Related News​');
      this.messageService.setKolsData('Trial Related News​');
    }

    if (this.trailsData === null || this.trailsData === undefined || this.trailsData === '') {
      this.router.navigate(['']);
    } else {
      if (this.trailsData['product_id'] !== undefined) {
        this.productId = this.trailsData['product_id'];
      }

      if (this.trailsData['is_notification']) {
        this.trailsData['brief_title'] = '';
        this.trailId = this.trailsData['trial_id'];
        this.getDrugsDetailData();
      } else {
        this.trailId = this.trailsData['id'];
        this.getDrugsDetailData();
      }
      if (this.trailId === null) {
        this.router.navigate(['']);
      } else {
        this.getTrailsDetailById();
        this.getAllNewsDataByTrialId();
      }
    }
  }

  ngOnInit() {
    if (!this.fromBookmark) {
      this.messageService.setKolsData({});
    }
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.renderer.removeClass(document.body, 'stickyheader');
    $('trial-fixed-block').removeClass('infoHeight');
    $('.trial-fixed-block').css('top', '0px');
    this.renderer.removeClass(document.body, 'stickyheader');
    this.messageService.setHttpLoaderStatus(true);
    this.getUserListForComment();
  }

  ngOnDestroy() {
    if (this.fromBookmark) {
      localStorage.removeItem('ktrials_data');
    }
    this.messageService.setHttpLoaderStatus(true);
    this.messageService.setKolsData(this.headerTitle);
    localStorage.setItem('header_title', this.headerTitle);
  }

  /**
  * Get trails detail by trial id
  */
  getTrailsDetailById() {
    this.drugsService.getTrailsDetailData(this.trailId, this.productId)
      .then(res => {
        console.log(res);
        if (res['success']) {
          this.trailsData = res['data']['data'];
          this.updatedNewsList = res['data']['news']['data'];
        }
        if (this.isPageLoad) {
          this.updateNewsReadStatus();
        }
        if (this.trailsData.trials_read_status === 0 || this.trailsData.related_news_is_updated === 0) {
          this.updateTrailReadStatus('trials');
        }
      }).catch(err => {
        console.log(err);
      });
  }

  /**
  * Get List of all news by Trials Id
  */
  getAllNewsDataByTrialId() {
    const postObj = {
      'page': this.currentPage,
      'product_id': this.productId
    };

    this.drugsService.getAllNewsByTrailId(this.trailId, postObj)
      .then((newsRes: any) => {
        if (newsRes['success']) {
          this.newsSettingsData = newsRes['data'];
          let data = {};
          for (const x of Object.keys(newsRes['data']['data'])) {
            newsRes['data']['data'][x]['isShow'] = false;
            newsRes['data']['data'][x]['target'] = '_blank';
            if (newsRes['data']['data'][x]['url'] === '') {
              newsRes['data']['data'][x]['url'] = 'javascript:void(0)';
              newsRes['data']['data'][x]['target'] = '';
            } else if (newsRes['data']['data'][x]['url'].indexOf('http') === -1) {
              newsRes['data']['data'][x]['url'] = 'http://' + newsRes['data']['data'][x]['url'];
            }
            if (newsRes['data']['data'][x]['id'] === this.newsId) {
              data = newsRes['data']['data'][x];
              if (this.notificationData['activity_type'] === 0) {
                newsRes['data']['data'][x]['is_notification_news'] = true;
              }
            }
            this.newsData.push(newsRes['data']['data'][x]);
          }
          this.nextPage = newsRes['data']['next_page'];
          if (newsRes['data']['next_page']) {
            this.currentPage += 1;
          }
          this.isPageLoad = true;
          if (this.newsId > 0) {
            const self = this;
            setTimeout(() => {
              $(document).ready(function () {
                const top = $('#news_' + self.newsId).offset().top;
                $('html, body').animate({
                  scrollTop: top + 'px'
                }, 1800);
                if (self.notificationData['activity_type'] === 0) {
                  setTimeout(() => {
                    console.log('NEWS DATA', data);
                  }, 2000);
                } else {
                  document.getElementById(<any>self.newsId).click();
                }
              });
            }, 500);
          }
        }
        if (this.isPageLoad) {
          this.updateNewsReadStatus();
        }
        this.isTrailsLoad = false;
        this.isAPIRun = false;
      }).catch((err: any) => {
        console.log(err);
        this.isPageLoad = true;
        this.isTrailsLoad = false;
        this.isAPIRun = false;
      });
  }

  /**
  * Set header as static once user scroll down
  * @param event
  */
  onWindowScroll(event: any) {
    event.preventDefault();
    this.isFullView = false;
    const num = window.scrollY;
    const q = this.drugInfo.nativeElement.offsetHeight + 'px';
    if (num > 110) {
      this.renderer.addClass(document.body, 'stickyheader');
      $('.trial-fixed-block').addClass('infoHeight');
      $('infoHeight').css('top', q);
    } else if (num < 110) {
      this.renderer.removeClass(document.body, 'stickyheader');
      $('.trial-fixed-block').removeClass('infoHeight');
      $('.trial-fixed-block').css('top', '0px');
    }
  }

  /**
  * Get bookmark icon hover text for trial
  * @param item
  */
  getTooltipDataForTrail(item: any) {
    if (item.is_bookmarked) {
      return 'Unbookmark';
    } else {
      return 'Bookmark';
    }
  }

  /**
  * Get bookmark icon hover text for news item
  * @param item
  */
  getTooltipData(item: any) {
    if (item.is_bookmark) {
      return 'Unbookmark';
    } else {
      return 'Bookmark';
    }
  }

  /**
  * Load more data when user scroll down on screen
  * @param event
  */
  onScroll(event: any) {
    if (this.nextPage) {
      if (!this.isAPIRun) {
        this.isAPIRun = true;
        this.isTrailsLoad = true;
        this.messageService.setHttpLoaderStatus(false);
        this.getAllNewsDataByTrialId();
      }
    }
  }

  /**
  * Go to previous page
  */
  goBack() {
    this.location.back();
  }

  /**
  * Return product name with specific format
  * @param name
  */
  getProductName(name: String) {
    if (name !== '' && name !== null && name !== undefined) {
      let newName: any;
      if (name.indexOf('(') === 0) {
        newName = name.split(')');
        if (newName.length > 1) {
          return newName[1].trim();
        } else {
          return name;
        }
      } else {
        newName = name.split('(');
        if (newName.length > 1) {
          return newName[0].trim();
        } else {
          return name;
        }
      }
    }
  }

  /**
  * get list of user that is used in web mentions for comment
  */
  getUserListForComment() {
    this.kolsService.getUserListForComment()
      .then((res: any) => {
        if (res['success']) {
          res['data']['data'].filter((item: any) => {
            this.allUserList.push(item);
          });
        }
      }).catch((err: any) => {
        console.log(err);
      });
  }

  /**
  * Image slider popup in tweet/news tab for multiple images
  */
  showPopup(item: any) {
    if (item.images.original.length > 1) {

      const activeModal = this.modalService.open(KolEntityImageComponent, { size: 'sm', windowClass: 'tweet-image-popup' });
      activeModal.componentInstance.news_images = item.images.original;
    }
  }
  /**
  * Add/remove news item from bookmark list
  * @param item
  */
  addNewsItemToBookmark(item: any) {
    this.messageService.setHttpLoaderStatus(true);
    if (item.is_bookmark) {
      this.drugsService.removeBookmarkNewsById(item.id)
        .then((res: any) => {
          if (res['success']) {
            item.is_bookmark = false;
            this.utilService.showCustom('Bookmark removed.');
          } else {
            this.utilService.showError('Error', res['message']);
          }
        }).catch((err: any) => {
          console.log(err);
          this.utilService.showError('Error', err['message']);
        });
    } else {
      this.drugsService.addBookmarkNewsById(item.id, this.productId)
        .then((res: any) => {
          if (res['success']) {
            item.is_bookmark = true;
            this.utilService.showCustom('Bookmark added.');
          } else {
            this.utilService.showError('Error', res['message']);
          }
        }).catch((err: any) => {
          console.log(err);
          this.utilService.showError('Error', err['message']);
        });
    }
  }

  /**
  * add to bookmark trials data
  * @param item
  */
  addTrialsToBookmark() {
    this.messageService.setHttpLoaderStatus(true);
    if (this.trailsData.is_bookmarked) {
      this.drugsService.removeBookmarkTrailsById(this.trailsData.id)
        .then((res: any) => {
          if (res['success']) {
            this.trailsData.is_bookmarked = false;
            this.utilService.showCustom('Bookmark removed.');
          } else {
            this.utilService.showError('Error', res['message']);
          }
        }).catch((err: any) => {
          console.log(err);
          this.utilService.showError('Error', err['message']);
        });
    } else {
      this.drugsService.addBookmarkTrailsById(this.trailsData.id, this.productId)
        .then((res: any) => {
          if (res['success']) {
            this.trailsData.is_bookmarked = true;
            this.utilService.showCustom('Bookmark added.');
          } else {
            this.utilService.showError('Error', res['message']);
          }
        }).catch((err: any) => {
          console.log(err);
          this.utilService.showError('Error', err['message']);
        });
    }
  }

  /**
  * Get Drug detail data by KOL id
  */
  getDrugsDetailData() {
    this.drugsService.getProductDetailById(this.productId)
      .then(res => {
        if (res['success']) {
          const productData = res['data'];
          if (productData.name !== null) {
            localStorage.setItem('header_title', productData.name);
            if (!this.fromBookmark) {
              this.messageService.setKolsData(productData.name);
            }
          } else {
            localStorage.setItem('header_title', '');
            this.messageService.setKolsData('');
          }
        }
        this.isInfoLoad = true;
      }).catch(err => {
        console.log(err);
        this.isInfoLoad = true;
      });
  }

  expandDetailView() {
    this.isFullView = !this.isFullView;
  }

  /**
  * Open trial url in new tab if exist
  * @param url
  */
  openUrl(url: any) {
    if (url !== undefined && url !== null && url !== '') {
      const win = window.open(url, '_blank');
      win.focus();
    }
  }

  /**
  * Update trails read status
  *
  * @memberof DrugTrialRelatedNewsComponent
  */
  updateTrailReadStatus(type: string) {
    this.drugsService.updateNewsReadStatus(this.productId, type)
      .then((res: any) => {
        console.log(res);
      }).catch((err: any) => {
        console.log(err);
      });
  }

  /**
  * Update news read status
  *
  * @memberof KolTrialRelatedNewsComponent
  */
  updateNewsReadStatus() {
    console.log('read');
    this.drugsService.updateTrailNewsReadStatus(this.productId, this.trailId)
      .then((res: any) => {
        console.log(res);
      }).catch((err: any) => {
        console.log(err);
      });
  }

  getSummaryData(summary: any) {
    const res = summary.replace(/;/g, ' | ');
    return res;
  }

}
