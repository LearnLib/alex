(function($, d){

    if (!$) {
        throw new Error("jQuery missing");
    }

    $(d).ready(createVideos);

    function createVideos(){
        var name, video, source;
        var path = '/videos/';
        var elements = $('.video');

        elements.each(function(i, el){
            el = $(el);
            name = el.data('name');

            video = $('<video></video>')
                .attr('width', '100%')
                .attr('controls', '');

            source = $('<source>')
                .attr('src', path + name + '.mp4')
                .attr('type', 'video/mp4');

            video.append(source);
            el.after(video);
            el.remove();
        })
    }
}(jQuery, document || window.document));