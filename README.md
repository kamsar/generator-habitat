# generator-habitat [![NPM version][npm-image]][npm-url]
> Yeoman generator for [Sitecore Habitat](https://github.com/Sitecore/Habitat)

## Installation

First, install [Yeoman](http://yeoman.io) and generator-habitat using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-habitat
```

## Installing Habitat

Prerequisite: Install a Sitecore instance with SIM. Use the version Habitat currently supports. You may use any hostname and path. You also need Git.

Then cd to where you want to install Habitat (make a new folder for your repository) and generate your new Habitat project from an **administrative** command prompt:

```bash
cd path\to\myNewHabitat
yo habitat
```
... then follow the prompts.

## Adding Features to Habitat

Execute in the root of your existing Habitat installation:

```bash
yo habitat:feature
```
...then follow the prompts.

## License

Apache-2.0


[npm-image]: https://badge.fury.io/js/generator-habitat.svg
[npm-url]: https://npmjs.org/package/generator-habitat