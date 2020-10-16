var VideoModel = function () {
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
    self.loadData = function () {
        self.loadGetVideoHomes();
        self.sideBar();
    }
    self.sideBar = function () {
        $.ajax({
            url: '/Home/SideBar',
            type: 'GET',
            contentType: 'application/html; charset=utf-8',
            dataType: 'html'
        }).done(function (data) {
            $("#input-sidebar").html(data);
        });
    }
    self.GetVideoHomes = ko.observableArray();
    self.loadGetVideoHomes = function () {
        $.ajax({
            url: "api/home/news/GetVideoHome",
            type: 'GET'
        }).done(function (data) {
            self.GetVideoHomes.removeAll();
            $.each(data, function (index, item) {
                self.GetVideoHomes.push(self.convertToKoObject(item))
            })
        });
    }
    self.selectedVideo = ko.observable();
    self.selectedVideo = function (item) {
        console.log(item)
        self.selectedVideo(item)
        console.log(self.selectedVideo())
    }
   

}
$(function () {
    ko.cleanNode(document.getElementById("body-content"));
    var videoModel = new VideoModel();
    videoModel.loadData();
    ko.applyBindings(videoModel, document.getElementById("body-content"));
});
