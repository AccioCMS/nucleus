import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '../../../../Shared/@fuse/services/config.service';
import { fuseAnimations } from '../../../../Shared/@fuse/animations';

import { HttpClient } from '@angular/common/http';

import { Store } from '@ngrx/store';
import * as fromAuth from '../../Store/auth.reducers';
import * as AuthActions from "../../Store/auth.actions";

import { Router } from '@angular/router';
import 'rxjs/Rx';

@Component({
  selector     : 'login',
  templateUrl  : './login.component.html',
  styleUrls    : ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    showErrorMessage: boolean = false;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private httpClient: HttpClient,
        private store: Store<fromAuth.State>,
        private router:Router
    )
    {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

    /**
    * On init
    */
    ngOnInit(): void
    {
        this.loginForm = this._formBuilder.group({
            email   : ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    onSubmit(){
        this.showErrorMessage = false;
        let authData = this.loginForm.value;
        let credentials = { email: authData.email, password: authData.password };

        this.httpClient.post('/api/auth/login', credentials)
            .map(
                (data) => {
                    if(data['success'] == true){
                        this.store.dispatch(new AuthActions.Signin(data['access_token']))
                        this.router.navigate(['/test/fuse'])
                    }else{
                        this.showErrorMessage = true;
                    }
                }
            )
            .subscribe();
    }
}
