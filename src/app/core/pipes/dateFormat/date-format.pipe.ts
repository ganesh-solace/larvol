import { Pipe, PipeTransform } from '@angular/core';
declare function require(name:string): any;
const format = require('moment');
@Pipe({
  name: 'dateformat'
})
export class DateFormatPipe implements PipeTransform {

  transform(d: Date | string, fmt: string): string {
    const rv = format(d).format(fmt);
    return rv;
  }

}