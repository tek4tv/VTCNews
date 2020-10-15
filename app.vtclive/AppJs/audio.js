var AudioModel = function () {
    var self = this;
    self.convertToKoObject = function (data) {
        var newObj = ko.mapping.fromJS(data);
        return newObj;
    }
    self.convertToJson = function (item) {
        if (item == null || item == "") {
            return [];
        } else {
            return JSON.parse(item);
        }
    };
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
    
    self.audioMusic = function () {
        $.ajax({
            url: '/Home/AudioMusic',
            type: 'GET',
            contentType: 'application/html; charset=utf-8',
            dataType: 'html'
        }).done(function (data) {
            $("#body-content").html(data);
            self.scrollToTop();
        });
    }
    self.audioPodcast = function () {
        $.ajax({
            url: '/Home/AudioPodcast',
            type: 'GET',
            contentType: 'application/html; charset=utf-8',
            dataType: 'html'
        }).done(function (data) {
            $("#body-content").html(data);
            self.scrollToTop();

        });
    }
    self.audioBook = function () {
        $.ajax({
            url: '/Home/AudioBook',
            type: 'GET',
            contentType: 'application/html; charset=utf-8',
            dataType: 'html'
        }).done(function (data) {
            $("#body-content").html(data);
            self.scrollToTop();
        });
    }
    self.audioDetail = function () {
        $.ajax({
            url: '/Home/AudioDetail',
            type: 'GET',
            contentType: 'application/html; charset=utf-8',
            dataType: 'html'
        }).done(function (data) {
            $("#body-content").html(data);
            self.scrollToTop();
        });
    }

    self.podcasts = ko.observableArray().reverse();
    self.podcast = ko.observableArray();
    self.lengthPodcast = ko.observable();
    self.imagePoster = ko.observable();
    self.loadAudioPodcast = function () {
        $.ajax({
            url: "/api/audio/episode",
            type: 'GET'
        }).done(function (data) {
            var item = [];
            item.push(data[0]) 
            var url = "https://vodovp.tek4tv.vn/" + self.convertToJson(data[0].Image)[0].Url;
           
            self.imagePoster(self.convertToKoObject(url))
            self.podcast.removeAll();   
            $.each(item, function (index, item) {
                self.podcast.push(self.convertToKoObject(item))                
            })
            self.lengthPodcast(data.length);
        });           
    }

    self.loadAudioPodcasts = function () {
        $.ajax({
            url: "/api/audio/episode",
            type: 'GET'
        }).done(function (data) {                    
            self.podcasts.removeAll();
            var imgs = []
            $.each(data.reverse(), function (index, item) {
                imgs.push(self.convertToJson(item.Image))
                self.podcasts.push(self.convertToKoObject(item))
            })
            $.each(imgs, function (index, item) {
                $.each(item, function (index, img) {
                    console.log(img);
                })
            })         
            
        }); 
    }
    

    /*self.isImageStorage = function (item) {
        if (item.ThumbNail() === null || item.ThumbNail().length === 0) {
            return '/BackEnd/assets/global/img/no_thumb.jpg';
        }
        var ext = item.ThumbNail().split('.').pop().toLowerCase();
        var fileExtension = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];
        if ($.inArray(ext, fileExtension, 0) === -1) {
            return '/BackEnd/assets/global/img/no_thumb.jpg';
        } else {
            var listRemote = item.RemoteStorage().split('#');
            var url = "https://vodovp.tek4tv.vn/";
            return url + "/" + item.ThumbNail();
        }
    };*/

}
$(function () {
    ko.cleanNode(document.getElementById("body-content"));
    var audioModel = new AudioModel();
    audioModel.loadAudioPodcast();
    audioModel.loadAudioPodcasts();
    ko.applyBindings(audioModel, document.getElementById("body-content"));
});
