import { Injectable } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  authToken: string;
  previousUrl: string;
  toast: any;
  showToast: any;

  constructor(private toasterService: ToasterService, public toastr: ToastrManager) { }

  /**
   * Check user is login or not
   */
  isLoggedIn(): boolean {
    return localStorage.getItem('Kweb_token') && localStorage.getItem('Kweb_token') ? true : false;
  }

  /**
  * get local storage token
  */
  getToken(): string | null {
    if (this.authToken) {
      return this.authToken;
    } else {
      return localStorage.getItem('Kweb_token') ? localStorage.getItem('Kweb_token') : null;
    }
  }

  /**
  * set token in localstorage
  * @param token
  */
  setToken(token: string): void {
    this.authToken = token;
    localStorage.setItem('Kweb_token', token);
  }

  /**
  * Set login user data in localstorage
  * @param data
  */
  setLoggedUserData(data: any) {
    localStorage.setItem('Kuser_data', data);
  }

  /**
  * Get login user data from localstorage
  */
  getLoggedUserData(): string | null {
    return localStorage.getItem('Kuser_data') ? JSON.parse(localStorage.getItem('Kuser_data')) : null;
  }

  clearLocalStorage() {
    localStorage.removeItem('Kuser_data');
    localStorage.removeItem('Kweb_token');
    localStorage.removeItem('krecent_search');
    localStorage.removeItem('ksearch_text');
    localStorage.removeItem('header_title');
    localStorage.removeItem('kselected_tab');
    localStorage.removeItem('kfeedback_text');
    localStorage.removeItem('knews_item');
    localStorage.removeItem('ktrials_data');
    localStorage.removeItem('KsearchAreaId');
    localStorage.removeItem('KsearchAreaData');
    localStorage.removeItem('KsearchInstituteId');
    localStorage.removeItem('KsearchInstituteData');
    localStorage.removeItem('kbookmarkselected_tab');
    localStorage.removeItem('kdevice_token');
    localStorage.removeItem('selectedEntity');
  }

  /**
  * Show error message
  * @param title
  * @param message
  */
  showError(title, message) {
    if (this.toast !== undefined) {
      this.toasterService.clear();
    }
    this.toast = this.toasterService.popAsync('error', title, message);
  }

  /**
  * Show success message
  * @param title
  * @param message
  */
  showSuccess(title, message) {
    if (this.toast !== undefined) {
      this.toasterService.clear();
    }
    this.toast = this.toasterService.popAsync('success', title, message);
  }

  /**
  * show custom
  * @param msg
  */
  showCustom(msg: string) {
    // console.log(this.showToast);
    // if (this.showToast !== undefined) {
    //     this.toastr.dismissAllToastr();
    // }
    // console.log(this.showToast);
    this.showToast = this.toastr.customToastr(
      '<span style="background-color: #6e7070; color: #fff; font-size: 16px; text-align: center; line-height: 15px;">' + msg + '</span>',
      null,
      { toastTimeout: 2000, position: 'bottom-center', enableHTML: true, animate: 'slideFromBottom' }
    );
  }

  /**
  * Get name initials for display when image is not exist
  * @param _name
  */
  getNameInitials(_name: any) {
    if (_name !== null && _name !== undefined) {
      return `${_name.split(' ')[0][0]}${_name.split(' ').pop()[0]}`;
    }
  }

  /**
  * Check which platform web is ruunig mobile or browser
  */
  checkRunningPlatformType() {
    const isMobile = {
      Android: function () {
        return navigator.userAgent.match(/Android/i);
      },
      BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
      },
      any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
      }
    };

    return isMobile.any();
  }

  /**
  * show custom notification  in toster form coming from server
  * @param data
  */
  showNotifications(data: any) {
    const browser = navigator.userAgent.split(')').reverse()[0].match(/(?!Gecko|Version|[A-Za-z]+?Web[Kk]it)[A-Z][a-z]+/g)[0];
    this.toastr.customToastr(
      `<a href="">
<div class='footer-toaster' style="background-color: #4e2a87; color: #fff; font-size: 16px; text-align: center; line-height: 15px;">
<span class='logo-img'> <img src="./assets/images/favicon.png" alt="Omni" /></span>
<span class='content-toaster'>
<span>` + data['body'] + `</span>
<span>` + browser + `. ` + environment.appName + `</span>
</span>
</div>
</a>`,
      null,
      { toastTimeout: 5000, dismiss: 'auto', position: 'bottom-right', enableHTML: true, animate: 'slideFromBottom' }
    );
  }

  /**
  * show confirm notification alter
  */
  showConfirmNotifications() {
    this.toastr.customToastr(
      ` <div class='footer-toaster' style="background-color: #4e2a87; color: #fff; font-size: 16px; text-align: center; line-height: 15px;">
<span class='logo-img'> <img src="./assets/images/favicon.png" alt="Omni" /></span>
<span class='content-toaster'>
<span>Notification from Omni</span>
<span>You will receive notifications from Omni.</span>
</span>
</div>`,
      null,
      { toastTimeout: 5000, dismiss: 'auto', position: 'bottom-right', enableHTML: true, animate: 'slideFromBottom' }
    );
  }
  /**
  * Common error handler
  */
  errorHandler(error: any) {
    if (error.hasOwnProperty('error')) {
      if (error && error.hasOwnProperty('message')) {
        if (typeof error.message === 'object') {
          for (const x of Object.keys(error.message)) {
            this.showError('Error', error.message[x]);
          }
        } else if (typeof error.message === 'string') {
          this.showError('Error', error.message);
        }
      } else {
        this.showError('Error', 'Something went wrong. Please try again later');
      }
    } else {
      this.showError('Error', 'Something went wrong. Please try again later');
    }
  }
}
