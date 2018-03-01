import { Component, OnInit } from "@angular/core";

import { RatingMode, ResourcePool } from "../main/app-entity-manager/entities/resource-pool";
import { ResourcePoolEditorService } from "../main/resource-pool-editor/resource-pool-editor.module";

@Component({
    selector: "resource-pool-tester",
    styleUrls: ["resource-pool-tester.component.css"],
    templateUrl: "resource-pool-tester.component.html"
})
export class ResourcePoolTesterComponent implements OnInit {

    RatingMode = RatingMode;
    resourcePool: ResourcePool = null;

    constructor(private resourcePoolEditorService: ResourcePoolEditorService) {
    }

    ngOnInit(): void {

        this.resourcePoolEditorService.getResourcePoolExpanded({ resourcePoolKey: "New-CMRP", username: "guest-171101-192722534" })
            .subscribe(resourcePool => {
                this.resourcePool = resourcePool;
            });
    }
}
