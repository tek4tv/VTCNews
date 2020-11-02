var LayoutModel = function () {
    var self = this;
    self.mode = ko.observable("");
    var scrollClick = 0;
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
    self.backHomeMenu = function () {
        self.mode("HomeApp");
        console.log(scrollClick)
        //document.body.scrollTop = scrollClick;
        document.documentElement.scrollTop = scrollClick;
    }
    self.loadData = function () {
        self.scrollToTop()
        self.sideBar();
        self.loadMenu();
        self.loadGetarticleHot();
        self.loadGetChannelHots();
        self.loadGetArticleSuggestionHome();
        self.loadVideos();
        
        
    };
    var pointHome = 0;
    self.homeApp = function () {
        if (pointHome == 0) {
            self.mode("lazyloading");  
        }         
        self.mode("HomeApp");
        pointHome++
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
            $.each(data, function (index, item) {
                if (item.ParentId == null) {
                    self.homeMenus.push(self.convertToKoObject(item))
                }
            })          
        });
    }
    self.firstGetarticleHots = ko.observableArray();
    self.articleHots = ko.observableArray();
    self.loadGetarticleHot = function () {
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/home/news/getarticlehot",
            type: 'GET'
        }).done(function (data) {
            self.firstGetarticleHots.push(self.convertToKoObject(data[0]))         
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

        });

        var swiper = new Swiper('.swiper-container', {
            slidesPerView: 2,
            spaceBetween: 10,
            freeMode: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });

    }
    self.articleSuggestionHome = ko.observableArray();
    self.loadGetArticleSuggestionHome = function () {
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/home/news/GetArticleSuggestionHome",
            type: 'GET'
        }).done(function (data) {            
            for (var i = 0; i < data.length; i++) {
                self.articleSuggestionHome.push(self.convertToKoObject(data[i]))
            }
        });
    }
    self.videoHome = ko.observableArray();
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
    self.tags = ko.observableArray();
    self.categoryNameData = ko.observableArray();
    self.detailData = ko.observableArray();
    self.clickDetailNew = function (item) {        
        scrollClick = document.documentElement.scrollTop;
        console.log(scrollClick)
        self.mode("lazyloading");
        $.ajax({
            url: 'https://api.vtcnews.tek4tv.vn/api/home/news/detail/' + item.Id(),
            type: 'GET',
            contentType: 'application/html; charset=utf-8',
            dataType: 'html'
        }).done(function (data) {
            self.scrollToTop();
            self.tags.removeAll();
            self.categoryNameData.removeAll();
            self.detailData(self.convertToJson(data).DetailData);
            $.each(self.convertToJson(data).ListTag, function (index, item) {
                self.tags.push(self.convertToKoObject(item))
            })
            $.each(self.articleSuggestionHome(), function (index, item) {
                if (item.CategoryName() == self.convertToJson(data).DetailData.CategoryName) {
                    if (item.Title() != self.convertToJson(data).DetailData.Title) {
                        self.categoryNameData.push(self.convertToKoObject(item))
                    }
                }
            })
            $.each(self.articleHots(), function (index, item) {
               
                if (item.CategoryName() == self.convertToJson(data).DetailData.CategoryName) {
                    if (item.Title() != self.convertToJson(data).DetailData.Title) {
                        self.categoryNameData.push(self.convertToKoObject(item))
                    }
                }
            })

            self.mode("newDetail");
            $(".lazy").each(function () {
                $(this).attr("src", $(this).attr("data-src"));
                $(this).removeAttr("data-src");
                $(this).addClass('img-fluid');
            });
            var dataId = $(".video-element").data("id");
            var text = '<div id="loadding" class="hidden d-flex justify-content-center" style="margin-bottom:60px; align-items:center">';
            text + '=  < i class="demo-icon icon-spin5 animate-spin" ></i >';
            text += '</div >';
            $(".video-element").html(text);
            if (dataId.length > 0) {
                var html = '';
                $.ajax({
                    url: "https://api.vtcnews.tek4tv.vn/api/home/video/GetVideoById?text=" + dataId,
                    type: 'GET'
                }).done(function (data) {
                    html += '<script src="https://vjs.zencdn.net/ie8/1.1.2/videojs-ie8.min.js"></script>';
                    html += '<script src="https://vjs.zencdn.net/7.8.4/video.js"></script>'
                    html += '<video id="my-video"';
                    html += 'class="video-js lazy"';
                    html += 'controls';
                    html += ' preload="auto"';
                    html += ' height="300" ';
                    html += 'poster="MY_VIDEO_POSTER.jpg"';
                    html += ' data-setup="{}" style="width:100%">';
                    html += '  <source src="https://media.vtc.vn' + data[0].URL + '" type="video/mp4" />';
                    html += '   <source src="MY_VIDEO.webm" type="video/webm" />';
                    html += '</video> ';
                    $(".video-element").html(html);

                })
            }
        });
    }
    console.log(scrollClick)










   




    var pointTrend = 0;
    self.trend = function () {
        if (pointTrend == 0) {
            self.mode("lazyloading");
        } 
        pointTrend++;
        self.mode("Trend")
        self.loadTrend();
        
    }
    self.trends = ko.observableArray();
    var isBusy = false;
    var page = 1;
    var stopped = false;
   
    self.loadTrend = function () {   
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/home/news/trending/" + page,
            type: 'GET'
        }).done(function (data) {
            $.each(data, function (index, item) {
                self.trends.push(self.convertToKoObject(item))
            })
            isBusy = false;
            console.log(self.trends())
            $(function () {
                $('.lazy').lazy();
                $('.lazy').addClass("img-fluid");
            });
        });
        $(window).scroll(function () {
            $element = $('#main');
            $loadding = $('#loadding');
            if ($(window).scrollTop() + $(window).height() >= $element.height()) {
                if (isBusy == true) {
                    return false;
                }
                if (stopped == true) {
                    return false;
                }
                isBusy = true;
                page++;

                $.ajax({
                    url: "https://api.vtcnews.tek4tv.vn/api/home/news/trending/" + page,
                    type: 'GET'
                }).done(function (data) {
                    $.each(data, function (index, item) {
                        self.trends.push(self.convertToKoObject(item))
                    })

                    isBusy = false
                });
            }
            $(function () {
                $('.lazy').lazy();
                $('figure img').addClass("img-fluid");
            });

        });
            
    }
       


    self.videoApp = function () {

    }
    self.audioApp = function () {

    }
    self.audioMusic = function () {

    }
    self.live = function () {

    }
}
   
$(function () {
    var layoutModel = new LayoutModel(); 
    var index = 0;
    if (index == 0) {
        layoutModel.homeApp();
        layoutModel.loadData();
        index++
    }

    ko.applyBindings(layoutModel);
}
);