if (typeof(ctk) == 'undefined') {
  var ctk = {};
}

function log(msg) {
	return;
    if (!window.gLogFile) {
        var filename = "/Users/ctk/komodo.log";
        var fileSvc = Components.classes["@activestate.com/koFileService;1"].getService(Components.interfaces.koIFileService);
        var koIFileEx = fileSvc.getFileFromURI(ko.uriparse.localPathToURI(filename));
        // Initialize the file.
        koIFileEx.open("w");
        koIFileEx.close();
        gLogFile = koIFileEx;
    }
    // Open for appending;
    gLogFile.open("a");
    gLogFile.puts(msg + "\n");
    gLogFile.close();
}

if (!('extensions' in ko)) {
    ko.extensions = {};
}
if (!('binder' in ko.extensions)) {
    ko.extensions.binder = {};
}

if (typeof(binder) == 'undefined') {
	binder = {codename : 'CTK', version : '1.0', project_scope: null, projects: {}, project : null, plugings : {}, listeners: {} };
}




/**
* Binder Komodo Helper
**/

binder.ko = {version : '1.0'};

/**
* XPCOM helpers
*/

function XPCOM_CCSV(cName, ifaceName){
    return Components.classes[cName].getService(Components.interfaces[ifaceName]);
};
function XPCOM_CCIN(cName, ifaceName){
    return Components.classes[cName].createInstance(Components.interfaces[ifaceName]);
};


binder.ko.hasActiveProject = function(){
	if (!ko.projects.manager.currentProject) return false;
	return true;
}
binder.ko.isFileInActiveProject = function() {
    return binder.ko.currentFileDir().indexOf(binder.ko.getActiveProjectPath()) === 0;
};
binder.ko.getActiveProjectPath = function() {
    if (!ko.projects.manager.currentProject) return null;
    var prefs = ko.projects.manager.currentProject.prefset,
        projectFileDir =
            ko.interpolate.activeProjectPath().replace(/[\/\\][^\/\\]+$/, ''),
        liveImportDir = prefs.hasStringPref('import_dirname')
            ? prefs.getStringPref('import_dirname') // read if set...
            : ''; // or set to empty string
        return liveImportDir
            ? (liveImportDir.match(/(^\/|^[A-Z]:)/) // live import configured...
                ? liveImportDir // absolute path case...
                : (projectFileDir + '/' + liveImportDir)) // or relative path case
            : projectFileDir; // or use directory of the project file
};
/* Return all environment variables set in the project */
binder.ko.getActiveProjectGetKeys = function () {
	var proj    = ko.projects.manager.currentProject;
	var prefs_data    = proj ? proj.prefset.getStringPref('userEnvironmentStartupOverride') : '';

	var rx            = /^(.+)=(.+)$/gm;
	var matches        = prefs_data.match(rx);
	var prefs        = {};
	if(matches) {
		rx = new RegExp(rx.source);
		for each(var match in matches) {
			var pair = match.match(rx);
			prefs[pair[1]] = pair[2];
		}
	}
	return prefs;
};
binder.ko.getActiveProject = function() {
    if (!ko.projects.manager.currentProject) return null;
    return binder.ko.getProjectInfo(ko.projects.manager.currentProject);
}
binder.ko.getProjectInfo = function(kProject) {

	var file = kProject.getFile();
    var prj = { ready: false, path : file.dirName, name: kProject.name, keys : {}, instance: kProject };

    prj.tag = prj.name.replace('.komodoproject', '');
    prj.activate = function(){
		if(this.instance) this.instance.activate();
    }
    prj.isReady = function(){
		this.ready = (this.path.length > 0) ? true : false;
		return this.ready;
    }

	prj.projectGetKeys = function(){
		return binder.ko.getActiveProjectGetKeys();
    }

    prj.settings = {};
    binder.project = prj;



    return binder.project;
};


/* Views Helpers */

