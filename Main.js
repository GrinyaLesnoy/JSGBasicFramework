/*main js*/
 
	  
classes.Main = {
	objectType : 'class',
	
	zoom : 16,//масштаб: для экономии ресурсов, оригинл игры соотв. минимальному шагу. однако, визуальное представление может быть увел. версия игры - нап., в10 раз () не совс ясго, как реализ. инерцию 
	__construct : function(){
		root.Main = root.main = this;
		this.debug = ($_GET['debug']); 
		
		root.classes.$_import = ['Game', 'Hero', 'Maps', 'Level', 'LayersBox',  'Ground', 'Camera','VirtualController', 'Viewed'];
		
		if($_GET['debug']=='full'){classes.$_import.push('Debugger');}
		//this.Intit();
	},
	Init : function(){ 
		$_SYS.fn.preventDefault();	//Блокирует стандартные ф-ции браузера
		if(main.debug){document.body.addClass('debug');}//Можно при помощи css стилей подсвечивать объекты и т.п. в процессе отладки
		$_SYS._New(classes.Game);//Создаем объект игры 
		if($_GET['debug']=='full'){$_SYS._New(classes.Debugger);}
		$_SYS.Animation.start();
	}
}	  
		  
		  
		 