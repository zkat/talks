# Slides + script

## Intro

### npm

<npm logo as contents of slide>

play.node() 2015

Get the slides! https://github.com/zkat/talks/blob/master/2015-11-play.node

Thank you so much for having me, and thank you very much to the organizers for their hard work in putting this together and getting you all in here.

This entire talk is available at the URL on this slide, along with the English transcript.

### Kat Marchán (1:00)

https://twitter.com/maybekatz/status/644254405718491136

Hi, everyone! My name Kat Marchán, and I'm an engineer on the npm CLI tool.

I take care of bugfixes and new features. I'm also the one maintaining the 2.x branch of npm.

On top of that, I represent my team on the Node Long Term Support Working Group.

And I'm here to talk about...

### What is `npm`? (1:00)

...well, npm! A lot of different stuff about npm!

By the way, there's npm buttons lying around. Please, help yourselves!

### What is `npm`? (#3)

<img: this thing!>

npm, as some of you might already know, is a tool included with node
installations.

When you're developing a Javascript application, it's used to install and manage
packages. So we call it the package manager for Javascript.

### What is `npm`? (#3)

<image of example packages>

So, usually, npm packages are things such as libraries that provide some small
piece of functionality, frameworks, command-line tools, or even resources for
your web application.

In the past, npm was mainly used by the node community to manage server-side
dependencies for their concurrent, high-performance server applications.

These days, npm is used by the entire Javascript community -- including desktop
application and frontend web developers.

### 200k+! (0:30)

<https://twitter.com/seldo/status/660200314562195456>

npm makes a LOT of code available to the community -- we recently crossed
200-thousand packages in our registry.

As far as I know, that makes us the single biggest language-specific package
manager in the world. That's more than all the modules in Perl's CPAN (150k),
all Ruby Gems (110k), or packages in Python's PyPI (68k).

That's a lot of packages!...

### Lots of downloads!

...And a lot of downloads.

You can probably imagine the sort of load this would put on servers, and how available the service would need to be.

### What is npm, Inc? (0:40)

Which is basically where npm, Inc comes in.

While the npm CLI tool is open source, and the registry is free to use for open
source projects, the npm registry, its infrastructure, and the website, are also
managed by my company, in service of the community.

We also have some for-pay products linked to the main registry, like private
packages, npm On-Site, and organizations, to help grow and sustain the company.

So if someone asks what our business model is?... I guess it's that.

### Who are the CLI Team? (1:30)

The CLI team is an interesting little corner of the company -- npm seems like a
regular old startup, for the most part...

...and then there's us.

You can think of us as the open source branch of npm, Inc: While we'll add
support for new registry features related to the business stuff, our main
purpose here is to serve the Javascript community and keep y'all happy.

We're a small team, too! While the whole of npm is a small company of about 26
people, only 3 of us are actually on the CLI team itself:

### Who are the CLI Team? (#2)

<Forrest Norvell (@othiym23) + pony pic>

Forrest is our team lead, product manager, and all-around Big Boss. You may have
seen his red pony avatar before on github or twitter.

### Who are the CLI Team? (#3)

<Rebecca Turner (@ReBeccaOrg) + ???pic>

Rebecca is our architect, and she was responsible for most of the work on npm 3. She's still the main one doing the latest 3.x releases.

### Who are the CLI Team? (#4)

<Kat Marchán (@maybekatz) + Gendo pic>

And that's me -- like I said before, 2.x release manager, LTS liaison, and just general dev.

### Who are the CLI Team? (#5)

<Stephanie Snopek (@StephSnopeks) and Ernie Salazar (@ehsalazar), + Stephanie and Ernie dot png>

There's two more folks I want to give a shout-out to: Stephanie and Ernie.

npm's support team isn't technically part of the CLI team, but they've been working on helping us, and you might see them pop up on twitter and github more. They're also the ones that respond if you email support@npmjs.com

They're lovely people and we all appreciate them a lot!

### Talk to us~ (0:30)

<@npmjs, support@npmjs.com, github.com/npm/npm>

We like interacting with the community! If you have issues or questions, feel
free to talk to us!

## Now! (time mark: 5:00)

