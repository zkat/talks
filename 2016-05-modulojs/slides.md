# bosquejo

## Introducción

* npm es una herramienta que usamos día a día
* bastante documentada (usa `npm help <comando>`)
* hay varios trucos para usuarios avanzados!
* `npm i -g npm`

## `npm init -y` y configuración

* primer paso con cualquier proyecto!
* `-y` acepta los defaults sin preguntarte -- simplemente crea tu
  `package.json`!
* puedes configurar tus defaults con `npm config set init-{author-name,author-email,license}`

## npm scripts y sub-utilidades

* uso básico de `npm run`
* Usando `gulp` y otras herramientas sin instalación global
* también existe un plugin para oh-my-zsh que hace
  `alias npmE='PATH="$(npm bin)":"$PATH"'`
  (o puedes añadir esto a tu .bashrc/.zshrc)
* `npm run build`
* `preversion` (`"preversion": "npm t"`)
* `npm run env`

## Manejando dependencias

### `npm outdated -l`

### `npm shrinkwrap`

* No usa el cache de npm (!)
* Garantiza que tu instalación sea replicable
* `npm install -S`/`npm rm -S`/etc alteran `npm-shrinkwrap.json` en `npm@3`
* No lo usen con `npm@2` porque está bien mal eso por ahí

### `bundledDependencies`

* Acelera instalaciones
* garantiza que dependencia con la que publicaste siga accesible (?)
* si instalas un paquete que usa `bundledDependencies`, sus dependencias no van
  a ser aplastadas durante la instalación

## Usando a npm offline

* `npm cache ls`
* `npm cache clear`
* Usando un paquete especial para calentar el cache
* `npm install --cache-min 999999`
* Mejor en el futuro:
  * https://github.com/npm/npm/issues/2568
  * https://github.com/npm/npm/pull/12084
