import { TallySheets } from "../TallySheets.js";

export const d2ProgressbarDirective = TallySheets.directive("d2Progressbar", function () {
    return {
        restrict: "E",
        templateUrl: "src/views/progressBarView.html",
    };
});
