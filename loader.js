function Loader(url, lag){
	this.url = url;
	this.lag = lag;
}

Loader.prototype = {
	load: function(sort, page, size){
    var settings = {
      method: 'GET',
      dataType: 'json',
      traditional: true,
      url: this.url,
      data: $.extend({}, {
        sort: sort,
        page: page,
        size: size
      })
    };
    if(this.lag > 0){
      var deferred = new $.Deferred();
      setTimeout(function(settings){
        $.ajax(settings).done(function(data, textStatus, jqXHR){
          deferred.resolve(data, textStatus, jqXHR);
        }).fail(function(jqXHR, textStatus, errorThrown){
          deferred.rejectWith(this, jqXHR, textStatus, errorThrown);
        });
      }, this.lag, settings);
      return deferred.promise();
    }else{

      return $.ajax(settings);

    }
	}
}