binder.ko.notifyWarning = function(msg, scope){
	require("notify/notify").send(msg, scope, {priority: "warning"});
}
binder.ko.notifyError = function(msg, scope){
	require("notify/notify").send(msg, scope, {priority: "error"});
}
binder.ko.notifyInfo = function(msg, scope){
	require("notify/notify").send(msg, scope, {priority: "info"});
}
binder.ko.hasActiveView = function(){
	return (ko.views.manager.currentView && ko.views.manager.currentView.koDoc && ko.views.manager.currentView.koDoc.buffer)
};
binder.ko.runoutputWrite = function(str) {
    try {
        // Uncomment to allow for prompting of input text
        //if (!str) {
        //    str  = prompt("What text do you want to input?");
        //}
        // Make sure the command output window is visible
        ko.run.output.show(window, false);
        // Retrieve the run output widget document element
        var runWidgetDoc = ko.widgets.getWidget("runoutput-desc-tabpanel").contentDocument;
        // Make sure we're showing the output pane, not the error list pane.
        var deckWidget = runWidgetDoc.getElementById("runoutput-deck");
        if (deckWidget.getAttribute("selectedIndex") != 0) {
            ko.run.output.toggleView();
        }
        // Now find out which newline sequence the window uses, and write the
        // text to it.
        var scimoz = runWidgetDoc.getElementById("runoutput-scintilla").scimoz;
        var prevLength = scimoz.length;
        var currNL = ["\r\n", "\n", "\r"][scimoz.eOLMode];
        var full_str = str + currNL;
        var full_str_byte_length = ko.stringutils.bytelength(full_str);
        var ro = scimoz.readOnly;
        try {
            scimoz.readOnly = false;
            scimoz.appendText(full_str_byte_length, full_str);
        } finally {
            scimoz.readOnly = ro;
        }
        // Bring the new text into view.
        scimoz.gotoPos(prevLength + 1);
    } catch(ex) {
        alert("problems printing [" + str + "]:" + ex + "\n");
    }
};
binder.ko.observeNotification = function(e, fn){
	var o = Components.classes['@mozilla.org/observer-service;1'].getService(Components.interfaces.nsIObserverService);
	o.addObserver({ observe : fn }, e, false);
}
binder.ko.alert = function(msg){

	ko.dialogs.alert(msg, null, "BINDER TOOL");
}

binder.openWindow = function(title, url){

	var obj = {};
	obj.title = title;
	obj.url = url;

	log("@binder.openWindow  [" + title + "]");
	window.openDialog("chrome://binder/content/window.xul",
                      "_blank",
                      "chrome,titlebar,centerscreen",
                      obj);

	log("@binder.openWindow  DONE");
}

binder.openToolWindow = function(params){

	params.binder = binder;

	log("@binder.openWindow  [" + params.title + "]");
	window.openDialog("chrome://binder/content/window.xul",
                      "_blank",
                      "chrome,titlebar,centerscreen",
                      params);

	log("@binder.openWindow  DONE");
}

/* File Helpers */
binder.ko.createFileFromPath = function(path){
	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
    file.initWithPath(path);
	return file;
};
binder.ko.getFilesInPath = function(p){
		var subPaths = binder.ko.comp_os.listdir(p, {}).filter(
			function(basename) { return (basename != '.' && basename != '..'); }
		);
		return subPaths;
};
binder.ko.currentFileDir = function() {
    return ko.interpolate.currentFilePath().replace(/[\/\\][^\/\\]+$/, '');
};
binder.ko.currentFilePath = function() {
    return ko.interpolate.currentFilePath();
};

binder.ko.isDocInActiveProject = function(d){
	//if ((d.file.indexOf(o.path_project) === 0)) o.flag_in_project = true;
};

binder.ko.activeDoc = function(){
    var d = ko.views.manager.currentView.koDoc;
	return d;
};

