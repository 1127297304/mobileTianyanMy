	//设置rem单位
	function setFontSize() {
		 var desW = 750;//按照设计稿宽750制作 
		 var winW = document.documentElement.clientWidth; 
		 document.documentElement.style.fontSize = winW / desW * 100 + "px"; 
	} 
	setFontSize(); 