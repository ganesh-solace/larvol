import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'reverse'
})
export class ReversePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (value !== null) {
            return value.slice().reverse();
        } else {
            return;
        }
    }
}
