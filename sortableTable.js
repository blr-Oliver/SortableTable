function SortableTable(root, data, config){
  this.data = data;
  this.root = $(root);
  this.config = $.extend(true, {
    sizes: [5, 20, 50]
  }, config);
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
  this.paginationRoot = $('<ul>').insertAfter(this.root);
  this.pagination = new Pagination(this.paginationRoot, this.config.sizes[0], {
    total: this.data.length
  });
  this.pagination.onpage = this.pageSelected.bind(this);
  this.render();
}

SortableTable.prototype = {
  commonCaption: '<div class="dropdown pull-right">' +
      '<a role="button" data-toggle="dropdown" class="btn btn-default" data-target="#" >'+
        '<i class="glyphicon glyphicon-cog"></i> <span class="caret"></span>'+
      '</a>'+
      '<ul class="dropdown-menu multi-level" role="menu">'+
        '<li class="dropdown-submenu pull-left">'+
          '<a tabindex="-1" href="#">Видимые столбцы</a>'+
          '<ul class="dropdown-menu checked-list keep-open"></ul>'+
        '</li>'+
        '<li class="dropdown-submenu pull-left">'+
          '<a tabindex="-1" href="#">Размер страницы</a>'+
          '<ul class="dropdown-menu checked-list size-list"></ul>'+
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
    tr = tr || this.root.find('>tbody:eq(0)>tr:eq(0)');
    tr.empty();
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
    tbody = tbody || this.root.children('tbody:eq(0)');
    tbody.children('tr:gt(0)').remove();
    var pagination = this.pagination;
    var columns = this.config.columns;
    var visibleColumns = this.view.visibleColumns;
    var data = this.data;

    for(var i = pagination.page() * pagination.size(); i < Math.min(data.length, (pagination.page() + 1) * pagination.size()); ++i){
      var tr = $('<tr>').appendTo(tbody);
      for(var j = 0; j < visibleColumns.length; ++j)
        $('<td>').text(this.getField(data[i], columns[visibleColumns[j]].field)).appendTo(tr);
    }
  },
  renderCaption: function(caption){
    caption.html(this.config.caption + this.commonCaption);
    var columnsList = caption.find('div>ul>li:eq(0)>ul');
    for(var field in this.config.columns){
      var html = '<i class="glyphicon glyphicon-ok"></i> ' + this.config.columns[field].caption;
      $('<a>').attr('data-field', field).html(html).addClass('checked').appendTo($('<li>').appendTo(columnsList));
    }
    var sizeList = caption.find('div>ul>li:eq(1)>ul');
    var sizes = this.config.sizes;
    for(var i = 0; i < sizes.length; ++i){
      var html = '<i class="glyphicon glyphicon-ok"></i> ' + sizes[i];
      var a = $('<a>').html(html).appendTo($('<li>').appendTo(sizeList));
      if(i === 0) a.addClass('checked');
    }
    var stopper = e => e.stopPropagation();
    columnsList.find('a').click(this.toggleColumn.bind(this)).click(stopper);
    sizeList.find('a').click(this.sizeChanged.bind(this)).click(stopper);
  },
  applySort: function(e){
    var field = e.currentTarget.getAttribute('data-field');
    var pageReset = false;
    if(this.view.sort)
      this.root.find('>tbody:eq(0)>tr:eq(0)>th').removeClass('asc desc');

    if(this.view.sort && this.view.sort.substr(1) == field){
      this.view.sort = (this.view.sort[0] === '+' ? '-' : '+') + field;
    }else{
      this.view.sort = '+' + field;
      pageReset = true;
    }
    $(e.currentTarget).addClass(this.view.sort[0] === '+' ? 'asc' : 'desc');

    this.sortByField(this.data, this.view.sort);
    if(pageReset){
      this.pagination.page(0);
      this.pagination.renderButtons();
    }
    this.renderBody();
  },
  toggleColumn: function(e){
    var target = $(e.target);
    var field = target.attr('data-field');
    if(target.hasClass('checked')){
      target.removeClass('checked');
      this.view.visibleColumns = this.view.visibleColumns.filter(x => x != field);
    }else{
      target.addClass('checked');
      this.view.visibleColumns.push(field);
    }
    this.renderHeaders();
    this.renderBody();
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
  },
  pageSelected: function(page){
    this.renderBody();
  },
  sizeChanged: function(e){
    var target = $(e.target);
    target.closest('ul').find('a').removeClass('checked');
    target.addClass('checked');
    var size = target.text().trim();
    this.pagination.page(0);
    this.pagination.size(size);
    this.pagination.renderButtons();
    this.renderBody();
  }
}
