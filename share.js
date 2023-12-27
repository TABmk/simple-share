/**
 * @author TAB_mk https://tab.mk <tabmk.contact@gmail.com>
 * @file Usage:
 *
 * let share = new Share({
 *   url: '',
 *   title: '',
 *   image: '',
 *   description: '',
 *   prefix: '',
 *   metrics: yaCounter56173735
 * });
 *
 * share.create('vk');
 * share.open('vk');
 *
 * =================================
 *
 * Создается экземпляр класса Share:
 *
 * let share = new Share();
 *
 * И нужно передать объект (пример выше):
 * url - ссылка
 * title - заголовок
 * image - ссылка на картинку (для вк)
 * description - описание (отображается ниже заголовка)
 * prefix - ⚠️ Необязательный парамерт (указывать только если нужно).
 *             Нужен для изменения названия метрики.
 *             По умолчанию 'share_' и потом дополнится названием сети.
 * metrics - ⚠️ Объект яндекс метрики, если нужно включать ее.
 *              Именно та переменая от я.метрики (yaCounter56173735 например)
 * isCanvas - Нужно ли включить фикс для игр, которые испольщуют canvas.
 *            Если не открываются ссылки по клику, то можно включить это.
 * mode - '_blank' для новой вкладки или '' для нового окна. По умолчанию -- ''
 *        Можно передать любое значение 'windowName' https://developer.mozilla.org/en-US/docs/Web/API/Window/open#parameters
 * library - ⚠️ Доступные значения:
 *              'vanilla' = this.metrics(55665566,'reachGoal',`${this.prefix}${name}`)
 *              'vue' = this.metrics.reachGoal(`${this.prefix}${name}`); (vue-yandex-metrika)
 *              'react' = this.metrics('reachGoal','${this.prefix}${name}'); (react-yandex-metrika)
 *              По умолчанию -- vanilla (нужно так же передать id)
 * id - если library = vanilla, то нужно передать это значение           
 *
 * Полный пример:
 * let share = new Share({
 *   url: 'https://aaaaa.team',
 *   title: 'Пикчер',
 *   image: '',
 *   description: 'это сайт пикчера',
 *   metrics: yaCounter56173735
 * });
 *
 * После этого можно использовать 2 метода:
 * share.create('vk');
 * share.open('vk');
 *
 * .create - Просто создает ссылку (доп функционал)
 *
 * .open - Открывает окно со ссылкой и отправляет метрику
 *         Пример: onclick="share.open('vk')"
 *
 * Доступные соц. сети: vk, fb, tw, ok
 */

/**
 * Share link in social media
 */
class Share {
  /**
   * Only one object is passing to constructor
   * Params:
   *        url         {String} url to share
   *        title       {String} site title
   *        image       {String} image url
   *        description {String} site description
   *        metrics     {Object} yandex metrics object (?)
   *        prefix      {String} prefix for metrics goal
   * @param {Object} params
   */
  constructor(params) {
    // assign params to context
    Object.assign(this, params);
    // set default prefix if not passed.
    // Prefix for metrics goal prefix+name (ex. share_vk)
    this.prefix = params.prefix || 'share_';
    // popup params
    this.width = 600;
    this.height = 600;
    // default value for canvas fix
    this.isCanvas = params.isCanvas || false;
    // default value for window open mode
    this.mode = params.mode || '';
    // library
    this.library = params.library || 'vanilla';
  }

  /**
   * sites data for generating link
   * @return {Object}
   */
  get sites() {
    let list = {
      'vk': {
        'domain': 'https://vk.com/share.php?',
        'params': {
          'url': this.url,
          'title': this.title,
          'description': this.description,
        },
      },
      'fb': {
        'domain': 'https://www.facebook.com/sharer.php?',
        'params': {
          'u' : this.url,
        }
      },
      'tw': {
        'domain': 'https://twitter.com/share?',
        'params': {
          'text': this.description,
          'url': this.url,
        }
      },
      'ok': {
        'domain': 'https://connect.ok.ru/offer?',
        'params': {
          'url' : this.url,
          'title' : this.title,
          'imageUrl' : this.image,
        }
      },
      'tg': {
        'domain': 'https://telegram.me/share/url?',
        'params': {
          'url' : this.url,
          'text' : this.title,
        }
      },
    };

    return list;
  }

  reachGoal(name) {
    switch (this.library) {
      case 'vanilla':
        this.metrics(this.id, 'reachGoal', `${this.prefix}${name}`);
        break;
      case 'vue':
        this.metrics.reachGoal(`${this.prefix}${name}`);
        break;
      case 'react':
        this.metrics('reachGoal', `${this.prefix}${name}`);
        break;
    }
  }

  /**
   * check if data for this site available
   * @param  {String} name site short name
   * @return {Object}      object with site data
   */
  check(name) {
    let site = this.sites[name];

    if (!site || typeof site === 'undefined') {
      throw new Error(`Wrong site (${name}). Available: ${Object.keys(this.sites).join(',')}`);
    }

    if (this.library === 'vanilla' && !this.id) {
      throw new Error(`Choosen 'vanilla', please pass 'id'`);
    }

    const libs = ['vanilla', 'vue', 'react'];
    
    if (!libs.includes(this.library)) {
      throw new Error(`Wrong library (${this.library}. Available: ${Object.keys(libs).join(',')})`);
    }

    return site;
  }

  /**
   * generating final share link
   * you can use it like Share.create('vk')
   * ⚠️ it only generate link, no metrics call
   * @param  {String} name site short name
   * @return {String}      final share link
   */
  create(name) {
    // check if valid site passed first
    let site = this.check(name);

    // generate params from object
    let params = Object.entries(site.params)
      .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
      .join('&');

    // join domain and params
    let shareLink = `${site.domain}${params}`;

    return shareLink;
  }

  /**
   * open share link in popup and call metrics
   * @param  {String} name site short name
   */
  open(name) {
    // check if valid site passed first
    this.check(name);

    // call metrics if ya.metrics object(?) passed
    if (this.metrics) {
      this.reachGoal(name);
    }
    // open popup
    if (this.isCanvas) {
      function OpenURL (url) {
        let gameCanvas = document.getElementsByTagName('canvas')[0];

        if (gameCanvas !== null)  {
          let endInteractFunction = function() {
            window.open(url, this.mode, this.mode === '' ? `width=${this.width},height=${this.height}` : '');
            gameCanvas.onmouseup = null;
            gameCanvas.ontouchend = null;
          }

          gameCanvas.ontouchend = endInteractFunction;
          gameCanvas.onmouseup = endInteractFunction;
        }
      }
      
      OpenURL(this.create(name));
    } else {
      window.open(this.create(name), this.mode, this.mode === '' ? `width=${this.width},height=${this.height}` : '');
    }
  }
}
