$(function() {

    var $document = $(document);

    $document.on('click', '.gallery', function() {

        var $that = $(this),
            gallery,
            gallery_id = $that.attr('data-gallery'),
            $gallery_items,
            options = {};


        function get_item_attributes($items) {

            var item_array = [];

            for ( var i = 0, l = $items.length; i < l; i++ ) {

                var item = $items[i],
                    dimensions = item.getAttribute('data-size').split('x');

                item_array.push({
                    src: item.href,
                    w: dimensions[0],
                    h: dimensions[1]
                });

            }

            return item_array;

        }


        if ( gallery_id && gallery_id !== '' ) {

            $gallery_items = $('[data-gallery="' + gallery_id + '"]');
            options.index = $gallery_items.index($that);

        } else {

            $gallery_items = $that;
            options.index = 0;

        }


        // Initializes and opens PhotoSwipe
        gallery = new PhotoSwipe($('.pswp')[0], PhotoSwipeUI_Default, get_item_attributes($gallery_items), options);

        gallery.init();

        return false;

    });

});