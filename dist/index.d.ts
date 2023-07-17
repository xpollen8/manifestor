export declare namespace manifestor {
    type Obj = {
        [key: string]: string | string[] | object | object[];
    };
    type ManifestDetails = {
        body?: string;
        source?: string;
        date?: string;
    };
    type ManifestDescription = {
        title?: string;
        summary?: string;
        date?: string;
        details?: ManifestDetails;
    };
    type ManifestHistory = ManifestDescription[];
    type ManifestEntry = ManifestDescription & {
        ordinal?: string | number;
        type?: string;
        json?: Obj;
        error?: string;
        name?: string;
        link?: string;
        length?: string;
        contents?: ManifestEntry[];
    };
    type Manifest = {
        root?: string;
        title?: string;
        description: ManifestDescription;
        contents: ManifestEntry[];
        history: ManifestHistory;
    };
}
declare function fetchManifest({ cache, root, recurse }: {
    cache?: boolean;
    root?: string;
    recurse?: boolean;
}): Promise<manifestor.Manifest>;
export default fetchManifest;
