import { NgModule } from '@angular/core';
import {AuthModule} from "../Auth/Resources/auth.module";
import {HeaderComponent} from "./Header/header.component";

@NgModule({
    declarations: [
        HeaderComponent,
    ],
    imports: [
        AuthModule
    ],
    exports: [
        AuthModule,
        HeaderComponent,
    ],
})
export class MainModule { }