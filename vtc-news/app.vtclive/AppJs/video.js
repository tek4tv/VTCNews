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
    self.scrollToTop = function () {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
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

    self.loadSelectedVideo = function (item) {
        alert(item.Path())
    }
   
    self.getVideoByID = ko.observable();
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
    
    /*
    self.slugifyLink = function (str) {
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        var from = "áàảãạăẵẳằắặâẫẩầấậđéẽèẻèêễếềểệíìỉĩịóòõỏọôỗồổốộơỡởờớợúũùủụưữửừứựýỹỷỳỵ·/_,:;";
        var to = "aaaaaaaaaaaaaaaaadeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyy------";
        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    }
    self.gotoItem = function (item) {
        var url = window.location.origin + '/view/' + self.slugifyLink(item.Name()) + '/' + item.PrivateID() + '.html';
        if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)) {
            var android = location.href.match(/#android$/) || navigator.userAgent.match(/Android/i) != null;
            if (android) {
                MainActivity.goToDetail(item.Path(), url, 'https://appnow.tek4tv.vn/back.html', 50, false);
            } else {
                webkit.messageHandlers.goToDetail.postMessage(
                    {
                        url: item.Path(),
                        urldetail: url,
                        urlWvHeader: 'https://appnow.tek4tv.vn/back.html',
                        height: 30,
                        isLive: false,
                        type: 0,
                        titleCast: item.Name(),
                        descriptionCast: item.Description(),
                        urlImage: self.getImage(item, 'Thumbnail')
                    });
            }
        };
    }
   
    */
}
$(function () {
    ko.cleanNode(document.getElementById("body-content"));
    var videoModel = new VideoModel();
    videoModel.loadData();   
    ko.applyBindings(videoModel, document.getElementById("body-content"));
});

