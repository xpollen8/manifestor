# Manifestor

The exported function.

```
import fetchManifest from 'manifestor';
import * as mfTypes from 'manifestor';

async function fetchManifest ({ cache = true, root = '', recurse = false }:
  {
    cache?: boolean,
    root?: string,
    recurse?: boolean
  }) : Promise<mfTypes.Manifest> {
}
```

Given a URL as `root`, `fetchManifest` will fetch the _manifest.json_ file from
that endpoint, and transform it into an array of ManifestEntry json objects.

If `recurse` is true, then `fetchManifest` will make recursive fetch calls to ll folder
URLs which are exposed by that folder's _manifest.json_ file.

In this way, a simple webserver can expose specific files via a clean API,
and allow arbitrary metadata to be tied to each file returned.

# But... why?

Suppose you are maintaining a collection media/files, that those files are
strewn all over your hard drive, and you'd like to share some of them with the world.  

You could host the files on a cloud service.  But you've probably just
duplicated your original file, lost important file creation timestamps (provenance), 
and *HOW* do you intend to attach and deliver
other metadata for those files in a consistent machine-readable manner>

The approach that _Manifestor_ takes is to deliver a _manifest.json_ file via a simple
 webserver.  If a _manifest.json_ file is found at the web endpoint, it will
list the contents of the folder that you wish to share.

You can describe those files and folders along with metadata: title,
description, provenance information, update history, etc.

Each item of type *folder* which is found in a _manifest.json_ can be recursively
fetched by `fetchManifest`.

The resulting data returned will be a JSON object
with each folder populated by recursive calls to `fetchManifest`.

# Example

Here's an example of a top-level _manifest.json_ file that is created by the band's
archivist and used to selectively gatekeep files.

```
{
  "title": "Digital assets for 700 West Recording",
  "description": {
    "summary": "Publicly available 700 West Recording digital assets.",
    "details": {
      "date": "2023-07-10",
      "source": "David Whittemore"
    }
  },
  "contents": {
    "boxes.csv": {
      "title": "Tapes",
      "date": "2023-07-05",
      "summary": "David's CSV file: digitization details of the 700 West Recording tapes. Includes tape condition, images, Mo's comments, more. This is the data that drives tapes.700west.com"
    },
    "singles_notes.csv": {
      "title": "Singles",
      "date": "?1992-XX-XX",
      "summary": "Mo's CSV file: details for released singles."
    },
    "interviews": { "type": "folder" },
    "audio/aliases.json": {
      "title": "Aliases",
      "date": "2023-07-11",
      "summary": "Mappings for digitized audio boxes to publicly-sharable names."
      }
    },
  "history": [
    {
      "date": "2023-07-08",
      "summary": "Initial checkin"
    }
  ]
}
```

If we make this call:

```
  const root = process.env.MANIFEST_SERVER;
  const manifest = await fetchManifest({ root, recurse: true });
```

The returned JSON will look something like this:

```
{
    "title": "Digital assets for 700 West Recording",
    "description": {
        "summary": "Publicly available 700 West Recording digital assets.",
        "details": {
            "body": "Click to open a folder, then to play/view media files - Enjoy",
            "date": "2023-07-10",
            "source": "David Whittemore"
        }
    },
    "contents": [
        {
            "name": "boxes.csv",
            "link": '' <----- URL of the file
            "title": "Tapes",
            "date": "2023-07-05",
            "summary": "David's CSV file: digitization details of the 700 West Recording tapes. Includes tape condition, images, Mo's comments, more. This is the data that drives tapes.700west.com",
            "type": "text/csv"
        },
        {
          name: 'audio/aliases.json',
          link: '' <----- URL of the file
          title: 'Aliases',
          date: '2023-07-11',
          summary: 'Mappings for digitized audio boxes to publicly-sharable names.',
          type: 'application/json',
          json: {} <------ THE CONTENTS OF 'audio/aliases.json'
        },
        {
            "name": "interviews",
            "link": '' <----- URL to this folder
            "type": "folder",
            "title": "Interviews",
            "description": {
                "summary": "A collection of interviews related to 700 West Recording or Maurice J. Whittemore Jr.",
                "date": "2023-07-08"
            },
            "contents": [
                "https://700west.com/audio/20190426_WFYI_Interview.mp3": {
                  "title": "'Cultural Manifesto' - Apr. 2019",
                  "name": "'Cultural Manifesto' - Apr. 2019",
                  "date": "2019-04-26",
                  "summary": "Kyle Long hourlong broadcast",
                  "length": "59:47",
                  "details": {
                    "body": "This week Kyle's guest is Moe Whittmore of 700 West Records. During the 1970s Moe recorded historically important funk, soul, and psychedelic rock music from his family's home in New Palestine, Indiana. We talk about a new compilation of his work titled 'Best of 700 West - Volume 2'.",
                    "source": "Kyle Long"
                    }
                  },
                  ......
              ],
          },
    .......
    ]
  }
```

Observe that the *interviews* folder that was described in the archivist's original _manifest.json_ file
has now been populated with the actual _interviews/manifest.json_ file via recursive calls.

# Important points

In the manifest.json file above, the items described in the *contents* object
can be files in the same folder as the _manifest.json_ file, can be *symlinks*
to (say) external drives, of even external URLs.  This enables one to logically group files
which may  be scattered across storage devices or URLs.  This is a powerful abstraction.

# Next moves

React components which rendfer *manifestor* JSON have been written and provide a nice data visualizer and a means to download files and play media.

Such components will likely appear as part of this repo

