// External
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule, Title } from "@angular/platform-browser";
import { MomentModule } from "angular2-moment";
import "../core/rxjs-extensions";

// Shared modules
import { AppEntityManagerModule } from "../app-entity-manager/app-entity-manager.module";
import { AppErrorHandlerModule } from "../app-error-handler/app-error-handler.module";
import { AppHttpModule } from "../app-http/app-http.module";
import { AuthModule } from "../auth/auth.module";
import { LoggerModule } from "../logger/logger.module";
import { NgChartModule } from "../ng-chart/ng-chart.module";
import { ProjectViewerModule } from "../project-viewer/project-viewer.module";

// Core module
import { CoreModule } from "../core/core.module";

// Feature modules
import { AccountModule } from "../account/account.module";

// App component
import { AppComponent } from "./app.component";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    declarations: [
        AppComponent
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

        CoreModule,
        AccountModule,
    ],
    providers: [
        Title
    ]
})
export class AppModule { }
