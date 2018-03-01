import { APP_INITIALIZER, NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Angulartics2GoogleAnalytics, Angulartics2Module } from "angulartics2";

// Components
import { MiscComponent } from "./misc.component";
import { ResourcePoolTesterComponent } from "./resource-pool-tester.component";

import { GoogleAnalyticsService } from "../main/core/google-analytics.service";

export { Angulartics2GoogleAnalytics, GoogleAnalyticsService }

const routes: Routes = [
    { path: "", component: MiscComponent, data: { title: "Misc" } },
    { path: "app/resource-pool-tester", component: ResourcePoolTesterComponent, data: { title: "Resource Pool Tester" } },

    /* Home alternatives */
    { path: "app/misc", redirectTo: "", pathMatch: "full" },
    { path: "app.html", redirectTo: "", pathMatch: "full" },
    { path: "app-aot.html", redirectTo: "", pathMatch: "full" }
];

export function appInitializer(googleAnalyticsService: GoogleAnalyticsService) {
    return () => {
        googleAnalyticsService.configureTrackingCode(); // Setup google analytics
    };
}

@NgModule({
    exports: [
        RouterModule
    ],
    imports: [
        RouterModule.forRoot(routes),
        Angulartics2Module.forRoot([Angulartics2GoogleAnalytics])
    ],
    providers: [
        // Application initializer
        {
            "provide": APP_INITIALIZER,
            "useFactory": appInitializer,
            "deps": [GoogleAnalyticsService],
            "multi": true,
        },
        GoogleAnalyticsService
    ]
})
export class AppRouterModule { }
