/**
Name : BasicXvFramevork
Autor : Grinya Lesnoy
version : 0.25
licence : The MIT License (MIT)
site : 	http://vnii.su/
		https://vk.com/lesnoy.skazochnik
**/

(function(){   

root = this;

/** = объект классов. Здесь хранятся классы объектов в порядке родительский - дочерний
	Функция преобразует объект в класс (также способна задавать новый пустой) путем добавления туда свойств objectType и extendOf. 
 = **/
root.classes = function(){//path,classObj
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

root.interfaces = function(){}
 //Массив импортируемых классов. Каждый из классов может иметь собственный подобный массив
 //Позволяет автоматически загружать нужные классы и присваивать им свойства классов (вызов classes()), но, если класс не будет найден программа зависнит
root.classes.$_import = [];


var sys = function(obj) {
    if (obj instanceof sys) return obj;
    if (!(this instanceof sys)) return new sys(obj);
  };
  
root.$_SYS = sys; 
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
			//var dev = ["iphone", "ipad", "android", "phone", "msie"]; 
		},	
		
		
 
	// === Массивы и объекты
	
	
	//Проверка объектов
		inArray : (Array.prototype.indexOf ?
		function (arr, val) {
			return arr.indexOf(val) != -1
		} :
		function (arr, val) {
			var i = arr.length
			while (i--) {
				if (arr[i] === val) return true
			}
			return false
		}),
		
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
		 
		isCloning : function(o){//Проверка на запрет клоирования (в этом случае, объект передается как ссылка)
			return (typeof o == 'object' && !o.noClone &&  !this.isClass(o) &&  o.objectType!="classExtend" &&  !this.isNode(o))? true : false;
		},
		
		isClass : function(o){ return (o != null && typeof o == "object" && (o.objectType=="class"||o.objectType=="classExtend" ) ) ? true : false;}, 
		
		//Операции с объектами
		 
		
		_import : function(a,b){//Слияние объектов Одноименные из b перекрывают a 
			if(typeof b != "object" || this.isNode(b))return b;
			if(typeof a != "object" &&typeof b == "object")a={};
			for(var key in b){  //if (b.hasOwnProperty(key)) 
				if(this.isClass(b[key])||key == 'objectType'){continue;}
				if (b[key] instanceof Array) {
					a[key] = ( a[key] && a[key] instanceof Array && b[key] instanceof Array )? a[key] : [];
					for (var i = 0, len = b[key].length; i < len; i++) {
						a[key][i] = a[key][i]|[];
						a[key][i] = this._import( a[key][i] , b[key][i]);
					} 
				}else{ 
					a[key]=( this.isCloning(a[key]) && this.isCloning(b[key])) ? this._import(a[key],b [key]) : this._import({},b[key]); 
				 }
			} 
			 
			return a;
		},
		marge : function(a,b){//то же самое, но при этом создается новый объект
			if(typeof b != "object" || this.isNode(b))return b;
			if(typeof a != "object" || this.isNode(a))return this.clone(b); 
			//var c ={};  for(var key in a){if(this.isClass(a[key])){continue;}c[key] = a[key];}
			var c = this._import({},a);
			return this._import(c,b);
		}, 
		extend : function(Child, Parent) {//Делает первый класс потомком второго
			var F = function() { }
			F.prototype = Parent.prototype
			Child.prototype = new F()
			Child.prototype.constructor = Child
			Child.superclass = Parent.prototype
		},
		
		clone : function (obj) {
			var copy;

			// Handle the 3 simple types, and null or undefined
			if (null == obj || "object" != typeof obj || this.isNode(obj)) return obj;

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
		}, 
		
		
		 forEach : function(a,f,t){//forEach для объектов
			if(a.forEach){a.forEach(f,t);}else{for(var i in a){f.call((t?t:a[i]),a[i],i,a);}}
		 },
		 
		 now : Date.now || function() {//
			return new Date().getTime();
		},
		
		objExplode : function(obj){//Разбивает объект на два массива - ключи и значения
			var result = {key:[],value:[]};
			for(var i in obj){result.key.push(i); result.value.push(obj[i]);}
			return result;
		},
		
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
			return str.replace(/(?:^|\s)\w/g, function(match) {
				return match.toUpperCase();
			});
		},
		
		toCamel : function(a){ // с-трока => сТрока
			return a.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
		},
		
		reCamel : function(a){ // сТрока => с-трока 
			return a.replace(/([A-Z])/g, function($1){return ('-'+$1.toLowerCase());});
		},
		
	// === Ф-ции, отвечающие за загрузку
 

		onReady : function(handler) { 
			document.addEventListener( "DOMContentLoaded", function(){ handler(); }, false );   
		}, 
		
		scriptsLoader :  function(src, callback, type, path){
				var path = path ? path+'/' : "";
				if(type == "classes" || type == "subclasses"){path+='classes/';}
				
				//if(typeof src == "string"){src = [src];} //Для возможности передавать в качестве аргумента строку
				if(!$_SYS.tmp.loaded)$_SYS.tmp.loaded=0;//Задаются временные переменные для хранения инф. о загруженных ресурсах
				 
				if(type != "subclasses"){ $_SYS.tmp.loaded-=src.length;}//счетчик загруженных. Для subclasses loaded родительской ф-ции
				if(src.length==0){callback();}//Если по каким-то причинам массив оказался пустым...
				for(var s in src){
					var name = src[s]; 
					var el = document.createElement('script');
					el.src = path + name +'.js';   
					el.name= name; 	
					document.getElementsByTagName('head')[0].appendChild(el);		
					el.onload = function(){ 
					$_SYS.tmp.loaded++; 
					if(type == "classes" && classes[this.name].include){
						$_SYS.tmp.loaded-=classes[this.name].include.length; //увеличиваем счетчик на кол-во подгруж подклассов
						$_SYS.fn.scriptsLoader(classes[this.name].include, callback,"subclasses");
					}  
					if($_SYS.tmp.loaded==0){callback();}
					}
				}
		}, 

		getElement : function(id){
			return document.getElementById(id);
		}, 
		
		//Блокировка стандартных ф-ций браузера - чтобы не мешались
		preventDefault : function(){
			if(document.getElementById('Preloader')) $_SYS.fn.removeBlock({id: 'Preloader'});
					document.oncontextmenu = function (){return false};//Будем пытаться бороться с контекстным меню

					// ничего не делать в обработчике событий, за исключением отмены события
					document.ondragstart = function(e) {
						if (e && e.preventDefault) { e.preventDefault(); }
						if (e && e.stopPropagation) { e.stopPropagation(); }
						return false;
					}

					// ничего не делать в обработчике событий, за исключением отмены события
					document.onselectstart = function(e) {
						if (e && e.preventDefault) { e.preventDefault(); }
						if (e && e.stopPropagation) { e.stopPropagation(); }
						return false;
					}
					//Отмена перемещения окна мобильного браузера
					document.body.ontouchstart = function(e) {
						if (e && e.preventDefault) { e.preventDefault(); }
						if (e && e.stopPropagation) { e.stopPropagation(); }
						return false;
					}

					document.body.ontouchmove = function(e) {
						if (e && e.preventDefault) { e.preventDefault(); }
						if (e && e.stopPropagation) { e.stopPropagation(); }
						return false;
					}
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
	
	createBlock : function(parent, attr, update){
		var parent = (typeof parent == 'object') ? parent :
		(parent=='body'||parent=='window'||parent=='screen'||parent=='root') ? document.body :
		document.getElementById(parent); 
		var el; 
		if(update && attr.id){ el = document.getElementById(attr.id);}  
		if(!el){el = document.createElement('div'); update=false;}
		
		for(var key in attr){if( attr[key]!='__fun' && attr[key]!='__styles') el[key] = attr [key];}
		if(!update) parent.appendChild(el);
		//Функции, выполняемые для элемента, передается ввиде __fun : {funct_name : args, ...} =>для el.funct_name(args);
		//__styles и __fun по сути - равнозначные функции.  Реализовал ввиде по отдельности для лучшей читабельности кода. Условно __styles - функции, отвечающие за стили, __fun - все остальные
		if( attr.__styles ){   $_SYS.fn.forEach(attr.__styles,function(value,s){ if(typeof el[s] == "function")el[s](value); })}; 
		if( attr.__fun ){ $_SYS.fn.forEach(attr.__fun, function(value,s){ if(typeof el[s] == "function")el[s](value); })}
		return el;
	},
	
	removeBlock : function(a){
		if(typeof a=='string'){var a={id:a}; }
		if(a.id){document.getElementById(a.id).remove();}else if(a.class){document.getElementsByClassName(a.class).remove();}
	},
	
	updateBlock : function(){
	
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
		if(typeof args == "object"){$_SYS.fn._import(o, args);}
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
		delete o;
	},
		
	//Получает разницу между 2мя числами, abs - отбрасывать "-" у отрицательных значений или нет (иногда нужно для сравнений: delta < 0 эквивалентно |a|<|b|) 
	delta : function(a,b,abs){var z = (Math.abs(a)-Math.abs(b));  return (!abs? Math.abs(z):z);},
	
	//Debug - функция для проверки скорости выполнения скрипта
	testTime : function(_f){
	console.time('test');
	var a = _f();
	console.timeEnd('test');
	return a;
	}
}
/** = /END Библиотека вспомогательных функций  = **/

 
 
/** = Загрузка скриптов, классов и изображений = **/
$_SYS.Loader = {
	rootURL : false,//url, откуда все грузится. По умолчанию - папка скриптов
	loaded : 0,
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
	LoadData :  function(url, _callback, type, _this) {
			var xmlhttp = this.getXmlHttp(); // code for IE7+, Firefox, Chrome, Opera, Safari  
				var options = {
					url : '',
					_this : xmlhttp,
					_callback : function(data){ console.log(data);},
					type : 'data',
					metod : 'GET'
				};
			 if(typeof arguments[0] == 'object'){//Возможна передача параметров как в виде объекта, так и последовательностью 
				for(var i in arguments[0]){options[i]=arguments[0][i];}//$_SYS.fn._import нельзя использовать. т.к. клонирует _this
				 if(typeof arguments[1] == 'object'){options._this = arguments[1];}
			 }else{ 
				for(var key in options){if(window[key])options[key]=window[key];}
			 }
			options.url = (this.rootURL && options.url.indexOf('://')!=-1 && options.url.indexOf('/')!=0)? this.rootURL+options.url : options.url; 
			;
			options.body = null;
			if(options.data){
				var body = '', formData = new FormData();
				for(var key in options.data){//if(options.data[key].type){console.log(options.data[key].type);}
					if(typeof options.data[key]=='object' && ! (options.data[key].type && options.data[key].type.match(/image.*/)))options.data[key]=JSON.stringify(options.data[key]);
					formData.append(key, options.data[key]); body += key +'='+options.data[key]+'&';
				} 
				if(options.metod.toLowerCase() == 'GET'){
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
					   options._callback.call(options._this, data,xmlhttp,options); 
					   }
				   }  else { console.log('Err '+url,xmlhttp);  }
				}
			} 
			xmlhttp.open(options.metod.toUpperCase(), options.url, true);
			//if(options.file) xhr.setRequestHeader("X_FILENAME", options.file.name); 
			xmlhttp.send(options.body); 
	},
	LoadItem : function(src, _callback, type){//Загрузка объекта. По умолчанию - скрипта 
		var el = document.createElement(type);
		//Если путь не задан от корня сайта или с какого-то http берется локальный путь
		el.src = (this.rootURL && src.indexOf('://')==-1 && src.indexOf('/')!=0)? this.rootURL+src : src;
		if(type=="script"){document.getElementsByTagName('head')[0].appendChild(el);}	
		el.onload =  _callback; 
		el.onerror = function() { console.log( "Ошибка загрузки: " + src + ' (' + el.src + ')' ); };
	},
	Include : function(path, _callback, type){//При загрузке класса пытается проверить, не подключен ли он уже (позволяет избежать ошибок, когда класс оказался подключен как-то иначе)
		var url = path, type = type ? type : 'script';
		if(type == 'script' && path.indexOf('classes')>-1){ 
			if(eval('root.'+path)){_callback(); return;} 
			url =  path.replace(/\./g, '/');
		} 
			if(type == 'script'){url+='.js';}
		this.LoadItem(url,_callback, type);
	},
	_ : function(list, _callback,_update,type){//Пакетная загрузка
		var _this = this;
		if(!_this._callback){_this._callback=_callback;}
		_this.loaded-=list.length; 
		
		list.forEach(function(item, k, arr) { 
			_this.Include(item,function(){ if(_update){_update(item);} _this.loaded++;   if(_this.loaded==0){var _callback = _this._callback; delete _this._callback;  _callback(); }},type);
		});
	},
	Classes : function( f ){//Загрузка классов
		var _this = this;
		if(!classes.$_import || classes.$_import.length==0){f();return;}
		_this._callback = f;
		var _update = function(path){ 
			//root.classes(path); - получает объект класса, а так же задает самому классу свойства класса
			var obj = root.classes(path); if(obj.$_import && obj.$_import.length>0){_this._(obj.$_import.map(function(i){return (path+'.'+i);}),f,_update);} 
		};
		_this.Include('classes',function(){ _update('classes'); }); 
	}
}

 

 
$_SYS.$Redistr = {}//Реестр объектов
$_SYS.$Get = function(id){return ( $_SYS.$Redistr[id] ? $_SYS.$Redistr[id] : false);}
//Получает элемент объекта или возвращает body
$_SYS.GetEl = function(obj){ //Если передана строка - пытается найти объект по id
	if(typeof obj == "string"){var obj = $_SYS.$Get(obj);}
	if(typeof obj == "object" && obj.view  && obj.view.el){return obj.view.el} 
	return document.body;
}

