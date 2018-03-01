import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { NgChartModule } from "../ng-chart/ng-chart.module";
import { IConfig as IProjectViewerConfig, ProjectViewerComponent } from "./resource-pool-editor.component";
import { ProjectService } from "./resource-pool-editor.service";
import { SymbolicPipe } from "./symbolic.pipe";

export { IProjectViewerConfig, ProjectService }

@NgModule({
    declarations: [
        ProjectViewerComponent,
        SymbolicPipe
    ],
    exports: [
        ProjectViewerComponent,
        SymbolicPipe
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,

        NgChartModule
    ],
    providers: [
        ProjectService
    ]
})
export class ProjectViewerModule { }
