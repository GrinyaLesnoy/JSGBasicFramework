/**
Name : BasicXvFramevork
Autor : Grinya Lesnoy
version : 0.37
licence : The MIT License (MIT)
site : 	http://vnii.su/
		https://vk.com/lesnoy.skazochnik
**/
"use strict";
var root = this;
(function(){    
/** = объект классов. Здесь хранятся классы объектов в порядке родительский - дочерний
	Функция преобразует объект в класс (также способна задавать новый пустой) путем добавления туда свойств objectType и extendOf. 
 = **/
 /*{
	classes(
		'Name',
		{extendOf : 'pName'},
		{})
 
 }*/
root.classes = function(){//Name,[obj options|str extendOf],class 
	var Name = arguments[0],options={},cobj; 
	switch(arguments.length) {
		case 0 : return root.classes;
		case 1 : 
			switch(typeof Name) {
				case 'string': 
				if(Name.indexOf('classes.')===0)return $_SYS.Object.getFromPath(Name);//Для совместимости
				else return  root.classes[Name];
				case  'object':  
				 var i,a=[];
				 for(var i in Name)if(!root.classes[Name]){a.push('classes/'+Name+'.js');}
				 $_SYS.Loader.setWaits(a,'script');
				 return;
				/*
					var el = document.createElement(type);
					var _this_ = _this_ || this;
					//Если путь не задан от корня сайта или с какого-то http берется локальный путь
					el.src = (this.rootURL && src.indexOf('://')==-1 && src.indexOf('/')!=0)? this.rootURL+src : src;
					if(type=="script"){document.getElementsByTagName('head')[0].appendChild(el);}	
					el.onload =  function(){_callback.apply(_this_, arguments);} 
					el.onerror = function() { console.log( "Ошибка загрузки: " + src + ' (' + el.src + ')' ); };
				*/
				return root.classes;
			}
		case 2 : cobj = arguments[1]; break;
		default : options = arguments[1]; cobj = arguments[2]; break;
	}  
	if( typeof Name!=='string')return undefined; 
	if(classes[Name]) return console.error('classes['+Name+'] exist',arguments);  
	var extend = options.extends||options.extend||false; 
	switch(typeof extend){case 'string':case 'number':extend = root.classes[extend];}
	if(extend)cobj.__proto__=extend;
	cobj.objectType = 'class';
	if(options.extendOf)cobj.extendOf = options.extendOf;
	//if(extend&&extend.classesName)cobj.extendOf = extend.classesName;
	cobj.classesName = Name;
	cobj.className = Name.replace(/\//g,' ').replace(/\./g,' ');
	root.classes[Name]=cobj;
	return cobj;
	var path, classObj;
	if (arguments.length == 0) {
		return root.classes;//Пустой вызов возвращает объект classes
	} else if(arguments.length == 1){   //Вызов с одним параметром - пытается понять что это и что с этим делать
		switch (typeof arguments[0]) {
			case "object":  //Объект - пытается придать ему свойство класса и вернуть
				classObj = arguments[0];
				if(classObj.extendOf){ classObj.objectType = 'classExtend';}else{classObj.objectType = 'class';}
				return classObj;
			break;
			case "string": //Строка - интерпретирует ее как путь
				path = arguments[0];
				if(path == 'classes'){return root.classes;}
			break;
			default:
				return false;
		} 
	} else {path = arguments[0]; classObj = arguments[1];} 
		var pathFull = path;//Запоминает полный путь для eval 
		 if(path.indexOf('classes.')==0){  path = path.substr((path.indexOf('.')+1));} else{pathFull = 'classes.'+path; }
		 
		 if(!classObj){classObj = (classObj = eval(pathFull))? classObj : {};}//Если был указан только путь - пытается получить по нему объект и, если не получается - создает пустой
		if(path.indexOf('.')==-1){
			classObj.objectType = 'class'; 
			var className = path;
			pathFull = 	'classes';
		}else{
			classObj.objectType = 'classExtend';
			classObj.extendOf = 'classes.'+path.substr(0,path.lastIndexOf('.'));
			var className = path.substr((path.lastIndexOf('.')+1)); 
			pathFull = 	classObj.extendOf;	
		}  
		 eval('root.'+pathFull)[className] = classObj;
		 return classObj; 
	
}

		
		root.classes.isClass = function(o){ return (o != null && typeof o == "object" && (o.objectType=="class"||o.objectType=="classExtend" ) ) ? true : false;}; 
root.interfaces = function(){}
 //Массив импортируемых классов. Каждый из классов может иметь собственный подобный массив
 //Позволяет автоматически загружать нужные классы и присваивать им свойства классов (вызов classes()), но, если класс не будет найден программа зависнит
//root.classes.$_import = [];

root.Data = {}
/**
		хранилище строковых переменных
		Добавляется путем создание объекта
		Data.Strings.ru = {
			string1_ID : 'строка 1',
			string2_ID : 'строка 2',
		}
		либо, через функцию Data.Strings._st(string1_ID, 'строка 1','ru');
		возвращается через функцию Data.Strings._gt(string1_ID,'ru');
		либо __str(string1_ID,'ru'); (второй параметр не обязательный - по умолчаню, берется язык браузера). В случае неудачи, возвращает обратно string1_ID (таким образом, alert(__str('dog1')) вернет строку в не зависимости от существованияя перевода
**/
  Data.Strings = {
	_gt : function(strID, ln){//Get string translate
		ln = ln || $_SYS.info.ln;  
		return this[ln]&&this[ln][strID] ? this[ln][strID] : strID;
	},
	_st : function( ){//Set string translate (string strID, string repl, [string language] || object strID, [object repl], [string language] )
	//('book','книга','ru') || ({'book' : 'книга','dog':'собака'},'ru') || (['book','dog'],['книга','собака'],'ru')
	//return translate string || boolean (true | false)
		var strID, repl, ln;
		strID = arguments[0];
		if((typeof arguments[0] == typeof arguments[1]))repl = arguments[1]; 
		 ln = (arguments.length == 2 && !repl)?arguments[1] : (arguments.length == 3 )?arguments[2] : $_SYS.info.ln;
		 if(!(typeof ln=='string' || typeof ln=='number') || (typeof ln=='string'&&ln.length>10))return false; //предохранитель от попадания текста
		 if(!this[ln])this[ln]={};
		 if (typeof strID == 'object'){
			if(repl) for(var i in strID) this[ln][strID[i]]=repl[i]; else for(var i in strID) this[ln][i]=strID[i];  
		}else{
			this[ln][strID]=repl;
			return this._gt(strID,ln);
		}
		return true;
	}
}
//псевдоним
root.__str = function(){return Data.Strings._gt.apply( Data.Strings,  arguments);}
var $_SYS = function(obj) {
    if (obj instanceof sys) return obj;
    if (!(this instanceof sys)) return new sys(obj);
  };
  
root.$_SYS = $_SYS; 
$_SYS.tmp = {}  

/** = Библиотека вспомогательных функций (слияние объектов, обработка гет-зпросов и т.д.) = **/
$_SYS.Library = $_SYS.fn = $_SYS.lib = {
 
	// === Получение данных (Get и coockie)
		get_query : function(){
			var get_str = location.search;
			if(get_str != ''){ var tmp = (get_str.substr(1)).split('&');
			for(var i=0; i < tmp.length; i++){var tmp2 = tmp[i].split('='); this[tmp2[0]] = tmp2[1]; }
			}
		},  
	 
		setCookie : function (name, value, expires, path, domain, secure) { 
			// +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com) 
			/*
			setcookie(name, value, expires, path, domain, secure)
			name - название cookie
			value - значение cookie (строка)
			options - Объект с дополнительными свойствами для установки cookie:
				expires - Время истечения cookie. Интерпретируется по-разному, в зависимости от типа:
							Число — количество секунд до истечения. Например, expires: 3600 — кука на час.
							Объект типа Date — дата истечения.
							Если expires в прошлом, то cookie будет удалено.
							Если expires отсутствует или 0, то cookie будет установлено как сессионное и исчезнет при закрытии браузера.
				path - Путь для cookie.
				domain - Домен для cookie.
				secure - Если true, то пересылать cookie только по защищенному соединению.
				*/
			expires instanceof Date ? expires = expires.toGMTString() : typeof(expires) == 'number' && (expires = (new Date(+(new Date) + expires * 1e3)).toGMTString());
			var r = [name + "=" + escape(value)], s, i;
			for(i in s = {expires: expires, path: path, domain: domain}){
				s[i] && r.push(i + "=" + s[i]);
			}
			return secure && r.push("secure"), document.cookie = r.join(";"), true;
		}, 

		getCookie : function(name) {
			/*myVar = GetCookie("postIDs");*/
			var cookie = " " + document.cookie;
			var search = " " + name + "=";
			var setStr = null;
			var offset = 0;
			var end = 0;
			if (cookie.length > 0) {
				offset = cookie.indexOf(search);
				if (offset != -1) {
					offset += search.length;
					end = cookie.indexOf(";", offset)
					if (end == -1) {
						end = cookie.length;
					}
					setStr = unescape(cookie.substring(offset, end));
				}
			}
			return(setStr);
		}, 
 
		getInfo : function(){ 
			this.screen = {
				Width :  $_SYS.fn.min([document.documentElement.clientWidth, window.screen.availWidth,window.innerWidth, window.screen.width]),
				Height : $_SYS.fn.min([document.documentElement.clientHeight, window.screen.availHeight, window.innerHeight,window.screen.height])
			}
			this.ua = navigator.userAgent.toLowerCase();
			//var dev = ["iphone", "ipad", "android", "phone", "msie"];  appCodeName
			//var brows = ['chrome',];
			this.ln = $_GET['ln'] || navigator.language || navigator.userLanguage;
			//Ширина полосы прокрутки
			this.scrBarWidth = function(){
				if(typeof this.screen.scrBarWidth =='undefined')
				{
					var div = document.body.addChild({style:{overflowY : 'scroll',visibility : 'hidden', position:'relative'}}).Width(50).Height(50);
					this.screen.scrBarWidth = div.offsetWidth - div.clientWidth;
					div.remove(); 
				}
				return this.screen.scrBarWidth;
			}
		},	
		 
  
	//Проверка объектов
		
		//проверяет существование переменной 
		isset : function(path){ try{ return (typeof  eval(path)!='undefined')?true:false}catch(e){return false;} },
		empty : function(path){ try{var data = eval(path); return ( data || typeof data == 'number' )?true:false}catch(e){return false;} },
		//проверяет существование значения переменной 
		issetValue : function(a){ return  (typeof a!='undefined'&&a!=null); },
 
		 now : Date.now || function() {//
			return (new Date()).getTime();
		}, 
		 
		 //
		 
		
		 on : function(e,event,f, useCapture, _this_){
			$_SYS.Node.EventListener('add', e,event,f, useCapture, _this_);
		 },
		
		off : function(e,event,f, useCapture){
			$_SYS.Node.EventListener('remove', e,event,(f.event_f||f), useCapture);
		 },
	// === Ф-ции, отвечающие за загрузку 

		onReady : function(handler) { 
			document.addEventListener( "DOMContentLoaded", function(){ handler(); }, false );   
		},    
		
		//Блокировка стандартных ф-ций браузера - чтобы не мешались
		preventDefault : function(){ 
					var stopF = function(e) {
						if (e && e.preventDefault) { e.preventDefault(); }
						if (e && e.stopPropagation) { e.stopPropagation(); }
						return false;
					};
					document.oncontextmenu = stopF;//function (){return false};//Будем пытаться бороться с контекстным меню
					// ничего не делать в обработчике событий, за исключением отмены события
					document.ondragstart = stopF; 
					// ничего не делать в обработчике событий, за исключением отмены события
					document.onselectstart = stopF;
					//Отмена перемещения окна мобильного браузера
					document.body.ontouchstart = stopF; 
					document.body.ontouchmove = stopF;
				},
				
	// === Разное
		
	// использование Math.round() даст неравномерное распределение!
	getRandomInt : function (min, max)
	{
	  return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	//Аналог Math.min и Math.max, но работает с большим кол-ом переменнных
	lim : function(arr, zn){ var n = (typeof zn == "undefined" || zn == 'max' || zn == 1) ? 1 : -1;
		var a; for(var k in arr){if(!a || n*arr[k]>a*n){a = arr[k];}} return a;
	},
	min: function (arr){return $_SYS.fn.lim(arr, -1);},//Псевдоимы
	max: function (arr){return $_SYS.fn.lim(arr, 1);},
	
	/*createBlock : function(parent, attr, update){
		var parent = (typeof parent == 'object') ? parent :
		(!parent || parent=='window' || parent=='screen')? false:(parent=='body'||parent=='root') ? document.body :
		document.getElementById(parent);  
		var el; 
		if(update && attr.id){ el = document.getElementById(attr.id);}  
		if(!el){el = document.createElement(attr.TagName || 'div'); update=false;}
		
		for(var key in attr){if( attr[key]!='__fun' && attr[key]!='__styles') el[key] = attr [key];}
		if(parent && !update) parent.appendChild(el);
		//Функции, выполняемые для элемента, передается ввиде __fun : {funct_name : args, ...} =>для el.funct_name(args);
		//__styles и __fun по сути - равнозначные функции.  Реализовал ввиде по отдельности для лучшей читабельности кода. Условно __styles - функции, отвечающие за стили, __fun - все остальные
		if( attr.__styles ) $_SYS..Object.forEach(attr.__styles,function(value,s){ if(typeof el[s] == "function")el[s](value); }) ; 
		if( attr.__fun )  $_SYS..Object.forEach(attr.__fun, function(value,s){ if(typeof el[s] == "function")el[s](value); }); 
		return el;
	},*/
	
	removeBlock : function(a){
		if(typeof a=='string'){var a={id:a}; }
		if(a.id){document.getElementById(a.id).remove();}else if(a.class){document.getElementsByClassName(a.class).remove();}
	},
	
	/*updateBlock : function(){
	
	},
	
	defaults : {	// Значения для персонажа по умолчанию
		mc : {
			_x	: 0,// х угла
			_y	: 0, 
			XC	: 0,// х центра
			YC	: 0,
			width : 0,// ширина
			WidthC : 0,// полуширина (от центра до края)
			height : 0,
			HeightC : 0,
			init : function(){}, // Инициализация
			onLoad : function(){}, // По загрузки ресурсов
			onEntereFrame : function(){} // При каждом вхождении в кадр
		}
	}, 
	
	createObject : function(args, view){
		var o = {};  
		if(typeof args == "object"){$_SYS.Object.Import(o, args);}
		if( view ){  
			o.view = (typeof view =='object') ? view : {}
			var el = {}; 
			if(o.class)el.class=o.class + (o.subclass ? ' ' + o.subclass : '');  if(o.id)el.id = o.id;
			o.view.el = this.createBlock((args.parent ? args.parent : "root"), el);
		}
		return o;
	},
	
	removeObject : function(o){
		if(o.view.el)o.view.el.remove(); 
	},*/
		
	//Получает разницу между 2мя числами, abs - отбрасывать "-" у отрицательных значений или нет (иногда нужно для сравнений: delta < 0 эквивалентно |a|<|b|) 
	
	
	//Debug - функция для проверки скорости выполнения скрипта
	testTime : function(_f){
	console.time('test');
	var a = _f();
	console.timeEnd('test');
	return a;
	}
}
/** = /END Библиотека вспомогательных функций  = **/
$_SYS.Node = {
//Returns true if it is a DOM node
		 isNode : function(o){
		  return (
			typeof Node === "object" ? o instanceof Node : 
			o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
		  );
		},

		//Returns true if it is a DOM element    
		 isElement : function(o){
			  return (
				typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
				o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
			);
		}, 
		
		EventListener : function($do, e,event,f, useCapture,_this_){
			switch(event){
				case '_MOUSE*' :
				event = ['mousedown','touchstart','mousemove','touchmove','mouseup','touchend']; 
				break;
				case '_MOUSE**' :
				event = ['mousedown','touchstart','mousemove','touchmove','mouseup','touchend', 'mouseenter', 'mouseleave','click']; //'mouseover','mouseout'
				break;
				case '_DOWN' :
				event = ['mousedown','touchstart']; 
				break;
				case '_MOVE' :
				event = ['mousemove','touchmove'];  
				break;
				case '_UP' :
				event = ['mouseup','touchend']; 
				break;
				case 'KEY' :
				event = ['keydown','keyup']; 
				break;
				case 'INPUT' : event = ['input','change'];  break;
				case 'INPUT*' : event = ['input','change','click'];  break;
				default:
				if(typeof event === 'string')event = event.split(' ');
				break;
			}
			var type = {
				'mousedown' : 'down',
				'touchstart' : 'down',
				'keydown' : true,
				'mouseup' : 'up',
				'touchend' : 'up',
				'keyup' : false,
				'mousemove' : 'move',
				'touchmove' : 'move',
				'mouseenter' : 'over', 
				'mouseover' : 'over', 
				'mouseleave' : 'out',
				'mouseout' : 'out',
			}; 
			for(var i in event){ 
				f.event_f = function(e){ f.call((_this_ || e),e,(type[e.type] || e.type))}
				e[$do + 'EventListener'](event[i], f.event_f, useCapture);
			}
		},
		
		
		NSURL : {
			HTML : 'http://www.w3.org/1999/xhtml',
			SVG : 'http://www.w3.org/2000/svg',
			xlink: 'http://www.w3.org/1999/xlink',
			XBL : 'http://www.mozilla.org/xbl',
			XUL : 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul' 
		},
		NS : false,
		setNS : function(NS){ 
			if(NS&&NS!=='default'&&NS!==true){this.NS = this.NSURL[NS.toUpperCase()]||NS}else this.NS = false;
			return this;
		}, 
		create : function(){
		//Разбор аттрибутов: TagName,attr,innerHTML || attr,innerHTML || innerHTML ||  attr || TagName,innerHTML|| TagName,attr
		var NSURL = this.NSURL, isSVG = this.NS===NSURL.SVG;
		var Data = { TagName : (isSVG?'g':'div'), attr : {}, innerHTML : false, NS : this.NS }, i , A= arguments; 
		if(A.length===1&&typeof A[0]==='object'&&typeof A[0].length === 'number')A=A[0];//Чтобы не вызывать apply
		if(A.length==1) Data[typeof arguments[0]=='object'?'attr':'innerHTML'] = A[0]; 
		else for( i=A.length-1; i>=0; i-- ) switch(typeof A[i]){
					case 'object': Data.attr = A[i];break;
					case 'string': if( i===0&&A.length>0 ){Data.TagName = A[i]; break; } 
					default:Data.innerHTML = A[i];
				}    
		//END Разбор аттрибутов
		//Удаление посторонних объектов
		var ex = {TagName:'TagName',tagName:'TagName',innerHTML:'innerHTML',content:'innerHTML'};
		for(i in ex){
			if(i==='content'&&typeof Data.innerHTML !== 'undefined')continue;//если есть innerHTM, content игнорируется
			if(Data.attr[i]){ Data[ex[i]]=i==='NS'? NSURL[Data.attr[i]]||Data.attr[i]:Data.attr[i];delete Data.attr[i]; }
		}  
		
		//createElementNS  
		var a = (typeof Data.NS==='string')? document.createElementNS(Data.NS,Data.TagName ):document.createElement( Data.TagName );//attr.tagName  
		//attributes 
		var key, value, ind;
		for(key in Data.attr){//if(attr.hasOwnProperty(key))
			value = Data.attr[key];  

			toAk:switch(typeof a[key]){
				case 'function': a[key](value); break;// ex: Node.Width(value); 
				case 'object': if(typeof value === 'object'){for(var d in value)a[key][d] = value[d];break;}// ex:  {dataset : {}, style : {}}
				case 'undefined':  
				switch(typeof value){
					case 'string':case 'number':case 'boolean':
					ind = key.indexOf(':'); 
					if(ind!==-1) a.setAttributeNS(NSURL[key.slice(0,ind)] ,key.substr(ind+1), value); else a.setAttribute(key , value); 
					break toAk;
				}
				default : try { a[key]=value; }catch(err){console.error(err,key,value);}//Прямое назначение иногда вызывает ошибку
			}
		}//a.namespaceURI
		if(Data.innerHTML){//facebook & zapo 
			if (isSVG && !('innerHTML' in a)) {
			var tmp = document.createElement('div');
			tmp.innerHTML = '<svg>' + Data.innerHTML + '</svg>';
			tmp=tmp.firstChild;
			while(tmp.firstChild)a.appendChild(tmp.firstChild); 
			}else{
			a.innerHTML=Data.innerHTML;
			}
		}
		return a;
	},
	bufer : function(){
		return document.createDocumentFragment();
	}
}
$_SYS.Object = {
	pushTo : function(a,e,after, before){
		if(typeof a != 'object')return false;
		//if(index!==false && dindex!==false)e = a[dindex];
		var b = {};//Вначале исходный массив очищается, затем заполняется вновь - массив не перезаписывается, чтобы сохранились ссылки на объект
		for(var i in a ){b[i]=a[i]; delete a[i]; }  
		if(before == 'first'||after == '/.'||Object.keys(b).length==0)for(var j in e)a[j]=e[j];  
		for(var i in b){ 
			if(before === true && i===after)for(var j in e)a[j]=e[j]; 
			a[i]=b[i];
			if(!before && i===after)for(var j in e)a[j]=e[j]; 
		}
		if(!a[after])for(var j in e)a[j]=e[j];// Если никуда не воткнулся - то в конец
		return a;
	},
	/*pushTo : function(a,e,index){ 
		return this._sort(a,e,after);
	},
	removeBy : function(a,dindex){ 
		if(!dindex&&dindex!==0)return a.pop(e);
		return this._sort(a,false,false,dindex);
	},*/
	moveTo : function(a,who,to ){ 
		var whoA;
		if(typeof who == 'object')var e = who, whoA = Object.keys(who);
		var e = {who: a[who]};
		if(whoA)for(var who in whoA)delete a[who];
		else delete a[who];
		return this.pushTo(a,e,to);
	},
	rename : function(O,name,newname){ 
		var e = {}; e[newname]=a[name];
		this.pushTo(a,e,name);
		delete a[name];
		return a;
	},
	isCloning : function(o){//Проверка на запрет клоирования (в этом случае, объект передается как ссылка)
		return (typeof o == 'object' && !o.noClone &&  !classes.isClass(o) &&  o.objectType!="classExtend" &&  !$_SYS.Node.isNode(o))? true : false;
	},
	
	//Операции с объектами
	 
	
	Import : function(a,b){//Слияние объектов Одноименные из b перекрывают a 
		var Import = $_SYS.Object.Import, isCloning = $_SYS.Object.isCloning;
		if(typeof b !== "object" || $_SYS.Node.isNode(b))return b;
		// if( Array.isArray(b)){  if(!Array.isArray(a))a=this.Import([],a);
		var isArrayA = Array.isArray(a),isArrayB = Array.isArray(b); 
		if( typeof a !== "object" || isArrayB&&Object.keys(a).length===0){a=isArrayB ? [] : {}; isArrayA=isArrayB;}
		if( isArrayA&&isArrayB ){  
			var len = b.length,i, Ai,Bi;
			for(i=0;i<len;i++){Ai = a[i];Bi=b[i];
				if(classes.isClass(b[i]))continue;  
				a[i]=typeof Bi!=='object'? Bi : (typeof Ai!=='object' || isCloning(Ai) && isCloning(Bi)) ? Import(Ai,Bi) : Import(false,Bi);				
			}
			a.length = Math.max(a.length,len);
		 }else if (b instanceof Date) {
			a = new Date(); a.setTime(b.getTime()); 
		} else {
			//Если а и б массивы или !а и б массив - возв массив, иначе объект
			var i, Ai,Bi;
			if( !isArrayB &&  isArrayA ){//массив => объект
				var c = {}, len = a.length; for(i=0;i<len;i++)c[i]=a[i]; a=c;
			}
			for(i in b){//  if (b.hasOwnProperty(key)) 
				if(!b.hasOwnProperty(i)||classes.isClass(b[i])||i === 'objectType')continue;
				Ai = a[i];Bi=b[i];
				a[i]=typeof Bi!=='object'? Bi : (typeof Ai!=='object' || isCloning(Ai) && isCloning(Bi)) ? Import(Ai,Bi) : Import(false,Bi);
			} 
		} 
		return a;
	},
	copy : function(a){ 
		return this.Import(false,a);
	},
	marge : function(a,b){//то же самое, но при этом создается новый объект
		if(typeof b !== "object" || $_SYS.Node.isNode(b))return b;
		if(typeof a !== "object" || $_SYS.Node.isNode(a))return this.Import(false,b); 
		//var c ={};  for(var key in a){if(this.isClass(a[key])){continue;}c[key] = a[key];}
		var c = this.Import(false,a);
		return this.Import(c,b);
	}, 
	/*extend : function(Child, Parent) {//Делает первый класс потомком второго
		var F = function() { }
		F.prototype = Parent.prototype
		Child.prototype = new F()
		Child.prototype.constructor = Child
		Child.superclass = Parent.prototype
	},*/
	
	/*clone : function (obj) {
		var copy;

		// Handle the 3 simple types, and null or undefined
		if (null == obj || "object" != typeof obj || $_SYS.Node.isNode(obj)) return obj;

		// Handle Date
		if (obj instanceof Date) {
			copy = new Date(); copy.setTime(obj.getTime());
			return copy;
		}

		// Handle Array
		if (obj instanceof Array) {
			copy = [];
			for (var i = 0, len = obj.length; i < len; i++) {
				copy[i] = this.clone(obj[i]);
			}
			return copy;
		}

		// Handle Object
		if (obj instanceof Object) {
			copy = {};
			for (var attr in obj) {//Копируемые объекты проверяются функцией isCloning
				if (obj.hasOwnProperty(attr)) copy[attr] = this.isCloning(obj[attr]) ? this.clone(obj[attr]) : obj[attr];
			}
			return copy;
		}

		throw new Error("Unable to copy obj! Its type isn't supported.");
	}, */
	
	
	 forEach : function(a,f,t){//forEach для объектов
		if(a.forEach){a.forEach(f,t);}else{for(var i in a){f.call((t?t:a[i]),a[i],i,a);}}
	 },
	  
	objExplode : function(obj){//Разбивает объект на два массива - ключи и значения
		var result = {key:[],value:[]};
		for(var i in obj){result.key.push(i); result.value.push(obj[i]);}
		return result;
	},
	/*stringify : function(o){
		switch(typeof o){
			case 'function': case 'boolean': return o.toString;
			case 'number' : return o;
			case 'object' : 
				var s = '', a = arguments.callee;
				if(Array.isArray(o)){
					for(var i in o){}
				}
			default : return JSON.parse(o);
		}
	},*/
	//Ищет объект по пути (в root либо указаном объекте). Путь вида a.b.c либо a/b/c/ a/b.c будет искать как ['a/b'][c] если не задать sep; act = 'set' - создаст цепочку объектов
	getFromPath : function(parent,_path_,sep, act){//
		if(arguments.length == 1){var _path_ = arguments[0], parent = root;}
		var sep = sep || _path_.indexOf('.')>-1 ? '.' : '/';
		if(!act)act='get';
		if(_path_.indexOf(sep)==-1){
			if(act=='set'&&!parent[_path_])parent[_path_]={};
			return parent[_path_] || false; 
		}
		_path_ = _path_.split(sep);
		if(act == 'set')
		for(var i in _path_){if(i==0&&_path_[i]=='root')continue;if(parent[_path_[i]])parent[_path_[i]]={}; parent = parent[_path_[i]]; }
		else
		for(var i in _path_){if(i==0&&_path_[i]=='root')continue;parent = parent[_path_[i]]; if(!parent)return false;}
		return parent || false;
	},
	setToPath : function(parent,_patch_,obj,sep){
		if(typeof arguments[0] == 'string'){var _patch_ = arguments[0], obj = arguments[1], sep = arguments[2] || false;}
		var sep = sep || _patch_.indexOf('.')>-1 ? '.' : '/', index= _patch_.lastIndexOf(sep); 
		this.getFromPath(parent,_patch_.substr(0,index),sep, 'set')[_patch_.substr(0,index+1)]=obj;
		return obj;
	},
	toKeys : function(a,v,t){//obj,value|function,this
		 var o={},t=t||this;
		 for(var i in a)switch(typeof a[i]){case 'string':case 'number': o[a[i]] = typeof v==='function'?v.call(t,a[i],i,a,o):typeof v==='undefined'?i:v; }
		return o;  
	} 
};
 $_SYS.Array = {
			_sort : function(a,e,index, dindex){ 
				if(!Array.isArray(a))return false; 

				if(arguments.length==4)e = a[dindex];
				var b = [],i,l;//Вначале исходный массив очищается, затем заполняется вновь - массив не перезаписывается, чтобы сохранились ссылки на объект
				//while(a.length){b.push(a.shift());} 
				l = a.length; for( i=0; i<l; i++)b[i] = a[i]; a.length=0;
				for( i=0; i<l; i++){ if(i===index)a.push(e); if(i!==dindex)a.push(b[i]); }


				return a;
			},
			pushTo : function(a,e,index){
				
				if(index === 0){a.unshift(e); return a;}
				if( !index ||index>=a.lenght){a.push(e); return a; }
				return this._sort(a,e,index);
			},
			removeBy : function(a,dindex){ 
				if(dindex === 0){a.shift(); return a;}
				if( !dindex ||dindex == a.lenght-1){return a.pop( );}
				return this._sort(a,false,false,dindex);
			},
			getIndex : function(a,index){
				if(typeof index == 'undefined')return a.length-1;
				switch(index){
					case 'end':case 'last': case false : case null: return a.length-1; 
				}
				return index;
			},
			moveTo : function(a,who,to ){ 
				who = this.getIndex(who);to = this.getIndex(who); 
				if( who === 0  && to >= a.lenght-1){
					a.push(a.shift()); return a;
				}else if( who >= a.lenght-1  && to === 0){
					a.unshift(a.pop()); return a;
				}else{
				return this._sort(a,false,to,who);
				}
			},
			inArray : function (arr, val) {
				if (arr == null)throw new TypeError('"this" is null or not defined'); 
				var  k=0, O = Object(arr), len = O.length >>> 0;//len = ToUint32(O.length)  
				if (len !== 0)while (k < len) {  if (k in O && O[k] === searchElement) return true;   k++; }
				return false; 
			},
		}
		
		$_SYS.Number = {
			toNumber : function(value,abs,_int){
				value=Number(value);
				if(value!==value)return 0;  
				if (value === 0 || !isFinite(value)) return value;
				if(_int)value = parseInt(value); 
				return (value||!abs > 0 ? 1 : -1) * value; 
			},
			delta : function(a,b,abs){var z = (Math.abs(a)-Math.abs(b));  return (!abs? Math.abs(z):z);},
		}
		$_SYS.Function = {
			isFunction : function(){
				 return typeof fn === 'function' || Object.prototype.toString.call(fn) === '[object Function]';
			}
		}
		$_SYS.String = {
		
		
			replace : function(a,b,str){//Попытка реализовать аналогичную php ф-цию
				if(typeof a !=="object"){var a = [a];}
				if(typeof b !=="object"){var b = [b];} 
				for(var k in a){if (!a.hasOwnProperty(k))continue; 
					 //Отчистка от спецсимволов
					var re = new RegExp(a[k].replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'g');
					str = str.replace(re, b[k]);
				}
				return str;
			},
			
			toTitleCase : function(str) {// строка => Строка (Ben Blank) 
				return str.replace(/(?:^|\s)\w/g, function(match) { return match.toUpperCase(); });
			},
			
			toCamel : function(a){ // с-трока => сТрока
				return a.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
			},
			
			reCamel : function(a){ // сТрока => с-трока 
				return a.replace(/([A-Z])/g, function($1){return ('-'+$1.toLowerCase());});
			},
		}
/** = Загрузка скриптов, классов и изображений = **/
$_SYS.Loader = {
	
	getXmlHttp : function (){
	  var xmlhttp;
	  try {
		xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
	  } catch (e) {
		try {
		  xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		} catch (E) {
		  xmlhttp = false;
		}
	  }
	  if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
		xmlhttp = new XMLHttpRequest();
	  }
	  return xmlhttp;
	},
	LoadData :  function(url, _callback, type, _this_) {
			var xmlhttp = this.getXmlHttp(); // code for IE7+, Firefox, Chrome, Opera, Safari  
				var options = {
					url : '',
					_this_ : xmlhttp,
					_callback : function(data){ console.log(data);},
					type : 'data',
					metod : 'GET'
				};
			 if(typeof arguments[0] == 'object'){//Возможна передача параметров как в виде объекта, так и последовательностью 
				for(var i in arguments[0]){options[i]=arguments[0][i];}//$_SYS.Object.Import нельзя использовать. т.к. клонирует _this_
				 if(typeof arguments[1] == 'object'){options._this_ = arguments[1];}
			 }else{ 
				for(var key in options){if(window[key])options[key]=window[key];}
			 }
			options.url = (this.rootURL && options.url.indexOf('://')==-1 && options.url.indexOf('/')!=0)? this.rootURL+options.url : options.url; 
			;
			options.body = null;
			if(options.data){
				var body = '', formData = new FormData();
				for(var key in options.data){//if(options.data[key].type){console.log(options.data[key].type);}
					if(typeof options.data[key]=='object' && ! (options.data[key].type && options.data[key].type.match(/image.*/)))options.data[key]=JSON.stringify(options.data[key]);
					formData.append(key, options.data[key]); body += key +'='+options.data[key]+'&';
				} 
				if(options.metod.toUpperCase() == 'GET'){
					options.url = options.url + (options.url.indexOf('?')>=0 ? '' : '?')+ body;
				}else{
					options.body = formData;
				}
			}
			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
				   if(xmlhttp.status == 200){ 
					if (xmlhttp.readyState == 4) {//Complete 
					   var data = xmlhttp.responseText;  
					   if(options.type=="script") {data = eval('('+data+')');} else if(options.type.toLowerCase()=="json"){ data = JSON.parse(data);}
					   options._callback.call(options._this_, data,xmlhttp,options); 
					   }
				   }  else { console.log('Err ',url,xmlhttp);  }
				}
			} 
			xmlhttp.open(options.metod.toUpperCase(), options.url, true);
			//if(options.file) xhr.setRequestHeader("X_FILENAME", options.file.name); 
			xmlhttp.send(options.body); 
	},
	jsonp : function(url, _callback) {
		var options = {
					url : '',
					_this_ : this,
					_callback : function(data){ console.log(data);}, 
				};
		 if(typeof arguments[0] == 'object'){//Возможна передача параметров как в виде объекта, так и последовательностью 
				for(var i in arguments[0]){options[i]=arguments[0][i];}//$_SYS.Object.Import нельзя использовать. т.к. клонирует _this_
				 if(typeof arguments[1] == 'object'){options._this_ = arguments[1];}
			 }else{  
				if(url)options.url=url;
				if(_callback)options._callback=_callback;
			 }
	    var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
	    window[callbackName] = function(data) {
		delete window[callbackName];
		document.body.removeChild(script);
		if(options._callback)options._callback.call(options._this_,data);
	    };

	    var script = document.createElement('script');
	    script.src = options.url + (options.url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
	    document.body.appendChild(script);
	},
	ReadFileAs : function(as,url,f,$T,er){  
		var xhr = new XMLHttpRequest();       
		xhr.open("GET", url, true); 
		xhr.responseType = "blob";
		xhr.onload = function (e) {  
            var reader = new FileReader();
            reader.onload = function(event) {  if(f)f.call($T||this,event.target.result); }
            var file = this.response,enc;//UTF-8
			switch(as){
				case 0: as = 'DataURL';break;
				case 1: as = 'Text';break;
				case 2: as = 'ArrayBuffer';break;
				case 2: as = 'BinaryString';break;
				default : 
				if(as.indexOf('Text:')!==-1){enc = as.substr(as.indexOf(':')+1);as = 'Text';}
			}
			if(as === 'Text'&&enc)reader.readAsText(file,enc);
			else if('readAs'+as in reader) reader['readAs'+as](file);
           
		};
		xhr.onerror = function() { 
		if(er === true&&f)er = f;
		if(typeof er === 'function')er.call($T||this,undefined);
		console.error( "Ошибка загрузки: " + url ); };
		xhr.send()
	},
	LoadAsBaseURL : function(url,f,type,$T){
		if(typeof type === 'object'){$T = type;type = '';}
		var mime = this.mime;
		var xhr = new XMLHttpRequest();       
		xhr.open("GET", url, true); 
		xhr.responseType = "blob";
		xhr.onload = function (e) {  
            var reader = new FileReader();
            reader.onload = function(event) {
               var res = event.target.result; 
			    
				if(!type && file.type === 'application/xml' && url[url.length-1]!=='/'){
					var i; 
					if((i = url.indexOf('?')) === -1)url = url.substr(url.lastIndexOf('/')+1);
					else url.slice(url = url.lastIndexOf('/')+1,i);
					if(url && (i = url.lastIndexOf('.'))!==-1){
						var ext =  url.substr(i+1).toLowerCase();
						switch(ext){ 
							case 'png':case 'gif':type = 'image/'+ext;break;
							default:
							if(ext.indexOf('jp')===0)type = 'image/jpeg';
							if(ext.indexOf('htm')===0)type = 'text/html';
							if(mime[ext])type = mime[ext];
						}
					} 
				}
			   if(type)res = res.replace(file.type,type);
			   if(f)f.call($T||this,res);
            }
            var file = this.response;
			reader.readAsDataURL(file);
           
    };
	xhr.onerror = function() { console.error( "Ошибка загрузки: " + url ); };
    xhr.send()
	},
	LoadAsB64Image : function(SRC,F, $T){
		var img = new Image;
		img.onload = $T ? function(e){F.call($T,e);} : F;
		this.LoadAsBaseURL(SRC,function(R){ img.src = R; });
		return img;
	},
	loadImages : function(data,f,$T){	
		var $T=$T||this, f = f || this.Init,i,set=false;
		$T.imgsLoaded = 0;
		for(i in data){
			if(typeof data[i] === 'string'){
				$T.imgsLoaded++;set=true;
				data[i]=this.LoadAsB64Image(data[i],function(){  
				if(--$T.imgsLoaded===0&&f)f.call($T,data); 
				});
			}			
		}
		if(set === false)f.call($T,data);//Предохранитель на случай пустого массива
		return data;
	}, 
	mime : {
		js : 'application/javascript',
		css : 'text/css',
		svg : 'image/svg+xml'
	},
	LoadItem : function(src, F, type, A, $T){//Загрузка объекта. По умолчанию - скрипта  
	/* src - url, F - func, type, A - доп. аргументы,передаваемые в ф. $T - this */
		var el = document.createElement(type), $T = $T || this;
		//Если путь не задан от корня сайта или с какого-то http берется локальный путь
		src = (this.rootURL && src.indexOf('://')==-1 && src.indexOf('/')!=0)? this.rootURL+src : src;
		if(type==='image')
		this.LoadAsBaseURL(src,function(R){ el.src = R; });
		else el.src = src;
		if(type=="script"){document.getElementsByTagName('head')[0].appendChild(el);}	
		el.onload =  function(e){F.call($T, e,A);} 
		el.onerror = function() { console.error( "Ошибка загрузки: " + src + ' (' + el.src + ')' ); };
		return el;
	}, 
	rootURL : false,//url, откуда все грузится. По умолчанию - папка скриптов
	loaded : 0,
	waits:{},//loadings очередь добавляется в очередь, потом изымается и проверяется, пуста ли очередь, если да - вызывается callback
	loading : {},
	getExtend : function(pach,lc){
		var ext = i.substr(0,i.indexOf('?')).substr(i.lastIndexOf('.')+1);
		return lc ? ext.toLowerCase():ext;
	},
	setWaits : function(a/*,type,path,onLoadItem*/){
		var v={type : 'script'},path='',onLoadItem, i; 
		 for( i=arguments.length-1; i>1;i--) switch(typeof arguments[i]){
				case 'function':v.onLoadItem = arguments[i];
				case 'string': if(i===1)v.type=arguments[i]; else path=arguments[i];
			}    
		if(path&&path.slice(-1)!=='/')path+='/';
		if(typeof a === 'object'){
			if(Array.isArray(a)) for( i=0; i<a.length; i++ ) this.waits[path+a[i]]=v;  
			 else  for( i in a){
				if(typeof a[i]=='object') this.setWaits(a[i], v.type, path+i+'/',v.onLoadItem);
				else this.waits[path+i+'/'+a[i]] = v; 
			}
		}else {this.waits[a] = v; }
		return this.getWaits;
	},
	getWaits : function( onLoadAll ){
		var  url, item, Loader = $_SYS.Loader;
		if(onLoadAll)Loader.onLoadAll = onLoadAll;
		var onLoadAll = onLoadAll||Loader.onLoadAll;  
		for(url in Loader.waits ){
			 item = Loader.waits[url];
			 Loader.loading[url] = item;
			 delete Loader.waits[url];
			/*if(item.type === 'script'){
				if(i.indexOf('classes.')===0)url = i.replace(/\./g, '/')+'.js';
				else if( url.slice(-3)!=='.js' )url+= '.js';
			}*/   
			Loader.LoadItem(url,function(e,url){ var  item = Loader.loading[url]; if(item){//Проверка нужна, чтобы исключить повторное срабатывание
				if(item.onLoadItem)item.onLoadItem(url,item); delete Loader.loading[url]; if(Object.keys(Loader.waits).length===0&&Object.keys(Loader.loading).length===0)onLoadAll();
			}},item.type,url);
		}
	},
	Includes : function(list, onLoadAll,onLoadItem,type){//Пакетная загрузка
		var  type = type || 'script';
		if(list.length===0){if(this.loaded===0)onLoadAll();return;} 
		this.loaded-=list.length;  
		this.setWaits(list,type,onLoadItem);
		list.forEach(function(item, k) { 
			var url = item;
			if(type == 'script'){
				if(item.indexOf('classes.')===0)url =  item.replace(/\./g, '/')+'.js';
				else if( url.slice(-3)!=='.js' )url+= '.js';
			}
			this.LoadItem(url,function(){ if(onLoadItem)onLoadItem(item); if(++this.loaded===0)onLoadAll();},type);
		},this);
	},
	/*Classes : function( f ){//Загрузка классов 
		if(!classes.$_import || classes.$_import.length==0){f();return;} 
		var Loader = this, update = function(path){  
			var obj = $_SYS.Object.getFromPath( path ); 
			if(obj.$_import && obj.$_import.length>0) 
			Loader.Includes(obj.$_import.map(function(i){return (path+'.'+i);}),f,update);  
		};
		update('classes');
	}, */
	getManifest : function(){ 
		if(typeof root.manifest!=='object')return this.getWaits; 
		var path = root.manifest.path || ''; if(path && path.slice(-1) !='/')path+='/';
		for(var type in root.manifest)if(type!=='path')this.setWaits(root.manifest[type], type, '');   
		return this.getWaits;
	}
}
root.$INCLUDE = function(list,type,dir){ 
	var cb = $_SYS.Loader.getWaits;
	if(!list.length)return cb;
	 var v={type : type||'script'},url,i,a, l=list.length; 
	if(type === 'classes'){
		v.type ='script'; dir=dir || 'classes/'; 
		v.onLoadItem = function(i,item){  
			var C = root.classes(item.Name);
			if(!C)console.log('$INCLUDE not found class: "'+item.Name+'" '+dir);
			if(C&&C.$INCLUDE){
			root.$INCLUDE(C.$INCLUDE,type,dir+item.Name); 
			delete C.$INCLUDE;
			cb();
			}
		}
	}
	if(dir&&dir.lastIndexOf('/')!==dir.length-1)dir+='/';    
			for(i=0; i<l;i++){ 
				a = $_SYS.Object.copy(v); 
				a.Name = list[i]; 
				url = (dir||'')+a.Name+(a.type==='script'&&a.Name.slice(-3)!=='.js'?'.js':''); 
				 $_SYS.Loader.waits[url]=a;
			} 
	return cb;
}

$_SYS.$Redistr = {}//Реестр объектов
$_SYS.$Get = function(id){return ( $_SYS.$Redistr[id] ? $_SYS.$Redistr[id] : false);}
//Получает элемент объекта или возвращает body
$_SYS.GetEl = function(obj){ //Если передана строка - пытается найти объект по id
	if(!obj)return false;
	var r=obj;
	if(typeof obj == "string") switch(obj){
			case  'root':case 'body': r = document.body; break; 
			//case  'screen':case 'window': r = $_SYS.$Get(obj) || false; break;
			default : 
				 r =  document.getElementById(obj)||$_SYS.$Get(obj)||false; 
		}  
	if(typeof r == "object")if($_SYS.Node.isNode(r))return r; else if(r.view  && r.view.el)return r.view.el;
	return false;
}

 

/** == Создает новый объект на основе аттрибуьлв и цепочки классов == **/
root.$New = $_SYS._New = function(){ //class,Data 
	if(arguments.length==0)return{};
	var result = arguments[0], i, $classes={};
	switch(typeof  result){
		case 'string': case 'number': result = classes[result]; if(!result)return console.error('classes['+result+'] not found!',arguments);break;
		case 'undefined':return console.error( 'arguments[0] undefined!',arguments);
	}
	if(typeof result.extendOf!=='undefined'){
		var obj=result, CLASSES = [obj];
		while(CLASSES[CLASSES.length-1].extendOf){
			i = CLASSES[CLASSES.length-1].extendOf;
			obj = i.indexOf('classes.')===-1?root.classes[i] : root.classes(i);
			if(!obj)break;else CLASSES.push(obj);
		}
		result = {}; 
		for(i =  CLASSES.length-1; i>=0;i--){
			result = $_SYS.Object.Import( result,CLASSES[i]);
			if(CLASSES[i].className)$classes[CLASSES[i]]=CLASSES[i].className; 
		}
		/*var _classesArr = result.extendOf.split('.'), C={}, obj = root.classes; 
		for( i in _classesArr){ 
			if(i==0&&_classesArr[i]==='classes')continue;
			obj = obj[_classesArr[i]];  $_SYS.Object.Import(C,obj);
			$classes[_classesArr[i]]=_classesArr[i]; 
		} 
		result = $_SYS.Object.Import(C,result);*/
	}else{
		result = $_SYS.Object.copy(result);
	}
		if(result.className )$classes[result.className]=result.className;
	 if(typeof arguments[1] ==='object'){   
	 $_SYS.Object.Import(result,arguments[1]);  
		if(result.className )$classes[result.className]=result.className;
	 } 
	 if(typeof arguments[2]==='object') for(i in arguments[2])result[i]=arguments[2][i]; 
	 if(result.id)$_SYS.$Redistr[result.id]=result;//Если суotcndetn id - объект будет доступен через $Get
	if(result.view){//обработчик вьюхи 
		if(typeof result.view!=='object')result.view={};//view можно задать как, например view = true; - объект создастся сам 
		var el_attr = {};  
		if(typeof result.parent === "string")result.parent = $_SYS.$Get(result.parent); 
		if(result.view.el!==false){//возможность передавать уже имеюшийся элемент либо вообще запрещать его создавать
			switch (typeof result.view.el){
				case 'string': result.view.el = document.getElementById(result.view.el); break;
				case 'object'://Может быть передан node или объект с параметрами 
					if($_SYS.Node.isNode(result.view.el)) break;
					el_attr=result.view.el; 
				default :  
				if(result.parentNode!==false)result.parentNode =  $_SYS.GetEl(result.parentNode||result.parent||false)||document.body;  //Задав false можно  создать "виртуальный" элемент  
				result.view.el  = $_SYS.Node.create(el_attr);			
				if(result.id&&!result.view.el.id)result.view.el.setAttribute('id',result.id); 
				if(result.parentNode)result.parentNode.appendChild(result.view.el);
			}  
				result.view.el.addClass($classes); 
				if( result.view.$styles )result.view.el.setStyles(result.view.$styles);
					var onCreate = result.view.$onCreate || result.view.$fun || false;
					switch(typeof onCreate){
						case 'function':onCreate(result.view.el);break;
						case 'object':for(i in onCreate)if(typeof result.view.el[i] == 'function')result.view.el[i](onCreate[i]);
					} 
		}else{delete result.view.el;}
		if(result.view.$ClassStyle )$_SYS.CSS.set(result,result.view.$ClassStyle); 
	}  
	result.objectType = 'object';
	if(result.extendOf){delete result.extendOf;} 
	if( result.__construct ){result.__construct(result);delete result.__construct;}//Можно задать собственную функцию, которая будет выполняться в самом конце сборки объекта
	return  result;
}
$_SYS.RegID=function(o,ret){
if(!o.id)o.id=(o.className||'id')+$_SYS.fn.now();
$_SYS.$Redistr[o.id]=o;
switch(typeof ret){
	case 'string':case 'number':return p[ret];
	case 'object':return ret;
	default : return this;
} 
};
//Функция проверяет, существует ли объект и, если уже существует, вызывает функцию __update() в нем, иначе вызывает _New()
/*$_SYS._Update = function(){ 
	var o = {}, result = {};
	if(arguments.length==0)
	{return result;}
	else if(arguments.length==1)//Переданы аргументы либо класс
	{ o = arguments[0]; if(o.classes){result = (typeof o.classes=="object")?o.classes : eval(o.classes);}}
	else if(arguments.length>=2)//Передан  (класс, аргументы)
	{   result = arguments[0];  o = arguments[1];  }
	if(o.id&&$_SYS.$Get(o.id)){
		var $obj = $_SYS.$Get(o.id);
		if($obj.__update){$obj.__update(o);}
		return $obj;
	}else{  
		return $_SYS._New(result,o);
	}
}*/

$_SYS._Remove = function(o){
	
	if(o.__destruct)o.__destruct.call(o,o);//Вызываем деструтор (!важен для корректного удаления модифицированного объекта: к примеру, если нужно удалить какие-то еще произвольные элементы или ссылки)
	if(o.view.el)o.view.el.remove();//Удаляем элемент
	if(o.id) delete $_SYS.$Redistr[o.id];//Удаляем из реестра
	if($_SYS.Animation.objects[o.id]) $_SYS.Animation.remove( o.id );//Удаляем из анимации
	for(var key in o)delete o[key];
	return null;
}

/** === 
Слои - это отдельные div. Отвечают за параллакс-эффект в основном
/Главный слой имеет 0 zIndex, слои выше - положительный, слои ниже - отрицательный. 
Каждый слой имеет собственные виртуальные слои, но они отвечают лишь за чередование объектов внутри слоя 
_default - какой слой считать главным (снизу вверх). Если _default отрицательное - отсчет будет вестись с верху, _default = -1 - самый верхний слой (только, если _count задано числом, а не списком)
_default по умолчанию - 0
Допустимые значения _count
	-Число - количество слоев
	-Объект 
	-При не заданном  _default:
		--Объект: default = _count._default | 0;  _count  = _count._count | 0;
		--Массив: _default= _count[1]; _count = _count[0];
	-При не заданном _default или после вышеописанного преобразования:
		Число - кол-во слоев (преобразуется в массив вида [-3,-2,-1, 1,2] из _count=[6,4])
		Массив слоев (кроме нолевого - он создается всегда) [-30,-25,-17, 14,22] (параллакс связан с индексом слоя)
	 
=== **/
/*
$_SYS.Layers = {
	add : function(obj, _count, _default){ 
		var _x = 0, _y=200;
		if(!arguments[1]){_count=1}else
		if(typeof arguments[1]=='object'){  
			if(arguments[1]._xy){_x=arguments[1]._xy[0];_y=arguments[1]._xy[1];}
			if(arguments.length==2){
				var _default = arguments[1][1] ? arguments[1][1] : arguments[1]._default ? arguments[1]._default : 0; 
				var _count =  arguments[1][0] ? arguments[1][0] : _count._count;
			} 
		} 
		
		if(typeof _count=="number"){ 
			if(_default<0){_default = _count-_default;}
			var _c = [];
			for(var i=1; i<=_default; i++){  _c.push((-1)*i); }
			for(var i=_default+1; i<_count; i++){  _c.push({zIndex : (i-_default)}); }
			_count=_c;
		} else{
			for(var c in _count){ if(typeof _count[c]=="number"){ _count[c]={zIndex : _count[c]}}}
		}
		console.log(_count);
		if(!obj.view.Layers){
			obj.view.Layers={onResize : function(){for(var l in Game.Level.view.Layers){if(!this[l].act){continue;} this[l].Width = this[l].view.el.width(); this[l].Height = this[l].view.el.height();console.log(this[l]);}}};
			obj.view.Layers.l_0 = this.create(obj.id,{}); 
		} else {
			for(var l in obj.view.Layers){if(l!='l_0'){this.activate(obj.view.Layers[l],false);}}
		}
		for(var c in _count){ if( _count[c] === 0)continue;
		
			if(!obj.view.Layers['l_'+_count[c]]){obj.view.Layers['l_'+_count[c].zIndex] = this.create(obj.id,_count[c]);  }else{this.activate(obj.view.Layers['l_'+_count[c].zIndex],true);}  
		}  
	},
	create: function(parentID, args){
	var a =	{ class : "Layer", zIndex : 0, parent : parentID, _xP :0, _yP :0, Width: 1, Height: 1, act:true };
	$_SYS.Object.Import(a,args);
		a.id = parentID+"_layer_"+a.zIndex; 
	 var e = $_SYS.fn.createObject(a,true); e.view.el.ZC(a.zIndex); return e;
	},
	remove: function(parentID, zIndex){ 
	 return $_SYS.fn.removeObject( );
	},
	activate : function(o, a){ o.act=a;  o.view.el[a ? 'show' : 'hidden'](); }
}*/
/** === Global - анимация. Функция setInterval не вызывается для каждого объекта - она запускается одна для всей программы. В $_SYS.Animation.obj добавляются ссылки на объекты, для которых должна срабатывать функция onEntereFrame, $_SYS.Animation.start и $_SYS.Animation.stop - запуск и остановка анимации. В $_SYS.Animation.start можно передать новое значение для timeout (при вызове без параметра будет взято значение dTimeout) === **/
$_SYS.Animation = {
	dTimeout : 80, //(1000/12 >>> 0)
	start : function(t){ if(this.i){if(t==this.timeout){return;}this.stop();}  this.timeout=t? t : this.dTimeout;  this.i = setInterval(this.callObjects, this.timeout); },
	stop : function(){ if(this.i){clearInterval(this.i); delete this.i;}},
	objects : {},
	add : function(id,obj){
		if(typeof id =='object'){ var obj = id, id = obj.id||$_SYS.RegID(obj,'id');  }
	this.objects[id]=obj; this.start();
	},
	remove : function(id){if(typeof id=='object')var id = id.id; delete this.objects[id]; if(!Object.keys(this.objects).length)this.stop();},
	callObjects : function(){  
		var o =$_SYS.Animation.objects; for(var i in o) if(o[i].onEntereFrame)o[i].onEntereFrame(); 
	}
}

$_SYS.CSS = {
	data : {},
	_new : 0,
	Alias : {//Псевдонимы, вида путь -> '<%find%>' : 'replace', для сокращения записи кода
		'<%path:data%>' : 'Data',
		'<%path:bg%>' : 'Data/backgrounds',
		'<%path:textures%>' : 'Data/textures'
	},
	setAlians : function(/*alias,replace | {alias1 : repace1,..}*/){//Добавляет псевдонимы 
	var A = arguments;
		if(A.length==2)this.Alias[A[0]] = A[1]; 
		else if(typeof A[0] === 'object') for(var a in A[0])this.Alias[a] = A[0][a]; 
		//перезаписывает _find _replace
		this._find = []; this._replace = [];
		for( var a in this.Alias ){ this._find.push(a); this._replace.push(this.Alias[a]); }
	},
	getSelector : function(){
		var find = arguments[0].match(/\<\=.*?\=\>/g);
			var selector, tmp, re, data=[];
			for(var i in find) data[i]=JSON.parse(find[i].match(/\<\=(.*?)\=\>/)[1]);//Получается, вид [[1,2,3],[]..]
			  
			for(var i in data[0]){//Переберается 1й из массивов (остальные,если есть, считаются равными по length)
				tmp = arguments[0];
					for(var j in data){//Замена в tmp всех найденных в find значений
						re = new RegExp(find[j].replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),'g');  
						tmp = tmp.replace(re, data[j][i]);
					}  
				selector = selector ? (selector + ', ' + tmp) : tmp; 
			}
		return selector;
	},
	setOne : function(selector, Data){//Добавляет стиль
		if(selector.indexOf('<=')>-1) selector=this.getSelector(selector);
		if(!this.data[selector])this.data[selector]={}; 
		var i=0;
		for(var s in Data){
			//Если используются псевдонимы () 
			if(this.data[selector][s] === Data[s])continue;
			this.data[selector][s] = Data[s]; i++;
		}
		if(this._new<i)this._new=i;//Если было добавленно что-то новое, this._new задается больше 0; Сравнение < вместо == нужно чтобы не занулить непустой new (бывает, когда какая-то другая функция поставила класс на обновление)
	},
	set : function(mainSelector, DATA){//Добавляет стили пакетом. $ => mainSelector
		var selector, Data;
		if(typeof arguments[0] == 'object'){//Можно передавать объект 
			var _s = {className : '.', id : '#', tagName : '', nodeName : ''}//Пытается найти хоть какую-то ацепку
			for(var i in _s){if(arguments[0][i]){var mainSelector =  arguments[0][i];break;}} 
		}
		var _template_=[mainSelector], _find_=['$'];
		for(var d in DATA){  
			 selector = (_find_.length>1 || d.indexOf('$')>-1 ) ? $_SYS.String.replace(_find_, _template_, d) : d; 
			if(typeof DATA[d] == 'string'){
				if(DATA[d].indexOf('template:')>-1){_template_.push(d); _find_.push('<%'+DATA[d].substr('template:'.length)+'%>');  }
			}else{
			 this.setOne(selector, DATA[d]);
			 }
		}
		
	},  
		cssNumber: {//Взято из jQuery - список стилей, в которых используется номер (для добавления суффикса px в остальные)
			"columnCount": true, "fillOpacity": true, "flexGrow": true, "flexShrink": true, "fontWeight": true, "lineHeight": true, "opacity": true, "order": true, "orphans": true, "widows": true, "zIndex": true, "zoom": true
		},
		
		update : function(){
			if(arguments.length==2)this.set(arguments[0], arguments[1]);//Можно вызвать set через update
			if(this._new==0)return;//небыло добавленно ничего нового 
			this._new=0;//Блокируем повторное либо лишнее выполнение
			//console.log(this.data);
			var css ='', tmp;
			if(!this.numValue){//Чтобы вручную не перебивать, т.к. хочу пока оставить список из jQuery, но здесь мне нужен список для обычных css// также, можно было бы пользоваться S_SYS.String.toCamel( name ) каждый раз, но лучше один раз вызвать
				 this.numValue={}
				 for(var i in this.cssNumber){this.numValue[$_SYS.String.reCamel(i)] = true;}
			}
			if(!this._find){//Если нет массива для поиска-замены псевдонимов (выполняется единожды)
				this.setAlians();
			}
			//Сведение классов в строку
			for(var sel in this.data){
				css+=sel+"{\n";
					for(var s in this.data[sel]){
						 tmp = this.data[sel][s];
						 if(typeof tmp == 'number'&&!this.numValue[s])tmp+='px';
						if(typeof tmp == 'string' && tmp.indexOf('<%')!=-1) tmp = $_SYS.String.replace(this._find, this._replace, tmp); 
						css+="\t"+s + ':' + tmp +";\n"
					
					}
				css+="}\n";
			}
			if($_GET['debug']=='css')console.log(css);
			if(!this.el){
			var head = document.head || document.getElementsByTagName('head')[0];
			this.el = document.createElement('style');
			this.el.type = 'text/css';
			this.el.id = 'sys_css'; 
			head.appendChild(this.el);
		} 
		//this.el.innerHTML = '';
		if (this.el.styleSheet){
				this.el.styleSheet.cssText = css;
			} else { 
				while (this.el.firstChild) {//firstElementChild
					this.el.removeChild(this.el.firstChild);
				}
				this.el.appendChild(document.createTextNode(css));
			}
		 
	}

}
/*$_SYS.CSS = {

}*/
$_SYS.onResize = function(){
	$_SYS.info.screen.Width =  $_SYS.fn.min([document.documentElement.clientWidth, window.screen.availWidth,window.innerWidth, window.screen.width]);
	$_SYS.info.screen.Height = $_SYS.fn.min([document.documentElement.clientHeight, window.screen.availHeight, window.innerHeight,window.screen.height]);
	for(var i in $_SYS.$Redistr)if($_SYS.$Redistr[i].onResize)$_SYS.$Redistr[i].onResize();  
}
window.addEventListener('resize',$_SYS.onResize);
//Объект мыши
$_SYS.Mouse={
	_x : 0, _y : 0, dx : 0, dy : 0, press : false, 
		move : function(e){ 
		var SM = $_SYS.Mouse;
		if(typeof e.touches!=="undefined" && e.touches[0])var e=e.touches[0];
		if (e.pageX == null && e.clientX != null ) { // если нет pageX..
			var html = document.documentElement, body = document.body; 
			e.pageX = e.clientX + (html.scrollLeft || body && body.scrollLeft || 0);
			e.pageX -= html.clientLeft || 0; 
			e.pageY = e.clientY + (html.scrollTop || body && body.scrollTop || 0);
			e.pageY -= html.clientTop || 0;
		}
		SM._x = e.clientX; SM._y = e.clientY;   SM.dx = e.pageX; SM.dy = e.pageY;   
		}, 
		down : function (e){  $_SYS.Mouse.press = true; $_SYS.Mouse.move(e); },
		up : function (e){  $_SYS.Mouse.press = false;   }
}
 
$_SYS.fn.on(window,'_DOWN', $_SYS.Mouse.down,false);
$_SYS.fn.on(window,'_MOVE', $_SYS.Mouse.move,false);
$_SYS.fn.on(window,'_UP', $_SYS.Mouse.up,false);
 

			
 

$_SYS.Key = {
	press : {//массив с нажатыми,отжатыми кнопками
	
	}, 
	keyboardMap : ["","","","CANCEL","","","HELP","","BACK_SPACE","TAB","","","CLEAR","ENTER","RETURN","","SHIFT","CONTROL","ALT","PAUSE","CAPS_LOCK","KANA","EISU","JUNJA","FINAL","HANJA","","ESCAPE","CONVERT","NONCONVERT","ACCEPT","MODECHANGE","SPACE","PAGE_UP","PAGE_DOWN","END","HOME","LEFT","UP","RIGHT","DOWN","SELECT","PRINT","EXECUTE","PRINTSCREEN","INSERT","DELETE","","0","1","2","3","4","5","6","7","8","9","COLON","SEMICOLON","LESS_THAN","EQUALS","GREATER_THAN","QUESTION_MARK","AT","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","WIN","","CONTEXT_MENU","","SLEEP","NUMPAD0","NUMPAD1","NUMPAD2","NUMPAD3","NUMPAD4","NUMPAD5","NUMPAD6","NUMPAD7","NUMPAD8","NUMPAD9","MULTIPLY","ADD","SEPARATOR","SUBTRACT","DECIMAL","DIVIDE","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12","F13","F14","F15","F16","F17","F18","F19","F20","F21","F22","F23","F24","","","","","","","","","NUM_LOCK","SCROLL_LOCK","WIN_OEM_FJ_JISHO","WIN_OEM_FJ_MASSHOU","WIN_OEM_FJ_TOUROKU","WIN_OEM_FJ_LOYA","WIN_OEM_FJ_ROYA","","","","","","","","","","CIRCUMFLEX","EXCLAMATION","DOUBLE_QUOTE","HASH","DOLLAR","PERCENT","AMPERSAND","UNDERSCORE","OPEN_PAREN","CLOSE_PAREN","ASTERISK","PLUS","PIPE","HYPHEN_MINUS","OPEN_CURLY_BRACKET","CLOSE_CURLY_BRACKET","TILDE","","","","","VOLUME_MUTE","VOLUME_DOWN","VOLUME_UP","","","SEMICOLON","EQUALS","COMMA","MINUS","PERIOD","SLASH","BACK_QUOTE","","","","","","","","","","","","","","","","","","","","","","","","","","","OPEN_BRACKET","BACK_SLASH","CLOSE_BRACKET","QUOTE","","META","ALTGR","","WIN_ICO_HELP","WIN_ICO_00","","WIN_ICO_CLEAR","","","WIN_OEM_RESET","WIN_OEM_JUMP","WIN_OEM_PA1","WIN_OEM_PA2","WIN_OEM_PA3","WIN_OEM_WSCTRL","WIN_OEM_CUSEL","WIN_OEM_ATTN","WIN_OEM_FINISH","WIN_OEM_COPY","WIN_OEM_AUTO","WIN_OEM_ENLW","WIN_OEM_BACKTAB","ATTN","CRSEL","EXSEL","EREOF","PLAY","ZOOM","","PA1","WIN_OEM_CLEAR",""],
	isDown : function(key){//Возвращает, нажата кнопка или нет
		if(!this.press[key])this.press[key]=false;
		return this.press [key];
	},
	keyDown : function(e){ if(!$_GET['debug']&&!Main['KeyDefault']){e.preventDefault();}
		//console.log(e.keyCode, $_SYS.Key.keyboardMap[e.keyCode]);
		var $T = $_SYS.Key;
		$T.press [ $T.keyboardMap[e.keyCode]]=true;
		if($T.onKeyDown)$T.onKeyDown($_SYS.Key.keyboardMap[e.keyCode]);
	},
	keyUp : function(e){ e.preventDefault();
		//console.log(e.keyCode, $_SYS.Key.keyboardMap[e.keyCode]);
		var $T = $_SYS.Key;
		$T.press[ $T.keyboardMap[e.keyCode]]=false;
		if($T.onKeyUp)$T.onKeyUp($T.keyboardMap[e.keyCode]);
	},
	//onKeyUp : function(){},
	//onKeyDown : function(){}
	Init : function(f,_t_){
		var $T = $_SYS.Key;
		$_SYS.Node.EventListener('add', window, 'keydown keyup', function(e,A){
			f.call( _t_||$T, $T.keyboardMap[e.keyCode],A,e );
		}, false);
	}
}
window.onkeydown = $_SYS.Key.keyDown;
window.onkeyup = $_SYS.Key.keyUp;


$_SYS.LocalFile = { 
	setListener  : function(el, callback, _this_,readAs){ 
		el.setAttribute('draggable', 'true');
		var $T=this, _this_ = _this_||this;
		 $_SYS.fn.on(el, 'dragenter dragstart dragend dragleave dragover drag drop', function(e){ e.preventDefault(); });
		 for(var ev = ['dragenter','dragstart','dragend','dragleave','dragover','drag','drop'], pDFun=function(e){ e.preventDefault(); }, 
		i=0; i<ev.length;i++)el.addEventListener(ev[i], pDFun);
		 el.addEventListener('dragover', function(e){ e.target.addClass('dragover'); }); 
		 el.addEventListener('dragleave', function(e){ e.target.removeClass('dragover'); });  
		$_SYS.fn.on(el, 'drop', function(e) {  
			e.target.removeClass('dragover');
			  $T.read(e.dataTransfer.files,callback,_this_,readAs); 
			 e.preventDefault();
		},false,_this_);
	},
	read : function(files, callback, _this_,readAs){ //readAs
		if(!window.File && window.FileReader && window.FileList && window.Blob){allert('not support browser!'); return;}
		if(!_this_)_this_ = this;
		 if(!files.length)files = [files];
		for (var i = 0, f; f = files[i]; i++) {
			 var reader = new FileReader();
			reader.File	= f;		 
			 reader.onload = function(event) {   if(callback)callback.call(_this_,this.File,event.target.result,event);} 
			 // Read in the image file as a data URL.
			console.log(f.type);  
		 
			if(!readAs)  var readAs = (!f.type || !f.type.match('text.*')) ? 'DataURL' : 'Text'; 
			readAs = (readAs.indexOf('readAs')==0 ? readAs : 'readAs'+readAs);
			reader[readAs](f);
		}
	},
	
	 uint8ToString : function(buf) {
		var i, length, out = '';
		for (i = 0, length = buf.length; i < length; i += 1) {
			out += String.fromCharCode(buf[i]);
		}
		return out;
	},
	
	getBase64 : function(Uint8Array, contentType){
		contentType = contentType ? "data:" + contentType + ";base64," : '';
		return contentType+btoa(this.uint8ToString(Uint8Array));
	},
	
}

$_SYS.Bazie = function(){
//Возвращает принадлежность точки к кривой базье, либо точку на кривой
},
$_SYS._lng =  function(_path_,string,ln){
		if(arguments.length == 1){var string = arguments[0], _path_=false;}
		var ln = ln || $_SYS.info.ln;
		if(!Data.Strings || !Data.Strings[ln])return string;
		
		if(!_path_)return Data.Strings[ln][string] || string;
		if(Data.Strings[ln][_path_] )return Data.Strings[ln][_path_][string] || string;
		if(_path_.indexOf('/')==-1)return $_SYS.Object.getFromPath(Data.Strings[ln],_path_,'/')[string] || string;  
		return string;
	}  
	/*Функция динамического добавления переводов
	способна делать преводы только вида 
	*/
	$_SYS._lng.Set = function(_path_,data,ln){
		var ln = ln || $_SYS.info.ln;
		if(!Data.Strings)Data.Strings={}
		if(!Data.Strings[ln])Data.Strings[ln]={};
		if(typeof data == 'object'){
			Data.Strings[ln][_path_]= Data.Strings[ln][_path_] || {};
			$_SYS.Object.Import(Data.Strings[ln][_path_],data); 
		}else{Data.Strings[ln][_path_] = data;}
		
	} 
 



 

/*Объект sys задает общие системные функции, как проверка загрузки и т.п.*/
 
	$_SYS.info = {
	
	} 
	
	
	$_SYS.Init = function(){  	
		root.$_GET = new $_SYS.fn.get_query(); 
		
		var sysJS = document.getElementById('JSGSys')||{dataset:{}};
		if(sysJS.dataset.path === '%' )$_SYS.Loader.rootURL = sysJS.src ? sysJS.src.substr(0,sysJS.src.lastIndexOf('/')+1): '';
		else $_SYS.Loader.rootURL = sysJS.dataset.path || '';
		
		this.info = new $_SYS.fn.getInfo();
		//console.info($_SYS.info);
		$_SYS.fn.onReady(function(){ 
			
			var head = document.head || document.getElementsByTagName('head')[0];
			var stel = document.createElement('style');
			stel.type = 'text/css';
			stel.id = 'sys_css_default'; 
			var css = 'html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, img, ins, kbd, q, s, samp, small, strike, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video { margin: 0; padding: 0;  border: 0; font-size: 100%; font: inherit; vertical-align: baseline; }'
			/* HTML5 display-role reset for older browsers */
			+'article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section { display: block; }'
			+'body {  line-height: 1; } ol, ul { list-style: none; } blockquote, q { quotes: none; }'
			+'blockquote:before, blockquote:after, q:before, q:after { content: ""; content: none; } table {  border-collapse: collapse;  border-spacing: 0; } .clearfix:before, .clearfix:after { content: " ";  display: table; }  .clearfix:after { clear: both; } .clearfix { *zoom: 1; } ';
			/* styles */
			css += 'html, body { height: 100%; overflow:hidden;  }'
			+'div{position:absolute;}'

			+'body *:not(input):not(textarea){user-select: none;'
			+'-ms-user-select: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -webkit-touch-callout: none; -webkit-user-drag: none;}' 
			+'body {background:#000; position:relative; color:#fff; font-family:Arial;}';
			if (stel.styleSheet)  stel.styleSheet.cssText = css;
			 else stel.appendChild(document.createTextNode(css)); 
			if(head.firstChild)head.insertBefore(stel,head.firstChild);  
			else head.appendChild(stel); 
			 
			var preloader = document.body.addChild({id:'Preloader'},'Идет загрузка...').position().$Style({textAlign: 'center', padding:50});
			
			//var onDataLoad = 
			//название файлов скриптов без ".js" - разширение доб. автоматически 
			var sclist=[ sysJS.dataset.manipath||'Main' ];
			//if(sysJS.dataset.extends!==false&&sysJS.dataset.extends!=="false")sclist.push('extends'); 
			//sclist.push(sysJS.dataset.manipath||'Main');
			if(sysJS.dataset.manifest!==false&&sysJS.dataset.manifest!=="false")sclist.push('manifest');
			root.$INCLUDE(sclist)( //$_SYS.Loader.Includes(sclist,
			 function(){
				if(classes.Main.$INCLUDE)root.$INCLUDE(classes.Main.$INCLUDE,'classes');
				root.Main = root.main = $_SYS._New(classes.Main);
				//$_SYS.Loader.Classes(function(){  
					//var data = (typeof manifest == "object"&&manifest.library) ? manifest.get_library() : {};  
					$_SYS.Loader.getManifest()(function(){preloader.parentElement.removeChild(preloader);  Main.Init();});
						/* var LoadClasses = function(){ 
					$_SYS.Loader.Classes(function(){   
						  if(data.images){ 
							$_SYS.Loader.Includes(data['images'],onDataLoad,null,'img');
						 } else {
							onDataLoad();
						 }
					 });
				};
					 if(data.scripts){
						$_SYS.Loader.Includes(data['scripts'],LoadClasses,null,'script');
					 }else{
						LoadClasses();
					 }
						 //}); */
			});
		});  
	}
	
	root.noClone = true;//запрет копирования
$_SYS.Init();
 })();

 /*** ===== EXTENDS ==== ***/
 /* === Расширения для NODE === */
 
 
 /*if(!Node.prototype.classList){ }*/
