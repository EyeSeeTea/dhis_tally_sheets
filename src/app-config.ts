import { FeedbackOptions } from "@eyeseetea/feedback-component";

export const appConfig: AppConfig = {
    id: "hmis-tally-sheets",
    appearance: {
        showShareButton: false,
    },
    feedback: undefined,
    storage: "constants",
};

interface AppConfig {
    id: string;
    appearance: {
        showShareButton: boolean;
    };
    feedback?: FeedbackOptions;
    storage: "constants" | "dataStore";
}

export type StorageSource = AppConfig["storage"];
