/* === Расширения для NODE === */

/*if(!Node.prototype.classList){
	
	
	
}*/
NodeExt = {}; 
NodeExt.addClass = function (cls) { 
	if(this.classList&&this.classList.add)this.classList.add(cls); return this;
	var c = this.className ? this.className.split(' ') : [];
	for (var i=0; i<c.length; i++) {
		if (c[i] == cls) return this;
	}
	c.push(cls);
	this.className = c.join(' ');
	return this;
};


NodeExt.removeClass = function (cls) {
	if(this.classList&&this.classList.remove)this.classList.remove(cls); return this;
	var c = this.className.split(' ');
	for (var i=0; i<c.length; i++) {
		if (c[i] == cls) c.splice(i--, 1);
	}
	this.className = c.join(' ');
	 return this;
};

NodeExt.hasClass = function(cls) {
	if(!this.className || this.className=='')return false;
	if(this.classList&&this.classList.contain)return this.classList.contains(cls); 
	for (var c = this.className.split(' '),i=c.length-1; i>=0; i--) {
		if (c[i] == cls) return true;
	}
	return false;
}

NodeExt.addChild = function (attr,noalias,noaliasArr) {
		/*для обычных:
			attribute[1] - noalias - выключить псевдонимы ()
			если attr - массив:
			attribute[1] - вернуть массив элементов или this
			attribute[2] - noaliasArr - не включать псевдонимы 
		*/
		if(attr instanceof Array){//В качестве аттр может быть массив, что позволяет не дублировать вызов из кода
			var b = [];
			for(var a in attr){  b[a] = this.addChild(attr[a],noaliasArr); b[a].dataset['child-index']=a;  }
			return (noalias ? b : this);
		}
		var alias = {'content':'innerHTML'}//список аттрибутов-псевдонимов  и их значений 
		var a = document.createElement(attr.TagName || attr.tagName || 'div'), value;
		for(var key in attr){
			value = attr[key];
			if(!noalias&&alias[key])key = alias[key];  
			//if(attr.hasOwnProperty(key))
				if(a[key] && typeof value == 'object')// Для передачи объектов dataset : {}, style : {} и т.д.
				for(var d in value)a[key][d] = value[d];
				else if(a[key] && typeof a[key] == 'function')a[key](value);// Для передачи функций Widyh(value)
				else a[key]=value; 
		}  //a.setAttribute(key , attr [key]);  
		return this.appendChild(a);
	}

 
	NodeExt.appEnd = function (string, returnChild) {
		if(typeof Node === "object" ? string instanceof Node : 
			string && typeof string === "object" && typeof string.nodeType === "number" && typeof string.nodeName==="string"){
			var a = string;
			}else{
		var a = document.createElement('div');
		a.innerHTML = string;
		}
		if(a.childNodes.length[1]){ return this.appendChild(a.childNodes[0]); }
		for(var i=0; i<a.childNodes.length; i++ ){  this.appendChild(a.childNodes[i]);}
		return returnChild ? a.childNodes : this;
	}
	
	
	NodeExt.appAfter = function(newNode) {
		this.parentNode.insertBefore(newNode, this.nextSibling);
	}
	NodeExt.appBefore = function(newNode) {
		this.parentNode.insertBefore(newNode, this);
	}
	  
		NodeExt.remove = function() {
		this.parentElement.removeChild(this); 
	}
	
	NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
		for(var i = this.length - 1; i >= 0; i--) {
			if(this[i] && this[i].parentElement) {
				this[i].parentElement.removeChild(this[i]);
			}
		}
	} 

