import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Users} from "./Views/user-list/user-list.component";
import { Observable} from "rxjs/Observable";
import { toArray } from 'rxjs/operators';
@Injectable()
export class UsersService {

    private _url: string = "assets/data.json";

    constructor(private http: HttpClient) {}


    getUsers(): Observable<Users[]>{

        return this.http.get<Users[]>(this._url);

    }
}
