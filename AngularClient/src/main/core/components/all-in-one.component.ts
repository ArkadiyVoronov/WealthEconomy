import { Component } from "@angular/core";

import { ElementCell } from "../../app-entity-manager/entities/element-cell";
import { IProjectViewerConfig, ProjectService } from "../../resource-pool-editor/resource-pool-editor.module";

@Component({
    selector: "all-in-one",
    templateUrl: "all-in-one.component.html"
})
export class AllInOneComponent {

    allInOneConfig: IProjectViewerConfig = { projectUniqueKey: { username: "sample", projectKey: "All-in-One" } };
    syncFlag: boolean = true;

    constructor(private projectService: ProjectService) {

        // Event handlers
        projectService.elementCellDecimalValueUpdated$.subscribe((elementCell: ElementCell): void => this.processNewInteraction(elementCell));
    }

    // Processes whether the user is currently interacting with this example
    processNewInteraction(elementCell: ElementCell): void {

        // Priority Index
        if (elementCell.ElementField.Element.Project.User.UserName === "sample"
            && (elementCell.ElementField.Element.Project.Key === "Priority-Index-Sample"
                || elementCell.ElementField.Element.Project.Key === "Knowledge-Index-Sample")
            && this.syncFlag) {

            this.projectService.getProjectExpanded(this.allInOneConfig.projectUniqueKey)
                .subscribe((project: any): void => {

                    if (!project) {
                        return;
                    }

                    // Elements
                    for (let elementIndex = 0; elementIndex < project.ElementSet.length; elementIndex++) {
                        const element = project.ElementSet[elementIndex];
                        if (element.Name === elementCell.ElementField.Element.Name) {

                            // Element fields
                            for (let elementFieldIndex = 0; elementFieldIndex < element.ElementFieldSet.length; elementFieldIndex++) {
                                const elementField = element.ElementFieldSet[elementFieldIndex];
                                if (elementField.Name === elementCell.ElementField.Name) {

                                    // Element cells
                                    for (let elementCellIndex = 0; elementCellIndex < elementField.ElementCellSet.length; elementCellIndex++) {
                                        const cell = elementField.ElementCellSet[elementCellIndex];

                                        if (cell.ElementItem.Name === elementCell.ElementItem.Name) {
                                            this.projectService.updateElementCellDecimalValue(cell, elementCell.numericValue());
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
        }
    }
}