### npm: The shiny new now (0:55)

<big 3>

So, now that we've got introductions out of the way, let's get to the meaty
stuff.

I'm gonna be talking about some of the recent changes to npm, specially those
that came along with npm@3.

There's a lot of good stuff in there, and a big part of it is meant to open the
doors for the future. I'll say more about that later in the talk.

npm@3 was a major change to npm, and was in development for about a year before
becoming our main release this past summer. The biggest changes had to do with
installation and the way dependencies are handled.

I'll go through them one by one. Shall we?

### The progress bar (0:35)

<gif of npm@3 progress bar>

First things first... this thing is probably the first thing any of you would've noticed, right? I mean, yeah. It's a progress bar. It looks nice, and it was a fun addition, but I figure it looked like a pretty big change, right?

It's funny because... while we were in beta? This thing here got a lot more attention than our other features for a while. Even now, it's one of the first things some folks mention to us.

This is a feature users have been requesting for a very long time. So when Isaac, our CEO, first started working on the CLI? Someone filed an issue asking for a nice progress bar.

Isaac was like “pshaw, should be easy enough”.

And well, we didn’t actually get one until Rebecca added it in npm@3.

### A note on semver

So before I keep going, let me take a step back and talk for a moment about semver. How many of you know what semver is? (raise hand)

So semver stands for Semantic Versioning. It's a method of figuring out what version numbers to use that tries to apply meaning to the actual numbers, rather than arbitrarily increasing them according to some vague rules.

The basic idea is that you have three main components of a version for your package: Major, Minor, and Patch.

### semver major

<v*1*.2.3>

Semver says major versions are defined as backwards-incompatible breaking changes. So, if your new release breaks any of your user's code, no matter how small the change is, it needs to be a major release.

### semver minor

<v1.*2*.3>
Minor releases are defined as adding new features without breaking old ones: So if you just add a new function to your API? That's a minor release.

### semver patch

<v1.2.*3*>

Finally, there's patch releases, which are anything that modifies existing functionality in a backwards-compatible way, without adding anything new. Patch releases tend to be things like bugfixes, tweaks to the documentation, configuration changes for your build, etcetera.

### semver all the things

<semver.org/lang/ko>

There's a bit more to it than that, but the bits here are all we'll need for this talk.

Why does this all matter? Because npm relies on you using semver correctly when you publish your packages. You can read the whole semver spec over at semver.org -- this link up on the slide has the spec in Korean.

### Flattened tree (2:20)

<npm dedupes by default now>

Now that we're primed on semver stuff, let's talk about a big use case for it, and one of the bigger features of npm@3: Flattened installs!

This is probably the other biggest change you may have noticed: npm installs
flat trees by default now.

This is basically like running `npm dedupe` every time you install.

This is a big change! For large projects especially, you'll have a lot less
nested stuff in your dependency tree. Large dependencies are much more likely to
get deduped now, which means your installations will be much smaller.

Some Windows users were having problems with really long paths -- this change
alone may have fixed it for a lot of you, if you ran into that particular bug.

### Flattened tree (#2)

<image of npm@2 tree>

So this is what your installs look like on npm@2: If you had multiple modules depending on the same package, you would just get duplicate installations inside the tree.

This is very important, because it prevents dependency hell, which is when you have multiple packages depending on incompatible versions. So if your library required a module, you would always get the one you declared in your package.json.

### Flattened tree (#3)

<image of npm@3 tree>

npm@3 changed the way this happened: We *still* guarantee that your dependencies will all be semver-compatible, but now we look at your dependency tree and see if we can bubble the duplicates up to the top.

So as you can see, we went from the deeply nested one...

### Flattened tree (#4)

Where we had multiple copies of A and B deep in the tree...

### Flattened tree (#5)

To a deduped one where we only have a single copy of the compatible dependencies. You'll notice the other package, I'll call it C, has two different incompatible versions? That's all we actually need to nest.

### Flattened tree (#3)

<`require('foo') !== require('foo')`>

This has some important side-effects: You still can't rely on the tree being
completely flat, and you still can't assume requiring the same name from two
modules will return the same object.

