export type Obj = {
    [key: string]: string | string[] | object | object[];
};
export type ManifestDetails = {
    body?: string;
    source?: string;
    date?: string;
};
export type ManifestDescription = {
    title?: string;
    summary?: string;
    date?: string;
    details?: ManifestDetails;
};
export type ManifestHistory = ManifestDescription[];
export type ManifestEntry = ManifestDescription & {
    ordinal?: string | number;
    type?: string;
    error?: string;
    name?: string;
    link?: string;
    length?: string;
    contents?: ManifestEntry[];
};
export type Manifest = {
    root?: string;
    title?: string;
    description: ManifestDescription;
    contents: ManifestEntry[];
    history: ManifestHistory;
};
declare const fetchManifest: ({ cache, root, recurse }: {
    cache?: boolean | undefined;
    root?: string | undefined;
    recurse?: boolean | undefined;
}) => Promise<Manifest>;
export default fetchManifest;
