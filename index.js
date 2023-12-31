import mime from 'mime';
export const guessContentType = (filename) => {
    const ext = String(filename?.split('.').pop());
    const mt = mime.getType(ext);
    return mt;
};
export default async function fetchManifest({ cache = true, root = '', recurse = false }) {
    const manifest = await fetch(`${root}/manifest.json`, { cache: (cache) ? 'default' : 'no-store' })
        .then(res => res.json())
        .catch(err => { return { error: 'MISSING_MANIFEST' }; });
    /*
        convert contents which is an object in the fetched data
        into an array
     */
    const new_manifest = { ...manifest };
    new_manifest.root = root; // add new entry
    new_manifest.contents = []; // replace .contents
    manifest?.contents && await Promise.all(Object.keys(manifest?.contents)?.map(async (key) => {
        const entry = manifest?.contents[key];
        const externalLink = key.includes('https://');
        let commonContents = { name: entry?.name || key, link: (externalLink) ? key : `${root}/${key}` };
        let contents = {};
        if (entry?.type === 'folder' && recurse) {
            // fetch manifest for folder
            contents = { type: 'folder', ...await fetchManifest({ cache, root: `${root}/${key}`, recurse }) };
        }
        else if (key.includes('.json')) {
            // fetch a json file
            const body = await fetch(`${root}/${key}`, { cache: (cache) ? 'default' : 'no-store' })
                .then(res => res.json())
                .catch(err => { return { error: 'MISSING_MANIFEST' }; });
            contents = { ...entry, type: entry.type || guessContentType(key) || 'application/octet-stream', json: { ...body } };
        }
        else {
            // else just add this entry
            contents = { ...entry, type: entry.type || guessContentType(key) || 'application/octet-stream' };
        }
        new_manifest.contents.push({ ...commonContents, ...contents });
    }));
    // sort entries - ideally w/errors on bottom below directories
    new_manifest.contents = new_manifest.contents.sort((a, b) => {
        const name1 = String(a.title || a.name);
        const name2 = String(a.title || b.name);
        //if (name1 === name2) {
        //console.log("COMP", { a, b });
        //if (a?.error && b?.error) return  ('' + name1).localeCompare(name2)
        //if (a?.contents?.length && b?.contents?.length)  ('' + name1).localeCompare(name2)
        //}
        return ('' + name1).localeCompare(name2);
    });
    return new_manifest;
}
