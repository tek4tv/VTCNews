var VideoModel = function () {  
    var self = this;
    self.mode = ko.observable("");
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
        self.sideBar();      
        self.loadVideos();
       
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
    self.videoHomes = ko.observableArray();   
    self.getImage = function (item, type) {
        $.each(self.convertToJson(item.Image()), function (idx, img) {
            if (img.Type == type) {
                url = img.Url;
            }
        });
        return "https://imageovp.tek4tv.vn/" + url;
    }
    
    self.loadVideos = function () {
        self.mode("lazyloading")
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/playlist/all",
            type: 'GET'
        }).done(function (data) {
            self.videoHomes.removeAll();              
           $.each(data.Media, function (index, item) {                
              self.videoHomes.push(self.convertToKoObject(item));                             
           })
            self.mode("")          
        });
    }    
   
  
}
$(function () {
    ko.cleanNode(document.getElementById("body-content"));
    var videoModel = new VideoModel();
    videoModel.loadData();   
    ko.applyBindings(videoModel, document.getElementById("body-content"));
});

