/**
 * @author TAB_mk https://tab.moe <ghshare@tab.moe>
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
export default class Share {
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
  }

  /**
   * sites data for generating link
   * @return {Object}
   */
  get sites() {
    let list = {
      'vk': {
        'domain': 'http://vk.com/share.php?',
        'params': {
          'url': this.url,
          'title': this.title,
          'description': this.description,
        },
      },
      'fb': {
        'domain': 'http://www.facebook.com/sharer.php?',
        'params': {
          'u' : this.url,
        }
      },
      'tw': {
        'domain': 'http://twitter.com/share?',
        'params': {
          'text': this.description,
          'url': this.url,
        }
      },
      'ok': {
        'domain': 'https://connect.ok.ru/dk?',
        'params': {
          'url' : this.url,
        }
      },
    };

    return list;
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
      this.metrics.reachGoal(`${this.prefix}${name}`);
    }
    // open popup
    window.open(this.create(name), '', `width=${this.width},height=${this.height}`);
  }
}
