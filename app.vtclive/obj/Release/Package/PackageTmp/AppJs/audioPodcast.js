﻿var AudioPodcastModel = function () {
    var self = this;
    self.scrollToTop = function () {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
    self.backAudio = function () {
        $.ajax({
            url: '/Home/Audio',
            type: 'GET',
            contentType: 'application/html; charset=utf-8',
            dataType: 'html'
        }).done(function (data) {
            $("#body-content").html(data);
            self.scrollToTop();
        });
    }

  
}
$(function () {
    ko.cleanNode(document.getElementById("body-content"));
    var audioPodcastModel = new AudioPodcastModel();
    
    ko.applyBindings(audioPodcastModel, document.getElementById("body-content"));
});