import { Component, OnInit, OnDestroy, HostListener, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { KolsService } from './../../../core/service/kols/kols.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KolsLikesListComponent } from './../../common/kols-likes-list/kols-likes-list.component';
import { ShareModalComponent } from './../../common/share-modal/share-modal.component';
import { MessageService } from './../../../core/service/message/message.service';
import { Location } from '@angular/common';
import { UtilService } from './../../../core/service/util.service';
import { KolEntityImageComponent } from './../../common/kol-entity-image/kol-entity-image.component';

declare var $: any;

@Component({
  selector: 'app-kol-trial-related-news',
  templateUrl: './kol-trial-related-news.component.html',
  styleUrls: ['./kol-trial-related-news.component.scss']
})
export class KolTrialRelatedNewsComponent implements OnInit, OnDestroy {

  @ViewChild('kolInfo') kolinfo: ElementRef;
  trailsData: any;
  newsData: any = [];
  trailsId = 0;
  currentPage = 1;
  nextPage = false;
  newsSettingsData: any;
  newsId = 0;
  notificationData: any;
  kolId = 0;
  isPageLoad = false;
  fromBookmark = false;
  headerTitle = '';
  usersData: any;
  userList: any = [];
  isNextUserPage = false;
  userCurrentPage = 1;
  allUserList: any = [];
  existingUserList: any = [];
  isNewsLoadCount = 0;
  updatedNewsList: any = [];
  keyData = null;
  isShow = false;
  isTrailsLoad = false;
  isAPIRun = false;
  isDataLoad = false;
  isFullView = false;

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
    private kolsService: KolsService,
    private router: Router,
    private modalService: NgbModal,
    private messageService: MessageService,
    private location: Location,
    private utilService: UtilService,
    private renderer: Renderer2,
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
    console.log(this.fromBookmark);
    if (this.trailsData === null || this.trailsData === undefined || this.trailsData === '') {
      this.router.navigate(['']);
    } else {
      if (this.trailsData['kol_id'] !== undefined) {
        this.kolId = this.trailsData['kol_id'];
      }
      console.log(this.kolId);
      if (this.trailsData['is_notification']) {
        this.trailsData['brief_title'] = '';
        this.trailsId = this.trailsData['trial_id'];
        this.getKolsDetailData();
      } else {
        this.trailsId = this.trailsData['id'];
        if (this.trailsData['is_related_news']) {
          this.getKolsDetailData();
        }
      }
      if (this.trailsId === null) {
        this.router.navigate(['']);
      } else {
        this.getTrailsDetailById();
        this.getAllNewsDataByTrialId();
      }
    }
  }

  ngOnInit() {
    this.usersData = this.utilService.getLoggedUserData();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.renderer.removeClass(document.body, 'stickyheader');
    $('trial-fixed-block').removeClass('infoHeight');
    $('.trial-fixed-block').css('top', '0px');
    if (!this.fromBookmark) {
      this.messageService.setKolsData({});
    }
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
  * Get KOL detail data by KOL id
  */
  getKolsDetailData() {
    this.kolsService.getKOLsDetailData(this.kolId)
      .then(res => {
        if (res['success']) {
          const KOLsData = res['data']['data'];
          if (KOLsData.kol_full_name !== null) {
            localStorage.setItem('header_title', KOLsData.kol_full_name);
            if (!this.fromBookmark) {
              this.messageService.setKolsData(KOLsData.kol_full_name);
            }
          } else {
            localStorage.setItem('header_title', '');
            this.messageService.setKolsData('');
          }
        }
      }).catch(err => {
        console.log(err);
      });
  }

  /**
  * Get trails detail by trial id
  */
  getTrailsDetailById() {
    this.kolsService.getTrailsDetailData(this.trailsId, this.kolId)
      .then(res => {
        console.log(res);
        if (res['success']) {
          this.trailsData = res['data']['data'];
          this.updatedNewsList = res['data']['news']['data'];
        }
        this.isDataLoad = true;
        if (this.isDataLoad && this.isPageLoad) {
          this.updateNewsReadStatus();
        }
        if (this.trailsData.trials_read_status === 0 || this.trailsData.related_news_is_updated === 0) {
          this.updateTrailReadStatus('trials');
        }
      }).catch(err => {
        console.log(err);
        this.isDataLoad = true;
      });
  }

  /**
  * Get List of all news by Trials Id
  */
  getAllNewsDataByTrialId() {
    const postObj = {
      'page': this.currentPage,
      'kol_id': this.kolId
    };

    this.kolsService.getAllNewsByTrailId(this.trailsId, postObj)
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
            this.newsData.push(newsRes['data']['data'][x]);
            if (newsRes['data']['data'][x]['id'] === this.newsId) {
              data = newsRes['data']['data'][x];
            }
          }
          this.nextPage = newsRes['data']['next_page'];
          if (newsRes['data']['next_page']) {
            this.currentPage += 1;
          }
          // if (this.newsData.length === 0) {
          this.isPageLoad = true;
          // }
          if (this.isDataLoad && this.isPageLoad) {
            this.updateNewsReadStatus();
          }
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
                    self.openLikesList(data);
                  }, 2000);
                } else {
                  document.getElementById(<any>self.newsId).click();
                }
              });
            }, 500);
          }
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
  * Load more data when user scroll down on screen
  * @param event
  */
  onScroll(event: any) {
    console.log(event);
    // if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    if (this.nextPage) {
      if (!this.isAPIRun) {
        this.isAPIRun = true;
        this.isTrailsLoad = true;
        this.messageService.setHttpLoaderStatus(false);
        this.getAllNewsDataByTrialId();
      }
    }
    // }
  }

  /**
  * Like news data by news id
  * @param item
  */
  likeNews(item: any) {
    const postObj = {
      'kol_id': this.kolId,
      'is_for_kol': 0,
      'trial_id': this.trailsId,
      'product_id': 0
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
    const postObj = {
      'comment': item.sendText,
      'kol_id': this.kolId,
      'is_for_kol': 0,
      'trial_id': this.trailsId,
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
    this.newsData.filter((list: any) => {
      if (list.id !== item.id) {
        list.isShow = false;
      }
      list.showUserList = false;
    });
  }

  /**
  * Get comment data from server
  * @param item
  */
  getAllExistingComments(item) {
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
  * Open social share popup for sharing news url
  * @param item
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

  goBack() {
    this.location.back();
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
    this.newsData.filter((list: any) => {
      if (item.id !== list.id) {
        list.showUserList = false;
      }
    });
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
  * add / remove trails in bookmark list
  */
  addToBookmarkTrails() {
    this.messageService.setHttpLoaderStatus(true);
    if (this.trailsData.is_bookmarked) {
      this.kolsService.removeBookmarkTrailsById(this.trailsData.id)
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
      this.kolsService.addBookmarkTrailsById(this.trailsData.id, this.kolId)
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
  * add to bookmark news item
  * @param item
  */
  addNewsItemToBookmark(item: any) {
    this.messageService.setHttpLoaderStatus(true);
    if (item.is_bookmark) {
      this.kolsService.removeBookmarkNewsById(item.id)
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
      this.kolsService.addBookmarkNewsById(item.id, this.kolId)
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

  getNewsSummary(summary: any) {
    if (summary[0] === '"' && summary[summary.length - 1] === '"') {
      return summary;
    } else {
      if (summary[0] === '"') {
        return summary + '"';
      } else if (summary[summary.length - 1] === '"') {
        return '"' + summary;
      } else {
        return '"' + summary + '"';
      }
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

  /**
  * create placeholder image with user firstname and lastname
  * @param item
  */
  getNameInitials(item: any) {
    // return `${item.first_name.split(' ')[0][0]}${item.last_name.split(' ')[0][0]}`;
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
  * get list of user that is used in web mentions for comment
  */
  getUserListForComment() {
    if (this.userCurrentPage === 1) {
      this.userList = [];
      this.allUserList = [];
    }
    this.kolsService.getUserListForComment()
      .then((res: any) => {
        if (res['success']) {
          this.isNextUserPage = res['data']['next_page'];
          if (this.isNextUserPage) {
            this.userCurrentPage++;
          }
          res['data']['data'].filter((item: any) => {
            this.allUserList.push(item);
          });
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
      this.allUserList.filter((list: any) => {
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
  /*--- window scroll event---*/
  onResize(event: any) {
    event.preventDefault();
  }

  onWindowScroll(event: any) {
    event.preventDefault();
    this.isFullView = false;
    const num = window.scrollY;
    const q = this.kolinfo.nativeElement.offsetHeight + 'px';
    if (num > 100) {
      this.renderer.addClass(document.body, 'stickyheader');
      $('.trial-fixed-block').addClass('infoHeight');
      $('infoHeight').css('top', q);
    } else if (num < 100) {
      this.renderer.removeClass(document.body, 'stickyheader');
      $('.trial-fixed-block').removeClass('infoHeight');
      $('.trial-fixed-block').css('top', '0px');
    }
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
  * Update news read status
  *
  * @memberof KolTrialRelatedNewsComponent
  */
  updateNewsReadStatus() {
    console.log('read');
    this.kolsService.updateTrailNewsReadStatus(this.kolId, this.trailsId)
      .then((res: any) => {
        console.log(res);
      }).catch((err: any) => {
        console.log(err);
      });
  }

  /**
  * Update trails read status
  *
  * @memberof KolTrialRelatedNewsComponent
  */
  updateTrailReadStatus(type: string) {
    this.kolsService.updateNewsReadStatus(this.kolId, type)
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
