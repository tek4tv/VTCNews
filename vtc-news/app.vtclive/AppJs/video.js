var VideoModel = function () {  
    var self = this;
    self.mode = ko.observableArray();
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
        //self.loadGetVideoHomes();
        self.sideBar();
       // self.loadGetImageThumbnail();
        self.loadVideos();
        self.mode('videos')
    }
    self.backVideo = function () {
        $.ajax({
            url: '/Home/Video',
            type: 'GET',
            contentType: 'application/html; charset=utf-8',
            dataType: 'html'
        }).done(function (data) {
            $("#body-content").html(data);
            
        });
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
    self.getImage = function (item, type) {
        $.each(self.convertToJson(item.Image()), function (idx, img) {
            if (img.Type == type) {
                url = img.Url;
            }
        });
        return "https://imageovp.tek4tv.vn/" + url;
    }
    
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
    
    self.selectedVideo = ko.observable();   
    self.loadSelectedVideo = function (item) {
        self.mode('video')       
        self.selectedVideo(item)
    }  
}
$(function () {
    ko.cleanNode(document.getElementById("body-content"));
    var videoModel = new VideoModel();
    videoModel.loadData();   
    ko.applyBindings(videoModel, document.getElementById("body-content"));
});

