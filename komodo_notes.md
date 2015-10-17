



https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIFile
https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsILocalFile



void create(in unsigned long type, in unsigned long permissions)
boolean contains( nsIFile inFile )
boolean equals(in nsIFile inFile)
boolean exists()
boolean isDirectory()
boolean isExecutable()
boolean isFile()
boolean isHidden()
boolean isReadable()
boolean isWritable()
void normalize()
void copyTo( nsIFile newParentDir, AString newName )
void moveTo(in nsIFile newParentDir,in AString newName )
void renameTo(in nsIFile newParentDir,in AString newName );

nsIFile
nsIFile.leafName
nsIFile.path


project.getFile()

koIFileEx interface "koIFileEx.idl"

file.baseName
file.path
file.parent
file.dirName
file.exists()

var koIFile = (Components.classes["@activestate.com/koFileService;1"].getService(Components.interfaces.koIFileService).
					   
koIFile.path
koIFile.isLocal
koIFile.isFile
koIFile.displayPath
koIFile.URI
koIFile.dirName
kIoFile.baseName
kIoFile.scheme


koIFile.open('rb');

var koIFile = fileSvc.makeTempFile(".py", "w");
koIFile.puts(fileContents);
koIFile.close();

//the view file is a koIFile
kIoFile = view.koDoc.file;


var koLocalFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
koLocalFile.initWithPath(kpzExtractFolder);
koLocalFile.append(ko.uriparse.baseName(uri));

koLocalFile.exists();
koLocalFile.remove(false);


var data = "hello world";
var stream = Components.classes["@mozilla.org/network/safe-file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
stream.init(koLocalFile, 0x04 | 0x08 | 0x20, /*0600*/384, 0); // write, create, truncate
stream.write(data, data.length);
stream.close();




var url = ko.uriparse.localPathToURI(dir);
defaultDir = ko.uriparse.dirName(prevSaveFile);
defaultName = ko.uriparse.baseName(prevSaveFile);
var ext = ko.uriparse.ext(targetPath); if (!ext)

var s = "file.displayPath=[" + o.file.displayPath + "]\n";
  s += "file.URI=[" + o.file.URI + "]\n";
  s += "file.server=[" + o.file.server + "]\n";
  s += "file.path=[" + o.file.path + "]\n";
  s += "file.nativeTarget=[" + o.file.nativeTarget + "]\n";
  s += "file.nativePath=[" + o.file.nativePath + "]\n";
  s += "file.parent=[" + o.file.parent + "]\n";
  s += "file.ext=[" + o.file.ext + "]\n";
  s += "file.md5name=[" + o.file.leafName + "]\n";
  s += "file.encodedURI=[" + o.file.encodedURI + "]\n";
  s += "file.isLocal=[" + o.file.isLocal + "]\n";
  s += "file.lastModifiedTime=[" + o.file.lastModifiedTime + "]\n";
  s += "file.fileSize=[" + o.file.fileSize + "]\n";
  s += "file.exists()=[" + o.file.exists() + "]\n";

  s += "file.isReadable()=[" + o.file.isReadable() + "]\n";
  s += "file.isWritable()=[" + o.file.isWritable() + "]\n";
  s += "file.isWritable()=[" + o.file.isWritable() + "]\n";
  s += "file.isHidden()=[" + o.file.isHidden() + "]\n";
  s += "file.isFile()=[" + o.file.isFile() + "]\n";
  s += "file.isExecutable()=[" + o.file.isExecutable() + "]\n";

  s += "file.isDirectory()=[" + o.file.isDirectory() + "]\n";
  s += "file.isFile()=[" + o.file.isFile() + "]\n";
  s += "file.isSymlink()=[" + o.file.isSymlink() + "]\n";
  alert(s);

  
var subPaths = binder.ko.comp_os.listdir(p, {}).filter(function(basename) {
                 // Copy folders that start with a ".", but not
                 // files, and of course skip "." and ".."
                 return (basename != '.' && basename != '..' && (osPathSvc.isdir(binder.ko.comp_ospath.join(path, basename)) || basename[0] != "."));
}).map(function(basename) binder.ko.comp_ospath.join(path, basename));



if ( ! file){
    log.error("File is not defined");
                return false;
            }

            if ( ! (file instanceof Components.interfaces.nsIFile))
            {
                log.error("File should be instance of nsIFile");
                return false;
            }

            if ( ! file.exists())
            {
                log.error("File does not exist: " + file.path);
                return false;
            }

doc.file
doc.displayPath
doc.baseName
doc.language;


var saveFilePath = ko.filepicker.saveFile(defaultDir, defaultName,"Save Workspace...", ["Workspace"]);

var fileEx = Components.classes["@activestate.com/koFileEx;1"].createInstance(Components.interfaces.koIFileEx);
fileEx.URI = filepath;
fileEx.open('w');
fileEx.puts(JSON.stringify(workspace));
fileEx.close();

ko.open.URI(tool.url);

ko.views.manager.doFileNewFromTemplateAsync(tool.url);
ko.browse.openUrlInDefaultBrowser(tool.value);
ko.views.manager.doFileOpenAsync(tool.value, 'browser');


var sysUtilsSvc = Components.classes["@activestate.com/koSysUtils;1"].getService(Components.interfaces.koISysUtils);
sysUtilsSvc.ShowFileInFileManager(path);


this.getDirectory = function() {
    return ko.places.manager.currentPlace;
};



if (file.isLocal) {
        ko.places..manager.openDirectory(file.path);
    } else {
        ko.places..manager.openNamedRemoteDirectory(file.URI);
    }



var url = items[0].url;
    var file = Components.classes["@activestate.com/koFileEx;1"].
    createInstance(Components.interfaces.koIFileEx);
    file.URI = url;
    var pickerDir = file.isLocal? file.dirName : '';
    var otherfile = ko.filepicker.browseForFile(pickerDir);
    if (otherfile) {
        ko.fileutils.showDiffs(file.path, otherfile);
    }



var title = komodo_bundle.GetStringFromName("selectFilesToImportToolbox");
    var defaultFilename = null;
    var defaultFilterName = "Komodo Tool";
    var filterNames = [defaultFilterName, "Zip", "All"]
    var paths = ko.filepicker.browseForFiles(defaultDirectory, defaultFilename,
                                        title,
                                        defaultFilterName, filterNames);
    if (!paths) {
        return;
    }


var path = ko.filepicker.getFolder(defaultDirectory, title);
    if (!path) {
        return;
    }


if (!ko.prefs.hasPref("mruWorkspaceSize")) {
    ko.prefs.setLong("mruWorkspaceSize", 10);
}

            spaceFile.URI = filepath;
              try {
                  spaceFile.open("r");
                  // It should be a JSON file.
                  return JSON.parse(spaceFile.readfile());
              } catch(ex) {
                  require("notify/notify").send("Could not load workspace file: " + spaceFile.baseName,
                                                "workspace", {priority: "warning"});
              } finally {
                  spaceFile.close();
              }



xtk.clipboard.addTextDataFlavor("text/plain", string);



viewManager.prototype.getViewForURI

ko.views.manager.


var project = ko.projects.manager.currentProject;
if (project) {

}
