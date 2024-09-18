import _ from "$/domain/entities/generic/Collection";
import { FutureData } from "$/data/api-futures";
import { MetadataResponse } from "@eyeseetea/d2-api/api";
import { Future } from "$/domain/entities/generic/Future";
import { Stats } from "$/domain/entities/generic/Stats";

export function getErrorFromResponse(res: MetadataResponse): string {
    console.debug(JSON.stringify(res, null, 4));

    return _(res.typeReports || [])
        .flatMap(typeReport => _(typeReport.objectReports) || [])
        .flatMap(objectReport => _(objectReport.errorReports) || [])
        .map(errorReport => errorReport.message)
        .compact()
        .uniq()
        .join("\n");
}

export function runMetadata(res$: FutureData<MetadataResponse>): FutureData<void> {
    return res$.flatMap(res =>
        res.status !== "OK"
            ? Future.error(new Error(getErrorFromResponse(res)))
            : Future.success(undefined)
    );
}

export function runMetadataWithStats(res$: FutureData<MetadataResponse>): FutureData<Stats> {
    return res$.flatMap(res =>
        res.status !== "OK"
            ? Future.error(new Error(getErrorFromResponse(res)))
            : Future.success(res.stats)
    );
}