$_SYS._Import = function(){
	
}

/** == Создает новый объект на основе аттрибуьлв и цепочки классов == **/
$_SYS._New = function(){ 
	var o = {}, result = {};
	if(arguments.length==0)
	{return result;}
	else if(arguments.length==1)//Переданы аргументы либо класс
	//Используется _import а не clone т..к. в clone более сложный обработчик и я пока не хочу его перестраивать, а здесь достаточно более простого обработчика
	{ o = arguments[0]; if(o.classes){result = (typeof o.classes=="object")?o.classes : eval(o.classes);}}
	else if(arguments.length>=2)//Передан  (класс, аргументы)
	{   result = $_SYS.fn._import({},arguments[0]);  o = arguments[1];  }
	if(result.extendOf){
		var pathEx = (result.extendOf.indexOf('classes.')==0)?  result.extendOf.substr(result.extendOf.indexOf('.')+1) :  result.extendOf,
		_classesArr = result.extendOf.split('.'), obj = classes;   
		if(_classesArr[0]=='classes')_classesArr.splice(0,1);
		for(var i in _classesArr){ 
			obj = obj[_classesArr[i]];  result = $_SYS.fn.marge(obj,result);
	 
		}
	}
	
	if(o.extendOf){
		var pathEx = (o.extendOf.indexOf('classes.')==0)?  o.extendOf.substr(o.extendOf.indexOf('.')+1) :  o.extendOf, 
		_classesArr = o.extendOf.split('.'), obj = classes; 
		for(var i in _classesArr){
			obj = obj[_classesArr[i]];   o = $_SYS.fn.marge(obj,o);
			//if( obj.view&&obj.view.$ClassStyle )$_SYS.CSS.set(_classesArr[i],obj.view.$ClassStyle);//Не ясно, стоит ли добавлять сборщик стилей здесь...
		}
	}
	/* if(o.classes){//Обработка цепочки классов от корневого к нижнему
		var _classesArr = o.classes.split('.'), obj = classes;
		for(var i in _classesArr){
			obj = obj[_classesArr[i]];   $_SYS.fn._import(result,$_SYS.fn.clone(obj));
		}
	}*/
	// $_SYS.fn._import(result,o); 
	 result = $_SYS.fn.marge(result,o);
	 //if(){}
	 if(result.id){$_SYS.$Redistr[result.id]=result;}//Если суotcndetn id - объект будет доступен через $Get
	if(result.view){ 
		if(typeof result.view!='object'){result.view={};}//view можно задать как, например view = true; - объект создастся сам 
		var el_attr = {}; 
		//Если объект генерируется из классов, в аттрибут class DOM-элемента будут автоматически добавленны имена всех классов, из которых он образуется. Однако, при этом, через объект o можно передать и собственные дополнительные классы для DOM-элемента 
		var className = (result.className? result.className : '') + 
						(result.classes ? (' '+result.classes.replace(/\./g, ' ')) : '');
		if(className!='')result.className = className;
		['id','className','__fun','__styles'].forEach(function(a){if(result[a])el_attr[a]=result[a];if(result.view[a])el_attr[a]=result.view[a];}); 
		//if(typeof result.parent == "string"){result.parent = eval(result.parent);} 
		if(!result.parentNode){
			//parent.view.el и parentNode могут отличаться: parent - это ссылка на родительский объект в иерархии объектов, но иерархия вложенности элементв в DOM может не совпадать (по сути, они вообще могут как угодно располагаться)
			result.parentNode = $_SYS.GetEl(result.parent);

		}
		if(result.view.el!==false){
			if(typeof result.view.el == 'string'){result.view.el = document.getElementById(result.view.el); }//возможность передавать уже имеюшийся элемент либо вообще запрещать его создавать
			if( !result.view.el )result.view.el  = $_SYS.fn.createBlock(result.parentNode, el_attr);
		}else{delete result.view.el;}
		if(result.view.$ClassStyle )$_SYS.CSS.set(result,result.view.$ClassStyle); 
	}  
	result.objectType = 'object';
	if(result.extendOf){delete result.extendOf;}
	
	if( result.__construct )result.__construct.call(result,result);//Можно задать собственную функцию, которая будет выполняться в самом конце сборки объекта
	return  result;
}

