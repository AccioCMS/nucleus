import {Component, OnInit} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
    selector: 'update-language-redirect',
    template: ``
})
export class UpdateLanguageRedirectComponent implements OnInit{

    constructor(
        private router: Router,
        private route:ActivatedRoute
    )
    {}

    ngOnInit(){
        let url = this.route.snapshot.queryParams['url'];
        this.router.navigate([url]);
    }
}
