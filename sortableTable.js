function SortableTable(root, data, config){
  this.data = data;
  this.root = $(root);
  this.config = $.extend(true, {}, config);
  var newColumns = {};
  for(var i = 0; i < this.config.columns.length; ++i){
    var column = this.config.columns[i];
    newColumns[column.field] = column;
  }
  this.view = {
    sort: null,
    visibleColumns: this.config.columns.map(x => x.field)
  };
  this.config.columns = newColumns;
  this.view.visibleColumns = this.view.visibleColumns.slice(0, 3);
  this.render();
}

SortableTable.prototype = {
  commonCaption: '<div class="dropdown pull-right">' +
      '<a role="button" data-toggle="dropdown" class="btn btn-default" data-target="#" >'+
        '<i class="glyphicon glyphicon-cog"></i> <span class="caret"></span>'+
      '</a>'+
      '<ul class="dropdown-menu multi-level" role="menu" aria-labelledby="dropdownMenu">'+
        '<li class="dropdown-submenu">'+
          '<a tabindex="-1" href="#">Видимые столбцы</a>'+
          '<ul class="dropdown-menu field-list"></ul>'+
        '</li>'+
      '</ul>'+
    '</div>',
  render: function(){
    this.root.html('<caption></caption><tbody></tbody>');
    var tbody = this.root.find('tbody');
    var caption = this.root.find('caption');
    var tr = $('<tr>').appendTo(tbody);
    this.renderCaption(caption);
    this.renderHeaders(tr);
    this.renderBody(tbody);
  },
  renderHeaders: function(tr){
    var columns = this.config.columns;
    var visibleColumns = this.view.visibleColumns;
    for(var i = 0; i < visibleColumns.length; ++i){
      var descriptor = columns[visibleColumns[i]];
      var th = $('<th>').text(descriptor.caption).attr('data-field', descriptor.field).appendTo(tr);
      if(descriptor.sortable)
        th.addClass('sortable');
    }
    tr.children('th.sortable').click(this.applySort.bind(this));
  },
  renderBody: function(tbody){
    tbody.children('tr:gt(0)').remove();
    var columns = this.config.columns;
    var visibleColumns = this.view.visibleColumns;
    var data = this.data;
    for(var i = 0; i < data.length; ++i){
      var tr = $('<tr>').appendTo(tbody);
      for(var j = 0; j < visibleColumns.length; ++j)
        $('<td>').text(this.getField(data[i], columns[visibleColumns[j]].field)).appendTo(tr);
    }
  },
  renderCaption: function(caption){
    caption.html(this.config.caption + this.commonCaption);
    var ul = caption.find('div>ul>li:eq(0)>ul');
    for(var field in this.config.columns){
      var li = $('<li>');
      var a = $('<a>').attr('data-field', field).html('<i class="glyphicon glyphicon-ok"></i> ' + this.config.columns[field].caption).addClass('checked');
      a.appendTo(li);
      li.appendTo(ul);
    }
    ul.find('a').click(this.toggleColumn.bind(this));
  },
  applySort: function(e){
    var field = e.currentTarget.getAttribute('data-field');
    if(this.view.sort)
      this.root.find('>tbody:eq(0)>tr:eq(0)>th').removeClass('asc desc');

    if(this.view.sort && this.view.sort.substr(1) == field){
      this.view.sort = (this.view.sort[0] === '+' ? '-' : '+') + field;
    }else{
      this.view.sort = '+' + field;
    }
    $(e.currentTarget).addClass(this.view.sort[0] === '+' ? 'asc' : 'desc');

    this.sortByField(this.data, this.view.sort);
    this.renderBody(this.root.children('tbody'));
  },
  toggleColumn: function(e){
    $(e.currentTarget).toggleClass('checked');
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
