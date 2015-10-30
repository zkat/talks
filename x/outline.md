# presentation

* Talk to Rebecca about her talks!!
* Get the initial one ASAP!

## things to touch on

* Make a joke about maru-chan
* npm is, in fact, a company!
* We have a team!
* flat deps/dedupe
* phased install
* peerDependencies
* shrinkwrap
* Teens & Orcs
* npmO
* LTS and work w/ node ("why are we getting different releases of npm w/ node?")

* Tutorial stuff! (stuff on slides they can stuff into a console)
* between 20 and 40 slides
* no bullet points (at least first draft) -- ONE thing per slide
* show thing to raquel
* bring them up to speed with stuff that's new and changed in v3
* focus on framing things as pivots into the future (frontend, windows?)
* frontend modules! assets/! lifecycle scripts!
* es6 modules - it's a cluster, and we're keeping a close eye on it. Ideas? give
* what's coming should be maybe 1/5 of the content.

## Talk structure

### Get an outline done

* Get index cards and write shit on index cards
* words or ideas that capture what's going into the Talk
* put it into a big space that can be seen from afar
* Extract topics, figure out themes, categories
* Spit out a 3-act structure from that
* make a pile that can be a linear read
* turn that into an outline
* move it around until it can be written down
* Write the whole longhand version
* Record myself and watch it
* pay attention to transitions, where repetition happens
* Callbacks (references to prior information) is ok, but should happen
* Very rare that good talk is first draft
* Keep in mind that everyone is gonna be ESL + limited attention span

## Sectioned Summary

### Intro

#### Who am I?

#### What is `npm`?

#### What is npm, Inc?

#### Who are the CLI Team?

The CLI team is its own sort-of separate entity dedicate to the open source side
of npm. This of it as "npm OSS".

#### Liaisons to the npm .jp and .kr communities (.cn?)

@watilde, @yosuke_furukawa, @Outsideris

#### Welcome to the tracker!

Submit bugs! We'll talk to you! Submit PRs! We love those too! Specially docs!

#### Intro to talk topics

Hey, so we're gonna talk about new features, and what's gonna happen in the
future of npm.

### Now!

This section is for what's currently new in npm that users might not know about.

#### Flattened tree

npm dedupes by default now, planning out and finding the flattest
semver-compatible dependency tree and bubbling common dependencies up to the top
level.

Show code!

#### peerDependencies

Show code!

#### phased installation

Ask Rebecca to see if there's anything that can be showed about this, in re
errors or something, to see how it helps, other than it being an internal
architectural thing.

#### shrinkwrap

npm@3 updates package.json and shrinkwrap.json automatically now! shrinkwrap is
great! Use it!

Show code!

#### version lifecycle scripts

@watilde added this! You can add preversion and postversion lifecycle scripts

Show code! Run test suite during preversion!

#### LTS

node@4 LTS is out, and v0.10 and v0.12 are going to have npm@2 in them for the
remained of their support periods.

npm itself has no LTS, but we're supporting critical bugfixes and
registry-specific features for the sake of node LTS users.

Discussions ongoing about wtf is going to happen in re certain minor bumps
npm-side

### Later!

This section is about the future of npm.

#### Frontend module support

We're still working out the design and details, but frontend support is a top
priority for next year. npm@3 is a great first step in that direction, but not
enough -- npm is going to add support for enforced-flat dependencies in a
separate directory than `node_modules`, with safe, consistent conflict
resolution. Static resources aren't necessarily javascript modules, either, so
we'll add features to support their use better, too.

TODO: What features are we adding specific to static resources?...

#### Teens + Orcs

Orgs are in closed beta! You can pay to create organization users that can add teams with permissions and stuff.

#### es6 modules

We're waiting for es6 module loading to be standardised before committing but we
may try to help push things along somehow -- we consider es6 modules the future
and want to help the community switch over when it's time.

#### world domination

obvious

## Slides

### Title

###
