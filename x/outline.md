# Sectioned Summary

## Intro

### Who am I?

Kat Marchán

Not まるちゃんキャット (http://www.theinertia.com/wp-content/uploads/2010/10/maru-cat-barrel-625.jpg)

Not マルちゃんキャット (http://blogimg.goo.ne.jp/user_image/49/cb/ee972bdb009f477ae63c1c4ca00c31f3.jpg)

マルチャンキャット! (https://twitter.com/maybekatz/status/644254405718491136)

CLI Engineer on npm. I'm the main person in charge of 2.x releases recently.
Also the npm liaison to the Node LTS WG.

### What is `npm`?

The package manager for javascript!

If you have ever used node, it's the CLI tool included with your installation.
It is used to install dependencies when developing new JavaScript libraries and
applications.

Did you know there's 200k+ modules now?
https://twitter.com/seldo/status/660200314562195456

### What is npm, Inc?

npm is open source, and contributors participate actively in the node community,
but it's developed by a completely separate entity: npm, Inc.

This company is in charge of developing and maintaining both the npm CLI
and the various online services related to it (website, registry).

### Who are the CLI Team?

The CLI team is its own sort-of separate entity dedicate to the open source side
of npm. This of it as "npm OSS".

* Forrest Norvell (@othiym23) - Product Manager, Big Boss
* Rebecca Turner (@ReBeccaOrg) - 3.x release manager and lead npm@3 developer
* Kat Marchán (@maybekatz) - 2.x release manager, LTS liaison, general dev

### Liaisons to the npm .jp and .kr communities (.cn?)

@watilde, @yosuke_furukawa, @Outsideris

### Welcome to the tracker!

Submit bugs! We'll talk to you! Submit PRs! We love those too! Specially docs!

### Intro to talk topics

Hey, so we're gonna talk about new features, and what's gonna happen in the
future of npm.

## Now!

This section is for what's currently new in npm that users might not know about.

### Flattened tree

npm dedupes by default now, planning out and finding the flattest
semver-compatible dependency tree and bubbling common dependencies up to the top
level.

Show code!

### peerDependencies

Show code!

### phased installation

Ask Rebecca to see if there's anything that can be showed about this, in re
errors or something, to see how it helps, other than it being an internal
architectural thing.

### shrinkwrap

npm@3 updates package.json and shrinkwrap.json automatically now! shrinkwrap is
great! Use it!

Show code!

### version lifecycle scripts

@watilde added this! You can add preversion and postversion lifecycle scripts

Show code! Run test suite during preversion!

### LTS

node@4 LTS is out, and v0.10 and v0.12 are going to have npm@2 in them for the
remained of their support periods.

npm itself has no LTS, but we're supporting critical bugfixes and
registry-specific features for the sake of node LTS users.

Discussions ongoing about wtf is going to happen in re certain minor bumps
npm-side

## Later!

This section is about the future of npm.

### Frontend module support

We're still working out the design and details, but frontend support is a top
priority for next year. npm@3 is a great first step in that direction, but not
enough -- npm is going to add support for enforced-flat dependencies in a
separate directory than `node_modules`, with safe, consistent conflict
resolution. Static resources aren't necessarily javascript modules, either, so
we'll add features to support their use better, too.

TODO: What features are we adding specific to static resources?...

### Teens + Orcs

Orgs are in closed beta! You can pay to create organization users that can add teams with permissions and stuff.

### es6 modules

We're waiting for es6 module loading to be standardised before committing but we
may try to help push things along somehow -- we consider es6 modules the future
and want to help the community switch over when it's time.

### world domination

obvious
