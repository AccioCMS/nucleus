import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import * as fromAuth from './Store/auth.reducers';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store<fromAuth.State>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = null;
        this.store.select(state => state).subscribe(
            data => (
                token = data['auth']['token']
            )
        );
    const copiedReq = req.clone({headers: req.headers.set('Authorization', 'Bearer '+token)});
    return next.handle(copiedReq);
  }
}
