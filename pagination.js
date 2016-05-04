function Pagination(root, size, config){
	this._page = 0;
	this.size = size > 0 ? size : 20;
	this.config = $.extend({
		arrows: true,
		innerLength: 3,
		sideLength: 2
	}, config);
	this.config.innerLength |= 1;
	this.root = $(root);
	this.render();
}

Pagination.prototype = {
	render: function(){
		var root = this.root;
		root.addClass("pagination");
		this.renderButtons();
		root.click(this.pageSelected.bind(this));
	},
	renderButtons: function(){
		var root = this.root;
		root.empty();
		var count = Math.ceil(this.config.total / this.size);
		if(count > 1){
			var i, li;
			if(this.config.arrows){
				$('<li><a href="#">&laquo;</a></li>').appendTo(root);
			}
			var
				leftMax = this.config.sideLength - 1,
				innerMin = this._page - (this.config.innerLength >> 1),
				innerMax = this._page + (this.config.innerLength >> 1),
				rightMin = count - this.config.sideLength;
			for(i = 0; i <= leftMax; ++i){
				li = $('<li><a href="#">' + (i + 1) + '</a></li>').appendTo(root);
				if(i == this._page)
					li.addClass('active');
			}
			debugger;
			if(leftMax < innerMin - 2){
				$('<li><a>...</a></li>').appendTo(root);
				i = innerMin;
			}
			for(; i <= innerMax; ++i){
				li = $('<li><a href="#">' + (i + 1) + '</a></li>').appendTo(root);
				if(i == this._page)
					li.addClass('active');
			}
			if(innerMax < rightMin - 2){
				$('<li><a>...</a></li>').appendTo(root);
				i = rightMin;
			}
			for(; i < count; ++i){
				li = $('<li><a href="#">' + (i + 1) + '</a></li>').appendTo(root);
				if(i == this._page)
					li.addClass('active');
			}
			if(this.config.arrows){
				$('<li><a href="#">&raquo;</a></li>').appendTo(root);
			}
		}
	},
	pageSelected: function(e){
		this.page(+$(e.target).text() - 1);
		this.renderButtons();
	},
	page: function(page){
		if(arguments.length)
			this._page = page;
		else return this._page;
	},
	size: function(size){
		if(arguments.length)
			this.size = size;
		else return this.size;
	}
}
