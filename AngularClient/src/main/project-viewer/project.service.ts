import { EventEmitter, Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { EntityQuery, FetchStrategy, Predicate } from "../../libraries/breeze-client";
import { Observable } from "rxjs/Observable";

import { AppSettings } from "../../app-settings/app-settings";
import { AppHttp } from "../app-http/app-http.module";
import { Element } from "../app-entity-manager/entities/element";
import { ElementCell } from "../app-entity-manager/entities/element-cell";
import { ElementField, ElementFieldDataType } from "../app-entity-manager/entities/element-field";
import { ElementItem } from "../app-entity-manager/entities/element-item";
import { IUniqueKey, Project } from "../app-entity-manager/entities/project";
import { User } from "../app-entity-manager/entities/user";
import { UserElementCell } from "../app-entity-manager/entities/user-element-cell";
import { UserElementField } from "../app-entity-manager/entities/user-element-field";
import { AuthService } from "../auth/auth.module";
import { AppEntityManager } from "../app-entity-manager/app-entity-manager.module";

@Injectable()
export class ProjectService {

    get currentUser(): User {
        return this.authService.currentUser;
    }
    get currentUserChanged$(): EventEmitter<User> {
        return this.authService.currentUserChanged$;
    }
    elementCellDecimalValueUpdated$: EventEmitter<any> = new EventEmitter<ElementCell>();
    fetchedList: IUniqueKey[] = [];
    get isBusy(): boolean {
        return this.appEntityManager.isBusy || this.appHttp.isBusy || this.isBusyLocal;
    }

    private appHttp: AppHttp;
    private isBusyLocal: boolean = false; // Use this flag for functions that contain multiple http requests (e.g. saveChanges())

    constructor(private appEntityManager: AppEntityManager, private authService: AuthService, http: Http) {

        this.appHttp = http as AppHttp;

        // Current user chanhaged
        this.currentUserChanged$.subscribe(() => {
            this.fetchedList = [];
            //this.fetchFromServer = true;
        });
    }

    createUserElementCell(elementCell: ElementCell, value: any) {

        // Search for an existing entity: deleted but not synced with remote entities are still in metadataStore
        const existingKey = [this.authService.currentUser.Id, elementCell.Id];
        let userElementCell = this.appEntityManager.getEntityByKey("UserElementCell", existingKey) as UserElementCell;

        if (userElementCell) {

            // If it's deleted, restore it
            if (userElementCell.entityAspect.entityState.isDeleted()) {
                userElementCell.entityAspect.rejectChanges();
            }

            switch (elementCell.ElementField.DataType) {
                case ElementFieldDataType.String: { break; }
                case ElementFieldDataType.Decimal: { userElementCell.DecimalValue = value !== null ? value : 50; break; }
                case ElementFieldDataType.Element: { break; }
            }

        } else {

            const userElementCellInitial = {
                User: this.authService.currentUser,
                ElementCell: elementCell
            } as any;

            switch (elementCell.ElementField.DataType) {
                case ElementFieldDataType.String: { break; }
                case ElementFieldDataType.Decimal: { userElementCellInitial.DecimalValue = value !== null ? value : 50; break; }
                case ElementFieldDataType.Element: { break; }
            }

            userElementCell = this.appEntityManager.createEntityNew("UserElementCell", userElementCellInitial) as UserElementCell;
        }

        return userElementCell;
    }

    createUserElementField(elementField: ElementField, rating: number = 50) {

        // Search for an existing entity: deleted but not synced with remote entities are still in metadataStore
        const existingKey = [this.authService.currentUser.Id, elementField.Id];
        let userElementField = this.appEntityManager.getEntityByKey("UserElementField", existingKey) as UserElementField;

        if (userElementField) {

            // If it's deleted, restore it
            if (userElementField.entityAspect.entityState.isDeleted()) {
                userElementField.entityAspect.rejectChanges();
            }

            userElementField.Rating = rating;

        } else {

            const userElementFieldInitial = {
                User: this.authService.currentUser,
                ElementField: elementField,
                Rating: rating
            };

            userElementField = this.appEntityManager.createEntityNew("UserElementField", userElementFieldInitial) as UserElementField;
        }

        return userElementField;
    }

    getProjectExpanded(projectUniqueKey: IUniqueKey, forceRefresh?: boolean) {
        forceRefresh = forceRefresh || false;

        // If it's forced, remove it from fetched list so it can be retrieved from the server
        if (forceRefresh) {
            const keyIndex = this.fetchedList.indexOf(projectUniqueKey);
            this.fetchedList.splice(keyIndex, 1);
        }

        // TODO Validations?

        var fetchedEarlier = false;

        // If it's not newly created, check the fetched list
        fetchedEarlier = this.fetchedList.some(item => (projectUniqueKey.username === item.username // TODO: Equals check?
            && projectUniqueKey.projectKey === item.projectKey));

        // Prepare the query
        let query = EntityQuery.from("Project");

        // Is authorized? No, then get only the public data, yes, then get include user's own records
        if (this.authService.currentUser.isAuthenticated()) {
            query = query.expand("User, ElementSet.ElementFieldSet.UserElementFieldSet, ElementSet.ElementItemSet.ElementCellSet.UserElementCellSet");
        } else {
            query = query.expand("User, ElementSet.ElementFieldSet, ElementSet.ElementItemSet.ElementCellSet");
        }

        const userNamePredicate = new Predicate("User.UserName", "eq", projectUniqueKey.username);
        const projectKeyPredicate = new Predicate("Key", "eq", projectUniqueKey.projectKey);

        query = query.where(userNamePredicate.and(projectKeyPredicate));

        // From server or local?
        if (!fetchedEarlier) {
            query = query.using(FetchStrategy.FromServer);
        } else {
            query = query.using(FetchStrategy.FromLocalCache);
        }

        return this.appEntityManager.executeQueryNew<Project>(query)
            .map(response => {

                // If there is no cmrp with this Id, return null
                if (response.results.length === 0) {
                    return null;
                }

                // Project
                var project = response.results[0];

                // Add the record into fetched list
                if (!fetchedEarlier) {
                    this.fetchedList.push(projectUniqueKey);
                }

                return project;
            });
    }

    hasChanges(): boolean {
        return this.appEntityManager.hasChanges();
    }

    rejectChanges(): void {
        this.appEntityManager.rejectChanges();
    }

    saveChanges(): Observable<void> {
        this.isBusyLocal = true;
        return this.authService.ensureAuthenticatedUser()
            .mergeMap(() => {
                return this.appEntityManager.saveChangesNew();
            })
            .finally(() => {
                this.isBusyLocal = false;
            });
    }

    // These "updateX" functions were defined in their related entities (user.js).
    // Only because they had to use createEntity() on dataService, it was moved to this service.
    // Try do handle them in a better way, maybe by using broadcast?
    updateElementCellDecimalValue(elementCell: ElementCell, value: number) {

        const userElementCell = elementCell.UserElementCellSet[0];

        if (!userElementCell) { // If there is no item, create it

            this.createUserElementCell(elementCell, value);

        } else { // If there is an item, update DecimalValue, but cannot be smaller than zero and cannot be bigger than 100

            userElementCell.DecimalValue = value;

        }

        this.elementCellDecimalValueUpdated$.emit(elementCell);
    }

    updateElementFieldIndexRating(elementField: ElementField, updateType: string) {

        switch (updateType) {
            case "increase":
            case "decrease": {

                const userElementField = elementField.UserElementFieldSet[0];

                // If there is no item, create it
                if (!userElementField) {

                    const rating = updateType === "increase" ? 55 : 45;
                    this.createUserElementField(elementField, rating);

                } else { // If there is an item, update Rating, but cannot be smaller than zero and cannot be bigger than 100

                    userElementField.Rating = updateType === "increase" ?
                        userElementField.Rating + 5 > 100 ? 100 : userElementField.Rating + 5 :
                        userElementField.Rating - 5 < 0 ? 0 : userElementField.Rating - 5;
                }

                break;
            }
            case "reset": {

                if (elementField.UserElementFieldSet[0]) {
                    elementField.UserElementFieldSet[0].Rating = 50;
                }

                break;
            }
        }
    }
}