if(!document.getElementsByClass){
NodeExt.getElementsByClass = function(classList) {			
		var node = this,
		list = node.getElementsByTagName('*'), 
		length = list.length,  
		classArray = classList.split(/\s+/), 
		classes = classArray.length, 
		result = [], i,j
		for(i = 0; i < length; i++) {
			for(j = 0; j < classes; j++)  {
				if(list[i].className.search('\\b' + classArray[j] + '\\b') != -1) {
					result.push(list[i])
					break
				}
			}
		} 
		return result;
}
}
 
 /*Проверяет принадлежность элемента к какому-либо параметру Node.getParents([by(string), [value(string), [light(boolean)]]])
 by - индификатор (id, klassName ... ). М.б. использована функция. Если передан без value будет искать по наличию индификатора
value - значение. для 'hasClass' значение подставляетсяя, для ос. сравнивается
light - "встречается" ( ищит по indexOf а не по == ; не распространяется на typeof by == function )
*/
 NodeExt.isIt = function(by, value, light){ var isset = $_SYS.fn.isset; return ( !isset(by)  || ( isset(this[by] ) && ( !isset(value)  ||  ((typeof this[by] == 'function') ? (by == 'hasClass' ? this[by](value) : this[by]()) : (light ? (this[by].indexOf(value)>-1) : this[by]== value) ) ) )  ); }
 
/*
Node.getParents([by(string), value(string), [light(boolean)]],[include_this_(boolean) = true]) - поиск родительских элементов (начиная с текущего).
by, value,light аналогичен isIt()
include_this_ - включать или нет в поиск текущий элемент (по умолчанию - включен, т.к. наиболее частое применение - поиск, был ли клик по элементу). При передаче в функцию одного параметра 'boolean' считается за include_this_ (если тип string - будет искать по наличию свойства) 
*/
NodeExt.getParents = function(by,value, light, include_this_){
	if(arguments.length<3)var include_this_ = true; 
	if(arguments.length==1&&typeof arguments[0] != 'string')var include_this_ = arguments[0]; 
	var result =  [];
	var e = this;
	 
	if(include_this_ && e.isIt(by,value, light) )result.push(e);
	while(e.parentNode){
		e = e.parentNode;
		if(e.isIt(by,value, light))result.push(e);
	}
	return result;
}
//Облегченная версия getParents - возвращает 1й найденный элемент
NodeExt.getParent = function(by,value, light, include_this_){
	if(arguments.length<3)var include_this_ = true; 
	if(arguments.length==1&&typeof arguments[0] != 'string')var include_this_ = arguments[0]; 
	var result =  false;
	var e = this;
	 
	if(include_this_ && e.isIt(by,value, light) )return e;
	while(e.parentNode){
		e = e.parentNode;
		if(e.isIt(by,value, light))result = e; break;
	}
	return result;
}

//Поиск элемента по параметру . Аналогично getParents, но include_this_ по умолчанию false
NodeExt.getElementsBy=function(by,value, light, include_this_){//Ищит дочерние элементы с id. 
		//var //value = value ? value : 'id';
		if(arguments.length==1&&typeof arguments[0] != 'string')var include_this_ = arguments[0]; 
		var list = this.getElementsByTagName('*'),
		result = [], i;
		if(include_this_ && this.isIt(by,value, light))result.push(this);
		for(i = 0; i < list.length; i++) { 
				if(list[i].isIt(by,value, light))result.push(list[i]); 
		} 
		return  result;
 }

