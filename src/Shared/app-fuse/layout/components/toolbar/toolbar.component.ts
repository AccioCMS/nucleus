import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

import { FuseConfigService } from '../../../../@fuse/services/config.service';
import { FuseSidebarService } from '../../../../@fuse/components/sidebar/sidebar.service';

import { navigation } from '../../../navigation/navigation';

import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as AuthActions from "../../../../../Auth/Resources/Store/auth.actions";
import * as SharedActions from "../../../../Store/shared.actions";

import { Router, ActivatedRoute } from '@angular/router';
import * as LabelActions from "../../../../../Label/Resources/Store/label.actions";

@Component({
    selector     : 'toolbar',
    templateUrl  : './toolbar.component.html',
    styleUrls    : ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ToolbarComponent implements OnInit, OnDestroy
{
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    languages: any;
    navigation: any;
    selectedLanguage: any;
    userStatusOptions: any[];
    authUser: object;
    searchCollaps: boolean = false;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {TranslateService} _translateService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private _translateService: TranslateService,
        private httpClient: HttpClient,
        private store: Store<any>,
        private router:Router,
        private route: ActivatedRoute
    )
    {
        // Set the defaults
        this.userStatusOptions = [
            {
                'title': 'Online',
                'icon' : 'icon-checkbox-marked-circle',
                'color': '#4CAF50'
            },
            {
                'title': 'Away',
                'icon' : 'icon-clock',
                'color': '#FFC107'
            },
            {
                'title': 'Do not Disturb',
                'icon' : 'icon-minus-circle',
                'color': '#F44336'
            },
            {
                'title': 'Invisible',
                'icon' : 'icon-checkbox-blank-circle-outline',
                'color': '#BDBDBD'
            },
            {
                'title': 'Offline',
                'icon' : 'icon-checkbox-blank-circle-outline',
                'color': '#616161'
            }
        ];

        this.store.select(state => state).subscribe(
            data => (
                this.languages = data['shared']['languages'],
                this.authUser = data['auth']['authUser']
            )
        );

        this.navigation = navigation;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                this.horizontalNavbar = settings.layout.navbar.position === 'top';
                this.rightNavbar = settings.layout.navbar.position === 'right';
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });

        // Set the selected language from default languages
        this.selectedLanguage = _.find(this.languages, {'id': this._translateService.currentLang});
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void
    {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }


    /**
     * Collapse
     */
    collapse(): void
    {
        if(this.searchCollaps){
            this.searchCollaps = false;
        }else{
            this.searchCollaps = true;
        }

        console.log( this.searchCollaps );

    }


    /**
     * Search
     *
     * @param value
     */
    search(value): void
    {
        // Do your search here...
        console.log(value);
    }

    /**
     * Set the language
     *
     * @param lang
     */
    setLanguage(lang): void
    {
        this.store.dispatch(new SharedActions.SetIsLoading(true));
        // Set the selected language for the toolbar
        this.selectedLanguage = lang;

        let routeParams = this.route.snapshot.params;

        this.httpClient.get('/'+routeParams['adminPrefix']+'/update-language/'+lang.id)
            .map(
                (data) => {
                    if(data['status'] == true){
                        this.store.dispatch(new SharedActions.SetAppMenuLinks(data['applicationMenuLinks']));
                    }else{
                        this.router.navigate(['/'+routeParams['adminPrefix']+'/login']);
                    }
                    this._translateService.use(lang.id);

                    let url = this.router.url;
                    url = url.replace(routeParams['lang'], lang.id);
                    this.router.navigate(['/'+routeParams['adminPrefix']+'/'+lang.id+'/update-language'], {queryParams: {'url': url}});

                    this.store.dispatch(new SharedActions.SetIsLoading(false));
                }
            )
            .subscribe();
    }


    /**
     * Logout and set auth data to null
     *
     */
    onLogOut(){
        this.httpClient.get('/api/auth/logout')
            .map(
                (data) => {
                    this.store.dispatch(new AuthActions.Logout())
                    this.router.navigate(['/admin/login'])
                }
            )
            .subscribe();
    }
}
