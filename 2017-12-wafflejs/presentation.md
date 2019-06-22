# ca**cache**
## 💩💵 but for your **data**

### Kat Marchán - 🥞**WaffleJS**🍩 Dec 2017

^ Hi! My name's Kat! I know a couple of you! It's been a while!

^ So, this talk is about a library. Yeah, one of those. It's the hot new thing and stuff. I'm doing JavaScript right, right?

^ The library is called cacache, and it's the shiny new content-addressable cache that sits beneath npm@5 and made a bunch of cool things possible. It's also a bit about the _concept_ of content-addressable caching and how to implement it, so... here we go?

---

## pre-**npm@5** cache 😱

* just `~/.npm/pkg/version/pkg-version.tar.gz` 🙃
* `npm i github:foo/bar bar` -> 💥
* `npm i JSONStream jsonstream` -> 💥
* big files/tarballs -> 💥
* HTTP cache headers -> 🤷🏽‍♀️
* Offline support -> 🤷🏽‍♀️

^ But first, let's talk a bit about what was -wrong- with the old cache.

^ Some of you may be familiar with it, if you ever looked in your .npm: it's a flat directory with package names and it had the tarballs for each package stored in that structure.

^ But it turns out... it was just by the strings for the package name and version.

^ So, if you switched registries? You could get the wrong data.

^ If you installed the git version of a package and also the registry version? Wrong data.

^ Try to run two versions of npm at a time? That's a YOLO and you might clobber data.

^ On Windows and OSX? If you tried to install the two versions of JSONStream, you would always get the first version you installed unless you manually removed the old version. Because of case normalization on the cache directories.

^ Maybe you wanted to use npm to install some huge assets package that you have on S3 or something? Nope, npm would implode because it tried to do everything in memory and often kept multiple copies of a thing.

^ And then if you wanted to use cache headers on your server to tell the client to cache more or less aggressively? Yeah no. What you get is what you get.

^ And if you wanted to install offline? Well. You could do the `--cache-min=999999` trick, but that wasn't really very good at all.

^ And... there's a few other things, and the truth is the cache was, when it was originally written, way better than what we had before that.

^ But this is what gets me... after **all of that**...

---

# LITERALLY
# **NO**
# SPEED GAIN
# 🤦🏼‍♀️

^ It didn't actually speed things up noticeably over a completely cold cache and downloading everything all over again every time. At least not on my test machines. I guess you'd gain a bit if you were on really really bad connections, but that was it, really.

---

# ca**cache**

* concurrency-safe 👯‍♂️👯
* fault/corruption-tolerant 💪🏼
* fully-verified on both `put` and `get` 🔏
* **streaming** support 🌊
* **sha512** support (and multi-algorithm support) 👩‍👩‍👧‍👦
* VERY VERY **FAST** 🏎
* **content-addressable** cache 📜

^ And so the team spent a long time talking about and thinking about what we wanted out of a cache instead. This whole rewrite had been on the drawing board for literally over a year before I started hacking on it.

^ In the end, we got cacache!

^ It's really concurrency-safe and uses no locks to do its work. You can throw a bunch of processes at it, and it won't care, both for reads and writes.

^ It's fault and corruption tolerant. If you get data from it, it'll be the correct data. That's an invariant.

^ And as far as that goes, that means that cacache verifies everything you insert into it, and everything you get out of it, by hash.

^ Oh, and as far as big files go? It can optionally stream data, so your multi-gigabyte cache files will work just fine!

^ It also sports not only sha512 support for its hashing algorithm, but it can safely host any number of different hash algorithms in the same cache, side-by-side!

^ And even with all this, it is very -very- fast. I think we're at 12x npm4 speeds with npm5 now, and a huge part of that is cacache itself.

^ It's also something called a "content-addressable cache"

---

## What's **content-addressable** caching?

