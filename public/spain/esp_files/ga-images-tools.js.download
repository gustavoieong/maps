function swipeRight(im) {
    // Do not swipe more than 1 time in 200ms, otherwise too fast and events may intersect
    window.swipeNotActive = true;
    var activeImage = im.children(".item-img:not(.hidden)"),
        nextImage = preloadRightImage(activeImage);
    // Fade in 200ms
    activeImage.fadeToggle(150, function () {
        im.children(".item-img:not(.hidden)").addClass("hidden");
        nextImage.removeClass("hidden");
        // Unfade
        activeImage.fadeToggle(0);
        // preload one more image to the right
        preloadRightImage(nextImage);
        window.swipeNotActive = false;
    });
    return false;
}

function swipeLeft(im) {
    // Do not swipe more than 1 time in 200ms, otherwise too fast and events may intersect
    window.swipeNotActive = true;
    var activeImage = im.children('.item-img:not(.hidden)'),
        previousImage = preloadLeftImage(activeImage);
    // Fade in 200ms
    activeImage.fadeToggle(150, function () {
        im.children(".item-img:not(.hidden)").addClass("hidden");
        previousImage.removeClass("hidden");
        // Unfade
        activeImage.fadeToggle(0);
        // preload one more image to the right
        preloadLeftImage(previousImage);
        window.swipeNotActive = false;
    });
    return false;
}

function preloadLeftImage(im) {
    var previousImage = im.siblings(".item-img[data-index=" + (im.data("index") - 1) + "]");
    if (!previousImage.length) {
        var maxPhotoIndex = 0;
        var items = im.siblings('.item-img');
        for (var i = 0; i < items.length; i++) {
            var val = items.eq(i).data("index");
            if (val > maxPhotoIndex) maxPhotoIndex = val;
        }
        previousImage = im.siblings(".item-img[data-index=" + maxPhotoIndex + "]");
    }
    if (previousImage.attr("data-lazy-load-src")) {
        previousImage.attr("src", previousImage.attr("data-lazy-load-src"));
        previousImage.removeAttr("data-lazy-load-src");
    }
    return previousImage;
}

function preloadRightImage(im) {
    var nextImage = im.siblings(".item-img[data-index=" + (im.data("index") + 1) + "]");
    if (!nextImage.length) {
        nextImage = im.siblings(".item-img[data-index=0]");
    }
    if (nextImage.attr("data-lazy-load-src")) {
        nextImage.attr("src", nextImage.attr("data-lazy-load-src"));
        nextImage.removeAttr("data-lazy-load-src");
    }
    return nextImage;
}


function swipeListen(im) {
    $(im).on('touchstart', handleTouchStart);
    $(im).on('touchmove', handleTouchMove);

    var xDown = null;
    var yDown = null;

    function handleTouchStart(evt) {
        // Do not swipe more than 1 time in 200ms, otherwise too fast and events may intersect
        if (window.swipeNotActive === true) {
            xDown = null;
            yDown = null;
        } else {
            xDown = evt.originalEvent.touches[0].clientX;
            yDown = evt.originalEvent.touches[0].clientY;
        }

    };

    function handleTouchMove(evt) {
        if (!xDown || !yDown) {
            return;
        }

        var xUp = evt.originalEvent.touches[0].clientX;
        var yUp = evt.originalEvent.touches[0].clientY;

        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;
        if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
            evt.preventDefault();
            if (xDiff > 0) {
                swipeRight(im);
            } else if (xDiff < 0) {
                swipeLeft(im);
            }
        }
        /* reset values */
        xDown = null;
        yDown = null;
    };
}

function preloadLeftAndRightImages(currentImage) {
    $(currentImage).removeAttr("data-lazy-load-src");
    // preload one image to the left
    preloadLeftImage($(currentImage));
    // preload one image to the right
    preloadRightImage($(currentImage));
}

$.fn.unveil = function (threshold, callback) {
    var $w = $(window),
        th = threshold || 0,
        retina = window.devicePixelRatio > 1,
        attrib = retina ? "data-lazy-load-src-retina" : "data-lazy-load-src",
        images = this,
        loaded;

    this.one("unveil", function () {
        var source = this.getAttribute(attrib);
        source = source || this.getAttribute("data-lazy-load-src");
        if (source) {
            if (this.getAttribute("src") !== source) {
                this.setAttribute("src", source);
            }
            if (typeof callback === "function") callback(this);
        }
    });

    function unveil() {
        var inview = images.filter(function () {
            var $e = $(this);
            if ($e.is(":hidden")) return;

            var wt = $w.scrollTop(),
                wb = wt + $w.height(),
                et = $e.offset().top,
                eb = et + $e.height();

            return eb >= wt - th && et <= wb + th;
        });

        loaded = inview.trigger("unveil");
        images = images.not(loaded);
    }

    $w.on("scroll.unveil resize.unveil lookup.unveil touchmove.unveil", unveil);

    unveil();

    return this;
};