import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { NgChartModule } from "../ng-chart/ng-chart.module";
import { IConfig as IProjectViewerConfig, ProjectViewerComponent } from "./project-viewer.component";
import { ProjectService } from "./project.service";
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
