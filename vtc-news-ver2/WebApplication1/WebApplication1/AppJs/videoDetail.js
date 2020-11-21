var VideoDetailModel = function () {
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
    self.loadData = function () {
        self.loadByVideoByID();
        self.loadVideos();
    }
    self.GetVideoHomes = ko.observableArray();
    self.loadVideos = function () {
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/home/news/GetVideoHome",
            type: 'GET'
        }).done(function (data) {
            console.log(data)
            self.GetVideoHomes.removeAll();
            $.each(data, function (index, item) {
                self.GetVideoHomes.push(self.convertToKoObject(item));
            })
        });
    }
    self.getVideoByID = ko.observableArray();
    self.loadByVideoByID = function () {
        var url = document.location.href;
        var idUrl = url.substring(url.lastIndexOf('/') + 1);
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/home/news/GetVideoHome/" + idUrl ,
            type: 'GET'
        }).done(function (data) {
            self.getVideoByID(data);         
            $(".hidden-div").css('visibility', '');
        });
    }  
    self.clickNextVideoSelected = function (item) {
        $.each(self.GetVideoHomes(), function (index, item2) {
            if (item2.Id() == item.Id()) {
                self.getVideoByID(item);
                console.log(self.getVideoByID())
            }
        })
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn//api/home/news/GetVideoDetail/" + item.Id(),
            type: 'GET'
        }).done(function (data) {
            var path = "https://media.vtc.vn" + data[0].VideoURL;
            console.log(path)
            alert('{"url":"' + path + '","urlwv":"","isLive":false}');
            $(".hidden-div").css('visibility', '');
        })
        
    }    
}
$(function () {
    var videoDetailModel = new VideoDetailModel();
    videoDetailModel.loadData();
    ko.applyBindings(videoDetailModel);
});