//Функция проверяет, существует ли объект и, если уже существует, вызывает функцию __update() в нем, иначе вызывает _New()
$_SYS._Update = function(){ 
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
}

$_SYS._Remove = function(o){
	
	if(o.__destruct)o.__destruct.call(o,o);//Вызываем деструтор (!важен для корректного удаления модифицированного объекта: к примеру, если нужно удалить какие-то еще произвольные элементы или ссылки)
	if(o.view.el){$_SYS.fn.removeBlock(o.view.el);}//Удаляем элемент
	if(o.id) delete $_SYS.$Redistr[o.id];//Удаляем из реестра
	if($_SYS.Animation.objects[o.id]) delete $_SYS.Animation.objects[o.id];//Удаляем из анимации
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
	$_SYS.fn._import(a,args);
		a.id = parentID+"_layer_"+a.zIndex; 
	 var e = $_SYS.fn.createObject(a,true); e.view.el.ZC(a.zIndex); return e;
	},
	remove: function(parentID, zIndex){ 
	 return $_SYS.fn.removeObject( );
	},
	activate : function(o, a){ o.act=a;  o.view.el[a ? 'show' : 'hidden'](); }
}
/** === Global - анимация. Функция setInterval не вызывается для каждого объекта - она запускается одна для всей программы. В $_SYS.Animation.obj добавляются ссылки на объекты, для которых должна срабатывать функция onEntereFrame, $_SYS.Animation.start и $_SYS.Animation.stop - запуск и остановка анимации. В $_SYS.Animation.start можно передать новое значение для timeout (при вызове без параметра будет взято значение dTimeout) === **/
$_SYS.Animation = {
	dTimeout : 80, 
	start : function(t){console.log('start',this.i);if(this.i){if(t==this.timeout){return;}this.stop();}  this.timeout=t? t : this.dTimeout;  this.i = setInterval(this.onEntereFrame, this.timeout); },
	stop : function(){console.log('stop',this.i);if(this.i){clearInterval(this.i); delete this.i;}},
	objects : {},
	onEntereFrame : function(){ 
		var o =$_SYS.Animation.objects;   for(var i in o){if(o[i].onEntereFrame)o[i].onEntereFrame();}
	}
}

