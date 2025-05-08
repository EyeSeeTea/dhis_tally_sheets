import { FeedbackOptions } from "@eyeseetea/feedback-component";

const rawStorageSource = import.meta.env.VITE_STORAGE_SOURCE;

export const storageSources = ["constants", "dataStore"] as const;
export const appConfig: AppConfig = {
    id: "hmis-tally-sheets",
    appearance: {
        showShareButton: false,
    },
    feedback: undefined,
    storage: storageSources.includes(rawStorageSource) ? rawStorageSource : "constants",
};

interface AppConfig {
    id: string;
    appearance: {
        showShareButton: boolean;
    };
    feedback?: FeedbackOptions;
    storage: StorageSource;
}

export type StorageSource = (typeof storageSources)[number];
