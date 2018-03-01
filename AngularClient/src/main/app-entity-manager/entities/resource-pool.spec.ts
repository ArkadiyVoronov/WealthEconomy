import { RatingMode } from "./resource-pool";
import { TestHelpers } from "./test-helpers";

describe("main/app-entity-manager/entities/resource-pool", () => {

    it("Key: if not set, should be equal to Name", () => {

        var project = TestHelpers.createResourcePool();

        project.Name = "name";

        expect(project.Key).toBe("name");
    });

    it("Key: if set, should stay as it is", () => {

        var project = TestHelpers.createResourcePool();

        project.Key = "key";
        project.Name = "name";

        expect(project.Key).toBe("key");
    });

    it("toggleRatingMode: RatingMode should be 'All Users' after first call", () => {

        var project = TestHelpers.createResourcePool();

        project.toggleRatingMode();

        expect(project.RatingMode).toBe(RatingMode.AllUsers);
    });

    it("toggleRatingMode: RatingMode should be 'Current User' after second call", () => {

        var project = TestHelpers.createResourcePool();

        project.toggleRatingMode();
        project.toggleRatingMode();

        expect(project.RatingMode).toBe(RatingMode.CurrentUser);
    });
});