$_SYS.CSS = {
	data : {},
	_new : 0,
	Alias : {//Псевдонимы, вида путь -> '<%find%>' : 'replace', для сокращения записи кода
		'<%path:bg%>' : 'Data/backgrounds',
		'<%path:textures%>' : 'Data/textures'
	},
	setAlians : function(){//Добавляет псевдонимы и перезаписывает _find _replace
		if(arguments.length==2){//Если задан Alias
			this.Alias[arguments[0]] = arguments[1];
		}else if(typeof arguments[0] == 'object'){//Если задан набор псевдонимов ввиде массива
			for(var a in arguments[0]){this.Alias[a] = arguments[0][a];}
		}
		this._find = []; this._replace = [];
			for( var a in this.Alias ){
				this._find.push(a);  this._replace.push(this.Alias[a]);
			}
	},
	getSelector : function(){
		var find = arguments[0].match(/\<\=.*?\=\>/g);
			var selector, tmp, re, data=[];
			for(var i in find){ //Получается, вид [[1,2,3],[]..]
				data[i]=JSON.parse(find[i].match(/\<\=(.*?)\=\>/)[1]);
			}  
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
			if(this.data[selector][s] == Data[s])continue;
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
			 selector = (_find_.length>1 || d.indexOf('$')>-1 ) ? $_SYS.fn.replace(_find_, _template_, d) : d; 
			if(typeof DATA[d] == 'string'){
				if(DATA[d].indexOf('template:')>-1){_template_.push(d); _find_.push('<%'+DATA[d].substr('template:'.length)+'%>');  }
			}else{
			 this.setOne(selector, DATA[d]);
			 }
		}
		
		},
		
		styleNumber: {
			"columnCount": true,
			"fillOpacity": true,
			"flexGrow": true,
			"flexShrink": true,
			"fontWeight": true,
			"lineHeight": true,
			"opacity": true,
			"order": true,
			"orphans": true,
			"widows": true,
			"zIndex": true,
			"zoom": true
		},
		
		cssNumber: {//Взято из jQuery - список стилей, в которых используется номер (для добавления суффикса px в остальные)
			"columnCount": true,
			"fillOpacity": true,
			"flexGrow": true,
			"flexShrink": true,
			"fontWeight": true,
			"lineHeight": true,
			"opacity": true,
			"order": true,
			"orphans": true,
			"widows": true,
			"zIndex": true,
			"zoom": true
		},
		
		update : function(){
			if(arguments.length==2)this.set(arguments[0], arguments[1]);//Можно вызвать set через update
			if(this._new==0)return;//небыло добавленно ничего нового 
			this._new=0;//Блокируем повторное либо лишнее выполнение
			console.log(this.data);
			var css ='', tmp;
			if(!this.numValue){//Чтобы вручную не перебивать, т.к. хочу пока оставить список из jQuery, но здесь мне нужен список для обычных css// также, можно было бы пользоваться S_SYS.fn.toCamel( name ) каждый раз, но лучше один раз вызвать
				 this.numValue={}
				 for(var i in this.cssNumber){this.numValue[$_SYS.fn.reCamel(i)] = true;}
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
						if(typeof tmp == 'string' && tmp.indexOf('<%')!=-1) tmp = $_SYS.fn.replace(this._find, this._replace, tmp); 
						css+="\t"+s + ':' + tmp +";\n"
					
					}
				css+="}\n";
			}
			console.log(css);
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
				while (this.el.firstChild) {
					this.el.removeChild(this.el.firstChild);
				}
				this.el.appendChild(document.createTextNode(css));
			}
		 
	}

}


 
$_SYS.ScreenResizes = {
objects : {},
onResizes : function(){
			$_SYS.info.screen.Width =  $_SYS.fn.min([document.documentElement.clientWidth, window.screen.availWidth,window.innerWidth, window.screen.width]);
			$_SYS.info.screen.Height = $_SYS.fn.min([document.documentElement.clientHeight, window.screen.availHeight, window.innerHeight,window.screen.height]);
			for(var i in $_SYS.ScreenResizes.objects){$_SYS.ScreenResizes.objects[i].onResize();}
		}
}
window.onresize = $_SYS.ScreenResizes.onResizes;
//Объект мыши
$_SYS.Mouse={
	_x : 0,
	_y : 0,
	dx : 0,
	dy : 0,
	press : false,
	Controls : { 
		move : function(e){ 
		if(typeof e.touches!=="undefined" && e.touches[0]){var e=e.touches[0];} 
			if (e.pageX == null && e.clientX != null ) { // если нет pageX..
				var html = document.documentElement;
				var body = document.body; 
				e.pageX = e.clientX + (html.scrollLeft || body && body.scrollLeft || 0);
				e.pageX -= html.clientLeft || 0; 
				e.pageY = e.clientY + (html.scrollTop || body && body.scrollTop || 0);
				e.pageY -= html.clientTop || 0;
			}
		$_SYS.Mouse._x = e.clientX; $_SYS.Mouse._y = e.clientY;  
		$_SYS.Mouse.dx = e.pageX; $_SYS.Mouse.dy = e.pageY; 
		if($_SYS.Mouse.onMovie){$_SYS.Mouse.onMovie();} 
		//main.debugger(Mouse.dx, Mouse.dy);
		},
		 getEvent : function(e) {
			if (!e) e = window.event;
			console.log(e.type);
		},
		down : function (e){
			if(!$_SYS.Mouse.tip){$_SYS.Mouse.tip='touch';}
			//Controls.Mouse.getEvent(e);
			//main.debugger('d');  if(Mouse.press!= true){main.debugger('down');  }
			$_SYS.Mouse.Controls.move(e);
			$_SYS.Mouse.press = true;// main.debugger(Mouse.press);//alert(Mouse._x);
			if($_SYS.Mouse.onDown){$_SYS.Mouse.onDown();} 
		},
		up : function (e){
			//main.debugger('u');  if(Mouse.press!= false){main.debugger('up');  }
			$_SYS.Mouse.press = false; //main.debugger(Mouse.press);
			//Controls.Mouse.getEvent(e);
			if($_SYS.Mouse.onUp){$_SYS.Mouse.onUp();} 
		}
	}
}
 

 if(!$_SYS.Mouse.tip||$_SYS.Mouse.tip=='touch'){
		   window.addEventListener('touchstart',$_SYS.Mouse.Controls.down,false);
		   window.addEventListener('touchend', $_SYS.Mouse.Controls.up,false);
		   window.addEventListener('touchmove', $_SYS.Mouse.Controls.move,false); 
			}
