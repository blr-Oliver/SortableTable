function Pagination(config, state){
  this.config = {
    arrows: true,
    innerLength: 3,
    sideLength: 2
  };
  this.config.arrows = config.arrows || this.config.arrows;
  this.config.innerLength = (config.innerLength || this.config.innerLength) | 1;
  this.config.sideLength = config.sideLength || this.config.sideLength;
  this.config.root = $(config.root);

  this.state = {
    page: 0,
    size: 1,
    total: 0
  };
  this.state.page = state.page || this.state.page;
  this.state.size = state.size || this.state.size;
  this.state.total = state.total || this.state.total;

  this.render();
}

Pagination.prototype = {
  render: function(){
    var root = this.config.root;
    root.addClass("pagination");
    this.renderButtons();
    root.click(this.pageSelected.bind(this));
  },
  renderButtons: function(){
    var root = this.config.root;
    var page = this.page();
    var total = this.total();
    root.empty();
    var count = Math.ceil(total / this.size());
    if(count > 1){
      var i, li;
      if(this.config.arrows){
        var previous = $('<li><a href="#" class="previous">&laquo;</a></li>');
        if(page == 0) previous.addClass('disabled');
        previous.appendTo(root);
      }
      var
        leftMax = Math.min(this.config.sideLength, count) - 1,
        innerMin = Math.max(0, page - (this.config.innerLength >> 1)),
        innerMax = Math.min(page + (this.config.innerLength >> 1), count - 1),
        rightMin = Math.max(0, count - this.config.sideLength);
      for(i = 0; i <= leftMax; ++i){
        li = $('<li><a href="#">' + (i + 1) + '</a></li>').appendTo(root);
        if(i == page)
          li.addClass('active');
      }
      if(leftMax < innerMin - 2){
        $('<li class="disabled"><a>...</a></li>').appendTo(root);
        i = innerMin;
      }
      for(; i <= innerMax; ++i){
        li = $('<li><a href="#">' + (i + 1) + '</a></li>').appendTo(root);
        if(i == page)
          li.addClass('active');
      }
      if(innerMax < rightMin - 2){
        $('<li class="disabled"><a>...</a></li>').appendTo(root);
        i = rightMin;
      }
      for(; i < count; ++i){
        li = $('<li><a href="#">' + (i + 1) + '</a></li>').appendTo(root);
        if(i == page)
          li.addClass('active');
      }
      if(this.config.arrows){
        var next = $('<li><a href="#" class="next">&raquo;</a></li>');
        if(page == count - 1) next.addClass('disabled');
        next.appendTo(root);
      }
    }
  },
  pageSelected: function(e){
    var target = $(e.target);
    if(target.is('a') && !target.parent().is('.disabled')){
      if(target.hasClass('previous'))
        this.page(this.page() - 1);
      else if(target.hasClass('next'))
        this.page(this.page() + 1);
      else
        this.page(+target.text() - 1);
      this.renderButtons();
    }
  },
  page: function(page){
    if(arguments.length){
      if(this.state.page != page){
        this.state.page = page;
        if(this.onpage)
          this.onpage(page);
      }
    }
    else return this.state.page;
  },
  size: function(size){
    if(arguments.length){
      if(this.state.size != size){
        this.state.size = size;
        if(this.onsize)
          this.onsize(size);
      }
    }
    else return this.state.size;
  },
  total: function(total){
    if(arguments.length){
      if(this.state.total != total){
        this.state.total = total;
        if(this.ontotal)
          this.ontotal(total);
      }
    }
    else return this.state.total;
  }
}
