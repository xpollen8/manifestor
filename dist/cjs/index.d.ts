import './index.d';
declare const fetchManifest: ({ cache, root, recurse }: {
    cache?: boolean | undefined;
    root?: string | undefined;
    recurse?: boolean | undefined;
}) => Promise<Manifest>;
export default fetchManifest;
