// Code from https://github.com/jquery/jquery-mobile/issues/1607

function OnImageLoad(evt) {
    var img = evt.currentTarget;

    if ($(img).hasClass('ui-li-thumb')) {
        PrepJqmLvThumbnail($(img));
    }

    var w = $(img).width();
    var h = $(img).height();
    var tw = $(img).parent().width();
    var th = $(img).parent().height();

    var result = ScaleImage(w, h, tw, th, false);

    img.width = result.width;
    img.height = result.height;
    $(img).css("left", result.targetleft);
    $(img).css("top", result.targettop);
}

function PrepJqmLvThumbnail(img) {
    var parent = img.wrap('<div>').parent();
    parent.addClass('ui-li-thumb');
    parent.css('overflow', 'hidden');
    img.removeClass('ui-li-thumb');
    img.css('position', 'absolute');

    parent.css('width', '100px');
    parent.css('height', '100px');

    img.css('max-width', '1000px');
}

function ScaleImage(srcwidth, srcheight, targetwidth, targetheight, fLetterBox) {
    var result = {
        width: 0,
        height: 0,
        fScaleToTargetWidth:true
    };

    if ((srcwidth <= 0) || (srcheight <= 0) || (targetwidth <= 0) || (targetheight <= 0)) {
        return result;
    }

// scale to the target width
    var scaleX1 = targetwidth;
    var scaleY1 = (srcheight * targetwidth) / srcwidth;

// scale to the target height
    var scaleX2 = (srcwidth * targetheight) / srcheight;
    var scaleY2 = targetheight;

// now figure out which one we should use
    var fScaleOnWidth = (scaleX2 > targetwidth);
    if (fScaleOnWidth) {
        fScaleOnWidth = fLetterBox;
    } else {
        fScaleOnWidth = !fLetterBox;
    }

    if (fScaleOnWidth) {
        result.width = Math.floor(scaleX1);
        result.height = Math.floor(scaleY1);
        result.fScaleToTargetWidth = true;
    } else {
        result.width = Math.floor(scaleX2);
        result.height = Math.floor(scaleY2);
        result.fScaleToTargetWidth = false;
    }
    result.targetleft = Math.floor((targetwidth - result.width) / 2);
    result.targettop = Math.floor((targetheight - result.height) / 2);

    return result;
}