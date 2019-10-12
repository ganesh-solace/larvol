import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-kol-entity-image',
    templateUrl: './kol-entity-image.component.html',
    styleUrls: ['./kol-entity-image.component.scss']
})
export class KolEntityImageComponent implements OnInit {

    @Input() news_images: any;

    slideConfig = {
        enabled: true,
        autoplay: false,
        arrows: true,
        dots: false,
        speed: 1000,
        draggable: false,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    constructor(
        private activeModal: NgbActiveModal
    ) { }

    ngOnInit() {
        console.log(this.news_images);
    }

    /**
     * Close the popup
     */
    closeModal() {
        this.activeModal.close();
    }

    slickInit(e: any) {
        console.log('slick initialized');
    }

    breakpoint(e: any) {
        console.log('breakpoint');
    }

    afterChange(e: any) {
        console.log('afterChange');
    }

    beforeChange(e: any) {
        console.log('beforeChange');
    }

}
