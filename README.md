# Manifestor

The exported function.

```
async function fetchManifest ({ cache = true, root = '', recurse = false }:
  {
    cache?: boolean,
    root?: string,
    recurse?: boolean
  }) : Promise<manifestor.Manifest> {
}
```

Given a URL as `root`, `fetchManifest` will fetch the _manifest.json_ file from
that endpoint, and transform it into an array of ManifestEntry json objects.

If `recurse` is tru, then `fetchManifest` will make fetch calls to all
URL which are exposed by the _manifest.json_ file.

In this way, a simple webserver can expose specific files via a clean API,
allowing arbitrary metadata to be tied to each file returned.

# But... why?

Suppose you are maintaining datafiles for a band, and you'd liek to share
them with the world.  

Sure, you could host the files on a cloud service.  But you've probably just
duplicated your original file, and *HOW* do you intend to attach and deliver
metadata for those files in a consistent machine-readable manner.

The approach that _Manifestor_ takes is to assuse a simple webserver that
is capable of delivering .json files.  The top-most _manifest.json_ will
describe the contents of the directory, and allow you to describe the files
and directories within that level that would like to publish.

Each *directory*/*folder* that is found in a _manifest.json_ file can be recursively
fetched by `fetchManifest`.

The resulting .json data returned to you will be a single manifest.json file
with each leaf fully populated from data found by recursive calls to `fetchManifest`.

# Example

Here's an example of a top-level _manifest.json_ file:

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

Then _manifest_ will look something like this:

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
            "link": '' <----- URL to this directory
            "type": "folder",
            "title": "Interviews",
            "description": {
                "summary": "A collection of interviews related to 700 West Recording or Maurice J. Whittemore Jr.",
                "date": "2023-07-08"
            },
            "contents": [
                {
                    "name": "Dan Modlin Interview - Sep. 2010",
                    "link": '' <-------- EXTERNAL URL TO AUDIO
                    "title": "Dan Modlin Interview - Sep. 2010",
                    "date": "2010-09-XX",
                    "details": {
                        "body": "We were at Dan Modlin's home last Thursday in Bowling Green, KY) he gave me a CD of the '700 West interview' he did with me about a month ago.  A question-and-answer thing. He also did the same with Dave Scott, asking him about his 700 West rememberances. The whole thing will air on WKU (public radio station) soon. (Dan's the news director, there...)",
                        "source": "MJW Jr. email",
                        "date": "2010-10-09"
                    },
                    "type": "audio/mpeg"
                },
								......
						],
				},
	.......
	]
}
```

# Important Note

In the manifest.json file above, the items described in the *contents* object
can be files in the same directory as the _manifest.json_ file, can be *symlinks*
to (say) external drives, of even external URLs.

