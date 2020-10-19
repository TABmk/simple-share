## simple-share

Fast configurator for sharing to facebook, vkontakte, ok.ru, twitter + YA.metrika support

RU and EN description + JSDoc also available in share.js file

### Usage

- Add/import share.js file to your project
- Create new instance:
```
let share = new Share({/* options */});
```
- Use `.create` and `.open` methods

### Options
|Name|Type|Description|
|---|---|---|
|url|String|url to share|
|title|String|site title|
|image|String|image url|
|description|String |site description|
|metrics|Object|yandex metrics object (?)|
|prefix|String|prefix for metrics goal|

### Available social media names

`vk, fb, tw, ok`

### Methods
##### .create
You can use it to generate raw link as string w/o opening and metrics call

Example: `Share.create('vk')`
##### .open
Use it to generate link, open new window for share and call metrics.

Metrics works only if `metrics` option is passed

Example: `Share.open('vk')`

### YA.metrika support
You can use script in vanilla js, react, vue, etc.

But some modules in react or vue, for example, use different methods. So, you need edit [this line](https://github.com/TABmk/simple-share/blob/master/share.js#L166) if you want add support of your module.

##### VanillaJS
- Change to `this.metrics(55665566,'reachGoal','${this.prefix}${name}')`
- And pass `ym` to `metrics`
##### Vue + vue-yandex-metrika
- Just pass `this.$metrika` to `metrics`
##### React + vue-yandex-metrika
- Change to `this.metrics('reachGoal','${this.prefix}${name}')`
- And pass `ym` (your variable from `import ym from 'react-yandex-metrika';`) to `metrics`

### TODO
Add ability to pass costum metrics call function to options
