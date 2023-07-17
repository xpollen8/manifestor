"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import './index.d';
const mime_1 = __importDefault(require("mime"));
const guessContentType = (filename) => {
    const ext = String(filename === null || filename === void 0 ? void 0 : filename.split('.').pop());
    const mt = mime_1.default.getType(ext);
    return mt;
};
const fetchManifest = ({ cache = true, root = '', recurse = false }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const manifest = yield fetch(`${root}/manifest.json`, { cache: (cache) ? 'default' : 'no-store' })
        .then(res => res.json())
        .catch(err => { return { error: 'MISSING_MANIFEST' }; });
    /*
        convert contents which is an object in the fetched data
        into an array
     */
    const new_manifest = Object.assign({}, manifest);
    new_manifest.root = root; // add new entry
    new_manifest.contents = []; // replace .contents
    (manifest === null || manifest === void 0 ? void 0 : manifest.contents) && (yield Promise.all((_a = Object.keys(manifest === null || manifest === void 0 ? void 0 : manifest.contents)) === null || _a === void 0 ? void 0 : _a.map((key) => __awaiter(void 0, void 0, void 0, function* () {
        const entry = manifest === null || manifest === void 0 ? void 0 : manifest.contents[key];
        const externalLink = key.includes('https://');
        let commonContents = { name: key, link: (externalLink) ? key : `${root}/${key}` };
        let contents = {};
        if ((entry === null || entry === void 0 ? void 0 : entry.type) === 'folder' && recurse) {
            // fetch manifest for folder
            contents = Object.assign({ type: 'folder' }, yield fetchManifest({ cache, root: `${root}/${key}`, recurse }));
        }
        else if (key.includes('.json')) {
            // fetch a json file
            const body = yield fetch(`${root}/${key}`, { cache: (cache) ? 'default' : 'no-store' })
                .then(res => res.json())
                .catch(err => { return { error: 'MISSING_MANIFEST' }; });
            contents = Object.assign(Object.assign({}, entry), { type: entry.type || guessContentType(key) || 'application/octet-stream', json: Object.assign({}, body) });
        }
        else {
            // else just add this entry
            contents = Object.assign(Object.assign({}, entry), { type: entry.type || guessContentType(key) || 'application/octet-stream' });
        }
        new_manifest.contents.push(Object.assign(Object.assign({}, commonContents), contents));
    }))));
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
});
exports.default = fetchManifest;
