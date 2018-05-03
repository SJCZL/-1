/**
 * IndexedList
 * 类似联系人应用中的联系人列表，可以按首字母分组
 * 右侧的字母定位工具条，可以快速定位列表位置
 * varstion 1.0.0
 * by Houfeng
 * Houfeng@DCloud.io
 **/

(function($, window, document) {

	var classSelector = function(name) {
		return '.' + $.className(name);
	}

	var IndexedList = $.IndexedList = $.Class.extend({
		/**
		 * 通过 element 和 options 构造 IndexedList 实例
		 **/
		init: function(holder, options) {
			var self = this;
			self.options = options || {};
			self.box = holder;
			if (!self.box) {
				throw "实例 IndexedList 时需要指定 element";
			}
			self.createDom();
			self.findElements();
			self.caleLayout();
			self.bindEvent();
		},
		createDom: function() {
			var self = this;
			self.el = self.el || {};
			//styleForSearch 用于搜索，此方式能在数据较多时获取很好的性能
			self.el.styleForSearch = document.createElement('style');
			(document.head || document.body).appendChild(self.el.styleForSearch);
		},
		findElements: function() {
			var self = this;
			self.el = self.el || {};
			self.el.search = self.box.querySelector(classSelector('indexed-list-search'));
			self.el.searchInput = self.box.querySelector(classSelector('indexed-list-search-input'));
			self.el.searchClear = self.box.querySelector(classSelector('indexed-list-search') + ' ' + classSelector('icon-clear'));
			self.el.bar = self.box.querySelector(classSelector('indexed-list-bar'));
			self.el.barItems = [].slice.call(self.box.querySelectorAll(classSelector('indexed-list-bar') + ' a'));
			self.el.inner = self.box.querySelector(classSelector('indexed-list-inner'));
			self.el.items = [].slice.call(self.box.querySelectorAll(classSelector('indexed-list-item')));
			self.el.liArray = [].slice.call(self.box.querySelectorAll(classSelector('indexed-list-inner') + ' li'));
			self.el.alert = self.box.querySelector(classSelector('indexed-list-alert'));
		},
		caleLayout: function() {
			var self = this;
			var withoutSearchHeight = (self.box.offsetHeight - self.el.search.offsetHeight) + 'px';
			self.el.bar.style.height = withoutSearchHeight;
			self.el.inner.style.height = withoutSearchHeight;
			var barItemHeight = ((self.el.bar.offsetHeight - 40) / self.el.barItems.length) + 'px';
			self.el.barItems.forEach(function(item) {
				item.style.height = barItemHeight;
				item.style.lineHeight = barItemHeight;
			});
		},
		scrollTo: function(group) {
			console.log(group);
			var self = this;
			var groupElement = self.el.inner.querySelector('[data-group="' + group + '"]');
			if (!groupElement || (self.hiddenGroups && self.hiddenGroups.indexOf(groupElement) > -1)) {
				return;
			}
			self.el.inner.scrollTop = groupElement.offsetTop;
		},
		bindBarEvent: function() {
			var self = this;
			var pointElement = null;
			var findStart = function(event) {
				if (pointElement) {
					pointElement.classList.remove('active');
					pointElement = null;
				}
				self.el.bar.classList.add('active');
				var point = event.changedTouches ? event.changedTouches[0] : event;
				pointElement = document.elementFromPoint(point.pageX, point.pageY);
				if (pointElement) {
					var group = pointElement.innerText;
					if (group && group.length == 1) {
						pointElement.classList.add('active');
						self.el.alert.innerText = group;
						self.el.alert.classList.add('active');
						self.scrollTo(group);
					}
				}
				event.preventDefault();
			};
			var findEnd = function(event) {
				self.el.alert.classList.remove('active');
				self.el.bar.classList.remove('active');
				if (pointElement) {
					pointElement.classList.remove('active');
					pointElement = null;
				}
			};
			self.el.bar.addEventListener('touchmove', function(event) {
				findStart(event);
			}, false);
			self.el.bar.addEventListener('touchstart', function(event) {
				findStart(event);
			}, false);
			document.body.addEventListener('touchend', function(event) {
				findEnd(event);
			}, false);
			document.body.addEventListener('touchcancel', function(event) {
				findEnd(event);
			}, false);
		},
		
		search: function(keyword) {
			var self = this;
			var finalList="";
			var arry_content=dataItem;
			if(/^[a-zA-Z]*$/.test(keyword))
			{
			    self.scrollTo(keyword.substring(0,1).toUpperCase());
                var i=0;
                for(j=0;j<dataItem.content.length;j++){
			        if(keyword[0]==dataItem.content[j].station_fullName[0]){
			    		arry_content.content[i]=dataItem.content[j];
			    		i++;
			    	}
			    }
                arry_content.content.length=i;
			    for(i=1;i<keyword.length;i++){
			    	var arry=arry_content;
			    	var k=0;
			    	for(j=0;j<arry_content.content.length;j++){
			    		if(keyword[i]==arry_content.content[j].station_fullName[i]){
			    			arry.content[k]=arry_content.content[j];
			    			k++;
			    		}
			    	}
			    	arry.content.length=k;
			    	arry_content=arry;
			    	arry_content.content.length=k;
			    }
			    if(arry_content.content.length==0){
			    	stationList.innerHTML='<li class="mui-table-view-divider mui-indexed-list-group" style="text-al">没有数据</li>'
			    }else{
			    	stationList.innerHTML='<li data-group='+keyword.substring(0,1).toUpperCase()+' class="mui-table-view-divider mui-indexed-list-group">'+keyword.substring(0,1).toUpperCase()+'</li>'
				    for(i=0;i<arry_content.content.length;i++){
				    	finalList+='<li data-id="'+i+'" data-value="' + arry_content.content[i].station_code + '" data-tags="' + arry_content.content[i].station_fullName + '" class="mui-table-view-cell mui-indexed-list-item">' + arry_content.content[i].station_name + '</li>';
				    }
			    }
			    stationList.innerHTML +=finalList;
			}else if(/^[\u4e00-\u9fa5]*$/.test(keyword))
			{
                var i=0;
                for(j=0;j<dataItem.content.length;j++){
			        if(keyword[0]==dataItem.content[j].station_name[0]){
			    		arry_content.content[i]=dataItem.content[j];
			    		i++;
			    	}
			    }
                arry_content.content.length=i;
			    for(i=1;i<keyword.length;i++){
			    	var arry=arry_content;
			    	var k=0;
			    	for(j=0;j<arry_content.content.length;j++){
			    		if(keyword[i]==arry_content.content[j].station_name[i]){
			    			arry.content[k]=arry_content.content[j];
			    			k++;
			    		}
			    	}
			    	arry.content.length=k;
			    	arry_content=arry;
			    	arry_content.content.length=k;
			    }
			    if(arry_content.content.length==0){
			    	stationList.innerHTML='<li class="mui-table-view-divider mui-indexed-list-group" style="text-al">没有数据</li>';
			    }else{
			    	stationList.innerHTML='<li data-group='+arry_content.content[0].station_fullName.substring(0,1).toUpperCase()+' class="mui-table-view-divider mui-indexed-list-group">'+arry_content.content[0].station_fullName.substring(0,1).toUpperCase()+'</li>'
				    for(i=0;i<arry_content.content.length;i++){
				    	finalList+='<li data-id="'+i+'" data-value="' + arry_content.content[i].station_code + '" data-tags="' + arry_content.content[i].station_fullName + '" class="mui-table-view-cell mui-indexed-list-item">' + arry_content.content[i].station_name + '</li>';
				    }
			    }
			    
			    stationList.innerHTML +=finalList;
			}
//			console.log(stationList.innerHTML);
			dataItem=arry_content;
//			console.log("finalList------------->"+finalList);
			if(finalList==""){
			    Item_data=JSON.parse(localStorage.getItem('Item_data'));
			    dataItem=Item_data;
			}
		},
		bindSearchEvent: function() {
			var self = this;
			self.el.searchInput.addEventListener('input', function() {
				var keyword = this.value;
				self.search(keyword);
			}, false);
			$(self.el.search).on('tap', classSelector('icon-clear'), function() {
				self.search('');
			}, false);
		},
		bindEvent: function() {
			var self = this;
			self.bindBarEvent();
			self.bindSearchEvent();
		}
	});

	//mui(selector).indexedList 方式
	$.fn.indexedList = function(options) {
		//遍历选择的元素
		this.each(function(i, element) {
			if (element.indexedList) return;
			element.indexedList = new IndexedList(element, options);
		});
		return this[0] ? this[0].indexedList : null;
	};

})(mui, window, document);