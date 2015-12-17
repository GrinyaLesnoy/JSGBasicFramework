/* === Расширения для NODE === */


Node.prototype.addClass = function (cls) { 
	var c = this.className ? this.className.split(' ') : [];
	for (var i=0; i<c.length; i++) {
		if (c[i] == cls) return;
	}
	c.push(cls);
	this.className = c.join(' ');
};


Node.prototype.removeClass = function (cls) {
	var c = this.className.split(' ');
	for (var i=0; i<c.length; i++) {
		if (c[i] == cls) c.splice(i--, 1);
	}
	this.className = c.join(' ');
};

Node.prototype.hasClass = function(cls) {
	for (var c = this.className.split(' '),i=c.length-1; i>=0; i--) {
		if (c[i] == cls) return true;
	}
	return false;
}

Node.prototype.addChild = function (attr) {
		if(attr instanceof Array){//В качестве аттр может быть массив, что позволяет не дублировать вызов из кода
			for(var a in attr){
				var e = this.addChild(attr[a]);
				e.setAttribute('data-child-index' , a);
			}
			return this;
		}
		var exclude = {'content':-1}//список аттрибутов-исключений
		var a = document.createElement(attr.TagName ? attr.TagName : 'div');
		for(var key in attr){if(attr.hasOwnProperty(key)&&!exclude[key])a[key]=attr[key];}  //a.setAttribute(key , attr [key]);
		if(attr['content'])a.innerHTML = attr['content'];
		return this.appendChild(a);
	}

 
	Node.prototype.appEnd = function (string, returnChild) {
		var a = document.createElement('div');
		a.innerHTML = string;
		if(a.childNodes.length[1]){ return this.appendChild(a.childNodes[0]); }
		for(var i=0; i<a.childNodes.length; i++ ){  this.appendChild(a.childNodes[i]);}
		return returnChild ? a.childNodes : this;
	}
	
	Element.prototype.remove = function() {
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
Node.prototype.getElementsByClass = function(classList) {			
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

Node.prototype.searchUp = function(attrName,_t,attr, max_level){
	if(!attr){attr = 'id';} //if(!max_level){max_level=false}
	var result = false;
	if(_t&&this[attr]==attrName){result = this;}else if(this.offsetParent){result = this.offsetParent.searchUp(attrName,true,attr);}
	return result;
}

Node.prototype.width = function(s){if(typeof s == "undefined"){return this.offsetWidth;} this.style.width=s+"px"; return this;}
Node.prototype.height = function(s){if(typeof s == "undefined"){return this.offsetHeight;} this.style.height=s+"px"; return this;}
Node.prototype._X = function(s){ if(typeof s == "undefined"){if(!this._x){this._x=this.offsetLeft;} return this._x;} this.style.left=s+"px"; this._x=s; return this; }
Node.prototype._Y = function(s){ if(typeof s == "undefined"){if(!this._y){this._y=this.offsetTop;} return this._y;} this.style.top=s+"px"; this._y=s; return this; }
//x,y,width, height отн-но центра объета
Node.prototype.WidthC = function(s){if(typeof s == "undefined"){return parseInt(this.offsetWidth/2);} var  delta =  (this.WidthC() - s); this.style.width=2*s+"px"; this._X(this._X()+delta); return this;}
Node.prototype.HeightC = function(s){if(typeof s == "undefined"){return parseInt(this.offsetHeight/2);} var delta = (this.HeightC() - s) ; this.style.height=2*s+"px"; this._Y(this._Y()+delta); return this;}
Node.prototype.XC = function(s){ if(typeof s == "undefined"){return this._X()+this.WidthC();} this._X(s-this.WidthC()); return this; }
Node.prototype.YC = function(s){ if(typeof s == "undefined"){return this._Y()+this.HeightC();} this._Y(s-this.HeightC());  return this; }
Node.prototype.ZC = function(s) {if(typeof s == "undefined"){return this.style.zIndex;} this.style.zIndex = s;  return this;}

Node.prototype.getElementBy=function(id, attr){//Ищит дочерние элементы с id.
		var attr = attr ? attr : 'id'
		var node = this,
		list = node.getElementsByTagName('*'), 
		length = list.length,  
		classArray = classList.split(/\s+/), 
		classes = classArray.length, 
		result = [], i,j
		for(i = 0; i < length; i++) { 
				if(list[i][attr] == id || list[i].getAttribute(attr) == id) {
					result.push(list[i]); 
				} 
		} 
		return  result;
 }

Node.prototype.background = function(o){
	//{color,img,position,repeat, attachment, size}
	//style.background = "#f3f3f3 url('img_tree.png') no-repeat right top";
	if(o.color){this.style.backgroundColor = o.color}
	if(o.url){this.style.backgroundImage = "url('"+o.url+"')";}
	if(o.position){var suf =o.position.suf ?  o.position.suf : "px"; this.style.backgroundPosition = o.position.x+suf+" "+o.position.y+suf; }
	if(o.repeat){this.style.backgroundRepeat = o.repeat;}
	if(o.attachment){this.style.backgroundAttachment = o.attachment;}
	if(o.size){var suf = o.suf ? o.suf : "px"; this.style.backgroundSize = (typeof o.size=='object' ? (o.size.x+suf+" "+o.size.y+suf): o.size);}
}

Node.prototype.rotate=function(r){this.style.transform = "rotate(7deg)"; }
Node.prototype.scale=function(s){this.style.transform = "scale("+s+","+s+")"; }
Node.prototype.mirror=function(s,n){this.style.transform = "scale"+s.toLocaleUpperCase()+"("+n+")"; }
Node.prototype.show=function(){this.style.display = "block"; }
Node.prototype.hidden=function(){this.style.display = "none"; }

Node.prototype.position = function(a){
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

Node.prototype.topBlock = function(a){
	var a = a ? a : {};  
	if(!a.zIndex) a.zIndex = 9999;
	return this.position(a) 
}
