import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule, Title } from "@angular/platform-browser";
import { MomentModule } from "angular2-moment";
import "../main/core/rxjs-extensions";

import { AppEntityManagerModule } from "../main/app-entity-manager/app-entity-manager.module";
import { AppErrorHandlerModule } from "../main/app-error-handler/app-error-handler.module";
import { AppHttpModule } from "../main/app-http/app-http.module";
import { AuthModule } from "../main/auth/auth.module";
import { LoggerModule } from "../main/logger/logger.module";
import { NgChartModule } from "../main/ng-chart/ng-chart.module";
import { ProjectViewerModule } from "../main/project-viewer/project-viewer.module";

import { AppRouterModule } from "./app-router.module";
import { AppComponent } from "./app.component";
import { MiscComponent } from "./misc.component";
import { NavigationComponent } from "./navigation.component";
import { ProjectTesterComponent } from "./project-tester.component";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    declarations: [
        AppComponent,
        MiscComponent,
        NavigationComponent,
        ProjectTesterComponent,
    ],
    imports: [
        // External
        BrowserModule,
        FormsModule,
        MomentModule,

        // Internal
        LoggerModule,
        AppHttpModule,
        AppErrorHandlerModule,
        AppEntityManagerModule,
        AuthModule,
        NgChartModule,
        ProjectViewerModule,

        AppRouterModule
    ],
    providers: [
        Title
    ]
})
export class AppModule { }