Yes, flattened trees are a big step towards making frontend developers' lives
better. They might also help reduce the size of your compiled projects if you're
using a build tool. But we're not quite there yet. We'll be doing other stuff
for that.

### peerDependencies (2:11)

<`"peerDependencies": {"grunt-cli": "5.0"}`>

The other breaking change in npm@3 was one we did for peerDependencies! It's actually a small but significant change in how peerDeps used to work.

Maybe you used them before, maybe you didn't... but the most important thing to
know now is `peerDependencies` doesn't cause anything to get installed anymore.
It just warns to remind you whether you're missing something, now.

So those of you using grunt or similar? You'll need to add them to your
`devDependencies` yourself now. And if you're a plugin author? You can't rely on
`peerDependencies` installing automatically for your users. Just keep that in
mind.

### peerDependencies (#2)

<`npm install hell`>

The reason for this change is simple: `peerDependencies` introduced dependency
hell into a tool that was designed from the beginning to avoid it.

The gist of it, and really the issue itself, is that your system shouldn't break
just because you have two dependencies requiring two different versions of the
same dependency. This is very important for npm to be able to promise you. It's
one of the things that really sets it apart from other package managers.

So, it turned out, we allowed that to happen by making `peerDependencies`
install by default.

With the new method, the feature is still there for the few use cases where
`peerDependencies` makes sense: things like CLI tools or frameworks with plugin
architectures, where the main tool is run separately and requires the plugins
itself.

If you were using `peerDependencies` in order to have have global singletons?
Just use a global singleton -- peerDeps is not and never was the solution to
that problem.

For those of you who don’t know what that singleton word means: It’s when you have a single, global instance of an object that needs to be unique across your application. It’s a common pattern, and it really is useful sometimes, but this is now how you should do them in npm.

So the long and the short of it is: npm wasn't doing its job, and we believe we've fixed it now. Sorry for the inconvenience.

### shrinkwrap (3:20)

<shrink wrapping vaccuum.png>

So who here has even heard of `npm shrinkwrap`? Could you raise your hands?

<pause, get a feel for it>

cool. <comment on %>

[most, Some, none, barely any, a few] of you have heard it, maybe used it. For
those of you who haven't, though: `npm shrinkwrap` lets you generate this
special file called `shrinkwrap.json` that sort of freezes all your dependencies
to specific versions -- even specific tarballs in the registry.

Now, semver is super-handy and you should totally use it most of the time.

In some cases, you need to actually lock down your dependencies so that `npm
install` always does exactly the same thing, even if there's new
semver-compatible versions.

In those cases, you use `shrinkwrap`.

This has totally been around for a while, too! This is not a new feature in and
of itself. What npm@3 did was make big changes to the feature to make it
super-useful in ways it wasn't before.

### shrinkwrap (#2)

<idempotent: adj. - does the same thing when you do it a lot>

It's really important for something like shrinkwrap that you actually get the
same thing if you run it twice. It doesn't matter if you run it on different
computers, or if you run it twice in the same one: you should always get the
same tree, in the end.

This didn't use to be the case with shrinkwrap, though: you would get different
results between the first and second time you ran it in the same repository.
That means that if you forgot to run it twice? Or you ran it on someone else's
computer? It wouldn't do what it was supposed to.

But that's fixed now! As of `npm@3`, you can rely on shrinkwrap to always be
idempotent. If you run `shrinkwrap` and commit `shrinkwrap.json`, everyone on
your team will have the exact same installed dependencies next time they `npm
install`

### shrinkwrap (#3)

<npm install --save
npm update --save
npm dedupe --save
npm uninstall --save>

Another welcome change is that now, if you update your package.json with the
`--save` flag, it'll automatically update your `shrinkwrap.json`. This means you
don't need to keep running `npm shrinkwrap` every time! Just use `--save` and
everything will be just fine.

### shrinkwrap (#4)

< http://www.usshrinkwrapinc.com/IMG00257-20110419-1337.jpg >

So to _wrap_ everything up here: Give shrinkwrap a shot! See if it serves your
needs. It's definitely a lot nicer than it used to be. There's some other
bugfixes for it in npm@3, but I think that's about it for shrinkwrap for now.

