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
declare function fetchManifest({ cache, root, recurse }: {
    cache?: boolean;
    root?: string;
    recurse?: boolean;
}): Promise<Manifest>;
export { fetchManifest, Obj, ManifestDetails, ManifestDescription, ManifestHistory, ManifestEntry, Manifest, };
declare const _default: {
    fetchManifest: typeof fetchManifest;
};
export default _default;
