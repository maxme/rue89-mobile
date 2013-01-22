var URL = "http://www.rue89.com/files/export/iphone3/xml/list.xml";

function startApp() {
    //console.log("cordova="+ JSON.stringify(cordova));
    //cordova.logger.logLevel("DEBUG");
    initPersistent(1024*1024, function () {
        loadData();
        fetchData();
    });
};

function createEntry(title, imageurl) {
    var res = '<li ';
    if (imageurl) {
        res += 'style="background-image: url(\'http://www.rue89.com/sites/news/files/styles/article_widescreen/public/'
            + imageurl +'\'); background-repeat: no-repeat; max-width:100%">';
    } else {
        res += '>';
    }
    res += '<a href=""><h1 style="width:90%; white-space:normal; font-size:120%; -webkit-text-stroke: 1px black; ">'
        + title + '</h1></a></li>';
    return res;
}

function parseXMLandShow(xml) {
    $('#load').fadeOut();
    $("#list").html("");
    $(xml).find("item").each(function () {
         var title = $(this).find("title").text();
         console.log("new title=" + title);
         var imageurl = $(this).find("image").text();
         var tmp = createEntry(title, imageurl);
         $("#list").append(tmp);
    });
    $('#list').listview('refresh');
}

function fileSave(data) {
    createFile("list.xml", function (fileEntry) {
        // Create a FileWriter object for our FileEntry (log.txt).
        fileEntry.createWriter(function(fileWriter) {
            fileWriter.onwriteend = function(e) {
                console.log('Write completed.');
                loadData();
            };
            fileWriter.onerror = function(e) {
                console.log('Write failed: ' + JSON.stringify(e));
                writeFileErrorHandler(e);
            };
            // Create a new Blob and write it to log.txt.
            var str = (new XMLSerializer()).serializeToString(data);
            //var blob = new Blob([str], {type: 'text/plain'});
            // cordova can only write text
            fileWriter.write(str);
        }, function (e) { console.log("error writing file:" + e);  writeFileErrorHandler(e); });
    });
}

function downloadAndCache(url) {

}

function loadData() {
    readFile("list.xml", function(fileEntry) {
      // Get a File object representing the file,
      // then use FileReader to read its contents.
      fileEntry.file(function(file) {
         var reader = new FileReader();
         reader.onloadend = function(evt) {
             var xml = evt.target.result;
             var xmlDoc = $.parseXML(xml);
             parseXMLandShow(xmlDoc);
         };
         reader.readAsText(file);
      }, function (e) { console.log("error reading file:" + e);  writeFileErrorHandler(e); });
    });
}

function fetchData() {
    $.ajax({
               type: "GET",
               url: URL,
               dataType: "text",
               success: getDataSuccess,
               error: getDataError
           });

    function getDataError(jqXHR, textStatus, errorThrown) {
        console.log("getDataError: status=" + textStatus + " xhr=" + JSON.stringify(jqXHR)
                    + " - "  + JSON.stringify(errorThrown));
        $('#load').fadeOut("slow", function () {
                               $('#load').html('<li>Error Loading Page</li>').fadeIn();
                           });
    }

    function getDataSuccess(data) {
        fileSave(data);
        var xmlDoc = $.parseXML(data);
        parseXMLandShow(xmlDoc);
    }
}
