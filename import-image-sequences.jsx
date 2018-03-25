#target premierepro
var proj = app.project;
function importImageSequences() {    
    var foundfolders = 0;
    var foundfiles = 0;
    var importFolder = Folder.selectDialog("Choose the folder to import");
    if (importFolder == null) {
        return;
    }
    var folders = importFolder.getFiles();
    var foldersAry = [];
    for (var i = 0; i < folders.length; i++) {
        if (folders[i].toString().indexOf(".") > -1){
            foundfiles++;
        } else {
            foundfolders++;
        }
    }
    // single folder
    if (foundfiles > foundfolders) {
        for (var i = 0; i < folders.length; i++) {
            if (folders[i].toString().indexOf("._") > -1 || folders[i].toString().indexOf(".DS_Store") > -1 || folders[i].toString().indexOf(".db") > -1 ){
                continue;
            } else {
                foldersAry[i] = folders[i].fsName;
            }            
        }    
        foldersAry.sort();
        proj.importFiles(foldersAry,1,proj.rootItem,1);
    // multi folder
    } else {
        var folderCount = 0;
        for (var i = 0; i < folders.length; i++) {
            if (folders[i].toString().indexOf("._") > -1 || folders[i].toString().indexOf(".DS_Store") > -1 || folders[i].toString().indexOf(".db") > -1 ){
                continue;
            } else {
                foldersAry[folderCount] = folders[i].fsName;
                folderCount++;
            }
        }
        foldersAry.sort();        
        for (var i = 0; i < folderCount; i++) {
                var filesAry = [];
                importFiles = Folder(foldersAry[i]);
                var files = importFiles.getFiles();

            for (var k = 0; k < files.length; k++) {
                if (files[k].toString().indexOf("._") > -1 || files[k].toString().indexOf(".DS_Store") > -1 || folders[i].toString().indexOf(".db") > -1 ){                    
                    continue;
                } else {
                    filesAry[k] = files[k].fsName;
                }
            }
            filesAry.sort();
            proj.importFiles(filesAry,1,proj.rootItem,1);
        }
    }
}
importImageSequences();