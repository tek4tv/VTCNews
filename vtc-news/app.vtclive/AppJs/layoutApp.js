var LayoutModel = function () {
    var self = this;
    
    self.homeApp = function () {
        $.ajax({
            url: '/Home/HomeApp',
            type: 'GET',
            contentType: 'application/html; charset=utf-8',
            dataType:'html'
        }).done(function (data) {
            $("#body-content").html(data);          
        });
    }
    
    self.videoApp = function () {
        $.ajax({
            url: '/Home/Video',
            type: 'GET',
            contentType: 'application/html; charset=utf-8',
            dataType: 'html'
        }).done(function (data) {
            $("#body-content").html(data);
        });
    }
    self.audioApp = function () {
        $.ajax({
            url: '/Home/Audio',
            type: 'GET',
            contentType: 'application/html; charset=utf-8',
            dataType: 'html'
        }).done(function (data) {
            $("#body-content").html(data);
        });
    }

    self.audioMusic = function () {
        console.log("ok");
        $.ajax({
            url: '/Home/AudioMusic',
            type: 'GET',
            contentType: 'application/html; charset=utf-8',
            dataType: 'html'
        }).done(function (data) {
            console.log(data);
            $("#body-content").html(data);
        });
    }
    var i =1;  
    self.clickPlay = function () {        
        // Change src attribute of image          
       
        if ($("#play-pause").val() % 2 == 0) {
            $("#play-pause").attr("src", "/fonts/icon/play.png");
            i++;
            $("#play-pause").val(i);
            $("#audio-play").get(0).pause();
            console.log($("#play-pause").val())
        } else {
            $("#play-pause").attr("src", "/fonts/icon/pause.png");
            i++;
            $("#play-pause").val(i);
            $("#audio-play").get(0).load();          
            console.log($("#play-pause").val())
        }
    }
    self.closeAudio = function () {
        $("#audio-play").get(0).pause();
        $("#close-audio").css('visibility', 'hidden');
    }

    

}
$(function () {
    ko.cleanNode(document.getElementById("body-content"));
    var layoutModel = new LayoutModel();
    ko.applyBindings(layoutModel);
});