binder.ko.shellExec = function (cmd, wait=false){
	var out = '';
  	//alert(cmd);
	var cwd = binder.ko.getActiveProjectPath();
	var process = binder.ko.comp_runservice.RunAndNotify(cmd, cwd, '', '');

	if (wait) {
		var retval = process.wait(-1); // wait till the process is done
		if (retval == 0) {
			out = process.getStdout();
		}else{
			out = process.getStderr();
			binder.ko.notifyError("Command Failed\n" + cmd + "\n" + out, 'binder');
		}

		//if(!quiet) console_log(cmd);
		return out;
 	}else{
		return '';
	}
};

binder.ko.loadJS = function(url, obj){
	log("loadJS(" + url + ")");

    var script = { url: url, file : null };

    var file = binder.ko.comp_files.getFileFromURI(url);
    if (file && file.isLocal) {
        script.file = file;
    }

    obj.script = script;

    //binder.ko.comp_jsloader.loadSubScript(url, obj);

    binder.ko.comp_jsloader.loadSubScriptWithOptions(url, {target:obj, ignoreCache: true});

};

binder.ko.executeJavaScript = function(code){
	ko.macros.evalAsJavaScript(code);
}

binder.ko.helper_path_relativeTo = function(f, dir){
		var s = f.replace(dir, '');
        if (s.substring(0,1) == '/') s = s.substring(1);
		return s;
};
binder.ko.helper_path_relativeToDir = function(f, dir){
		var p = f.split('/');
		var np = [];
		var ok = false;
		for (i = 0; i < p.length; ++i) {
			if (!ok && (p[i] != dir)) continue;
			if(!ok && (p[i] == dir)){
				ok = true;
				continue;
			}
			np.push(p[i]);
		}

		return np.join('/');
};

binder.initializeFolders = function(){

	var dirsSvc = Components.classes['@activestate.com/koDirs;1'].getService(Components.interfaces.koIDirs);
	//var p = dirsSvc.userDataDir;

	binder.loadBindingsFromBindingFolderAtPath(dirsSvc.userDataDir);

}

