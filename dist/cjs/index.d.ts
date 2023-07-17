declare namespace manifestor {
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
declare const fetchManifest: ({ cache, root, recurse }: {
    cache?: boolean | undefined;
    root?: string | undefined;
    recurse?: boolean | undefined;
}) => Promise<manifestor.Manifest>;
export default fetchManifest;
