class App{
	constructor(){
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		this.bindEvents();
	}

	bindEvents(){
		$(window).on("resize", this.resize);
	}

	resize(){ 
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		
		console.log(this.width, this.height);
	}
}

$(() => {
	'use strict';

	window.onload = ()=>{
		new App();
	};
});