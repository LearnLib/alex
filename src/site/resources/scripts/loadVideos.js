(function($, d){

    if (!$) {
        throw new Error("jQuery missing");
    }

    $(d).ready(createVideos);

    function createVideos(){
        var src, video, source;
        var elements = $('.video');

        elements.each(function(i, el){
            el = $(el);
            src = el.data('src');

            video = $('<video></video>')
                .attr('width', '100%')
                .attr('controls', '');

            source = $('<source>')
                .attr('src', src)
                .attr('type', 'video/mp4');

            video.append(source);
            el.after(video);
            el.remove();
        })
    }
}(jQuery, document || window.document));