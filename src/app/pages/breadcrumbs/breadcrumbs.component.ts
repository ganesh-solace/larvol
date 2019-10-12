import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, PRIMARY_OUTLET, Router, NavigationEnd } from '@angular/router';

interface IBreadcrumb {
    label: string;
    params?: any;
    url: string;
    type: string;
}

@Component({
    selector: 'app-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {

    public breadcrumbs: IBreadcrumb[];
    routerSubscribe: any;
    isHome = true;

    constructor(
        private activatedRoute: ActivatedRoute,
        public router: Router) {
    }

    ngOnInit() {
        const root: ActivatedRoute = this.activatedRoute.root;
        this.breadcrumbs = this.getBreadcrumbs(root);
        if (this.router.url !== '/') {
            this.isHome = false;
        } else {
            this.isHome = true;
        }
        this.routerSubscribe = this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
            if (this.router.url !== '/') {
                this.isHome = false;
            } else {
                this.isHome = true;
            }
// tslint:disable-next-line: no-shadowed-variable
            const root: ActivatedRoute = this.activatedRoute.root;
            this.breadcrumbs = this.getBreadcrumbs(root);
            console.log(this.breadcrumbs);
        });
        console.log(this.breadcrumbs);
    }

    private getBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadcrumb[] = []): IBreadcrumb[] {

        const ROUTE_DATA_BREADCRUMB: any = 'breadcrumb';
        const children: ActivatedRoute[] = route.children;
        if (children.length === 0) {
            return breadcrumbs;
        }
        for (const child of children) {
            if (child.outlet !== PRIMARY_OUTLET) {
                continue;
            }
            // if (child.snapshot.data !== undefined) {
            if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
                return this.getBreadcrumbs(child, url, breadcrumbs);
            }
            const myUrl: any = child.snapshot;
            const routeURL: string = myUrl._routerState.url;
            url = `${routeURL}`;
            let labelText = child.snapshot.data[ROUTE_DATA_BREADCRUMB];
            let type = 'home';
            if (this.router.url.indexOf('kol-entity') > -1) {
                labelText = localStorage.getItem('header_title');
                type = 'detail';
            }
            const breadcrumb: IBreadcrumb = {
                label: labelText,
                params: child.snapshot.params,
                url: url,
                type: type
            };
            breadcrumbs.push(breadcrumb);
            return this.getBreadcrumbs(child, url, breadcrumbs);
            // }
        }
        return breadcrumbs;
    }

    openUrl(url: any, index: Number) {
        console.log(url);
        console.log(this.breadcrumbs.length);
    }

}
