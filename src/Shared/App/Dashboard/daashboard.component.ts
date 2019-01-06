import { Component } from '@angular/core';
import {HeaderComponent} from "../../Header/header.component";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    providers: [HeaderComponent]
})
export class DashboardComponent { }
