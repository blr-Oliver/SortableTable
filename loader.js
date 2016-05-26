function Loader(url, lag) {
  this.url = url;
  this.lag = lag;
}

Loader.prototype = {
  load : function(sort, page, size) {
    var settings = {
      method : 'GET',
      dataType : 'json',
      traditional : true,
      url : this.url,
      data : $.extend({}, {
        sort : sort,
        page : page,
        size : size
      })
    };
    if (this.lag > 0) {
      var deferred = new $.Deferred();
      $.ajax(settings).then(this._delayedCall(deferred.resolve.bind(deferred), this.lag),
          this._delayedCall(deferred.reject.bind(deferred), this.lag),
          this._delayedCall(deferred.notify.bind(deferred), this.lag));
      return deferred.promise();
    } else
      return $.ajax(settings);
  },
  _delayedCall : function(callback, delay) {
    return setTimeout.bind(null, callback, delay);
  }
}
