var HomeAppModel = function () {
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
    self.lodaData = function () {
        
        self.loadMenu();
        self.loadGetarticleHot();
        self.loadFirstGetarticleHots();
        self.loadGetChannelHots();
        self.loadGetArticleSuggestionHome();
        self.loadGetVideoHome();
        self.loadGetVideoHome4();
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
    self.homeMenus = ko.observableArray();
    self.loadMenu = function () {
        $.ajax({
            url: "/api/home/news/menu",
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

    self.getarticleHots = ko.observableArray();
    self.firstGetarticleHots = ko.observableArray();
    self.loadFirstGetarticleHots = function () {
        $.ajax({
            url: "/api/home/news/getarticlehot",
            type: 'GET'
        }).done(function (data) {
            self.firstGetarticleHots.removeAll();           
            self.firstGetarticleHots.push(self.convertToKoObject(data[0]))
           
        });
    }
    self.loadGetarticleHot = function () {
        $.ajax({
            url: "/api/home/news/getarticlehot",
            type: 'GET'
        }).done(function (data) {
            self.getarticleHots.removeAll();
            data.shift();
            $.each(data, function (index, item) {                
                self.getarticleHots.push(self.convertToKoObject(item))               
            })
           
        });
    } 

    self.getChannelHots = ko.observableArray();
    self.loadGetChannelHots = function () {
        $.ajax({
            url: "/api/home/news/getchannelhot",
            type: 'GET'
        }).done(function (data) {
            self.getChannelHots.removeAll();
            
            $.each(data, function (index, item) {
                self.getChannelHots.push(self.convertToKoObject(item))
            })
           
        });
    }

    self.GetArticleSuggestionHome = ko.observableArray();
    self.loadGetArticleSuggestionHome = function () {
        $.ajax({
            url: "/api/home/news/GetArticleSuggestionHome",
            type: 'GET'
        }).done(function (data) {
            self.GetArticleSuggestionHome.removeAll();

            $.each(data, function (index, item) {
                self.GetArticleSuggestionHome.push(self.convertToKoObject(item))
            })           
        });
    }

    self.GetVideoHome = ko.observableArray();
    self.loadGetVideoHome = function () {
        $.ajax({
            url: "api/home/news/GetVideoHome",
            type: 'GET'
        }).done(function (data) {
            console.log(data.length-1)
            self.GetVideoHome.removeAll();
            self.GetVideoHome.push(self.convertToKoObject(data[0]))
        });
    }

    self.GetVideoHome4 = ko.observableArray();
    self.loadGetVideoHome4 = function () {
        $.ajax({
            url: "api/home/news/GetVideoHome",
            type: 'GET'
        }).done(function (data) {
            self.GetVideoHome4.removeAll();
            for (var i = 0; i < 4 ; i++) {
                self.GetVideoHome4.push(self.convertToKoObject(data[i]))
            }
            
        });
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
    homeAppModel.lodaData();  
    ko.applyBindings(homeAppModel, document.getElementById("body-content"));
});
