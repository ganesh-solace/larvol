import { Component, OnInit, ElementRef, ViewChild, Renderer2, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { KolsService } from 'src/app/core/service/kols/kols.service';
import { MessageService } from 'src/app/core/service/message/message.service';
import { Location } from '@angular/common';
import { UtilService } from 'src/app/core/service/util.service';
import { ShareModalComponent } from '../../common/share-modal/share-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KolsLikesListComponent } from '../../common/kols-likes-list/kols-likes-list.component';
import { ConferenceService } from 'src/app/core/service/conference/conference.service';

declare var $: any;

@Component({
  selector: 'app-conference-detail',
  templateUrl: './conference-detail.component.html',
  styleUrls: ['./conference-detail.component.scss']
})
export class ConferenceDetailComponent implements OnInit, OnDestroy {

  @ViewChild('kolInfo') kolinfo: ElementRef;

  conferenceData: any;
  kolId: any;
  conferenceId: any;
  isDataLoad = false;
  currentPage = 1;
  newsSettingsData: any;
  isPageLoad = false;
  isAPIRun = false;
  isConferenceLoad = false;
  newsData: any = [];
  nextPage = false;
  headerTitle = '';
  usersData: any;
  userList: any = [];
  isNextUserPage = false;
  userCurrentPage = 1;
  allUserList: any = [];
  existingUserList: any = [];
  keyData = null;
  isShow = false;
  newsId = 0;
  notificationData: any;

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
    private router: Router,
    private kolsService: KolsService,
    private messageService: MessageService,
    private renderer: Renderer2,
    private location: Location,
    private utilService: UtilService,
    private modalService: NgbModal,
    private conferenceService: ConferenceService
  ) {
    if (localStorage.getItem('knews_item') !== null) {
      this.notificationData = <any>JSON.parse(localStorage.getItem('knews_item'));
      this.newsId = this.notificationData['id'];
      localStorage.removeItem('knews_item');
    }

    this.conferenceData = JSON.parse(localStorage.getItem('kconference_data'));
    if (this.conferenceData === null || this.conferenceData === undefined || this.conferenceData === '') {
      this.router.navigate(['']);
    } else {
      if (this.conferenceData['kol_id'] !== undefined) {
        this.kolId = this.conferenceData['kol_id'];
      }
      console.log(this.kolId);
      if (this.conferenceData['is_notification']) {
        this.conferenceId = this.conferenceData['conference_id'];
        this.getKolsDetailData();
      } else {
        this.conferenceId = this.conferenceData['id'];
        // if (this.conferenceData['is_related_news']) {
          this.getKolsDetailData();
        //}
      }
      if (this.conferenceId === null) {
        this.router.navigate(['']);
      } else {
        this.getConferenceDetailById();
        this.getAllNewsDataByConferenceId();
      }
    }
  }

  ngOnInit() {
    this.usersData = this.utilService.getLoggedUserData();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.renderer.removeClass(document.body, 'stickyheader');
    $('trial-fixed-block').removeClass('infoHeight');
    $('.trial-fixed-block').css('top', '0px');
    this.messageService.setHttpLoaderStatus(true);
    this.getUserListForComment();
  }

  ngOnDestroy() {
    // localStorage.removeItem('kconference_data');
    this.messageService.setHttpLoaderStatus(true);
    // this.messageService.setKolsData(this.headerTitle);
    // localStorage.setItem('header_title', this.headerTitle);
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
            this.messageService.setKolsData(KOLsData.kol_full_name);
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
  * Get Conference detail by trial id
  */
  getConferenceDetailById() {
    this.conferenceService.getConferenceDetailData(this.kolId, this.conferenceId)
      .then((conferenceRes: any) => {
        console.log(conferenceRes);
        if (conferenceRes['success']) {
          const data = [];
          if (conferenceRes['data']['data']['city'] !== null && conferenceRes['data']['data']['city'] !== '') {
            data.push(conferenceRes['data']['data']['city']);
          }
          if (conferenceRes['data']['data']['state'] !== null && conferenceRes['data']['data']['state'] !== '') {
            data.push(conferenceRes['data']['data']['state']);
          }
          if (conferenceRes['data']['data']['country'] !== null && conferenceRes['data']['data']['country'] !== '') {
            data.push(conferenceRes['data']['data']['country']);
          }
          const date1 = new Date(conferenceRes['data']['data']['start_date']);
          const date2 = new Date(conferenceRes['data']['data']['end_date']);
          if (date1.getMonth() === date2.getMonth()) {
            conferenceRes.data.data.isSameMonth = true;
          } else {
            conferenceRes.data.data.isSameMonth = false;
          }
          conferenceRes.data.data.location = data.join(', ');
          this.conferenceData = conferenceRes['data']['data'];

          if (this.conferenceData.is_newly_added === 0 || this.conferenceData.is_updated === 0) {
            this.updateNewsReadStatus('conference');
          }
        }
        this.isDataLoad = true;
        console.log(this.conferenceData);
      }).catch(err => {
        console.log(err);
        this.isDataLoad = true;
      });
  }

  /**
  * Get List of all news by Conference Id
  */
  getAllNewsDataByConferenceId() {
    const postObj = {
      'page': this.currentPage,
      'kol_id': this.kolId
    };

    this.conferenceService.getAllNewsDataByConferenceId(this.kolId, this.conferenceId, postObj)
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
                    self.openLikesList(data);
                  }, 2000);
                } else {
                  document.getElementById(<any>self.newsId).click();
                }
              });
            }, 500);
          } else {
            if (this.newsData.length > 0) {
              this.updateNewsLastView();
            }
          }
        }
        this.isConferenceLoad = false;
        this.isAPIRun = false;
      }).catch((err: any) => {
        console.log(err);
        this.isPageLoad = true;
        this.isConferenceLoad = false;
        this.isAPIRun = false;
      });
  }

  getTooltipData(item: any) {
    if (item.is_bookmark) {
      return 'Unbookmark';
    } else {
      return 'Bookmark';
    }
  }

  /*--- window scroll event---*/
  onResize(event: any) {
    event.preventDefault();
  }

  onWindowScroll(event: any) {
    event.preventDefault();
    const num = window.scrollY;
    const q = this.kolinfo.nativeElement.offsetHeight + 'px';
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
  * Load more data when user scroll down on screen
  * @param event
  */
  onScroll(event: any) {
    if (this.nextPage) {
      if (!this.isAPIRun) {
        this.isAPIRun = true;
        this.isConferenceLoad = true;
        this.messageService.setHttpLoaderStatus(false);
        this.getAllNewsDataByConferenceId();
      }
    }
  }

  goBack() {
    this.location.back();
  }

  /**
  * set format of product
  * @param name: string
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
  * @param item: any
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
      'trial_id': 0,
      'product_id': 0,
      'conference_id': this.conferenceId
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

  /**
  * Like news data by news id
  * @param item
  */
  likeNews(item: any) {
    const postObj = {
      'kol_id': this.kolId,
      'is_for_kol': 0,
      'trial_id': 0,
      'product_id': 0,
      'conference_id': this.conferenceId
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
  * add to bookmark news item
  * @param item
  */
  addNewsItemToBookmark(item: any) {
    this.messageService.setHttpLoaderStatus(true);
    if (item.is_bookmark) {
      this.conferenceService.removeBookmarkNewsById(item.id)
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
      this.conferenceService.addBookmarkNewsById(item.id, this.conferenceId)
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
  * Update last view of news items
  */
  updateNewsLastView() {
    this.messageService.setHttpLoaderStatus(false);
    this.conferenceService.updateNewsLastView(this.kolId, this.conferenceId)
      .then((res: any) => {
        if (res['success']) {
          console.log(res);
        }
      }).catch((err: any) => {
        console.log(err);
      });
  }

  /**
  * changes news read/unread staus when click on it
  * @param item
  */
  changeNewsReadStatus(item: any) {
    item.read_status = 1;
  }

  /**
   * Update news read status
   *
   * @memberof DrugEntityPageComponent
   */
  updateNewsReadStatus(type: string) {
    this.kolsService.updateNewsReadStatus(this.kolId, type)
    .then((res: any) => {
      console.log(res);
    }).catch((err: any) => {
      console.log(err);
    });
  }
}
