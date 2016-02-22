Data = {}

manifest = {
	tempData : [],//Временное хранилище массива
	getData : function(obj,path){ 
		for(var i in obj){
			if(typeof obj[i]=='object'){
				this.getData(obj[i], path+i+'/');
			}else{
				this.tempData[this.tempData.length] = (path+obj[i]);
			} 
		}
	},
	get_library: function(path){ if(!path){path='';}else if(path.substr(-1) !='/'){path+='/';}
	var a={};
	for(var type in manifest.library){
		this.tempData =[]; this.getData(manifest.library[type], path);
		a[type]=this.tempData; delete this.tempData;
	} 
		return a;
	}
}

manifest.library = {
	//Может содержать как объекты вида {Data : {sprites : ['s1.png','s2.png']}} так и строки ['Data/sprites/s1.png','Data/sprites/s2.png'], так и комбинированную (корневой массив соответств корневому каталогу)
	/*images : {
		Data : {
			sprites : [
				'Hero.png'
			],
			textures : [ 
				'ground01.gif'
			],
			backgrounds: {
				'default' : [
					'ground.jpg',
					'dymka_1.png',
					'planets_in_sky.jpg',
					'sky.jpg'
				]
			
			}
		} 
	}*/
}
//manifest.get_library('images')