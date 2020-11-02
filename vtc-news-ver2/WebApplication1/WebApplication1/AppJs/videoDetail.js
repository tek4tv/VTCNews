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
    }
    
    self.GetVideoHomes = ko.observableArray();
    self.loadVideos = function () {
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/home/news/GetVideoHome",
            type: 'GET'
        }).done(function (data) {
            self.GetVideoHomes.removeAll();
            $.each(data, function (index, item) {
                self.GetVideoHomes.push(self.convertToKoObject(item));
            })
            console.log(self.GetVideoHomes())
        });

    }

    self.clickNextVideoSelected = function (item) {
        $.each(self.GetVideoHomes(), function (index, item2) {
            if (item2.PrivateID() == item.PrivateID()) {
                self.getVideoByID(item);
            }
        })
        alert('{"url":"' + item.Path() + '","urlwv":"","isLive":false}');
        $(".hidden-div").css('visibility', '');
    }
}
$(function () {
    var videoDetailModel = new VideoDetailModel();
    videoDetailModel.loadData();
    ko.applyBindings(videoDetailModel);
});