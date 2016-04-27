function SortableTable(root, data, config){
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
    var fields = this.config.fields;
    var captions = this.config.captions;
    for(var i = 0; i < fields.length; ++i)
      $('<th>').text(captions[i]).attr('data-field', fields[i]).appendTo(tr);
    tr.children('th').addClass('sortable');
    tr.children('th.sortable').click(this.applySort.bind(this));
  },
  renderBody: function(tbody){
    tbody.children('tr:gt(0)').remove();
    var fields = this.config.fields;
    var data = this.data;
    for(var i = 0; i < data.length; ++i){
      var tr = $('<tr>').appendTo(tbody);
      for(var j = 0; j < fields.length; ++j)
        $('<td>').text(this.getField(data[i], fields[j])).appendTo(tr);
    }
  },
  applySort: function(e){
    var field = e.currentTarget.getAttribute('data-field');
    if(this.view.sort && this.view.sort.substr(1) == field)
      this.view.sort = (this.view.sort[0] === '+' ? '-' : '+') + field;
    else
      this.view.sort = '+' + field;
    this.sortByField(this.data, this.view.sort);
    this.render();
  },
  sortByField: function(a, sort){
    if (typeof(sort) === 'string') return this.sortByField(a, [sort]);
    sort = sort.map(x => ({
      asc: x[0] !== '-',
      key: (x[0] === '+' || x[0] === '-') ? x.substr(1) : x
    }));
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
