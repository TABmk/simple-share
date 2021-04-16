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
|Name|Type|Description|Default|
|---|---|---|---|
|url|String|url to share|
|title|String|site title|
|image|String|image url|
|description|String |site description|
|metrics|Object|yandex metrics object (?)|
|prefix|String|prefix for metrics goal|'share_'|
|width|Number|popup width|600
|height|Number|popup height|600
|isCanvas|Boolean|Set to true, if your game (based on canvas) can't open links|false|
|mode|String|'\_blank' or '', also can take any [windowName](https://developer.mozilla.org/en-US/docs/Web/API/Window/open#parameters) value|''|
|library|String|Read below|'vanilla'|
|id|Number|if 'vanilla' choosen, pass metrics id||

### Available library values

`vanilla, vue, react`

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

##### vanilla
- Set 'vanilla' mode
- Pass `ym` to `metrics`
- Function: ``` this.metrics(thid.id,'reachGoal',`${this.prefix}${name}`) ```
##### Vue + vue-yandex-metrika
- Set 'vue' mode
- Pass `this.$metrika` to `metrics`
- Function: ``` this.metrics.reachGoal(`${this.prefix}${name}`) ```
##### React + react-yandex-metrika
- Set 'react' mode
- Pass `ym` (your variable from `import ym from 'react-yandex-metrika';`) to `metrics`
- Function: ``` this.metrics('reachGoal','${this.prefix}${name}') ```