### phased installation (1:50)

<set phasers to stun! https://southpawbeagle.files.wordpress.com/2010/05/star-trek.jpg?w=500&h=375>

Let's take a step back for a moment. I want to mention one of the biggest
internal changes to npm.

Part of the big rearchitecting that Rebecca did was rewrite the code behind `npm
install` to make it happen in individual phases.

In npm@2, the installer would immediately start executing each installation step
for every package, one after the other. This means that some packages might be
getting written to their final destination even before some other packages were
done downloading!

This introduced all sorts of race conditions and strange errors. It also made it
really hard to fix the installer sometimes.

npm@3 changed that: now, the installer goes through different phases, and waits
until all packages in one phase are done before moving on to the next step.

You might not notice this, but it's important! It's helped make the installer
much easier for us to think and talk about. It also helped get rid of some types
of race conditions. At best, you might notice some of this if you pay close
enough attention to that shiny new progress bar. Or you might get nicer errors
that don't necessarily leave you in a mixed-up state, they way they used to.

Also speaking of mixed-up state? The installer is able to fix broken installs
now -- it crawls through your dependencies and makes sure everything is in its
proper place. If it's not, it _fixes it on the spot_. Pretty cool, huh?

### version lifecycle scripts (2:00)

```
"scripts": {
  "preversion": "npm test"
}
```

Turns out, there's now lifecycle scripts associated with `npm version`!

This is actually a pretty neat feature -- it means, for example, that you can
make your test suite run before you can bump the version on your project! You
can see an example of that right here.

So if you have that code in your `package.json`, and you run `npm version`, your
version will only get bumped if `npm test` succeeds. Otherwise, it'll back out
of the whole thing.

### version lifecyle scripts

```
  "postversion": "git push --follow-tags && npm publish"
```

Another idea could be to make your project do a git push and a publish every
time you successfully upgrade your version.

Lifecycle scripts in general are great! I've seen a lot more people use them on
their projects, instead of installing all of grunt or gulp for the sake of only
a couple of small commands. Give it a shot and see how you feel about it!

Don't worry, grunt, gulp, and broccoli are probably not going anywhere: they're
still great tools for more complex workflows. They might work better than npm
scripts even for simple things! So I'm not, like, trying to kill those tools,
here.

### Long Term Support (2:30)

<pyramids.png>

Before I move on to future features, I want to take a little time to talk about
LTS.

So LTS stands for "Long Term Support". A lot of different tools, especially
operating systems, have something called LTS, or something similar.

The general idea is to maintain a branch that users know they can commit to in
the long term. This is super-important for things like enterprise, because they
want to make sure the product they make is built on a platform that will
continue getting bugfixes and security patches. At the same time, they don't
want to have to worry about things changing too fast. Unstable APIs.

### Long Term Support (#2)

<https://entwickler.de/wp-content/uploads/2015/10/schedule.png>

In order to better serve this crowd, the Node Foundation set up a plan for
releasing and maintaining LTS releases. So now, whenever an LTS version is
released, it's guaranteed to be maintained for 30 whole months!

Regular stable releases still happen between every LTS release, but they're
maintained for a much shorter period.

What does this mean for npm users?

Well, we don't have our own LTS process. We're independent of node, but we're
also willing to help with its LTS efforts.

For this reason, we committed to ongoing support for the `2.x` branch of npm.
This means we'll keep landing security and other important patches into that
branch for as long as the node LTS is going on.

So people first installing node? they'll be getting 2.x for anything below
`node@5`. This includes the official LTS release, `node@4.2`. It also means node
0.12. Soon, 0.10 will also be upgraded from npm 1.x to 2.x.

In fact, 0.10 should start warning about the upcoming upgrade soon.

Basically, don't use npm 1.x. We really don't want to deal with it.

## Later! (time mark: 21:00)

### Into the future! (0:40)

< https://davidsgoals.files.wordpress.com/2014/07/ii__1362656850_back-to-the-future-car.gif>

LTS is a pretty good note to end that section of the talk, before we move on to
some other exciting stuff: the future of npm.

### Roadmap!

<https://github.com/npm/npm/wiki/Roadmap>

