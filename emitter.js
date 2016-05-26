function Emitter(obj) {
  if (obj) {
    for (var key in Emitter.prototype)
      obj[key] = Emitter.prototype[key];
    return obj;
  }
}
Emitter.prototype = {
  addListener: function(event, fn){
    if(!this.hasListener(event, fn))
      ((this._callbacks = this._callbacks || {})['$' + event] || (this._callbacks['$' + event] = [])).push(fn);
    return this;
  },
  removeListener: function(event, fn){
    this._callbacks = this._callbacks || {};

    if (!arguments.length) {
      this._callbacks = {};
      return this;
    }

    var callbacks = this._callbacks['$' + event];
    if (callbacks && callbacks.length){
      if (arguments.length == 1)
        callbacks.length = 0;
      else {
        var index = callbacks.indexOf(fn);
        if (~index)
          callbacks.splice(index, 1);
      }
      
      if (!callbacks.length)
        delete this._callbacks['$' + event];
    }
    return this;
  },
  emit: function(event){
    this._callbacks = this._callbacks || {};
    var
      args = [].slice.call(arguments, 1),
      callbacks = this._callbacks['$' + event];

    if (callbacks)
      callbacks.slice().forEach(fn => fn.apply(this, args), this);
    
    return this;
  },
  getListeners: function(event){
    this._callbacks = this._callbacks || {};
    return this._callbacks['$' + event] || [];
  },
  hasListener: function(event, fn){
    switch(arguments.length){
      case 0: return !!(this._callbacks && Object.keys(this._callbacks).length);
      case 1: return !!(this._callbacks && this._callbacks[event]);
      case 2: return !!(this._callbacks && this._callbacks[event] && this._callbacks[event].some(x => x === fn));
    }
  }
};
