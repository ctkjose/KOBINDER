if (typeof ko.extensions === 'undefined') ko.extensions = {};
if (typeof ko.extensions.bindercmd === 'undefined') ko.extensions.bindercmd = { version : '0.01' };

function XPCOM_CCSV(cName, ifaceName){
    return Components.classes[cName].getService(Components.interfaces[ifaceName]);
};

(function () {
	var main = this;
	main.isMac = navigator.platform.match(/^Mac/);
	
	this.parseCMD = function(q){
		var cmd = q.substr(0, q.indexOf(" ")).trim();
		
		var arg = q.substr(cmd.length).trim();
		//alert("[" + cmd + "]=[" + arg + "]");
		
		if(!main.cmd.hasOwnProperty(cmd)){
			alert("Command [" + cmd + "] not found...");
		}
		
		var fn = main.cmd[cmd];
		fn(arg);
		
		
		//alert("called cmd." + cmd + "(" + arg + ")");
	}
	main.cmd = {
		
	}
	main.cmd.exec = function(arg){
		var prj = main.binder.ko.projectGetPath();
		
		var p = arg;
		if( p.substr(0,1) != "/" ){
			p = main.binder.ko.pathJoin(prj, p);
		}else{
			
		}
		
		var s = main.binder.ko.shellExec(arg, true);
	}
	main.cmd.open = function(arg){
		var prj = main.binder.ko.projectGetPath();
		
		var p = arg;
		if( p.substr(0,1) != "/" ){
			p = main.binder.ko.pathJoin(prj, p);
		}else{
			
		}
		
		ko.views.manager.doFileOpenAsync(p);
	}
	this.test = function(){
		alert("bindercmd is alive");
	}
	this.onQueryKeyPress = function onQueryKeyPress(event) {
		var keyCode = event.keyCode;
		if (keyCode == KeyEvent.DOM_VK_ENTER || keyCode == KeyEvent.DOM_VK_RETURN){
			
			
		}
	}
	this.onFocus = function(){
		
	}
	this.onTextChanged = function(){
		//alert("bindercmd is alive");
	}
	this.onSearch = function(){
		
		//alert("bindercmd is alive");
		
		//var sound = XPCOM_CCSV("@mozilla.org/sound;1", "nsISound");
        //sound.play(ioService.newURI('chrome://commando/content/loading.wav', null, null));
		
		var txtbox = document.getElementById('bindercmd-search-text');
		if (!txtbox.value) {
			return;	
		}
		
		var q = txtbox.value;
		if( q.trim().length == 0) return;
		
		//alert("find " + q);
		//main.view.contentDocument.body.innerHTML('searching for ' + q + "<br>");
		alert(main.view);
		//var p = main.binder.ko.projectGetPath();
		//if(!p || (p.length <= 0)){
		//	return;
		//}
		//alert("path === " + p);
		main.parseCMD(q);
		//var files = binder.ko.pathListFiles(p);
	}
	this.load = function() {
		main.binder = ko.extensions.binder;
		main.view = document.getElementById("binderConsoleFrame");
		//alert("loaded");
	}
	window.setTimeout(main.load, 1000, false);
	
}).apply(ko.extensions.bindercmd);