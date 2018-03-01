import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";

import { AppEntityManager } from "../app-entity-manager/app-entity-manager.module";
import { IUniqueKey } from "../app-entity-manager/entities/resource-pool";
import { ResourcePoolEditorService } from "../resource-pool-editor/resource-pool-editor.module";

@Injectable()
export class DynamicTitleResolve implements Resolve<string> {

    constructor(private appEntityManager: AppEntityManager, private resourcePoolService: ResourcePoolEditorService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<string> {

        const username = route.params["username"];
        const resourcePoolKey = route.params["resourcePoolKey"];
        const lastUrl = route.url[route.url.length - 1];

        if (username && resourcePoolKey) { // Project title

            let title = "";

            // Project unique key
            const resourcePoolUniqueKey: IUniqueKey = {
                username: username,
                resourcePoolKey: resourcePoolKey
            };

            return this.resourcePoolService.getResourcePoolExpanded(resourcePoolUniqueKey)
                .map((project): string => {

                    if (project !== null) {

                        title += project.User.UserName + " - " + project.Name;
                        if (lastUrl && lastUrl.path === "edit") {
                            title += " - Edit";
                        }
                    }

                    return title;
                });

        } else if (username) { // User title

            return this.appEntityManager.getUser(username)
                .map((user): string => {

                    let title = "";

                    if (user !== null) {
                        title = user.UserName;

                        if (lastUrl && lastUrl.path === "new") {
                            title += " - New";
                        }
                    }

                    return title;
                });

        } else { // None

            return Observable.of("");
        }
    }
}
