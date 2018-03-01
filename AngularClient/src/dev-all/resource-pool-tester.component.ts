import { Component, OnInit } from "@angular/core";

import { RatingMode, Project } from "../main/app-entity-manager/entities/resource-pool";
import { ProjectService } from "../main/resource-pool-editor/resource-pool-editor.module";

@Component({
    selector: "resource-pool-tester",
    styleUrls: ["resource-pool-tester.component.css"],
    templateUrl: "resource-pool-tester.component.html"
})
export class ProjectTesterComponent implements OnInit {

    RatingMode = RatingMode;
    project: Project = null;

    constructor(private projectService: ProjectService) {
    }

    ngOnInit(): void {

        this.projectService.getProjectExpanded({ projectKey: "New-CMRP", username: "guest-171101-192722534" })
            .subscribe(project => {
                this.project = project;
            });
    }
}