Turns out we have a pretty long roadmap ahead of us, and there's a ton of good
stuff in there. I'm going to focus on what I think the most exciting bits are.
If you want more details, go to this URL up here.

Forrest puts a lot of work into keeping it up to date with important stuff. It's
also really well organized, and has pretty much what our plans are for the
coming year or so.

### Frontend modules!

<Browser-tan>

Of all the things on the roadmap, I think the one I'm most excited about is this
one: better frontend support.

Now, we're still working on the design and details, but this is a top priority
for the coming year.

I talked earlier about how npm@3 is a great step towards supporting this. At the
same time, it's not enough: a lot of frontend modules expect to be globally
unique. On top of that, there's resources that don't include any javascript at
all -- things like templates, CSS, or even plain static resources like images
and other files.

### Frontend module support (#2)

<Choose your own adventure>

To support this, our current plan is to create a new directory, something other
than `node_modules`. We'll add an extra step to the npm lifecycle for a new type
of dependency: `browserDependencies`. These will have special semantics because
they'll be copied over from `node_modules` in such a way that they will end up
flat, or the process will fail.

Should a conflict arise where modules can't be flattened, we'll give users the
ability to pick which version will "win", and the other version will be ignored.
Unlike something like bower, though, this choice will be immediately recorded in
`package.json`, so the rest of the team doesn't run into the conflict, too.

The end result of all this will be a single directory with only flattened
modules. You would then be able to refer to the files in it directly, without
any ambiguity about where they will be located.

### Frontend module support (#3)

<???>

There's more to be done! This plan isn't anywhere near final. The thing we
actually implement may, in fact, be very very different from what I just
described. Keep an eye out in the coming year for news. If you have thoughts
about this in particular, please find me. I'd love to hear them.

### Organizations

<teens and orcs - http:/info.npmjs.com/test-orgs>
Soon, npm is releasing one of its newest products: Organizations.

You can think of organizations as something between private modules and npm Onsite. The general idea is that you can create an organization on the registry. Organizations, unlike regular users, is able to manage entire teams of people, and grant them read and write access to its packages.

This is great for small companies and organizations that need a bit more functionality than what private modules provide, but aren't quite ready for something self-hosted like Onsite: we still host Organization packages for you on the main registry. Private or otherwise.

### Join the beta!

The feature is already implemented in the CLI. It's also in beta! If you’re interested in trying it out and helping us test during out beta, check out the link on the slide.

### Better Windows Support

We're not very satisfied with the user experience on Windows, and we'd really
love to make it so much better. Improving that experience, and doing things that
cater more to our large and growing base of Windows user, is super-important to
us.

Turns out about 42% of our users actually install from Windows machines. They're
really nothing to scoff at!

A large part of our efforts at better Windows support right now turns out to be
just general bugfixing for platform-specific bugs. We'd like to do more, though:
better installers, more reliable upgrades, helping users with path issues. Even
possibly creating a Windows-specific GUI wrapper around npm are all things we're
doing or considering doing.

### Windows Support
This particular change will most likely not come overnight: We're putting a lot
of effort soon into making sure we get our test suite passing on Windows, just
to start. Once at that place, we'll be able to go on with more complex tasks.

And like I said before about frontend -- if you're a Windows user using node and
npm a lot, talk to me about it! We want to get a wide-enough perspective that we
can reasonably serve as many folks as possible.

### es6 modules

So the standards committee is working on a new module system for Javascript.

Covered in those standards is a new module system with interesting static semantics.

Officially, npm considers the es6 efforts to be the future of module system for the Javascript world.

We're very interested in seeing this new module system develop, and we want to do our best to support the community in adopting it and migrating over.

Unfortunately, it's still too early for us to act: the module loader isn’t standardised yet. Understanding how installation and loading should work for a system like this is critically important for us. Without that, we can only sit and wait, and continue paying attention to the conversation.

Someday, though, we’re sure we'll have full-fledged ES6 modules, whatever those end up looking like.


### World domination

<wombat pile.png>

That's it! it's an exciting time to be working on this stuff. I look forward to where things move in the future, and I hope you all enjoy using this tool that I have the privilege to work on. <bow>
