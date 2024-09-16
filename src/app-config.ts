import { FeedbackOptions } from "@eyeseetea/feedback-component";

export const appConfig: AppConfig = {
    id: "hmis-tally-sheets",
    appearance: {
        showShareButton: false,
    },
    feedback: {
        repositories: {
            clickUp: {
                // https://app.clickup.com/${workspace}/v/b/N-${listId}-M
                // Web development -> Common resources -> app-skeleton
                listId: "901204158366",
                title: "[User feedback] {title}",
                body: "## dhis2\n\nUsername: {username}\n\n{body}",
            },
        },
        layoutOptions: {
            buttonPosition: "bottom-end",
        },
    },
    storage: "constants",
};

export interface AppConfig {
    id: string;
    appearance: {
        showShareButton: boolean;
    };
    feedback?: FeedbackOptions;
    storage: "constants" | "dataStore";
}

export type StorageSource = AppConfig["storage"];
