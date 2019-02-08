import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AccioRouteParamsService {
    constructor(
        private router: Router,
        private route: ActivatedRoute
    ){}

    public getParamsString(defaultPageSize): string {
        if(this.route.snapshot.queryParams['pageSize']){
            defaultPageSize = this.route.snapshot.queryParams['pageSize'];
        }

        let params = '?pageSize='+defaultPageSize;
        if (this.route.snapshot.queryParams['page']){
            params += '&page='+this.route.snapshot.queryParams['page'];
        }
        if (this.route.snapshot.queryParams['order'] && this.route.snapshot.queryParams['type']) {
            params += '&order='+this.route.snapshot.queryParams['order']+'&type='+this.route.snapshot.queryParams['type'];
        }

        return params;
    }

    public customSortParams(event, pageSize){
        let data = [];

        data['stringParams'] = '?pageSize='+pageSize+'&order='+event['active']+'&type='+event['direction'];
        data['queryParams'] = {
            pageSize: this.route.snapshot.queryParams['pageSize'],
            order: event['active'],
            type: event['direction']
        };
        return data;
    }

    public paginationParams(event, pageSize){
        let data = [];

        data['stringParams'] = '?pageSize='+pageSize+'&page='+(event.pageIndex + 1);
        if (this.route.snapshot.queryParams['order'] && this.route.snapshot.queryParams['type']) {
            data['stringParams'] += '&order='+this.route.snapshot.queryParams['order']+'&type='+this.route.snapshot.queryParams['type'];

            data['queryParams'] = {
                page: (event.pageIndex + 1),
                pageSize: pageSize,
                order: this.route.snapshot.queryParams['order'],
                type: this.route.snapshot.queryParams['type']
            };
        }else{
            data['queryParams'] = {
                page: (event.pageIndex + 1),
                pageSize: pageSize
            };
        }

        return data;
    }
}
