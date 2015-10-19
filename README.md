
BINDER

Binder provides means to extend Komodo with easy to use javascript bindings to events and more, without the need of plugins.

## How it works ##

Binder allows to load javascript files from different sources. In these javascript files you can place code to extend Komodo or register callbacks for the many events exposed by Binder.


## Where to put javascript files... ##

Binder looks for scripts in a folder named ```komodo_bindings``` in a couple of places.

### In the Komodo data directory ###

The first place Binder looks for scripts to load is in your Komodo's folder. This folder is the User-specific data directory where Komodo store its files (userDataDir).

In Mac this folder is located at ```~/Library/Application Support/KomodoEdit/9.1/```, where ```9.1``` must be replaced with your version of Komodo. In windows is in the user's ```AppData``` folder.

For example in my mac the folder is ```/Users/ctk/Library/Application Support/KomodoEdit/9.2/komodo_bindings/```.

Here we usually put code that we want to share globally, including Binder addons (plugins).

### In your home folder ###
The second place is in your user home folder. For example ```/Users/ctk/komodo_bindings/```.

### In your project's folder ###
The third place is in the root folder of a Komodo project. Files in this folder are loaded when the project is opened ofr the first time.

## What can I put on a komodo_bindings folder... ##

You can put any file with a ```.js``` extension in a ```komodo_bindings``` folder and it will be loaded.

WARNING: The order in which the scripts are loaded is not guaranteed and is OS specific. In must OS you can use the file name to control the order.


## Project Bindings ##

Create a JavaScript file with the same name as your project file and add ".binder.js" to the name.
For example if my project's file is ```reasg.komodoproject```, then you create a ```reasg.binder.js``` file.

This script is loaded before the scripts in your project's ```komodo_bindings``` folder.


## Binding Samples ##

```javascript
binder.on( "file_changed", function(o){
    binder.ko.alert("my save1=" + o.file.path);
} );
```

```javascript
binder.on( ["open-url", "open_file"], function(o){
    binder.ko.alert("my open_file=" + o.file.path);
} );
```

```javascript
binder.on( "project_added", function(p){
    binder.ko.alert("my project_added=" + o.name);
} );
```

```javascript
binder.on( "project_added", function(p){
    binder.ko.alert("my project_removed=" + o.name);
} );
```

## Interact with Komodo ##

Binder provides some helpers to interact with Komodo.

Check if Komodo has an active project open.
```javascript
var ok = binder.ko.projectHasActive(); //bool
```

Check if a path is part of the active project.
```JavaScript
var ok = binder.ko.projectHasPath(path);  //bool
```

Get a string with the absolute path of the current project.
```javascript
var path = binder.ko.projectGetPath();
```

Get an array with key/value pairs of all the environment variables defined in the active project.
```JavaScript
var items = binder.ko.projectGetKeys();
```

Get basic info about the active project. Returns a project object. See: Binder Value Type Project
```javascript
var prj = binder.ko.getActiveProject();
```

Get basic info from a komodo project instance. Returns a project object. See: Binder Value Type Project
```javascript
var prj = binder.ko.getProjectInfo(kProject);
```

Check if the editor has an active editor view.
```javascript
var ok = binder.ko.hasActiveView(); //bool
```

Display a notification.
```javascript
var msg = "Hello World";
var scope_tag = "mything";

binder.ko.notifyWarning(msg, scope_tag);

binder.ko.notifyError(msg, scope_tag);

binder.ko.notifyInfo(msg, scope_tag);
```

Write a string the command output pane.
```javascript
binder.ko.runoutputWrite("Commad done");
```

Display an alert dialog.
```javascript
binder.ko.alert("Hello world");
```

Open a dialog window with the contents of an url.
```javascript
binder.openWindow(title, url);
```

Executes javascript code.
```javascript
binder.ko.executeJavaScript(js);
```

Run a command in CLI.
```javascript
binder.ko.shellExec(cmd);
```

```javascript
var wait = true;
var output = binder.ko.shellExec(cmd, wait);
```

Running a command with a Komodo procces using ```shellExecProcess()```. This method returns a ```process`` and is a direct mapping for Komodo's ```RunAndNotify``` service.
```javascript
var cmd = "ls -l /Users/ctk/Desktop";

//binder.ko.shellExecProcess(cmd, cwd, env=null, cmd_input=null, cmd_output=null, cmd_error=null) 
var p = binder.ko.shellExecProcess(cmd, null, null, null, null, null);
var retval = p.wait(-1);

