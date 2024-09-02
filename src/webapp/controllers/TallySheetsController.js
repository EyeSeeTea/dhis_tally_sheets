import { TallySheets } from "../TallySheets.js";
import { dhisUrl, compositionRoot } from "../app.js";

export const TallySheetsController = TallySheets.controller("TallySheetsController", [
    "$rootScope",
    "$scope",
    "$resource",
    "$timeout",
    "$translate",
    "DataSetsUID",
    "Locales",
    "DataSetEntryForm",
    "UserSettingsKeyUiLocale",
    "Storage",
    "CurrentUser",
    "UserGroups",
    function (
        $rootScope,
        $scope,
        $resource,
        $timeout,
        $translate,
        DataSetsUID,
        Locales,
        DataSetEntryForm,
        UserSettingsKeyUiLocale,
        Storage,
        CurrentUser,
        UserGroups
    ) {
        $scope.includeHeaders = true;
        $scope.datasets = [];
        $scope.selectedDatasets = [];
        $scope.availableLanguages = [];
        $scope.selectedLocales = [];
        $scope.progressbarDisplayed = false;
        $scope.selectorsLoaded = false;
        $scope.selectAllLangs = false;
        $scope.selectAllDatasets = false;
        $scope.removedSections = [];
        $scope.preferredLanguage = "en";
        $scope.isAdmin = false;

        Locales.get()
            .$promise.then(result => {
                $scope.languages = result;
            })
            .then(() => UserSettingsKeyUiLocale.get().$promise)
            .then(locale => {
                $scope.preferredLanguage = $scope.languages.map(({ locale }) => locale).includes(locale.response)
                    ? locale.response
                    : "en";
            });

        Storage.get()
            .$promise.then(result => {
                const constants = result.constants;
                if (constants && constants[0]?.code === "TALLY_SHEETS_STORAGE") {
                    try {
                        const storage = JSON.parse(constants[0].description);
                        return storage.administratorGroups && storage.administratorGroups.length > 0
                            ? storage.administratorGroups
                            : undefined;
                    } catch (e) {
                        $scope.isAdmin = true;
                        console.error(
                            "Unable to retrieve if the user is Admin. The TALLY_SHEETS_STORAGE description is not a valid JSON object.",
                            e
                        );
                    }
                }
            })
            .then(administratorGroups => {
                if (administratorGroups)
                    return UserGroups.get().$promise.then(result => {
                        const userGroups = result.userGroups;
                        return userGroups &&
                            userGroups.length > 0 &&
                            userGroups.some(group => administratorGroups.includes(group.id))
                            ? administratorGroups
                            : undefined;
                    });
                else $scope.isAdmin = true;
            })
            .then(administratorGroups => {
                if (administratorGroups)
                    CurrentUser.get().$promise.then(result => {
                        const userGroups = result.userGroups;
                        if (userGroups && userGroups.length > 0) {
                            $scope.isAdmin = userGroups.some(group => administratorGroups.includes(group.id));
                        }
                    });
                else $scope.isAdmin = true;
            });

        DataSetsUID.get().$promise.then(result => {
            $scope.datasets = result.dataSets.filter(
                dataset =>
                    !dataset.attributeValues.some(
                        att => att.attribute.name === "hideInTallySheet" && att.value === "true"
                    )
            );

            $scope.selectorsLoaded = true;
        });

        $rootScope.$on("$translateChangeSuccess", function () {
            $scope.healthFacility = $translate.instant("FACILITY");
            $scope.reportingPeriod = $translate.instant("PERIOD");
        });

        $scope.$on("ngRepeatFinished", function () {
            // Refresh bootstrap-select
            $(".selectpicker").selectpicker("refresh");
            $(".selectpicker").selectpicker("render");
            $scope.selectorsLoaded = true;
        });

        const datasetSelectorForm = document.getElementById("datasetSelectorForm");
        const languageSelectorForm = document.getElementById("languageSelectorForm");
        const inputSelectAllDatasets = document.getElementById("selectAllDatasets").nextElementSibling;

        $(datasetSelectorForm).on("change", () => {
            const formData = new FormData(datasetSelectorForm);
            const selectedIds = formData.getAll("dataset");
            updateSelectedDatasets(selectedIds);
        });

        //can't be on ng-click because updateSelectedDatasets uses $scope.apply
        $(inputSelectAllDatasets).on("change", () => {
            if ($scope.selectAllDatasets) updateSelectedDatasets();
            else $scope.clearForm();
        });

        $(languageSelectorForm).on("change", () => {
            const formData = new FormData(languageSelectorForm);
            const selectedLocales = formData.getAll("language");
            $scope.$apply(() => {
                $scope.selectedLocales = selectedLocales;
            });
        });

        $scope.clearForm = () => {
            $scope.availableLanguages = [];
            $scope.forms = [];
            $scope.selectedDatasets = [];
            $scope.progressbarDisplayed = false;
            $scope.selectorsLoaded = false;
            $scope.removedSections = [];
            $scope.selectAllDatasets = false;
            $scope.selectedLocales = [];

            _.first(datasetSelectorForm.getElementsByTagName("select")).value = "";
            _.first(languageSelectorForm.getElementsByTagName("select")).value = "";

            $timeout(() => {
                $(".selectpicker").selectpicker("refresh");
                $(".selectpicker").selectpicker("render");
            });

            $timeout(() => {
                //just for visuals
                $(".selectpicker").selectpicker("refresh");
                $(".selectpicker").selectpicker("render");
                $scope.selectorsLoaded = true;
            }, 200);
        };

        $scope.goHome = () => {
            window.location.replace(dhisUrl);
        };

        $scope.exportToTable = () => {
            $scope.exporting = true;
            const ids = $scope.selectedDatasets.map(({ id }) => id);
            const headers = $scope.forms.map(({ headers }) => headers);
            const realHeaders = $scope.includeHeaders
                ? headers
                : headers.map(header => ({
                      id: headers.id,
                      dataSetName: header.displayName,
                  }));

            $timeout(() => {
                $(".selectpicker").selectpicker("refresh");
                $(".selectpicker").selectpicker("render");
            }, 200);

            if (!_.isEmpty(ids))
                compositionRoot.exportToXlsx
                    .execute($resource, ids, realHeaders, $scope.selectedLocales, $scope.removedSections)
                    .then(() => {
                        $scope.exporting = false;
                        $timeout(() => {
                            $(".selectpicker").selectpicker("refresh");
                            $(".selectpicker").selectpicker("render");
                        }, 200);
                    });
        };

        //In case they toggle the selectAllLang switch after selecting the desired datasets
        $scope.updateLangs = () => {
            const formData = new FormData(datasetSelectorForm);
            const selectedIds = formData.getAll("dataset");
            const selectedDatasets = $scope.selectAllDatasets
                ? $scope.datasets
                : $scope.datasets.filter(dataset => selectedIds.includes(dataset.id));

            const availableLocales = _.uniq([
                ...selectedDatasets
                    .map(dataset =>
                        dataset.translations?.flatMap(translation =>
                            translation.property === "NAME" ? [translation.locale.split("_")[0]] : []
                        )
                    )
                    .flat(),
                "en",
            ]);

            if ($scope.selectAllLangs) $scope.selectedLocales = availableLocales;
            else {
                const formData = new FormData(languageSelectorForm);
                const selectedLocales = formData.getAll("language");
                $scope.selectedLocales = selectedLocales;
            }
        };

        function updateSelectedDatasets(selectedIds) {
            $scope.progressbarDisplayed = true;
            $scope.selectorsLoaded = false;

            const selectedDatasets = $scope.selectAllDatasets
                ? $scope.datasets
                : $scope.datasets.filter(dataset => selectedIds.includes(dataset.id));

            const availableLocales = _.uniq([
                ...selectedDatasets
                    .map(dataset =>
                        dataset.translations?.flatMap(translation =>
                            translation.property === "NAME" ? [translation.locale.split("_")[0]] : []
                        )
                    )
                    .flat(),
                "en",
            ]);

            const availableLanguages = $scope.languages.filter(lang => availableLocales?.includes(lang.locale));

            $scope.$apply(() => {
                $scope.selectedDatasets = selectedDatasets;
                $scope.availableLanguages = _.isEmpty(selectedDatasets) ? [] : availableLanguages;
                if (
                    $scope.selectedLocales.length === 0 &&
                    availableLocales?.includes($scope.preferredLanguage) &&
                    !_.isEmpty(selectedDatasets)
                ) {
                    $scope.selectedLocales = [$scope.preferredLanguage];
                }
                if ($scope.selectAllLangs) $scope.selectedLocales = availableLocales;
            });

            Promise.all(
                selectedDatasets.map(dataset =>
                    DataSetEntryForm.get({
                        dataSetId: dataset.id,
                    }).$promise.then(result => {
                        const codeHtml = result.codeHtml.replace(/id="tabs"/g, `id="tabs-${dataset.id}"`);

                        return {
                            dataset,
                            headers: {
                                id: dataset.id,
                                healthFacility: `${$scope.healthFacility}: `,
                                reportingPeriod: `${$scope.reportingPeriod}: `,
                                dataSetName: dataset.displayName,
                            },
                            output: codeHtml,
                        };
                    })
                )
            )
                .then(datasets => {
                    $scope.$apply(() => {
                        $("#datasetsForms").children().remove();
                        $scope.removedSections = [];
                        $scope.forms = datasets;
                        $scope.progressbarDisplayed = false;

                        $timeout(() => {
                            $(".selectpicker").selectpicker("refresh");
                            $(".selectpicker").selectpicker("render");
                        });

                        $timeout(() => {
                            //just for visuals
                            $scope.selectorsLoaded = true;
                        }, 200);
                    });
                })
                .catch(err => {
                    console.error(err);
                    $scope.progressbarDisplayed = false;
                    $scope.selectorsLoaded = true;

                    $timeout(() => {
                        $(".selectpicker").selectpicker("refresh");
                        $(".selectpicker").selectpicker("render");
                    });
                });
        }
    },
]);
