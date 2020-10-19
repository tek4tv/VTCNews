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
        self.loadVideos();
        self.loadByVideoByID();
       
    }
    self.getImage = function (item, type) {
        $.each(self.convertToJson(item.Image()), function (idx, img) {
            if (img.Type == type) {
                url = img.Url;
            }
        });
        return "https://imageovp.tek4tv.vn/" + url;
    }
    self.GetVideoHomes = ko.observableArray(); 
    self.loadVideos = function () {       
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/playlist/all",
            type: 'GET'
        }).done(function (data) {
            self.GetVideoHomes.removeAll();
            $.each(data.Media, function (index, item) {
                self.GetVideoHomes.push(self.convertToKoObject(item));
            })
        });
    }
    self.getVideoByID = ko.observable();
    self.loadByVideoByID = function () {
        var url = document.location.href;
        var idUrl = url.substring(url.lastIndexOf('/') + 1);
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/playlist/PrivateID/" + idUrl,
            type: 'GET'
        }).done(function (data) {           
            self.getVideoByID(data);
        });
    }
    self.clickNextVideoSelected = function (item) {
        $.each(self.GetVideoHomes(), function (index, item2) {
            if (item2.PrivateID() == item.PrivateID()) {
                self.getVideoByID(item);
            }
        })
        alert('{"url":"' + item.Path() + '","urlwv":"","isLive":false}');
    }     
}
$(function () {  
    var videoDetailModel = new VideoDetailModel();
    videoDetailModel.loadData();
    ko.applyBindings(videoDetailModel);
});