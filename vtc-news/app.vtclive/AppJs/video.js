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
    self.loadByVideoByID = function (item) {       
        var url = window.location.origin + "/VideoDetail/Index/" + item.PrivateID();     
        if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)) {
            var android = location.href.match(/#android$/) || navigator.userAgent.match(/Android/i) != null;
            if (android) {
                MainActivity.goToDetail(item.Path(), url, 'https://vtcnews.tek4tv.vn/Header/Index', 50, false);
            } else {
                webkit.messageHandlers.goToDetail.postMessage(
                    {
                        url: item.Path(),
                        urldetail: url,
                        urlWvHeader: 'https://vtcnews.tek4tv.vn/Header/Index',
                        height: 50,
                        isLive: false,
                        type: 0,
                        titleCast: item.Name(),
                        descriptionCast: item.Description(),
                        urlImage: self.getImage(item, 'Thumbnail')
                    });
            }
        };
    }
  
}
$(function () {
    ko.cleanNode(document.getElementById("body-content"));
    var videoModel = new VideoModel();
    videoModel.loadData();   
    ko.applyBindings(videoModel, document.getElementById("body-content"));
});

