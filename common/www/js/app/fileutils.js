var g_fs = null;
var g_success = null;

var initPersistent = function(size, success) { // size: 5*1024*1024 /*5MB*/
    g_success = success;
    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    window.requestFileSystem(1, size, onInitFs, writeFileErrorHandler);
}

function initTemporary(size) {
    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    window.requestFileSystem(0, size, onInitFs, writeFileErrorHandler);
}

function onInitFs(fs) {
    g_fs = fs;
    console.log('Opened file system: ' + fs.name);
    g_success();
}

function createFile(filename, success) {
    g_fs.root.getFile(filename, {create: true, exclusive: false}, success, function (e) { console.log("createFile error:" + e);
                                                                        writeFileErrorHandler(e);});
}

function readFile(filename, success) {
    g_fs.root.getFile(filename, {create: false}, success, function (e) { console.log("getFile error:" + e); writeFileErrorHandler(e);});
}

function writeToFile(filename, text, onwriteend, onerror) {
    createFile(filename, function (fileEntry) {
        fileEntry.createWriter(function(fileWriter) {
            fileWriter.onwriteend = onwriteend;
            fileWriter.onerror = onerror;
            // cordova can only write text
            if (mobile_system == "") {
                fileWriter.write(new Blob([text]));
            } else {
                fileWriter.write(text);
            }
        }, function (e) { console.log("error writing file:" + e);
                          writeFileErrorHandler(e); });
    });
}

function readFromFile(filename, onloadend, onerror) {
    readFile(filename, function(fileEntry) {
        fileEntry.file(function(file) {
            var reader = new FileReader();
            reader.onloadend = onloadend;
            reader.readAsText(file);
        }, function (e) { console.log("error reading file:" + e);
                          writeFileErrorHandler(e); });
    });
}

function fileExists(filename) {
    var reader = new FileReader();
    reader.onloadend = function(evt) {
        if (evt.target.result == null) {
            return true;
        } else {
            return false;
        }
    };
    reader.readAsDataURL(filename);
}

function writeFileErrorHandler(e) {
    var msg = '';

    switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
        msg = 'QUOTA_EXCEEDED_ERR';
        break;
    case FileError.NOT_FOUND_ERR:
        msg = 'NOT_FOUND_ERR';
        break;
    case FileError.SECURITY_ERR:
        msg = 'SECURITY_ERR';
        break;
    case FileError.INVALID_MODIFICATION_ERR:
        msg = 'INVALID_MODIFICATION_ERR';
        break;
    case FileError.INVALID_STATE_ERR:
        msg = 'INVALID_STATE_ERR';
        break;
    default:
        msg = 'Unknown Error';
        break;
    };

    console.log('Error: ' + msg + " - " + e);
}