var $EXT = {} 
var $Extends = $EXT;//Для совместимости
$EXT.Node = function(obj) { // Для вызова в виде $EXT.Node(Node)._X()
    if ((obj instanceof Node)) return obj; else return document;
  }; 
  
/*$EXT.Node.classList = function(){
	return this this.className.split(' ');
}
$EXT.Node.classList.add = function(){ 
	var a = arguments, c = this.className ? this.className.split(' ') : [],k=' '+this.className+' ';
	for(var i=0; i<a; i++) if(k.indexOf(' '+a[i]+' ')===-1)c.push(cls);  
	this.className = c.join(' ');
}*/
  
$EXT.Node.addClass = function (cls) { 
	if(typeof cls!=='object'&&arguments.length===1&&this.classList ){this.classList.add(cls); return this;} 
	var  a = (typeof cls==='object')?cls:arguments,cName = this.className === 'string'?true:false, c= (c = (cName===true?this.className:this.getAttribute('class'))||'')?' '+c+' ':' ';  
	for(var i in a)if(a.hasOwnProperty( i )&&c.indexOf(' '+a[i]+' ')===-1)c+=a[i]+' ';
	c=c.slice(1,-1); if(cName===true)this.className = c; else this.setAttribute('class',c);
	return this;
};


$EXT.Node.removeClass = function (cls) {
	if(!this.hasAttribute||!this.className&&!this.hasAttribute('class'))return this;
	if(this.classList){this.classList.remove(cls); return this;} 
	var cName = this.className === 'string'?true:false;   
	var c = ((cName===true?this.className:this.getAttribute('class'))||'').split(' '); 
	for (var i=0; i<c.length; i++) {
		if (c[i] == cls) c.splice(i--, 1);
	}
	c = c.join(' ');
	this.className = c.join(' ');
	if(cName===true)this.className = c; else this.setAttribute('class',c);
	 return this;
};

