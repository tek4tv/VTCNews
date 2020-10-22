var HomeAppModel = function () {
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
        self.loadMenu();
        self.loadGetarticleHot();
        self.loadFirstGetarticleHots();
        self.loadGetChannelHots();
        self.loadGetArticleSuggestionHome();
        self.loadVideos()
        self.sideBar();
    }
    self.backHomeMenu = function () {
        $.ajax({
            url: '/Home/HomeApp',
            type: 'GET',
            contentType: 'application/html; charset=utf-8',
            dataType: 'html'
        }).done(function (data) {
            $("#body-content").html(data);
            self.scrollToTop();
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
    self.homeMenus = ko.observableArray();
    self.loadMenu = function () {
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/home/news/menu",
            type: 'GET'
        }).done(function (data) {
            self.homeMenus.removeAll();           
            $.each(data, function (index, item) {
                if (item.parentId == null) {                   
                    self.homeMenus.push(self.convertToKoObject(item))
                }
            })          
        });
    }
    self.selectHomeMenuDetail = ko.observableArray();
    self.selectHomeMenu = function (item) {
        console.log(item.id())
        var id = item.id();
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/home/news/menu",
            type: 'GET'
        }).done(function (data) {
            self.selectHomeMenuDetail.removeAll();
            $.each(data, function (index, item) {
                if (item.parentId == id) {
                    self.selectHomeMenuDetail.push(self.convertToKoObject(item))
                }
            })
            self.mode("selectedMenu")
        });
    }

    self.articleHots = ko.observableArray();
    self.firstGetarticleHots = ko.observableArray();
    self.loadFirstGetarticleHots = function () {
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/home/news/getarticlehot",
            type: 'GET'
        }).done(function (data) {
            self.firstGetarticleHots.removeAll();           
            self.firstGetarticleHots.push(self.convertToKoObject(data[0]))           
            $(".div-hidden-loading").css('visibility', '');
        });
    }
    self.loadGetarticleHot = function () {
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/home/news/getarticlehot",
            type: 'GET'
        }).done(function (data) {
            self.articleHots.removeAll();
            data.shift();
            $.each(data, function (index, item) {                
                self.articleHots.push(self.convertToKoObject(item))               
            })           
        });
    } 

    self.channelHots = ko.observableArray();
    self.loadGetChannelHots = function () {
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/home/news/getchannelhot",
            type: 'GET'
        }).done(function (data) {
            self.channelHots.removeAll();               
            $.each(data, function (index, item) {
                self.channelHots.push(self.convertToKoObject(item))
            })
            var swiper = new Swiper('.swiper-container', {
                slidesPerView: 2,
                spaceBetween: 10,
                freeMode: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
            });
           
        });
    }

    self.articleSuggestionHome1 = ko.observableArray();
    self.articleSuggestionHome2 = ko.observableArray();
    self.articleSuggestionHome3 = ko.observableArray();
    self.loadGetArticleSuggestionHome = function () {
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/home/news/GetArticleSuggestionHome",
            type: 'GET'
        }).done(function (data) {          
            self.articleSuggestionHome1.removeAll();
            for (var i = 0; i < data.length; i++) {
                if (data[i].listUrlImages == "") {
                    for (var i = 0; i < 5; i++) {
                        self.articleSuggestionHome1.push(self.convertToKoObject(data[i]))
                    }
                    self.articleSuggestionHome2.removeAll();
                    for (var i = 5; i < 10; i++) {
                        self.articleSuggestionHome2.push(self.convertToKoObject(data[i]))
                    }
                    self.articleSuggestionHome3.removeAll();
                    for (var i = 10; i < data.length; i++) {
                        self.articleSuggestionHome3.push(self.convertToKoObject(data[i]))
                    }
                }
            }    
        });
    }

    self.videoHomes = ko.observableArray();
    self.videoHome = ko.observableArray();
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
            self.videoHomes.removeAll();
            for (var i = 1; i < 5; i++) {
                self.videoHomes.push(self.convertToKoObject(data.Media[i]));
            }  
            self.videoHome.removeAll();
            for (var i = 0; i < 1; i++) {
                self.videoHome.push(self.convertToKoObject(data.Media[i]));
            }  
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


    self.videoApp = function () {
        $.ajax({
            url: '/Home/Video',
            type: 'GET',
            contentType: 'application/html; charset=utf-8',
            dataType: 'html'
        }).done(function (data) {
            $("#body-content").html(data);
            $('.selected').removeClass('selected');
            $(".button-video").addClass('selected');          
        });
    }
}
$(function () {
    ko.cleanNode(document.getElementById("body-content"));
    var homeAppModel = new HomeAppModel();
    homeAppModel.loadData();  
    ko.applyBindings(homeAppModel, document.getElementById("body-content"));
});