* Key/value stores -> **user-defined** key
* **additional key** -> unique id for value (hash)
* **fast lookups** when content ID known
* automatic data **deduplication**
* easy to **verify**

^ Now, I've thrown this term around a couple of times now, and it's probably new to some of you. It was definitely new to me when I started writing this thing...

^ So, the stores we're used to tend to be key/value things. Think redis, or hash tables. Things like that. If you have the key, usually a string, you can get the value. These keys are defined by the user themself, when they insert data into the store.

^ Content-addressable caches can have this, but they add another dimension: You can get the data _based on its identity_. That is, usually a checksum of the data itself. If you know what _data_ you're getting, you don't even need to know the string key for it.

^ This means you can have really fast access, because you can go straight to the data in its storage location, without an index.

^ It also means that if you're writing another key, and the contents are already written into the cache, you can just reuse the old data.

^ And finally, since the content is organized based on the **hash** of the data, it's incredibly easy to reliably verify all its contents. You don't even really need to store metadata somewhere to do this.

---

## How does ca**cache** do it?

* Split between two parts: **index** and **content**
* **Index**: string key -> content address (hash of content)
* **Content**: filenames === content address

^ So how does cacache's own implementation work? Well, the cache is split into two parts:

^ The index is a directory of bucket files that hold the metadata for the cache. That's where the string keys are stored, and those keys tell you what the content address of the data is.

^ And once you have that content address, you go into the content directory, where the names can be inferred directly from the hashes you're working off of!

---

##  Index

* `_cacache/index-<version>/aa/bb/deadbeef`
* buckets are hashes of the key
* bucket:key -> 1:N
* append-only
* skip corrupted entries
* no locking

^ In the current version of cacache, the index looks like this: Inside the cache directory is an `index` directory with a version _of the index itself_ attached. That lets us upgrade the on-disk format later.

^ After that, we have a series of directories where the index buckets are stored. The buckets are similar to hash table buckets: They might store multiple different keys in a single bucket file, and the bucket files are named based on a hash of the string of the key itself.

^ Each bucket is append-only, too, so to change the content address for a key, or to add metadata, you just add another line. This is usually just fine, and cacache has a garbage collector that you can invoke to compress the buckets if things start growing a lot.

^ And so, I mentioned fault and corruption tolerance: If individual entries in these buckets get corrupted, due to some error, or some problem with your disk, or a race, the corrupted ones will simply be ignored. And this is fine, because it's a cache!

^ And all of this? It needs no locking. You can have as many processes or threads accessing the index at the same time, and it'll be just fine.

---

## Content

