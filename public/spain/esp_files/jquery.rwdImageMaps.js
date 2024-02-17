/*
* rwdImageMaps jQuery plugin v1.5
*
* Allows image maps to be used in a responsive design by recalculating the area coordinates to match the actual image size on load and window.resize
*
* Copyright (c) 2013 Matt Stow
* https://github.com/stowball/jQuery-rwdImageMaps
* http://mattstow.com
* Licensed under the MIT license
*/
; (function ($) {
    $.fn.rwdImageMaps = function () {
        var $img = this;

        var rwdImageMap = function () {
            $img.each(function () {
                if (typeof ($(this).attr('usemap')) == 'undefined')
                    return;

                var that = this,
					$that = $(that);

                // Since WebKit doesn't know the height until after the image has loaded, perform everything in an onload copy
                $('<img />').load(function () {
                    var attrW = 'width',
						attrH = 'height',
						w = $that.attr(attrW),
						h = $that.attr(attrH);

                    if (!w || !h) {
                        var temp = new Image();
                        temp.src = $that.attr('src');
                        if (!w)
                            w = temp.width;
                        if (!h)
                            h = temp.height;
                    }

                    var wPercent = $that.width() / 100,
						hPercent = $that.height() / 100,
						map = $that.attr('usemap').replace('#', ''),
						c = 'coords';

                    $('map[name="' + map + '"]').find('area').each(function () {
                        var $this = $(this);
                        if (!$this.data(c))
                            $this.data(c, $this.attr(c));

                        var coords = $this.data(c).split(','),
							coordsPercent = new Array(coords.length),
                            boxCoords = [+Infinity, +Infinity, -Infinity, -Infinity];

                        for (var i = 0; i < coordsPercent.length; ++i) {
                            if (i % 2 === 0) {
                                coordsPercent[i] = parseInt(((coords[i] / w) * 100) * wPercent);
                                boxCoords[0] = Math.min(boxCoords[0], coordsPercent[i]);
                                boxCoords[2] = Math.max(boxCoords[2], coordsPercent[i]);
                            } else {
                                coordsPercent[i] = parseInt(((coords[i] / h) * 100) * hPercent);
                                boxCoords[1] = Math.min(boxCoords[1], coordsPercent[i]);
                                boxCoords[3] = Math.max(boxCoords[3], coordsPercent[i]);
                            }
                        }
                        $this.data('box', boxCoords.toString());
                        $this.attr(c, coordsPercent.toString());
                    });
                }).attr('src', $that.attr('src'));
            });
        };
        $(window).resize(rwdImageMap).trigger('resize');

        return this;
    };

    $.fn.responsiveCities = function (imgId) {
        var $div = this;
        var $img = $("#" + imgId);

        var resizeCities = function () {
            var that = this;

            var attrW = 'width',
                w = $img.attr(attrW);

            var ratio = $img.width() / w;

            $div.find('div').each(function () {
                var $this = $(this);
                var top = $this.attr("top");
                var left = $this.attr("left");

                $this.css("top", parseInt(top * ratio) + "px");
                $this.css("left", parseInt(left * ratio) + "px");
            });
        };

        $(window).resize(resizeCities).trigger('resize');

        return this;
    };
})(jQuery);