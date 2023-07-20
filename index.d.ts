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
    json?: Obj;
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
export declare const guessContentType: (filename: string) => string | null;
export default function fetchManifest({ cache, root, recurse }: {
    cache?: boolean;
    root?: string;
    recurse?: boolean;
}): Promise<Manifest>;