* `_cacache/content-<version>/<algorithm>/aa/bb/abad1dea`
* content with the same hash globally deduplicated
* can infer path on disk using hash
* atomic writes (content moved to dest in single operation)
* idempotent writes (data is identical, doesn't matter who wins)
* hash verified on **get** and **set**

^ Which brings us to the content directory. Again, you see that we have a version for the format, then the algorithm used for the stored data. And then you see the hex string thing again, which in this case is the hex hash for the content itself.

^ Two things to note here: the reason for splitting that hash by directories is that some tools and filesystems can choke really badly if they have too many files in a single flat directory. Doing things this was at least seriously limits how many files an individual directory has.

^ The other thing is that we're using specifically hex hashes. This is important because it makes the files on disk safe from case-normalizing quirks in different filesystems.

^ Now, since the path is the content, it means that if we have a string with the hash, we can go straight to the file and get our data! The identity is the address on disk!

^ Apart from that, we do atomic writes with a bit more ceremony for content, since it tends to be bigger.

^ But content is also guaranteed to be idempotent, so we exploit this property to say that it doesn't matter if two things try to write the same content at the same time: whoever moves the temp file to destination first wins, and if the other one overwrites it due to a race, that's fine and we'll still have the same data.

^ And again, we can verify everything we put in and everything we get out, because we just need to have the path of the file to know what its hash should be. That metadata doesn't need to go anywhere!

---

## Anatomy of a key lookup

* `cacache.get('my-cache', 'foo')`

^ Now, putting all of that together, this is what it looks like when you try and get something out of cacache:

^ In this case, we're using a local cache named `my-cache`, and the key we want to look up is `foo`.

---

## Anatomy of a key lookup

* `cacache.get('my-cache', 'foo')`
* -> hash key `foo` + look up in `_cacache/index`

^ So cacache hashes foo and looks up the bucket for that hash in the index directory...

---

## Anatomy of a key lookup

* `cacache.get('my-cache', 'foo')`
* -> hash key `foo` + look up in `_cacache/index`
* -> `{key: 'foo', integrity: 'sha1-D3Adbe3F==', ...}`

^ When it finds a bucket, it goes over each entry that matches that string key, and picks the last one in that bucket...

---

## Anatomy of a key lookup

* `cacache.get('my-cache', 'foo')`
* -> hash key `foo` + look up in `_cacache/index`
* -> `{key: 'foo', integrity: 'sha1-D3Adbe3F==', ...}`
* -> convert `D3Adbe3F==` to hex (from base64)

^ We grab the `integrity` string out of that entry, which is the hash of the content itself. Because cacache uses Subresource Integrity strings for its hashes, those are in base64 format, so we turn them into hex strings...

---

## Anatomy of a key lookup

* `cacache.get('my-cache', 'foo')`
* -> hash key `foo` + look up in `_cacache/index`
* -> `{key: 'foo', integrity: 'sha1-D3Adbe3F==', ...}`
* -> convert `D3Adbe3F==` to hex (from base64)
* -> hex hash is sha1 `abad1dea`

^ And now we take the algorithm for the integrity string, and the hex string to build a path...

---

## Anatomy of a key lookup

* `cacache.get('my-cache', 'foo')`
* -> hash key `foo` + look up in `_cacache/index`
* -> `{key: 'foo', integrity: 'sha1-D3Adbe3F==', ...}`
* -> convert `D3Adbe3F==` to hex (from base64)
* -> hex hash is sha1 `abad1dea`
* -> contentPath is `'my-cache/content-v2/sha1/ab/ad/1dea'`

^ So we know the content is going to be at this path, inside our cache!

---

## Anatomy of a key lookup

* `cacache.get('my-cache', 'foo')`
* -> hash key `foo` + look up in `_cacache/index`
* -> `{key: 'foo', integrity: 'sha1-D3Adbe3F==', ...}`
* -> convert `D3Adbe3F==` to hex (from base64)
* -> hex hash is sha1 `abad1dea`
* -> contentPath is `'my-cache/content-v2/sha1/ab/ad/1dea'`
* -> `verify(fs.readFile(contentPath), hash)` 📦

^ And finally, we read the file and verify its contents against the hash we just got, before returning it to the user.

^ Now... let's say that instead of a key, we want to do a content-address lookup and already have the hash of our data...

---

## **Content-address** Lookup

* `cacache.get.byDigest('my-cache', 'sha1-D3Adbe3F==')`
* -> ~~hash key `foo` + look up in `_cacache/index`~~
* -> ~~`{key: 'foo', integrity: 'sha1-D3Adbe3F==', ...}`~~
* -> convert `D3Adbe3F==` to hex (from base64)
* -> hex hash is sha1 `abad1dea`
* -> contentPath is `'my-cache/content-v2/sha1/ab/ad/1dea'`
* -> `verify(fs.readFile(contentPath), hash)` 📦

^ And that removes the index entirely from our get by calling the `byDigest()` function instead of get(). We only touch the filesystem once: to grab the file from it.

^ And that's the general idea behind content-addressable caches! The ability to do this is what sets them apart.

---

## ca**cache** in practice

* `make-fetch-happen`: spec-compliant http caching
* `pacote`/`npm@5`: direct, by-integrity cached tarball extraction
* `cadr`: (experimental) cache tarball contents individually

^ So, I just talked about a pretty low-level library kind of in isolation and I know we're all familiar with key/value fetching and it makes sense enough that you'd have an extra key and stuff.

^ But what's the actual benefit? How'd this used in practice?

---

## **make-fetch-happen**: http caching

* HTTP headers stored in cacache **metadata**
* Support `cache` option for `fetch` (`no-store`, `reload`, etc)
* Identical bodies (tarballs from different registries) **deduplicated**
* Cache settings tunable **server-side** with headers

^ make-fetch-happen is an implementation of the `window.fetch` API that can handle spec-compliant HTTP caching. You can inject arbitrary metadata into cacache index entries, so make-fetch-happen takes advantage of that to store the headers from the request, and some extra details it will need to do its thing.

^ Furthermore, it uses cacache's content deduplication to make sure that even if it makes requests for the same data from different servers or URLs, the body itself will be deduplicated when stored.

---

## **pacote** / **npm@5**: skip the ceremony

```
// package-lock.json
{
  "dependencies": {
    "foo": {
      "version": "1.2.3",
      "resolved": "https://registry.npmjs.org/foo/-/foo-1.2.3.tgz",
      "integrity": "sha1-deadbeef" <-- Content Address!
    }
  }
}
```

* Skip tree metadata checks and **extract directly** by content address
* Extracted data **guaranteed identical** for your whole team
* Protects from **corruption and attacks** on npm or private registry
* npm@5 parallelizes extractions across cores, safely

^ now, npm5 and pacote use make-fetch-happen under the hood, but they also use cacache directly.

^ Y'all may have noticed this `integrity` field that package-lock.json has? Yeah, that's a content address. npm has a whole special branch in its installer when a `package-lock.json` is present where it skips all the metadata lookups it would usually do, and goes straight to the extraction stage.

^ Another reason it's nice to have this in package-lock is that there is now a very strong guarantee that if you do a git pull, followed by an `npm install`, and that completes without error, the data inside your `node_modules/` will be exactly what was in the tarball! npm is currently the only JS package manager that includes this guarantee. If your cache gets corrupted, it'll even re-download the package for you automatically. When you're talking about reproducibility in CI, and across your team, these sorts of guarantees are pretty important.

^ Finally, because cacache is concurrency-safe, npm started extracting tarballs in different node processes, fully in parallel. And I didn't have to write any extra safety checks or locking code to pull that off. That was really easy, in fact.

---

## **cadr**: npm's future cache

* Download only **missing** files
* Automatic **deduplication** when updating package versions
* No more **untar/gunzip** during install
* Use **Copy-on-Write** when supported to **minimize disk usage**

^ Finally, I wanna bring up this project I'm working on called `cadr`.

^ `cadr` is a thin layer over cacache that allows it to cache entire directories, instead of individual tarball files.

^ We can then combine this new cache with new registry features to enable all sorts of cool things: for example, we can make it so instead of downloading tarballs, npm sends up a manifest of files it's missing, and the registry digs them up and only sends back the files the client needs, instead of entire tarballs. This would speed things up a lot, as the cache warms up and more files are globally deduplicated.

^ It also means that npm wouldn't need to extract tarballs on install -- and it would be able to do this -while still guaranteeing- the integrity of individual files!

^ And then, once more folks start using copy-on-write filesystems, it would mean that every time you `npm install`, your `node_modules` itself would be globally deduplicated at the level of individual files. And, unlike the hard linking method of centralized caching, a stray edit on one project won't automatically corrupt all other projects that reference that file. Isolation is a very important aspect of npm, and I wanna make sure we maintain that invariant going forward. Copy-on-write gets us the best of both worlds.

---

## Check **cacache** out: https://npm.im/cacache
## **@maybekatz** on Twitter 🐦
## **@zkat** on Github