$EXT.Node.hasClass = function(cls) {
	if(!this.className || this.className=='')return false;
	if(this.classList&&this.classList.contain)return this.classList.contains(cls); 
	for (var c = this.className.split(' '),i=c.length-1; i>=0; i--) {
		if (c[i] == cls) return true;
	}
	return false;
}
$EXT.Node.setText = function(){
var textnode = document.createTextNode("Water"); 
this.appendChild(textnode);   
return text; 
} 
$EXT.Node.addChild = function ( ) {
		/*для обычных:
			arguments - TagName,attr,innerHTML 
		если arguments[0] - массив:
			arguments[0][i] - attr || arguments
			arguments[1] - вернуть массив элементов или this 
		*/
		var SN = $_SYS.Node;
		if(arguments[0] instanceof Array){//Если передан массив, то создается несколько блоков
			var b = [],fragment = document.createDocumentFragment();
			for(var a in arguments[0]){
			b[a] =  fragment.appendChild( SN.create(arguments[0][a]) );
			b[a].setAttribute('data-child-index',a);  
			
			}
			this.appendChild(fragment);
			return (arguments[1] ? b : this);//вернуть массив элементов или this
		}
	 
		return  this.appendChild(SN.create(arguments));
	}

	$EXT.Node.SetAttributes = function(A){
		var a = this, NSURL = $_SYS.Node.NSURL || {
			HTML : 'http://www.w3.org/1999/xhtml',
			SVG : 'http://www.w3.org/2000/svg',
			xlink: 'http://www.w3.org/1999/xlink',
			XBL : 'http://www.mozilla.org/xbl',
			XUL : 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul' 
		};
		var key, value, ind;
		for(key in A){//if(attr.hasOwnProperty(key))
			value = A[key];  

			toAk:switch(typeof a[key]){
				case 'function': a[key](value); break;// ex: Node.Width(value); 
				case 'object': if(typeof value === 'object'){for(var d in value)a[key][d] = value[d];break;}// ex:  {dataset : {}, style : {}}
				case 'undefined':  
				switch(typeof value){
					case 'string':case 'number':case 'boolean':
					ind = key.indexOf(':'); 
					if(ind!==-1) a.setAttributeNS(NSURL[key.slice(0,ind)] ,key.substr(ind+1), value); else a.setAttribute(key , value); 
					break toAk;
				}
				default : try { a[key]=value; }catch(err){console.error(err,key,value);}//Прямое назначение иногда вызывает ошибку
			}
		}
		return  this;
	},
	$EXT.Node.appEnd = function (string, returnChild) {
		if($_SYS.Node.isNode(string)){
			var a = string;
			}else{
		var a = document.createElement('div'); a.innerHTML = string;
		}
		if(a.childNodes.length[1]){ return this.appendChild(a.childNodes[0]); }
		for(var i=0; i<a.childNodes.length; i++ ){  this.appendChild(a.childNodes[i]);}
		return returnChild ? a.childNodes : this;
	}
	
	
	$EXT.Node.appFirst = function(newNode,innerHTML) {
		if(!$_SYS.Node.isNode(newNode))newNode = $_SYS.Node.create(newNode,innerHTML); 
		if(this.firstChild)this.insertBefore(newNode, this.firstChild);
		else this.appendChild(newNode);
		return newNode;
	}
	
	$EXT.Node.appAfter = function(newNode,innerHTML) {
		if(!$_SYS.Node.isNode(newNode))newNode = $_SYS.Node.create(newNode,innerHTML); 
		this.parentNode.insertBefore(newNode, this.nextSibling);
		return newNode;
	}
	$EXT.Node.appBefore = function(newNode,innerHTML) {
		if(!$_SYS.Node.isNode(newNode))newNode = $_SYS.Node.create(newNode,innerHTML); 
		this.parentNode.insertBefore(newNode, this);
		return newNode;
	}
	  
		$EXT.Node.remove = function() {
		this.parentElement.removeChild(this); 
	}
	NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
		for(var i = this.length - 1; i >= 0; i--) {
			if(this[i] && this[i].parentElement) {
				this[i].parentElement.removeChild(this[i]);
			}
		}
	} 

	$EXT.Node.clean = function() {
		/*for(var i = this.children.length - 1; i >= 0; i--) {
			this.removeChild(this.children[i]); 
		}*/
		this.innerHTML='';
		return this;
	}