if($_SYS.Mouse.tip!='touch'){
			$_SYS.Mouse.tip='mouse';
			window.onmousedown= $_SYS.Mouse.Controls.down;//window.event.which
			window.onmouseup=  $_SYS.Mouse.Controls.up;
		   //window.onclick=  Mouse.Controls.up;
		    window.onmousemove =  $_SYS.Mouse.Controls.move;
			//mouseover mouseout
}

			
 

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
		$_SYS.Key.press [ $_SYS.Key.keyboardMap[e.keyCode]]=true;
		if($_SYS.Key.onKeyDown){$_SYS.Key.onKeyDown($_SYS.Key.keyboardMap[e.keyCode]);}
	},
	keyUp : function(e){ e.preventDefault();
		//console.log(e.keyCode, $_SYS.Key.keyboardMap[e.keyCode]);
		$_SYS.Key.press[ $_SYS.Key.keyboardMap[e.keyCode]]=false;
		if($_SYS.Key.onKeyUp){$_SYS.Key.onKeyUp($_SYS.Key.keyboardMap[e.keyCode]);}
	}//,
	//onKeyUp : function(){},
	//onKeyDown : function(){}

}

$_SYS.LocalFile = { 
	read : function(files, callback, _this){ 
		if(!window.File && window.FileReader && window.FileList && window.Blob){allert('not support browser!'); return;}
		if(!_this){_this = this;}
		 if(!files.length){files = [files];}
		for (var i = 0, f; f = files[i]; i++) {
			 var reader = new FileReader();
			 reader.onload = function(event) { var contents = event.target.result;  if(callback)callback.call(_this,f,contents,event);} 
			 // Read in the image file as a data URL.
		  
		if (f.type && f.type.match('image.*')) {
		reader.readAsDataURL(f);
			}else{
		reader.readAsText(f);
		}
		}
	}
	
}

window.onkeydown = $_SYS.Key.keyDown;
window.onkeyup = $_SYS.Key.keyUp;

/*Объект sys задает общие системные функции, как проверка загрузки и т.п.*/
 
	$_SYS.info = {
	
	} 
	$_SYS.Init = function(){  	
		$_GET = new $_SYS.fn.get_query();
		
		if( typeof $_SYSRootURL == 'string' )$_SYS.Loader.rootURL = $_SYSRootURL; 
		
		this.info = new $_SYS.fn.getInfo();
		//console.info($_SYS.info);
		$_SYS.fn.onReady(function(){
			
			$_SYS.fn.createBlock("root", {id: 'Preloader'});
			//название файлов скриптов без ".js" - разширение доб. автоматически 
			$_SYS.Loader._(['extends', 'Main', 'manifest'], function(){
				$_SYS._New(classes.Main);
				$_SYS.Loader.Classes(function(){ 
				var data = manifest.get_library(); 
						 if(data.images){$_SYS.Loader._(data['images'],main.Init,null,'img');} else {main.Init();}
						 }); 
			});
		});  
	}
	
	root.noClone = true;//запрет копирования
$_SYS.Init();
 })();