binder.pathsLoaded = [];
binder.loadBindingFromURL = function (url){

	if( binder.pathsLoaded.indexOf(url) >= 0 ){
		log("Binding already loaded [" + url + "]" );
		return;
	}
	binder.pathsLoaded.push(url);

	binder.ko.loadJS(url, this);

};
binder.loadBindingsFromBindingFolderAtPath = function(path){

	var dirsSvc = Components.classes['@activestate.com/koDirs;1'].getService(Components.interfaces.koIDirs);
	var my_bindings = binder.ko.comp_ospath.join(path, 'komodo_bindings');

	log("Attempting to load bindings in [" + my_bindings + "]");
	if(!binder.ko.comp_ospath.isdir(my_bindings )){
		log("No bindings in [" + my_bindings + "]");
		return;
	}


	var files = binder.ko.getFilesInPath(my_bindings);


	files.map( function(f){
        var ext = ko.uriparse.ext(f);
        if (!ext || (ext != '.js')) return;

        var url = ko.uriparse.localPathToURI( binder.ko.comp_ospath.join(my_bindings, f));
        binder.loadBindingFromURL(url);
	});
};
binder.initialize = function() {
    try {
		binder.ko.comp_runservice = XPCOM_CCIN("@activestate.com/koRunService;1",'koIRunService');
		binder.ko.comp_jsloader = XPCOM_CCIN("@mozilla.org/moz/jssubscript-loader;1", "mozIJSSubScriptLoader");
		binder.ko.comp_resolve = XPCOM_CCSV("@activestate.com/koResolve;1", "koIResolve");
		binder.ko.comp_os = XPCOM_CCSV("@activestate.com/koOs;1", "koIOs");
		binder.ko.comp_ospath = XPCOM_CCSV("@activestate.com/koOsPath;1", "koIOsPath");
        binder.ko.comp_files = XPCOM_CCSV("@activestate.com/koFileService;1", "koIFileService");

		binder.ko.observeNotification('project_added', binder.eventProjectReady);
		binder.ko.observeNotification('project_removed', function(){ binder.project = null});

		binder.ko.observeNotification('file_changed', binder.onEventWithURI);
		//binder.ko.observeNotification('file_status', binder.onEventWithURI);

		binder.ko.observeNotification('open_file', binder.onEventWithURI);
		binder.ko.observeNotification('open-url', binder.onEventWithURI);


		//binder.ko.observeNotification('komodo-post-startup', binder.onEventWithURI);

		binder.initializeFolders();

    } catch(e) {

	}
};
binder.eventProjectReady = function(subject, topic, data){

	binder.ko.getProjectInfo(subject);
	log("Project Ready: " + binder.project.name);

	log("got event(" + topic + ")");

    binder.project_scope = binder.project.tag;


    var n = binder.project.tag + ".binder.js";
    var nf = binder.ko.createFileFromPath(binder.ko.comp_ospath.join( binder.project.path, n));
    log("seraching for " + nf.path);
    if( nf.exists() ){
        var url = ko.uriparse.localPathToURI( nf.path );
        binder.loadBindingFromURL(url);
    }

	binder.loadBindingsFromBindingFolderAtPath(binder.project.path);
    //binder.project_scope = "";

	if(!binder.listeners[topic]) return;
	for(var k in binder.listeners[topic]){
		var fn = binder.listeners[topic][k];
		//log("binder.listeners[" + k + "]g=" + fn);
		fn(binder.project);
	}
};
binder.cmd_file_transfer_scp = function(f, p){
  var cmd = "scp '" + f.file + "' " + p.user + "@" + p.host + ":'" + p.remote_dir + "" + f.file_rel_project + "'";
  binder.ko.alert(cmd);
  s = binder.ko.cli_run_command(cmd, true);
};




binder.on = function(events, fn){
	var events = typeof events === 'string' ? events.split(' ') : events;

	for (var i in events) {
		var e = events[i];

		if(!binder.listeners[e]) binder.listeners[e] = [];

		binder.listeners[e].push( fn );
	}
};
binder.broadcast = function(e){

};

binder.onEventWithURI = function(subject, topic, data){
    //if(!binder.ko.isFileInActiveProject()) return;

	log("got event(" + topic + ")");


    var currentProjectPath = "";
    var prj = binder.ko.getActiveProject();
    if( prj == null){
        binder.project_scope = "";
    }else{
	    currentProjectPath = binder.project.path; //(binder.project) ? binder.project.path : "";
    }

	if(data.indexOf("\n")){
		var urllist = data.split('\n');
	}else{
		var urllist = [data];
	}

	for (var u=0; u < urllist.length; ++u) {
		log("event(" + topic + ")=" + urllist[u]);
		var url = urllist[u];
		var path = binder.ko.comp_resolve.uriToPath(url);
		var f = binder.ko.createFileFromPath(path);

		var o = {pathRelativeToProject : '', currentProjectPath : '', file : f};
		o.currentProjectPath = currentProjectPath;

		if ( (currentProjectPath.length > 0) && (f.path.indexOf(currentProjectPath) === 0) ){
			o.pathRelativeToProject = binder.ko.helper_path_relativeTo(f.path,  currentProjectPath);
		}

		for(var k in binder.listeners[topic]){
			var fn = binder.listeners[topic][k];
			//log("binder.listeners[" + k + "]=" + fn);
			fn(o);
		}

        if( binder.project_scope.length > 0 ){
            topic = binder.project_scope + "." + topic;
            for(var k in binder.listeners[topic]){
			    var fn = binder.listeners[topic][k];
			    //log("binder.listeners[" + k + "]=" + fn);
			    fn(o);
		    }
        }


	}
	return;
}


binder.initialize();
ko.extensions.binder = binder;
