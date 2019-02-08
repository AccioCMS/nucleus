import {Component, OnInit} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { PreviousRouteService } from '../../Services/previous-route.service';

@Component({
    selector: 'update-language-redirect',
    template: ``
})
export class UpdateLanguageRedirectComponent implements OnInit{

    routeParams: any;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private previousRouteService: PreviousRouteService
    )
    {
    }

    ngOnInit(){
        this.routeParams = this.route.parent.snapshot.params;

        let url = this.previousRouteService.getPreviousUrl();
        let previousLang = url.split("/")[2];

        url = url.replace(previousLang, this.routeParams['lang']);
        let urlSplited = url.split('?');

        let formatedQP = {};
        if(typeof urlSplited[1] != undefined && urlSplited[1]){
            formatedQP = JSON.parse('{"' + urlSplited[1].replace(/&/g, '","')
                .replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value) });
        }

        this.router.navigate([urlSplited[0]], {queryParams: formatedQP});
    }
}
