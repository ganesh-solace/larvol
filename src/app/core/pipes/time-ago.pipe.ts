import { Pipe, PipeTransform } from '@angular/core';
// import * as moment from 'moment';
import 'moment-timezone';
import * as moment from 'moment-timezone';

@Pipe({
    name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

    public setdate = moment();
    transform(date: any, args?: any): any {
        const dateNew = moment.tz(date, 'America/Los_Angeles').toDate();

        const time_formats = [
            [60, 'seconds', 1], // 60
            [120, '1 minute ago', '1 minute from now'], // 60*2
            [3600, 'minutes', 60], // 60*60, 60
            [7200, '1 hour ago', '1 hour from now'], // 60*60*2
            [86400, 'hours', 3600], // 60*60*24, 60*60
            [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
            [604800, 'days', 86400], // 60*60*24*7, 60*60*24
            [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
            [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
            [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
            [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
            [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
            [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
            [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
            [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
        ];

        let seconds = ((+new Date().getTime() - <any>dateNew.getTime()) / 1000),
            token = 'ago',
            list_choice = 1;

// tslint:disable-next-line: radix
        seconds = parseInt(<any>seconds);
        if (seconds === 0) {
            return 'Just now';
        }
        if (seconds < 0) {
            seconds = Math.abs(seconds);
            token = 'from now';
            list_choice = 2;
        }

        let i = 0,
            format;
        while (format = time_formats[i++]) {
            if (seconds < format[0]) {
                if (typeof format[2] === 'string') {
                    return format[list_choice];
                } else {
                    return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
                }
            }
        }

        // return moment.tz(date, 'America/Los_Angeles').fromNow();
    }

}
