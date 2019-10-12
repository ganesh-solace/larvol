import { Component, OnInit, OnDestroy, Renderer2, ViewChild, ElementRef, HostListener } from '@angular/core';
import { MessageService } from './../../../core/service/message/message.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { KolsService } from './../../../core/service/kols/kols.service';
import { UtilService } from './../../../core/service/util.service';
import { ShareModalComponent } from './../../common/share-modal/share-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KolsLikesListComponent } from './../../common/kols-likes-list/kols-likes-list.component';
import { environment } from '../../../../environments/environment';
import { KolEntityImageComponent } from './../../common/kol-entity-image/kol-entity-image.component';
import { DrugsService } from './../../../core/service/drugs/drugs.service';
import { ConferenceService } from './../../../core/service/conference/conference.service';

declare var $: any;

@Component({
  selector: 'app-bookmark-kols',
  templateUrl: './bookmark-kols.component.html',
  styleUrls: ['./bookmark-kols.component.scss']
})
export class BookmarkKolsComponent implements OnInit, OnDestroy {

  @ViewChild('kolInfo') kolinfo: ElementRef;
  headerTitle = '';
  newsData: any = [];
  eventsData: any = [];
  twittersData: any = [];
  trialsData: any = [];
  newsType = 'news';
  newsSettingsData: any;
  eventsSettingsData: any;
  twittersSettingsData: any;
  trialsSettingsData: any;
  currentPage = 1;
  nextPage = '';
  usersData: any;
  lastView: any = '';
  isNewsLoad = false;
  isEventLoad = false;
  isTweetsLoad = false;
  isTrailsLoad = false;
  selectedTab = 0;
  isAPIRun = false;
  isPageLoad: boolean;
  isNewsPageLoad = false;
  loggedUserData: any;
  infoSectionHeight = '100px';
  userList: any = [];
  isNextUserPage = false;
  userCurrentPage = 1;
  allUserList: any = [];
  keyData = null;
  isShow = false;
  conferenceSettingsData: any;
  conferenceData: any = [];
  isConferenceLoad = false;

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    console.log(event.srcElement.className);
    if (event.srcElement.className.indexOf('comment') === -1) {
      if (this.isShow) {
        this.isShow = false;
      }
    }
  }

  constructor(
    private messageService: MessageService,
    private location: Location,
    private router: Router,
    private kolsService: KolsService,
    private utilService: UtilService,
    private modalService: NgbModal,
    private renderer: Renderer2,
    private drugsService: DrugsService,
    private conferenceService: ConferenceService
  ) {
    // setTimeout(() => {
    //     this.infoSectionHeight = this.kolinfo.nativeElement.offsetHeight + 'px';
    // }, 500);

    if (this.headerTitle === '') {
      this.headerTitle = localStorage.getItem('header_title');
    }
    localStorage.setItem('header_title', 'Bookmarks');
    this.messageService.setKolsData('Bookmarks');

    this.usersData = this.utilService.getLoggedUserData();
  }

  ngOnInit() {
    this.isPageLoad = false;
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.renderer.removeClass(document.body, 'stickyheader');
    $('.mat-tab-header').removeClass('infoHeight');
    $('.mat-tab-header').css('top', '0px');
    this.messageService.setHttpLoaderStatus(true);
    if (localStorage.getItem('kbookmarkselected_tab') !== null || localStorage.getItem('kbookmarkselected_tab') !== undefined) {
      this.selectedTab = <any>localStorage.getItem('kbookmarkselected_tab');
      localStorage.removeItem('kbookmarkselected_tab');
    }

    this.getAllBookmarkNewsList('news', 0);
    this.getAllBookmarkNewsList('events', 0);
    this.getAllBookmarkNewsList('twitter', 0);
    this.getAllBookmarkTrailsList();
    this.getUserListForComment();
    this.getAllBookmarkConferenceNews(0);
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy() {
    this.messageService.setHttpLoaderStatus(true);
    this.messageService.setKolsData(this.headerTitle);
    localStorage.setItem('header_title', this.headerTitle);
  }

  checkImageExistorNot(item) {
    item['kol_image_url'] = './assets/images/avtar.png';
  }

  /**
  * Get bookmark News/events/twitters data
  */
  getAllBookmarkNewsList(type: String, next: Number) {
    const postObj = {
      'type': type,
    };

    if (next > 0) {
      postObj['next'] = next;
    }

    this.kolsService.getAllBookmarkNewsList(postObj)
      .then((newsRes: any) => {
        this.isAPIRun = false;
        if (newsRes['success']) {
          if (type === 'news') {
            this.newsSettingsData = newsRes['data'];
            for (const x of Object.keys(newsRes['data']['data'])) {
              newsRes['data']['data'][x]['isShow'] = false;
              newsRes['data']['data'][x]['target'] = '_blank';
              if (newsRes['data']['data'][x]['url'] === '') {
                newsRes['data']['data'][x]['url'] = 'javascript:void(0)';
                newsRes['data']['data'][x]['target'] = '';
              } else if (newsRes['data']['data'][x]['url'].indexOf('http') === -1) {
                newsRes['data']['data'][x]['url'] = 'http://' + newsRes['data']['data'][x]['url'];
              }
              this.newsData.push(newsRes['data']['data'][x]);
            }
            // if (this.newsData.length === 0) {
            this.isNewsPageLoad = true;
            // }
            this.isNewsLoad = false;
          } else if (type === 'events') {
            this.eventsSettingsData = newsRes['data'];
            for (const x of Object.keys(newsRes['data']['data'])) {
              newsRes['data']['data'][x]['target'] = '_blank';
              if (newsRes['data']['data'][x]['presentation_date'] !== '0000-00-00 00:00:00' && newsRes['data']['data'][x]['presentation_date'] !== null) {
                // tslint:disable-next-line:max-line-length
                newsRes['data']['data'][x]['presentation_date'] = newsRes['data']['data'][x]['presentation_date'].replace(/\s/g, 'T');
              } else {
                newsRes['data']['data'][x]['presentation_date'] = '';
              }

              if (newsRes['data']['data'][x]['presentation_enddate'] !== '0000-00-00 00:00:00' && newsRes['data']['data'][x]['presentation_enddate'] !== null) {
                // tslint:disable-next-line:max-line-length
                newsRes['data']['data'][x]['presentation_enddate'] = newsRes['data']['data'][x]['presentation_enddate'].replace(/\s/g, 'T');
              } else {
                newsRes['data']['data'][x]['presentation_enddate'] = '';
              }
              if (newsRes['data']['data'][x]['url'] === '') {
                newsRes['data']['data'][x]['url'] = 'javascript:void(0)';
                newsRes['data']['data'][x]['target'] = '';
              } else if (newsRes['data']['data'][x]['url'].indexOf('http') === -1) {
                newsRes['data']['data'][x]['url'] = 'http://' + newsRes['data']['data'][x]['url'];
              }
              const location = [];
              if (newsRes['data']['data'][x]['city'] !== null && newsRes['data']['data'][x]['city'] !== '') {
                location.push(newsRes['data']['data'][x]['city']);
              }
              if (newsRes['data']['data'][x]['state'] !== null && newsRes['data']['data'][x]['state'] !== '') {
                location.push(newsRes['data']['data'][x]['state']);
              }
              if (newsRes['data']['data'][x]['country'] !== null && newsRes['data']['data'][x]['country'] !== '') {
                location.push(newsRes['data']['data'][x]['country']);
              }
              newsRes['data']['data'][x].location = location.join(', ');
              this.eventsData.push(newsRes['data']['data'][x]);
            }
            this.isEventLoad = false;
          } else if (type === 'twitter') {
            this.twittersSettingsData = Object.assign({}, newsRes['data']);
            for (const x of Object.keys(newsRes['data']['data'])) {
              newsRes['data']['data'][x]['target'] = '_blank';
              if (newsRes['data']['data'][x]['url'] === '') {
                newsRes['data']['data'][x]['url'] = 'javascript:void(0)';
                newsRes['data']['data'][x]['target'] = '';
              } else if (newsRes['data']['data'][x]['url'].indexOf('http') === -1) {
                newsRes['data']['data'][x]['url'] = 'http://' + newsRes['data']['data'][x]['url'];
              }
              this.twittersData.push(newsRes['data']['data'][x]);
            }
            this.isTweetsLoad = false;
          }
        }
      }).catch((err: any) => {
        if (err.status === 0 || err.status === 504) {
          this.router.navigate(['']);
        }
        this.isTweetsLoad = false;
        this.isNewsLoad = false;
        this.isEventLoad = false;
        this.isAPIRun = false;
        this.isNewsPageLoad = true;
      });
  }

  /**
  * Get all bookmark Trials data
  */
  getAllBookmarkTrailsList() {
    const postObj = {
      'page': this.currentPage,
    };

    this.kolsService.getAllBookmarkTrailsList(postObj)
      .then((trialsRes: any) => {
        this.isAPIRun = false;
        console.log(trialsRes);
        // if (trialsRes['success']) {
        this.trialsSettingsData = trialsRes;
        if (trialsRes['next_page_url'] !== null) {
          this.nextPage = trialsRes['next_page_url'];
          this.currentPage += 1;
        } else {
          this.nextPage = '';
        }
        for (const x of Object.keys(trialsRes['data'])) {
          this.trialsData.push(trialsRes['data'][x]);
        }
        // }
        // if (this.trialsData.length === 0) {
        this.isPageLoad = true;
        // }
        this.isTrailsLoad = false;
      }).catch((err: any) => {
        this.isTrailsLoad = false;
        this.isAPIRun = false;
        this.isPageLoad = true;
      });
  }

  /**
  * Load more data when user scroll for all tabs
  * @param event
  */
  onScroll(event: any) {
    console.log(event);
    if (this.newsType !== '') {
      let next = 0;
      if (this.newsType === 'news') {
        if (this.newsSettingsData !== undefined) {
          if (this.newsSettingsData['next'] !== null) {
            this.isNewsLoad = true;
            next = this.newsSettingsData['next'];
          }
        }
      } else if (this.newsType === 'events') {
        if (this.eventsSettingsData['next'] !== null) {
          this.isEventLoad = true;
          next = this.eventsSettingsData['next'];
        }
      } else if (this.newsType === 'twitter') {
        if (this.twittersSettingsData['next'] !== null) {
          this.isTweetsLoad = true;
          next = this.twittersSettingsData['next'];
        }
      } else if (this.newsType === 'conference') {
        if (this.conferenceSettingsData !== undefined) {
            if (this.conferenceSettingsData.next) {
                this.isConferenceLoad = true;
                next = this.conferenceSettingsData.next;
            }
        }
    }
      if (next > 0) {
        if (!this.isAPIRun) {
          this.isAPIRun = true;
          this.messageService.setHttpLoaderStatus(false);
          if (this.newsType === 'conference') {
            this.getAllBookmarkConferenceNews(next);
        } else {
            this.getAllBookmarkNewsList(this.newsType, next);
        }
        }
      }
    } else {
      if (this.nextPage !== '') {
        if (!this.isAPIRun) {
          this.isAPIRun = true;
          this.isTrailsLoad = true;
          this.messageService.setHttpLoaderStatus(false);
          this.getAllBookmarkTrailsList();
        }
      }
    }
  }

  /**
  * change newstype when tab change
  * @param event
  */
  changeTabsData(event: string) {
    this.renderer.removeClass(document.body, 'stickyheader');
    $('.mat-tab-header').removeClass('infoHeight');
    $('.mat-tab-header').css('top', '0px');
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if (event['index'] === 0) {
      this.newsType = 'news';
  } else if (event['index'] === 1) {
      this.newsType = 'events';
  } else if (event['index'] === 2) {
      this.newsType = 'conference';
  } else if (event['index'] === 3) {
      this.newsType = 'twitter';
  } else if (event['index'] === 4) {
      this.newsType = '';
  }
    this.selectedTab = event['index'];
  }

  getTooltipData(item: any) {
    if (item.is_bookmark) {
      return 'Unbookmark';
    } else {
      return 'Bookmark';
    }
  }

  getTooltipDataForTrail(item: any) {
    if (item.is_bookmarked) {
      return 'Unbookmark';
    } else {
      return 'Bookmark';
    }
  }

  /**
  * Show list of existing comments for news
  */
  hideShowComment(item: any) {
    console.log(item.isShow);
    if (item.isShow) {
      item.isShow = !item.isShow;
    } else {
      this.messageService.setHttpLoaderStatus(true);
      this.getAllExistingComments(item);
    }
    item.showUserList = false;
    if (this.selectedTab === 0 || this.selectedTab === null) {
      this.newsData.filter((list: any) => {
        if (list.id !== item.id) {
          list.isShow = false;
        }
        list.showUserList = false;
      });
    } else if (this.selectedTab === 1) {
      this.eventsData.filter((list: any) => {
        if (list.id !== item.id) {
          list.isShow = false;
        }
        list.showUserList = false;
      });
    } else if (this.selectedTab === 2) {
      this.twittersData.filter((list: any) => {
        if (list.id !== item.id) {
          list.isShow = false;
        }
        list.showUserList = false;
      });
    }
  }

  /**
  * Get comment data from server
  * @param item
  */
  getAllExistingComments(item: any) {
    this.kolsService.getAllExistingComments(item.id)
      .then((res: any) => {
        if (res['success']) {
          item.isShow = !item.isShow;
          item.settingData = res['data'];
          item.comments = [];
          item.commentText = '';
          for (const x of Object.keys(res['data']['data'])) {
            item.comments.unshift(res['data']['data'][x]);
          }
          item.comment_count = item.comments.length;
        }
      }).catch((err: any) => {
        console.log(err);
      });
  }

  /**
  * Open all Likes list for selected news data
  */
  openLikesList(item: any) {
    if (item.like_count > 0) {
      this.messageService.setHttpLoaderStatus(true);
      this.kolsService.getLikedForNews(item['id'], {})
        .then((res: any) => {
          if (res['success']) {
            const activeModal = this.modalService.open(KolsLikesListComponent, { size: 'sm' });
            activeModal.componentInstance.newsData = item;
            activeModal.componentInstance.likesAllData = res;
          }
        }).catch((err: any) => {
          console.log(err);
        });
    }
  }

  /**
  * Open social share popup
  */
  sharePopup(item: any) {
    const activeModal = this.modalService.open(ShareModalComponent, { size: 'sm' });
    activeModal.componentInstance.url = item.url;
    activeModal.componentInstance.title = item.title;
    activeModal.result.then((result) => {
      if (result === 'success') {
        this.messageService.setHttpLoaderStatus(false);
        this.kolsService.increaseShareCOunt(item.id)
          .then(res => {
            if (res['success']) {
              item.shared_count = res['data']['shared_count'];
              this.messageService.setHttpLoaderStatus(true);
            }
          }).catch(err => {
            console.log(err);
          });
      }
    }, (reason) => {
      console.log(reason);
    });
  }

  /**
  * Like news data by news id
  * @param item
  */
  likeNews(item: any) {
    item.kol_id = 0;
    item.product_id = 0;
    item.conference_id = 0;
    if (item.pivot !== undefined) {
      if (item.pivot.kol_id !== undefined && item.pivot.kol_id !== null && item.pivot.kol_id !== '') {
        item.kol_id = item.pivot.kol_id;
      } else if (item.pivot.product_id !== undefined && item.pivot.product_id !== null && item.pivot.product_id !== '') {
        item.product_id = item.pivot.product_id;
      } else if (item.pivot.conference_iteration_id !== undefined && item.pivot.conference_iteration_id !== null && item.pivot.conference_iteration_id !== '') {
        item.conference_id = item.pivot.conference_iteration_id;
      }
    }
    const postObj = {
      'kol_id': item.kol_id,
      'is_for_kol': 1,
      'trial_id': 0,
      'product_id': item.product_id,
      'conference_id': item.conference_id,
    };
    if (item.like_enabled) {
      this.kolsService.addLikedStatustoNews(item.id, postObj)
        .then((res: any) => {
          if (res['success']) {
            item.like_count = res['data']['like_count'];
            item.like_enabled = false;
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
  * Comments on news data by news id
  * @param item
  */
  addCommentForNews(item: any) {
    item.showUserList = false;
    item.sendText = item.commentText;
    this.allUserList.filter((list: any) => {
      const name = list.first_name + ' ' + list.last_name;
      if (item.sendText.indexOf('user_' + list.id + '_id') > -1) {
        item.sendText = item.sendText.replace(name, '`' + list.id + '`');
      }
    });
    item.sendText = item.sendText.replace(/(<([^>]+)>)/ig, '');
    item.sendText = item.sendText.replace(/ {1,}/g, ' ');
    item.kol_id = 0;
    item.product_id = 0;
    item.conference_id = 0;
    if (item.pivot !== undefined) {
      if (item.pivot.kol_id !== undefined && item.pivot.kol_id !== null && item.pivot.kol_id !== '') {
        item.kol_id = item.pivot.kol_id;
      } else if (item.pivot.product_id !== undefined && item.pivot.product_id !== null && item.pivot.product_id !== '') {
        item.product_id = item.pivot.product_id;
      } else if (item.pivot.conference_iteration_id !== undefined && item.pivot.conference_iteration_id !== null && item.pivot.conference_iteration_id !== '') {
        item.conference_id = item.pivot.conference_iteration_id;
      }
    }
    const postObj = {
      'comment': item.sendText,
      'kol_id': parseInt(item.kol_id, 0),
      'is_for_kol': 1,
      'trial_id': 0,
      'product_id': parseInt(item.product_id, 0),
      'conference_id': parseInt(item.conference_id, 0)
    };
    this.kolsService.addCommentForNews(item.id, postObj)
      .then((res: any) => {
        if (res['success']) {
          $('#myinputtext_' + item.id).html('');
          item.commentText = '';
          item.comments.unshift(res['data']['data']);
          item.comment_count += 1;
        } else {
          this.utilService.showError('Error', res['message']);
        }
      }).catch((err: any) => {
        console.log(err);
        this.utilService.showError('Error', err['message']);
      });
  }

  /**
  * add event data to google calendar
  * @param item
  */
  addEventToCalendar(item: any) {
    this.kolsService.getICSFileForCalender(item.id)
      .then((res: any) => {
        if (res['success']) {
          let url = '';
          if (res['data'].indexOf('http') > -1) {
            url = res['data'].replace('http', 'webcal');
          } else {
            url = res['data'].replace('htts', 'webcal');
          }
          console.log(url);
          const result = window.open(url, '_self');
          console.log(result);
        }
      }).catch((err: any) => {
        console.log(err);
      });
  }

  commentFocus(event: any, item: any) {
    const self = this;
    $(document).ready(function () {
      if (self.utilService.checkRunningPlatformType()) {
        const top = $('#myinputtext_' + item.id).offset().top;
        const sc = top - 200;
        $('html, body').animate({
          scrollTop: sc + 'px'
        }, 1000);
      }
    });
    if (this.selectedTab === 0 || this.selectedTab === null) {
      this.newsData.filter((list: any) => {
        if (item.id !== list.id) {
          list.showUserList = false;
        }
      });
    } else if (this.selectedTab === 1) {
      this.eventsData.filter((list: any) => {
        if (item.id !== list.id) {
          list.showUserList = false;
        }
      });
    } else if (this.selectedTab === 2) {
      this.twittersData.filter((list: any) => {
        if (item.id !== list.id) {
          list.showUserList = false;
        }
      });
    }
    if (this.keyData !== ' ') {
      this.openUserList('', item);
    }

    const update = function () {
      const position = getCaretPosition(this);
      if (position === <any>'@') {
        item.showUserList = true;
        self.isShow = true;
      } else {
        item.showUserList = false;
        self.isShow = false;
      }
    };

    $('#myinputtext_' + item.id).on('mouseup', update);

    function getCaretPosition(editableDiv) {
      let caretPos = 0,
        sel, range;
      if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
          range = sel.getRangeAt(0).cloneRange();
          range.collapse(true);
          range.setStart(editableDiv, 0);
          caretPos = range.toString().slice(-1);
        }
      }
      return caretPos;
    }
  }
  /**
  * add to bookmark news item
  * @param item
  */
  addNewsItemToBookmark(item: any, index: Number) {
    console.log(item);
    const entityType = this.checkEntityType(item);
    this.messageService.setHttpLoaderStatus(true);
    if (item.is_bookmark) {
      if (entityType === 'kol') {
        this.kolsService.removeBookmarkNewsById(item.id)
          .then((res: any) => {
            this.handleResponseForNewsAPIs(res, index);
          }).catch((err: any) => {
            console.log(err);
            this.utilService.showError('Error', err['message']);
          });
      } else if (entityType === 'drug'){
        this.drugsService.removeBookmarkNewsById(item.id)
          .then((res: any) => {
            this.handleResponseForNewsAPIs(res, index);
          }).catch((err: any) => {
            this.utilService.showError('Error', err['message']);
          });
      } else {
        this.conferenceService.removeBookmarkNewsById(item.id)
        .then((res: any) => {
          this.handleResponseForNewsAPIs(res, index);
        }).catch((err: any) => {
            this.utilService.showError('Error', err['message']);
          });
      }
    }
  }

  /**
  * add to bookmark trials data
  * @param item
  */
  addTrialsToBookmark(item: any, index: Number) {
    console.log(item);
    const entityType = this.checkEntityType(item);
    this.messageService.setHttpLoaderStatus(true);
    if (item.is_bookmark) {
      if (entityType === 'kol') {
        this.kolsService.removeBookmarkTrailsById(item.id)
          .then((res: any) => {
            if (res['success']) {
              this.trialsData.splice(index, 1);
              if (this.trialsData.length === 0) {
                this.isTrailsLoad = true;
                this.newsSettingsData['trial_bookmark_count'] = 0;
              } else {
                this.newsSettingsData['trial_bookmark_count'] = this.newsSettingsData['trial_bookmark_count'] - 1;
              }
              this.utilService.showCustom('Bookmark removed.');
            } else {
              this.utilService.showError('Error', res['message']);
            }
          }).catch((err: any) => {
            console.log(err);
            this.utilService.showError('Error', err['message']);
          });
      } else {
        this.drugsService.removeBookmarkTrailsById(item.id)
          .then((res: any) => {
            if (res['success']) {
              this.trialsData.splice(index, 1);
              if (this.trialsData.length === 0) {
                this.isTrailsLoad = true;
                this.newsSettingsData['trial_bookmark_count'] = 0;
              } else {
                this.newsSettingsData['trial_bookmark_count'] = this.newsSettingsData['trial_bookmark_count'] - 1;
              }
              this.utilService.showCustom('Bookmark removed.');
            } else {
              this.utilService.showError('Error', res['message']);
            }
          }).catch((err: any) => {
            this.utilService.showError('Error', err['message']);
          });
      }
    }
  }

  /**
  * create placeholder image with user firstname and lastname
  * @param item
  */
  getNameInitials(item: any) {
    let name = '';
    if (item.first_name !== null) {
      name = `${item.first_name.split(' ')[0][0]}`;
    }
    if (item.last_name !== null) {
      name = name + `${item.last_name.split(' ')[0][0]}`;
    }
    return name;
  }

  checkValidValue(text: String) {
    if (text.trim() === '') {
      return true;
    } else {
      return false;
    }
  }

  /**
  * Open trails detail page with related news data
  * @param item
  */
  trialNewsData(item: any) {
    console.log(item);
    item.is_notification = false;
    const entityType = this.checkEntityType(item);
    item.is_related_news = true;
    localStorage.setItem('ktrials_data', JSON.stringify(item));
    localStorage.setItem('kbookmarkselected_tab', <any>this.selectedTab);
    if (entityType === 'kol') {
      this.router.navigate([`${environment.appPrefix}/kol-trial-related-news`]);
    } else {
      this.router.navigate([`${environment.appPrefix}/drug-trial-related-news`]);
    }
  }

  onResize(event: any) {
    event.preventDefault();
  }

  onWindowScroll(event: any) {
    event.preventDefault();
    const num = window.scrollY;
    const q = this.kolinfo.nativeElement.offsetHeight + 'px';
    if (num > 110) {
      this.renderer.addClass(document.body, 'stickyheader');
      $('.mat-tab-header').addClass('infoHeight');
      $('infoHeight').css('top', q);
    } else if (num < 110) {
      this.renderer.removeClass(document.body, 'stickyheader');
      $('.mat-tab-header').removeClass('infoHeight');
      $('.mat-tab-header').css('top', '0px');
    }
  }

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

  onKeydown(event: any) {
    this.keyData = null;
    if (event.keyCode !== 35 && event.keyCode !== 36 && event.keyCode !== 8 && event.keyCode !== 46) {
      if (event.keyCode === 32) {
        this.keyData = ' ';
      } else {
        this.keyData = event.keyCode;
      }
    }
    if (event.keyCode === 13) {
      this.keyData = event.keyCode;
      document.execCommand('insertHTML', false, '');
      return false;
    }
  }

  /**
  * Open existing user list for mentions in comment box
  * @param event
  * @param item
  */
  openUserList(event: any, item: any) {
    let last = null;
    let isFirst = false;
    if (navigator.userAgent.match(/Android/i) !== null) {
      this.keyData = event.data;
    }
    if (this.keyData !== null) {
      let data = $('#myinputtext_' + item.id).html();
      if (item.commentText === '' && data.length > 1) {
        isFirst = true;
        data = data.replace(/(<([^>]+)>)/ig, '');
      }
      if ($.trim($('div[contenteditable]').text()).length > 0) {
        item.commentText = data;
      } else {
        item.commentText = '';
      }
      item.commentText = item.commentText.replace(/<br\s*\/?>/gi, '');
      if (item.commentText.length > 0) {
        last = item.commentText.slice(-1);
        last = last.replace('>', '');
      }
      if (this.keyData === ' ') {
        let str = '';
        if (item.commentText.length > 1) {
          str = item.commentText.slice(-2);
        }
        if (str.trim() === '@') {
          item.isSearch = false;
          item.showUserList = false;
          this.isShow = false;
        }
      }
      if (last !== null) {
        if (last === '@') {
          item.isSearch = true;
          item.showUserList = true;
          this.isShow = true;
        } else {
          item.showUserList = false;
        }
      } else {
        item.showUserList = false;
      }
      if (this.keyData === 13) {
        item.isSearch = false;
        item.showUserList = false;
        this.isShow = false;
      }
      this.manageUserlistData(item, last);
      const self = this;
      $(document).ready(function () {
        $('.user-name-popup').scroll(function () {
          if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
            self.onUserListScroll();
          } else {
            console.log('b');
          }
        });

        let textData = $('#myinputtext_' + item.id).html();
        if (isFirst) {
          textData = textData.replace(/(<([^>]+)>)/ig, '');
          isFirst = false;
          $('#myinputtext_' + item.id).html(textData);
        }
        // $('#myinputtext_' + item.id).html(data);
        const elem = document.getElementById('myinputtext_' + item.id); // This is the element that you want to move the caret to the end of
        if (self.keyData !== null) {
          // setEndOfContenteditable(elem);
        }

        function setEndOfContenteditable(contentEditableElement: any) {
          let range, selection;
          if (document.createRange) { // Firefox, Chrome, Opera, Safari, IE 9+
            range = document.createRange();
            range.selectNodeContents(contentEditableElement);
            range.collapse(false);
            selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }

        elem.onkeydown = function (event1: any) {
          if (event1.keyCode === 35) {
            elem.focus();
            setEndOfContenteditable(elem);
          }
        };
      });
    } else {
      item.showUserList = false;
      let lastKey = '';
      const data = $('#myinputtext_' + item.id).html();
      if ($.trim($('div[contenteditable]').text()).length > 0) {
        item.commentText = data;
        item.commentText = item.commentText.replace(/<br\s*\/?>/gi, '');
        if (item.commentText.length > 0) {
          lastKey = item.commentText.slice(-1);
        }
      } else {
        item.commentText = '';
        lastKey = '';
      }
      if (lastKey !== '') {
        if (lastKey === '@') {
          item.isSearch = true;
          item.showUserList = true;
          this.isShow = true;
          this.manageUserlistData(item, lastKey);
        } else {
          if (item.isSearch && lastKey !== ' ') {
            item.showUserList = true;
            this.manageUserlistData(item, lastKey);
          } else {
            item.showUserList = false;
          }
        }
      } else {
        item.showUserList = false;
        this.manageUserlistData(item, lastKey);
      }
      if (item.commentText === '') {
        item.isSearch = false;
        this.isShow = false;
        $('#myinputtext_' + item.id).html('');
      }
    }
  }

  /**
  * search user from existing when user type any letter after @ in comment box
  * @param item
  * @param last
  */
  manageUserlistData(item: any, last: any) {
    const str = item.commentText;
    const search = item.commentText.substring(item.commentText.lastIndexOf('@') + 1, item.commentText.length);
    if (search !== '') {
      const searchData = [];
      this.allUserList.filter(list => {
        if (list.full_name.toLowerCase().includes(search.toLowerCase())) {
          if (str.indexOf('user_' + list.id + '_id') === -1) {
            searchData.push(list);
          }
        }
      });
      if (item.isSearch) {
        item.showUserList = true;
      }
      this.userList = searchData;
    } else {
      const searchData = [];
      this.allUserList.filter((list: any) => {
        if (str.indexOf('user_' + list.id + '_id') === -1) {
          searchData.push(list);
        }
      });
      this.userList = searchData;
      if (item.isSearch) {
        item.showUserList = true;
      }
    }
    if (item.commentText === '') {
      item.showUserList = false;
    }
  }

  /**
  * get list of user that is used in web mentions for comment
  */
  getUserListForComment() {
    if (this.userCurrentPage === 1) {
      this.userList = [];
      this.allUserList = [];
    }
    this.kolsService.getUserListForComment()
      .then((res: any) => {
        console.log(res);
        if (res['success']) {
          this.isNextUserPage = res['data']['next_page'];
          if (this.isNextUserPage) {
            this.userCurrentPage++;
          }
          res['data']['data'].filter((item: any) => {
            this.allUserList.push(item);
          });
          // this.allUserList = res['data']['data'];
          this.allUserList.filter((item: any) => {
            this.userList.push(item);
          });
        }
      }).catch((err: any) => {
        console.log(err);
      });
  }

  onUserListScroll() {
    if (this.isNextUserPage) {
      this.messageService.setHttpLoaderStatus(false);
      this.getUserListForComment();
    }
  }

  /**
  * Add user name in comment
  * @param user
  * @param item
  */
  selectUserForComment(user: any, item: any) {
    const isChrome = navigator.userAgent.indexOf('Chrome');
    const isFirfox = navigator.userAgent.indexOf('Firefox');
    item.isSearch = false;
    this.isShow = false;
    item.commentText = item.commentText.substring(0, item.commentText.lastIndexOf('@'));
    if (isFirfox !== -1) {
      // tslint:disable-next-line: max-line-length
      item.commentText = item.commentText + `<span contentEditable="true" unselectable="on" class="name-tag-new" id="user_` + user.id + `_id">` + user.first_name + ' ' + user.last_name + ` </span>`;
    } else {
      if (navigator.userAgent.match(/Android/i) !== null) {
        item.commentText = item.commentText + `<span contentEditable="true" unselectable="on" class="name-tag-new" id="user_` + user.id + `_id">` + user.first_name + ' ' + user.last_name + ` </span>` + ' ';
      } else {
        item.commentText = item.commentText + `<span contentEditable="false" unselectable="on" class="name-tag-new" id="user_` + user.id + `_id">` + user.first_name + ' ' + user.last_name + ` </span>` + ' ';
      }
    }
    item.showUserList = false;
    $(document).ready(function () {
      $('#myinputtext_' + item.id).html(item.commentText);
      const elem = document.getElementById('myinputtext_' + item.id); // This is the element that you want to move the caret to the end of
      setEndOfContenteditable(elem);

      function setEndOfContenteditable(contentEditableElement: any) {
        let range, selection;
        if (document.createRange) { // Firefox, Chrome, Opera, Safari, IE 9+
          range = document.createRange();
          range.selectNodeContents(contentEditableElement);
          range.collapse(false);
          selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          contentEditableElement.focus();
          const ele = $('#myinputtext_' + item.id);
          ele.scrollTop(ele[0].scrollHeight);
        }
      }
    });
  }

  /**
  * Image slider popup in news/tweets tab for multiple images
  */
  showPopup(item: any) {
    if (item.images.original.length > 1) {
      const activeModal = this.modalService.open(KolEntityImageComponent, { size: 'sm', windowClass: 'tweet-image-popup' });
      activeModal.componentInstance.news_images = item.images.original;
    }
  }

  /**
  * Check click news item type
  * @param item
  */
  checkEntityType(item: any) {
    let is_kol = 'kol';
    if (item.pivot !== undefined) {
      if (item.pivot.kol_id !== undefined && item.pivot.kol_id !== null && item.pivot.kol_id !== '') {
        item.kol_id = item.pivot.kol_id;
        is_kol = 'kol';
      } else if (item.pivot.product_id !== undefined && item.pivot.product_id !== null && item.pivot.product_id !== '') {
        item.product_id = item.pivot.product_id;
        is_kol = 'drug';
      } else if (item.pivot.conference_iteration_id !== undefined && item.pivot.conference_iteration_id !== null && item.pivot.conference_iteration_id !== '') {
        item.conference_id = item.pivot.conference_iteration_id;
        is_kol = 'conference';
      }
    }
    return is_kol;
  }

  /**
  * Handle response after remove news item from bookmark list
  * @param res
  */
  handleResponseForNewsAPIs(res: any, index: Number) {
    if (res['success']) {
      if (this.newsType === 'news') {
        this.newsData.splice(index, 1);
        if (this.newsData.length === 0) {
          this.isNewsPageLoad = true;
          this.newsSettingsData['news_bookmark_count'] = 0;
        } else {
          this.newsSettingsData['news_bookmark_count'] = this.newsSettingsData['news_bookmark_count'] - 1;
        }
      } else if (this.newsType === 'events') {
        this.eventsData.splice(index, 1);
        if (this.eventsData.length === 0) {
          this.newsSettingsData['event_bookmark_count'] = 0;
        } else {
          this.newsSettingsData['event_bookmark_count'] = this.newsSettingsData['event_bookmark_count'] - 1;
        }
      } else if (this.newsType === 'twitter') {
        this.twittersData.splice(index, 1);
        if (this.twittersData.length === 0) {
          this.newsSettingsData['twitter_bookmark_count'] = 0;
        } else {
          this.newsSettingsData['twitter_bookmark_count'] = this.newsSettingsData['twitter_bookmark_count'] - 1;
        }
      } else if (this.newsType === 'conference') {
        this.conferenceData.splice(index, 1);
        if (this.conferenceData.length === 0) {
          this.newsSettingsData['conference_bookmark_count'] = 0;
        } else {
          this.newsSettingsData['conference_bookmark_count'] = this.newsSettingsData['conference_bookmark_count'] - 1;
        }
      }
      this.utilService.showCustom('Bookmark removed.');
    } else {
      this.utilService.showError('Error', res['message']);
    }
  }

  /**
  * Get all bookmark list of conference news
  */
  getAllBookmarkConferenceNews(next: number) {
    this.conferenceService.getAllBookmarkNewsList({})
      .then((newsRes: any) => {
        console.log(newsRes);
        if (newsRes['success']) {
          this.conferenceSettingsData = newsRes['data'];
          for (const x of Object.keys(newsRes['data']['data'])) {
            newsRes['data']['data'][x]['isShow'] = false;
            newsRes['data']['data'][x]['target'] = '_blank';
            if (newsRes['data']['data'][x]['url'] === '') {
              newsRes['data']['data'][x]['url'] = 'javascript:void(0)';
              newsRes['data']['data'][x]['target'] = '';
            } else if (newsRes['data']['data'][x]['url'].indexOf('http') === -1) {
              newsRes['data']['data'][x]['url'] = 'http://' + newsRes['data']['data'][x]['url'];
            }
            this.conferenceData.push(newsRes['data']['data'][x]);
          }

          this.isConferenceLoad = true;
        }
      }).catch((err: any) => {
        console.log(err);
        this.isConferenceLoad = true;
      });
  }

}