alert("Exit code=" + retval);
if( retval != 0){
	alert("Command failed: " + p.getStderr());
}else{
	alert("Success: " + p.getStdout());
}
```
return;

## Helpers to handle files ##

Test if a path is a directory.
```javascript
var ok = binder.ko.pathIsDir(path);
```

Test if a path exists.
```javascript
var ok = binder.ko.pathExists(path);
```

Get the directory part of a path.
```javascript
var dir_path = binder.ko.pathDirectory(path);
```

Normalize a path by collapsing redundant separators and up-level references so that A//B, A/B/, A/./B and A/foo/../B all become A/B.
```javascript
path = binder.ko.pathNormalize(path);
```

Replace an initial component of ~ or ~user replaced by that user‘s home directory
```javascript
var path = binder.ko.pathExpandUser("~/Desktop/test.js");
```

Returns a path without a file extensions
```javascript
var path = binder.ko.pathWithoutExtension("~/Desktop/test.js");
```

Returns the extension of a file's path.
```javascript
var ext = binder.ko.pathGetExtension("/Desktop/test.js");
```

Build a URI for a given local path.
```javascript
var url = binder.ko.pathGetURI(path);
```

Join two paths.
```javascript
var path = "/Users/ctk";
var file_path = binder.ko.pathJoin(path, "Desktop/test.php");
```

Test if a path is an absolute path.
```javascript
var absolute_path = "";
if( binder.ko.pathIsAbsolute(path) ){
	absolute_path = path;
}else{
	//make an absolute path using the current working directory
	absolute_path = binder.ko.pathJoin(gCWD, path);
}
```

Crate a directory
```javascript
binder.ko.pathMakeDir = function(path){
	return binder.ko.comp_os.mkdir(path);
};
```

Get an array of file names in a folder.
```javascript
var items = binder.ko.pathListFiles( dir_path );
```

Create a temporary file with a given extension and contents.
```javascript
var extension = ".txt";
var contents = "hello world\n";
var kIoFile = binder.ko.fileCreateTempWithContents(extension, contents);
alert("Path is: " + kIoFile.path);
```

 ```javascript
 binder.ko.currentFilePath();
 ```

```javascript
binder.ko.currentFileDir();
```

Get a koIFileEx instance. Uses Komodo File Service Component.
```javascript
var kIoFile = binder.ko.fileCreateFromURI( uri );
var s = "file.displayPath=[" + kIoFile.displayPath + "]\n";
  s += "file.URI=[" + kIoFile.URI + "]\n";
  s += "file.server=[" + kIoFile.server + "]\n";
  s += "file.path=[" + kIoFile.path + "]\n";
  s += "file.ext=[" + kIoFile.ext + "]\n";
  s += "file.dirName=[" + kIoFile.dirName + "]\n";
  s += "file.baseName=[" + kIoFile.baseName + "]\n";
  s += "file.md5name=[" + kIoFile.leafName + "]\n";
  s += "file.encodedURI=[" + kIoFile.encodedURI + "]\n";
  s += "file.isLocal=[" + kIoFile.isLocal + "]\n";
  s += "file.isFile=[" + kIoFile.isFile + "]\n";
  s += "file.scheme=[" + kIoFile.scheme + "]\n";
  s += "file.lastModifiedTime=[" + kIoFile.lastModifiedTime + "]\n";
  s += "file.fileSize=[" + kIoFile.fileSize + "]\n";

alert(s);
```

```javascript
var kIoFile = binder.ko.fileCreateFromPath( uri );
```


Returns an instance of [nsILocalFile](https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsILocalFile) from a given path.

```javascript
	var nsILocalFile = binder.ko.createFileFromPath(file_path);
```




## Binder Value Type: File ##
Binder's File is a basic object that wraps a Komodo's koIFileEx instance with additional info.

https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIFile
https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsILocalFile


```javascript

o.currentProjectPath
o.pathRelativeToProject

o.file.path
o.file.path
o.file.parent
o.file.dirName
o.file.URI
o.file.isLocal
o.file.exists()

```

## Binder Value Type: Project ##
Binder's Project is a basic object with basic information about the current project.

```javascript

p.path
p.name
p.instance

p.activate();
p.isReady();

p.projectGetKeys();
p.settings = {};
```


## Binder ToolWindow ##

Build a tool window with ```binder.openToolWindow(params)```

```javascript




```