NodeExt.width = NodeExt.Width = function(s){if(typeof s == "undefined"){return this.offsetWidth;} this.style.width=s+"px"; return this;}
NodeExt.height = NodeExt.Height = function(s){if(typeof s == "undefined"){return this.offsetHeight;} this.style.height=s+"px"; return this;}
NodeExt.FullWH = function(a,s,margin){//Полный размер, включая padding, border [margin]. Можно как получить, так и задать
var style = window.getComputedStyle(this, null),
p = 0, l = (a == 'height') ? ['top', 'bottom'] : ['left', 'right'];  
for(var i in l){ 
	p += parseInt(style['border-' + l[i] + '-width']);
	p += parseInt(style['padding-' +  l[i]]);
	if(margin)p += parseInt(style['margin-' + l[i]] ); 
}
if(typeof s == "number" ){ this.style[a]=(s-p)+"px"; return this;}return this['offset'+$_SYS.fn.toTitleCase(a)]+p;
}
//сокращенные записи. Возможна передача в виде el.FullWidth() - вернет FullWH('width');  el.FullWidth(1) - выполнит FullWH('width', 1), вернет this;  el.FullWidth(1,true) - выполнит FullWH('width', 1, true), вернет this; el.FullWidth(true) - вернет FullWH('width',false,true); 
NodeExt.FullWidth = NodeExt.outerWidth = function(s,margin){ if(arguments.length==1 && typeof arguments[0] == 'boolean'){var s = false, margin = arguments[0]}return this.FullWH('width',s,margin);}
NodeExt.FullHeight = NodeExt.outerHeight = function(s,margin){ if(arguments.length==1 && typeof arguments[0] == 'boolean'){var s = false, margin = arguments[0]} return this.FullWH('height',s,margin);}
NodeExt._X = function(s){ if(typeof s == "undefined"){if(!this._x){this._x=this.offsetLeft;} return this._x;} this.style.left=s+"px"; this._x=s; return this; }
NodeExt._Y = function(s){ if(typeof s == "undefined"){if(!this._y){this._y=this.offsetTop;} return this._y;} this.style.top=s+"px"; this._y=s; return this; }
//x,y,width, height отн-но центра объета
NodeExt.WidthC = function(s){if(typeof s == "undefined"){return parseInt(this.offsetWidth/2);} var  delta =  (this.WidthC() - s); this.style.width=2*s+"px"; this._X(this._X()+delta); return this;}
NodeExt.HeightC = function(s){if(typeof s == "undefined"){return parseInt(this.offsetHeight/2);} var delta = (this.HeightC() - s) ; this.style.height=2*s+"px"; this._Y(this._Y()+delta); return this;}
NodeExt.XC = function(s){ if(typeof s == "undefined"){return this._X()+this.WidthC();} this._X(s-this.WidthC()); return this; }
NodeExt.YC = function(s){ if(typeof s == "undefined"){return this._Y()+this.HeightC();} this._Y(s-this.HeightC());  return this; }
NodeExt.ZC = function(s) {if(typeof s == "undefined"){return this.style.zIndex;} this.style.zIndex = s;  return this;}


NodeExt.background = function(o){
	//{color,img,position,repeat, attachment, size}
	//style.background = "#f3f3f3 url('img_tree.png') no-repeat right top";
	if(o.color){this.style.backgroundColor = o.color}
	if(o.url){this.style.backgroundImage = "url('"+o.url+"')";}
	if(o.position){var suf =o.position.suf ?  o.position.suf : "px"; this.style.backgroundPosition = o.position.x+suf+" "+o.position.y+suf; }
	if(o.repeat){this.style.backgroundRepeat = o.repeat;}
	if(o.attachment){this.style.backgroundAttachment = o.attachment;}
	if(o.size){var suf = o.suf ? o.suf : "px"; this.style.backgroundSize = (typeof o.size=='object' ? (o.size.x+suf+" "+o.size.y+suf): o.size);}
	return this;
}

NodeExt.rotate=function(r){this.style.transform = "rotate(7deg)"; return this;}
NodeExt.scale=function(s){this.style.transform = "scale("+s+","+s+")"; return this;}
NodeExt.mirror=function(s,n){this.style.transform = "scale"+s.toLocaleUpperCase()+"("+n+")"; return this;}
NodeExt.defaults = {};
NodeExt.show=function(){this.style.display = this.defaults.display || "block"; return this; }
NodeExt.hidde=function(){this.style.display = "none"; return this; }

NodeExt.position = function(a){
	var a = a ? a : {}; 
	if(!a.position) a.position = "absolute"; 
	var n =  ['left', 'right','top','bottom'];
	for(var i in n){
		if(a[n[i]]===false)continue; 
		a[n[i]] = a[n[i]] ? (typeof a[n[i]]== "number" ? a[n[i]]+'px' : a[n[i]]):0;
	} 
	for(var d in a){this.style[d] =  a[d];}
	return this;
}

NodeExt.topBlock = function(a){
	var a = a ? a : {};  
	if(!a.zIndex) a.zIndex = 9999;
	return this.position(a) 
}
NodeExt.setStyle = function(a){
	for(var d in a){this.style[d] =  a[d];} return this;
}

Math.log2 = Math.log2 || function(x) {
  return Math.log(x) / Math.LN2;
};
for(var p in NodeExt){
	if(!Node.prototype[p])Node.prototype[p]=NodeExt[p];//else console.error(p);
	if(!Element.prototype[p])Element.prototype[p]=NodeExt[p];//else console.error(p);
	//if(!Element.prototype[p])HTMLDivElement.prototype[p]=NodeExt[p];else console.err(p);
}
