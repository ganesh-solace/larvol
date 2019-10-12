import { Component, OnInit, Input, HostListener, OnDestroy } from '@angular/core';
import { KolsService } from './../../../core/service/kols/kols.service';
import { UtilService } from './../../../core/service/util.service';
import { MessageService } from './../../../core/service/message/message.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KolsLikesListComponent } from './../kols-likes-list/kols-likes-list.component';
import { ShareModalComponent } from './../share-modal/share-modal.component';
import { take } from 'rxjs/operators';

declare var $: any;

@Component({
    selector: 'app-news-social-features',
    templateUrl: './news-social-features.component.html',
    styleUrls: ['./news-social-features.component.scss']
})
export class NewsSocialFeaturesComponent implements OnInit, OnDestroy {

    @Input() item: any;
    @Input() settingsData: any;
    @Input() productId: any;
    @Input() kolId: any;
    @Input() allUserList: any;
    @Input() trailId: any;

    selectedNewItem: any;
    usersData: any;
    keyData = null;
    isShow = false;
    userList: any = [];
    userCurrentPage = 1;
    isNextUserPage = false;
    openLikeListRef: any;

    @HostListener('document:click', ['$event'])
    clickout(event: any) {
        if (event.srcElement.className.indexOf('comment') === -1) {
            if (this.isShow) {
                this.isShow = false;
            }
        }
    }

    constructor(
        private kolsService: KolsService,
        private utilService: UtilService,
        private messageService: MessageService,
        private modalService: NgbModal,
    ) {
        this.usersData = this.utilService.getLoggedUserData();

        // this.openLikeListRef = this.messageService.getLikelistOpenStatus().pipe(take(1)).subscribe((res: any) => {
        //     console.log(res);
        //     // this.openLikesList(res);
        // });
    }

    ngOnInit() {
        // this.getUserListForComment();

        if (this.allUserList.length > 0) {
            this.allUserList.filter((item: any) => {
                setTimeout(() => {
                    this.userList.push(item);
                }, 1000);
            });
        }

        if (this.item['is_notification_news'] !== undefined) {
            if (this.item['is_notification_news']) {
                this.openLikesList(this.item);
            }

        }
    }

    ngOnDestroy() {
        if (!!this.openLikeListRef) {
            this.openLikeListRef.unsubscribe();
        }
    }

    /**
    * Like news data by news id
    * @param item
    */
    likeNews(item: any) {
        const postObj = {
            'kol_id': 0,
            'trial_id': 0,
            'is_for_kol': 1,
            'product_id': this.productId
        };

        if (this.trailId > 0) {
            postObj['trial_id'] = this.trailId;
        }

        if (this.trailId !== undefined && this.trailId !== '' && this.trailId !== null) {
            postObj['is_for_kol'] = 0;
        }

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
    * Open social share popup
    */
    sharePopup(item: any) {
        console.log(item);
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
    * Show list of existing comments for news
    */
    hideShowComment(item: any) {
        if (item.isShow) {
            item.isShow = !item.isShow;
        } else {
            this.messageService.setHttpLoaderStatus(true);
            this.getAllExistingComments(item);
        }
        if (item.isShow) {
            this.selectedNewItem = item;
        } else {
            this.selectedNewItem = item;
        }
        item.showUserList = false;
        this.messageService.setOpenCommentBoxStatus(item);
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
    *  scroll on comment box when opne in mobile view
    * @param event
    * @param item
    */
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
            item.isSearch = false;
            this.isShow = false;
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
            'kol_id': 0,
            'is_for_kol': 1,
            'trial_id': 0,
            'product_id': this.productId
        };

        if (this.trailId > 0) {
            postObj['trial_id'] = this.trailId;
        }
        if (this.trailId !== undefined && this.trailId !== '' && this.trailId !== null) {
            postObj['is_for_kol'] = 0;
        }
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
                    $('#myinputtext_' + item.id).trigger('focus');
                }
            }
        });
    }

}
