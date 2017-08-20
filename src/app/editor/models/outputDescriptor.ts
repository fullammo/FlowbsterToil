import { DistributionType } from "app/editor/models/distributionType";

export interface OutPutDescriptor {
    name: string,
    filter?: string,
    distribution?: DistributionType,
    targetname?: string,
    targetnode?: string,
    targetip?: string,
    targetport?: number,
    displayName?: string // this is a tweak to get the actual things later.
}