if(!document.getElementsByClass){
$EXT.Node.getElementsByClass = function(classList) {			
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
 $EXT.Node.isIt = function(by, value, light){ var isset = $_SYS.fn.issetValue,v;  
  // любая by || (существует this[by] && (не задана value || (this[by] - функция ? (кроме 'hasClass', выполняется сравнение с результатом) ) ))
 return ( !by  || // любая by  ||
	( isset(this[by] ) && ( !isset(value)  ||  (
		by == 'hasClass' ? this[by](value) :
			(light ? ((typeof this[by] == 'function'?this[by]():this[by]).indexOf(value)>-1) : (typeof this[by] == 'function'?this[by]():this[by])== value) 
	) ) )  
 );
 }
 
/*
Node.getParents([by(string), value(string), [light(boolean)]],[include_this_(boolean) = true]) - поиск родительских элементов (начиная с текущего).
by, value,light аналогичен isIt()
include_this_ - включать или нет в поиск текущий элемент (по умолчанию - включен, т.к. наиболее частое применение - поиск, был ли клик по элементу). При передаче в функцию одного параметра 'boolean' считается за include_this_ (если тип string - будет искать по наличию свойства) 
*/
$EXT.Node.getParents = function(by,value, light, include_this_){
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
$EXT.Node.getParent = function(by,value, light, include_this_){
	if(arguments.length===0)return this.parentNode;
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
$EXT.Node.getElementsBy=function(by,value, light, include_this_){//Ищит дочерние элементы с id. 
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

$EXT.Node.Width = function(s){
	var T = this, isSVG = T.namespaceURI.indexOf('svg')!==-1;
	if( typeof s === 'undefined' )return ( isSVG === true ? (T.getBBox?T.getBBox().width :+T.width == T.width ? +T.width : 0) : T.offsetWidth );
	T.width=s; T.style.width=s+"px"; return T;
}
$EXT.Node.Height = function(s){
	var T = this, isSVG = T.namespaceURI.indexOf('svg')!==-1;
	if( typeof s === 'undefined' )return ( isSVG === true ? (T.getBBox?T.getBBox().height :+T.height == T.height ? +T.height : 0) : T.offsetHeight );
	T.height=s;T.style.height=s+"px"; return T;
}

$EXT.Node.WidthC = function(s){
	var T = this, isSVG = T.namespaceURI.indexOf('svg')!==-1;
	if(isSVG === true) var BB=T.getBBox?T.getBBox():false, C2 = (T.getBBox ? BB.width :+T.width == T.width ? +T.width : 0)>>1;
	else C2 = T.offsetWidth>>1; 
	if( typeof s === 'undefined' )return C2; 
	if(isSVG === true){  
		var x = T.x == +T.x ? +T.x : BB&&BB.x===0 ? 0 : false 
		if( x!==false )T.setAttribute('x', x + C2 -s);//Если не удалось определить x, то лучше не трогать
	}else T.style.left=(T.offsetLeft+C2-s)+"px";  
	s*=2; T.width=s; T.style.width=s+"px"; return T;
}
$EXT.Node.HeightC = function(s){
	var T = this, isSVG = T.namespaceURI.indexOf('svg')!==-1;
	if(isSVG === true)var BB = T.getBBox?T.getBBox():false;
	var C2 = ( isSVG === true ? (BB ? BB.height :+T.width == T.height ? +T.height : 0) : T.offsetHeight )>>1;
	if( typeof s === 'undefined' )return C2; 
	if(isSVG === true){  
		var y = T.y == +T.y ? +T.y : BB&&BB.y===0 ? 0 : false 
		if( y!==false )T.setAttribute('y', y + C2 -s);
	}else T.style.top=(T.offsetTop+C2-s)+"px";  
	s*=2; T.height=s; T.style.height=s+"px"; return T;
}  

$EXT.Node.FullWidth = $EXT.Node.outerWidth = function(s,margin){ 
	if(arguments.length==1 && typeof arguments[0] === 'boolean'){var s = false, margin = arguments[0]}
	var style = window.getComputedStyle(this, null),
	p = 0; 
	p += parseInt(style['border-left-width']);
	p += parseInt(style['border-right-width']);
	p += parseInt(style['padding-left']);
	p += parseInt(style['padding-right']);
	if( margin === true ){
		p += parseInt(style['margin-left'] );
		p += parseInt(style['margin-right'] );
	}
	if(typeof s === 'number' ){ this.style.width=(~~s-p)+'px'; return this;}return this.offsetWidth+p;
}
$EXT.Node.FullHeight = $EXT.Node.outerHeight = function(s,margin){ 
	if(arguments.length==1 && typeof arguments[0] === 'boolean'){var s = false, margin = arguments[0]}
	var style = window.getComputedStyle(this, null),
	p = 0; 
	p += parseInt(style['border-top-width']);
	p += parseInt(style['border-bottom-width']);
	p += parseInt(style['padding-top']);
	p += parseInt(style['padding-bottom']);
	if( margin === true ){
		p += parseInt(style['margin-top'] );
		p += parseInt(style['margin-bottom'] );
	}
	if(typeof s === 'number' ){ this.style.height = (~~s-p)+'px'; return this;}return this.offsetHeight+p;
} 

$EXT.Node.Move = $EXT.Node.XY = function(/*x,y,c*/){
	var A = arguments, size ={x:false,y:false},x=A[0],y=A[1],c=A[2],tr={string:true,number:true}; 
	switch(typeof A[0]){ 
		case 'string': if(x!=+x){if(y==+y)size[x.toLoverCase()]=+y;break;}
		case 'number': size.x=+x;
		case 'boolean': if(typeof y!=='boolean')size.y=+y; break;
		case 'object': if(x.length){size.x=x[0];size.y=x[1];}else {
			if(typeof x.x!=='undefined')size.x=x.x; if(typeof x.y!=='undefined')size.y=x.y;} c=A[1];break;
	}
	x=size.x;y=size.y;
	var T = this; 
	if( this.namespaceURI.indexOf('svg')!==-1 ){
		var BB = T.getBBox ? T.getBBox() : false;
		if(x!==false){if(c)x-=(BB?BB.width:+T.width == T.width ? +T.width : 0)>>1; T.setAttribute('x',x); }
		if(y!==false){if(c)y-=(BB?BB.height:+T.height == T.height ? +T.height : 0)>>1; T.setAttribute('y',y); }
	}else{
		if(x!==false){if(c)x-=T.offsetWidth>>1; T.style.left=x+"px";}
		if(y!==false){if(c)y-=T.offsetHeight>>1; T.style.top=y+"px";}
	} 
	return this;
}
$EXT.Node._X = $EXT.Node.X = function(s){
	if( this.namespaceURI.indexOf('svg')!==-1 ){
		if(typeof s === "undefined")return this.getBBox ? this.getBBox().x : this.x == +this.x ? this.x : 0; 
		this.setAttribute('x',~~(+s));
	}else{
		if(typeof s === "undefined")return  this.offsetLeft;
		this.style.left=~~(+s)+"px";
	} 
	return this;
}
$EXT.Node._Y = $EXT.Node.Y = function(s){
	if( this.namespaceURI.indexOf('svg')!==-1 ){
		if(typeof s === "undefined")return this.getBBox ? this.getBBox().y : this.y == +this.y ? this.y : 0; 
		this.setAttribute('y',~~(+s));
	}else{
		if(typeof s === "undefined")return  this.offsetTop;
		this.style.top =~~(+s)+"px";
	} 
	return this;
} 

//x,y,width, height отн-но центра объета


$EXT.Node.XC = function(s){ 
	if(this.namespaceURI.indexOf('svg')!==-1){ 
		var BB=this.getBBox?this.getBBox():false, 
		C2 = (this.getBBox ? BB.width :+this.width == this.width ? this.width : 0)>>1;
		if(typeof s==="undefined")return C2+(BB!==false?BB.x:this.x==+this.x?+this.x : 0);
		this.setAttribute('x',s-C2);
	}else {
		var C2 = this.offsetWidth>>1;
		if(typeof s==="undefined")return C2+this.offsetLeft;
		this.style.left=(s-C2)+"px";
	} 
	return this;
}
$EXT.Node.YC = function(s){ 
	if(this.namespaceURI.indexOf('svg')!==-1){ 
		var BB=this.getBBox?this.getBBox():false, 
		C2 = (this.getBBox ? BB.height :+this.height == this.height ? this.height : 0)>>1;
		if(typeof s==="undefined")return C2+(BB!==false?BB.y:this.y==+this.y?+this.y : 0);
		this.setAttribute('y',s-C2);
	}else {
		var C2 = this.offsetHeight>>1;
		if(typeof s==="undefined")return C2+this.offsetTop;
		this.style.top=(s-C2)+"px";
	} 
	return this;
} 
$EXT.Node.ZC = function(s) {if(typeof s == "undefined"){return this.style.zIndex;} this.style.zIndex = s;  return this;}


//
$EXT.Node.BGPosition = function(){var suf = arguments[3]||"px";
	this.style.backgroundPosition = arguments[0]+suf+" "+arguments[1]+suf;
}
$EXT.Node.BackGround = $EXT.Node.BG = function(o){
	//{color,img,position,repeat, attachment, size}
	//style.background = "#f3f3f3 url('img_tree.png') no-repeat right top";
	if(typeof o === 'string'){ 
		this.style.backgroundColor = o;
		return this;
	}
	if(o.color){this.style.backgroundColor = o.color}
	if(o.url){this.style.backgroundImage = "url('"+o.url+"')";}
	if(o.position){
		var p=o.position,d=['x','y'],suf=p.suf||p[3]||'px';
		for(var i=0;i<2;i++){ d[i]=p[i]||p[d[i]]||0;if(typeof d[i]=='number')d[i]+=suf; } 
		this.style.backgroundPosition = d[0]+" "+d[1];
	}
	if(o.repeat){var r='repeat'; this.style.backgroundRepeat = (o[r]=='no')?('no-'+r):(o[r].length===1)? (r+'-'+o[r]):(o[r]=='xy')?r:o[r]; }
	if(o.attachment){this.style.backgroundAttachment = o.attachment;}
	if(o.size){var suf = o.suf ? o.suf : "px"; this.style.backgroundSize = (typeof o.size=='object' ? (o.size.x+suf+" "+o.size.y+suf): o.size);}
	return this;
}

$EXT.Node.rotate=function(r){return this.Transform('rotate',r+'deg'); }
$EXT.Node.scale=function(s,s2){return this.Transform('scale',s+','+(s||s2));}
$EXT.Node.mirror=function(s,n){return this.Transform('scale'+s.toLocaleUpperCase(),n); return this;}
$EXT.Node.Transform=function(t,data){
	var f=t+'('; 
	if(this.style.transform.indexOf(t)>-1)
	 this.style.transform = this.style.transform.replace(new RegExp(t+'\\(([^\\)])+\\)') ,f+data+')');
	 else this.style.transform+=' '+f+data+')';
	 return this;
}
$EXT.Node.defaults = {};
$EXT.Node.show=function(){this.style.display = this.defaults.display || "block"; return this; }
$EXT.Node.hidde=function(){this.style.display = "none"; return this; }

$EXT.Node.position = function(a){
	var a = a || {},b = {left : 0, right:0,top:0,bottom:0};
	a.position = a.position || "absolute";  
	for(var i in a) if(i in b){ 
			delete b[i];
			if(a[i] !== false)this.style[i] = typeof a[i]=== "number" ? a[i]+'px' : a[i];
		}else this.style[i] = a[i]; 
	for(i in b)this.style[i] = b[i];
	return this;
}

$EXT.Node.topBlock = function(a){
	var a = a ? a : {};  
	if(!a.zIndex) a.zIndex = 9999;
	return this.position(a) 
}
$EXT.Node.setStyles = $EXT.Node.$Style = function(a){
	var CN = {//Взято из jQuery - список стилей, в которых используется номер (для добавления суффикса px в остальные)
			"columnCount": true, "fillOpacity": true, "flexGrow": true, "flexShrink": true, "fontWeight": true, "lineHeight": true, "opacity": true, "order": true, "orphans": true, "widows": true, "zIndex": true, "zoom": true
		};
	for(var d in a)this.style[d] = (typeof a[d] === 'number')&& !(d in CN) ? a[d]+'px' : a[d]; return this;
}

$EXT.Node.ON = function(event,f, useCapture, _this_){
			$_SYS.Node.EventListener('add', this,event,f, useCapture, _this_);
			return this;
		 };
		
$EXT.Node.OFF = function(event,f, useCapture){
			$_SYS.Node.EventListener('remove', this,event,(f.event_f||f), useCapture);
			return this;
		 };

for(var p in $EXT.Node){
	if(!Node.prototype[p])Node.prototype[p]=$EXT.Node[p];//else console.error(p);
	if(!Element.prototype[p])Element.prototype[p]=$EXT.Node[p];//else console.error(p);
	//if(!Element.prototype[p])HTMLDivElement.prototype[p]=$EXT.Node[p];else console.err(p);
}
if (!Array.of) Array.of = function() {  return Array.prototype.slice.call(arguments); };
/* == Array ==*/
Array.prototype.PushTo = function(Element,Index) {
		if (this == null)throw new TypeError('"this" is null or not defined'); 
			var a = [],i,O = Object(this),len = O.length >>> 0;//len = ToUint32(O.length)
		if(Index<0)Index=len-Index;
		if(Index>=len){O[Index]=Element;O.length=++Index; return O;} 
		for(i=0;i<len;i++)a[i]=O[i];O.length = 0;
		for(i=0;i<=len;i++){if(i===Index)O[i++]=Element;O[i]=a[i];}
		O.length=++len;
		return O;
	}
	Array.prototype.RemoveBy = function(Index) {
		if (this == null)throw new TypeError('"this" is null or not defined'); 
		var a = [],i,O = Object(this),len = O.length >>> 0;//len = ToUint32(O.length)
		if(Index<0)Index=len-Index;
		if(len === 0 || Index>=len)return O;
		if(Index===len-1){O.length--;return O;}
		for(i=0;i<len;i++)a[i]=O[i];O.length = 0;
		var j=0;
		for(i=0;j<len-1;i++){if(i===Index)continue;O[j]=a[i];j++;}
		O.length=--len;
		return O;
	}
	Array.prototype.MoveByTo = function(who,to){  
		if (this == null)throw new TypeError('"this" is null or not defined'); 
		var a = [],i,O = Object(this),len = O.length >>> 0; 
		if(who<0)who+=len; if(to<0)to+=len; 
		if(who===to||len === 0)return this; 
		var Element = O[who],j=0;
		for(i=0;i<len;i++)a[i]=O[i];O.length = 0; 
		for(i=0;j<len;i++){if(i===who)continue;if(j===to)O[j++]=Element; O[j]=a[i];j++;}
		O.length=len;
		return O; 
	}
	Array.prototype.End = function(){
		if (this == null)throw new TypeError('"this" is null or not defined'); 
		var O = Object(this); return O[(O.length >>> 0)-1];
	}
	Array.prototype.Get = function(Index){
		if (this == null)throw new TypeError('"this" is null or not defined'); 
		var O = Object(this); if(Index<0)Index+=(O.length >>> 0); return O[Index];
	}
if (!Array.prototype.indexOf)  Array.prototype.indexOf = function(searchElement, fromIndex) {
    var k; 
    if (this == null)throw new TypeError('"this" is null or not defined'); 
    var O = Object(this); 
    var len = O.length >>> 0;//len = ToUint32(O.length) 
    if (len === 0)return -1; 
    var n = +fromIndex || 0; //n = ToInteger(fromIndex) || 0;
	if (Math.abs(n) === Infinity) n = 0;//Если n бесконечно большое -> 0 
    if (n >= len)return -1;//Если n >= len, вернём -1.

    // Если n >= 0, положим k = n. Иначе, k = len - abs(n). Если k< 0 => k = 0.
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);  
    while (k < len) {  if (k in O && O[k] === searchElement) return k;   k++; }
    return -1;
  };

if (!Array.inArray) Array.prototype.inArray = function(searchElement){ 
		if (this == null)throw new TypeError('"this" is null or not defined'); 
		var  k=0, O = Object(this), len = O.length >>> 0;//len = ToUint32(O.length)  
		if (len !== 0)while (k < len) {  if (k in O && O[k] === searchElement) return true;   k++; }
		return false; 
	} 
if (!Array.from) Array.from = function(arrayLike, mapFn, thisArg) { 
      var C = this, items = Object(arrayLike); // items = ToObject(arrayLike). 
      if (arrayLike == null)  throw new TypeError('Array.from requires an array-like object - not null or undefined');    
       if (typeof mapFn !== 'undefined'&&(typeof mapFn === 'function' || Object.prototype.toString.call(mapFn) === '[object Function]')) throw new TypeError('Array.from: when provided, the second argument must be a function');  
	  var len = Math.min(Math.max(~~items.lenght, 0), Math.pow(2, 53) - 1),  
      A = (typeof this === 'function' || Object.prototype.toString.call(this) === '[object Function]') ? Object( new this(len) ) : new Array( len ); 
      var k = 0, kValue;
	  if(mapFn) for( var k = 0; k < len; k++ ) A[k] = items[k]; 
	  else for  ( var k = 0; k < len;k++)  A[k] = typeof thisArg === 'undefined' ? mapFn(items[k], k) : mapFn.call(thisArg, items[k], k);  
      A.length = len; 
      return A;
    }; 
 String.prototype.splitNum = function(sep){ 
	for(var a = [],len=0,s='',i=0,l=this.length;i<l;i++)if(this[i]===sep){a[len]=+s; len++;s='';}else{ s+=this[i]; }
	if(s){a[len]=+s; len++;}a.length=len;return a;
 }
 String.prototype.count = function(sep){ 
	var i=0,count=0; while(i!==-1){i=this.indexOf(sep,++i);count++;}return count;
 }
 String.prototype.toUpperCaseChar = function(i){
	i=i||0; return ((i===0)?'':this.slice(0,i))+this[i].toUpperCase()+this.slice(++i);
 }
 
 
 if (!String.prototype.repeat)  String.prototype.repeat = function(count) {
    'use strict';
    if (this == null) throw new TypeError('can\'t convert ' + this + ' to object'); 
    var str = '' + this;
    count = +count; if (count != count) count = 0; 
    if (count < 0) throw new RangeError('repeat count must be non-negative'); 
    if (count == Infinity) throw new RangeError('repeat count must be less than infinity'); 
    count = Math.floor(count);  if (str.length == 0 || count == 0) return ''; 
    /* Обеспечение того, что count является 31-битным целым числом, позволяет нам значительно соптимизировать главную часть функции. Впрочем, большинство современных (на август 2014 года) браузеров не обрабатывают строки, длиннее 1 << 28 символов, так что:*/
    if (str.length * count >= 1 << 28) throw new RangeError('repeat count must not overflow maximum string size'); 
    var rpt = '';
    for (;;) {
      if ((count & 1) == 1) rpt += str; 
      count >>>= 1;
      if (count == 0) break;
      str += str;
    }
    return rpt;
  } 
 
 /** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") Number.prototype.toRad = function() { return this * Math.PI / 180; }

Math.log2 = Math.log2 || function(x) {  return Math.log(x) / Math.LN2; };
Math.roundAbs = function(t){var z=t>0?1:-1,r=~~t;if((t-r)*z>=0.5)r+=z;return r;};
 
/** 
 * Base64 encode/decode
 * http://www.webtoolkit.info 
 **/   
$_SYS.Base64 = $EXT.Base64 = {
   _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
   //метод для кодировки в base64 на javascript
  encode : function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0
    input = this._utf8_encode(input);
       while (i < input.length) {
       chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
       enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
       if( isNaN(chr2) ) {
         enc3 = enc4 = 64;
      }else if( isNaN(chr3) ){
        enc4 = 64;
      }
       output = output +
      this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
      this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
     }
    return output;
  },
 
   //метод для раскодировки из base64
  decode : function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
     input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
     while (i < input.length) {
       enc1 = this._keyStr.indexOf(input.charAt(i++));
      enc2 = this._keyStr.indexOf(input.charAt(i++));
      enc3 = this._keyStr.indexOf(input.charAt(i++));
      enc4 = this._keyStr.indexOf(input.charAt(i++));
       chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
       output = output + String.fromCharCode(chr1);
       if( enc3 != 64 ){
        output = output + String.fromCharCode(chr2);
      }
      if( enc4 != 64 ) {
        output = output + String.fromCharCode(chr3);
      }
   }
   output = this._utf8_decode(output);
     return output;
   },
   // метод для кодировки в utf8
  _utf8_encode : function (string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
       if( c < 128 ){
        utftext += String.fromCharCode(c);
      }else if( (c > 127) && (c < 2048) ){
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      }else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
     }
    return utftext;
 
  },
 
  //метод для раскодировки из urf8
  _utf8_decode : function (utftext) {
    var string = "",i = 0;
    var c = c1 = c2 = 0;
    while( i < utftext.length ){
      c = utftext.charCodeAt(i);
       if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      }else if( (c > 191) && (c < 224) ) {
        c2 = utftext.charCodeAt(i+1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      }else {
        c2 = utftext.charCodeAt(i+1);
        c3 = utftext.charCodeAt(i+2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
     }
     return string;
  }
 }
