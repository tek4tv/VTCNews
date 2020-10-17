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
       
}
$(function () {
    ko.cleanNode(document.getElementById("body-content"));
    var layoutModel = new LayoutModel();
    ko.applyBindings(layoutModel);
});