var LIST_URL = "http://www.rue89.com/files/export/iphone3/xml/list.xml";
var ARTICLE_URL = "http://www.rue89.com/files/export/iphone3/xml/content_";
var g_article_loading = false;

function startApp() {
    initPersistent(1024 * 1024, function () {
        realStart();
    });
}

function realStart() {
    loadData();
    fetchData();
    $("#refreshbutton").on("tap", function () {
        fetchData();
    });
}

function createEntry(title, imageurl, nid) {
    var res = '<li ';
//    if (imageurl) {
//        res += 'style="background-image: url(\'http://www.rue89.com/sites/news/files/styles/article_widescreen/public/'
//            + imageurl +'\'); background-repeat: no-repeat; background-position: 50% 100%;">';
//    } else {
    res += '>';
//    }
    var img = '<img src="http://www.rue89.com/sites/news/files/styles/article_widescreen/public/' + imageurl + '" /></div>';
    res += '<a href="#article" class="articlelink" id="' + nid + '">' + img + '<h2 style="font-size: 80%; white-space:normal; ">' + title + '</h2></a></li>';
    return res;
}

function parseArticleXML(xml) {
    $("#articlecontent").html("");
    var body = $(xml).find("body").text();
    $("#articlecontent").append(body);

}

function showArticle(nid) {
    // read
    readFromFile(nid + ".xml", function (evt) {
        var xml = evt.target.result;
        var xmlDoc = $.parseXML(xml);
        parseArticleXML(xmlDoc);
        g_article_loading = false;
    });
}

function parseListXMLandShow(xml) {
    $('#load').fadeOut();
    $("#list").html("");
    $(xml).find("item").each(function () {
        var title = $(this).find("title").text();
        var nid = $(this).find("nid").text();
        var imageurl = $(this).find("image").text();
        var tmp = createEntry(title, imageurl, nid);
        $("#list").append(tmp);
        downloadAndSaveArticle(nid);
    });
    $('#list').listview('refresh');
    $('.ui-li-thumb').load(function (event) {
        OnImageLoad(event);
        return false;
    });
    $('.articlelink').on('tap', function (event) {
        if (g_article_loading == false) {
            g_article_loading = true;
            var nid = $(this).attr("id");
            console.log("tap=" + nid);
            showArticle(nid);
        }
    });
}

function downloadAndSaveArticle(nid) {
    var url = ARTICLE_URL + nid + ".xml";
    var filename = nid + ".xml";
    fileExists(filename, function (exists) {
        if (!exists) {
            console.log("file doesn't exists: " + filename);
            downloadAndSaveFile(url, filename);
        }
    });
}

function downloadAndSaveFile(url, filename) {
    $.ajax({type:"GET",
        url:url,
        dataType:"text",
        success:saveFilename(url, filename),
        error:downloadError,
        cache:true
    });
}

function saveFilename(url, filename) {
    return function (data) {
        writeToFile(filename, data, function (e) {
            console.log("file written: " + filename);
        });
    };
}

function downloadError(jqXHR, textStatus, errorThrown) {
    console.log("downloadError: status=" + textStatus + " xhr=" + JSON.stringify(jqXHR)
        + " - " + JSON.stringify(errorThrown));
}

function loadData() {
    readFromFile("list.xml", function (evt) {
        var xml = evt.target.result;
        var xmlDoc = $.parseXML(xml);
        parseListXMLandShow(xmlDoc);
    });
}

function fetchData() {
    $.ajax({type:"GET",
        url:LIST_URL,
        dataType:"text",
        success:getDataSuccess,
        error:getDataError
    });

    function getDataError(jqXHR, textStatus, errorThrown) {
        console.log("getDataError: status=" + textStatus + " xhr=" + JSON.stringify(jqXHR)
            + " - " + JSON.stringify(errorThrown));
        $('#load').fadeOut("slow", function () {
            $('#load').html('<li>Error Loading Page</li>').fadeIn();
        });
    }

    function getDataSuccess(data) {
        writeToFile("list.xml", data);
        var xmlDoc = $.parseXML(data);
        parseListXMLandShow(xmlDoc);
    }
}
