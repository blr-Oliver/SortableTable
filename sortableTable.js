function SortableTable(data, root, config){
  this.data = data;
  this.root = $(root);
  this.config = $.extend(true, {}, config);
  this.view = {
    sort: null
  };
  this.render();
}

SortableTable.prototype = {
  render: function(){
    this.root.html('<tbody></tbody>');
    var tbody = this.root.find('tbody');
    var tr = $('<tr>').appendTo(tbody);
    this.renderHeaders(tr);
    this.renderBody(tbody);
  },
  renderHeaders: function(tr){
    
  },
  renderBody: function(tbody){
    
  },
  applySort: function(e){
    var field = e.currentTarget.getAttribute('data-field');
    if(this.view.sort && this.view.sort.substr(1) == field)
      this.view.sort = (this.view.sort[0] === '+' ? '-' : '+') + field;
    else
      this.view.sort = '+' + field;
    this.sortByField(this.view.sort);
    this.render();
  },
  sortByField: function(a, sort){
    if (typeof(sort) === 'string') return this.sortByField(a, [sort]);
    sort = sort.map(key => {
      asc: key[0] !== '-',
      key: (key[0] === '+' || key[0] === '-') ? key.substr(1) : key
    });
    var getField = this.getField;
    return a.sort(function(a, b) {
      for (var i = 0; i < sort.length; ++i) {
        var valueA = getField(a, sort[i].key), valueB = getField(b, sort[i].key);
        if (valueA != valueB) return (valueA < valueB ^ sort[i].asc) ? 1 : -1;
      }
      return 0;
    });
  },
  getField: function(obj, field){
    if(typeof(field) === 'function') return field(obj);
    if(typeof(field) === 'string') field = field.split(/\./);
    return field.reduce((obj, prop) => (obj||undefined) && obj[prop], obj);
  }
}
