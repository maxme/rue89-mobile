var g_fs = null;
var g_success = null;
function initPersistent(size, success) { // size: 5*1024*1024 /*5MB*/
    g_success = success;
    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    window.webkitStorageInfo.requestQuota(1, size,
           function(grantedBytes) { // success
               console.log('Granted Bytes: ' + grantedBytes);
               window.requestFileSystem(1, grantedBytes, onInitFs, errorHandler);
           },
           function(e) { // error
               console.log('Error requesting quota: ', e);
           });
}

function initTemporary(size) {
    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    window.requestFileSystem(0, size, onInitFs, errorHandler);
}

function onInitFs(fs) {
    g_fs = fs;
    console.log('Opened file system: ' + fs.name);
    g_success();
}

function createFile(filename, success) {
    g_fs.root.getFile(filename, {create: true}, success, function (e) { console.log("error:" + e); });
}

function readFile(filename, success) {
    g_fs.root.getFile(filename, {}, success, function (e) { console.log("error:" + e); });
}

function errorHandler(e) {
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
    alert('Error: ' + msg + " - " + e);
}
