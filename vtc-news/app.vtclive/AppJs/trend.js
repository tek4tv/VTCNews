var TrendModel = function () {
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
    self.backTrending = function () {
        $.ajax({
            url: '/Home/Trend',
            type: 'GET',
            contentType: 'application/html; charset=utf-8',
            dataType: 'html'
        }).done(function (data) {
            self.loadWindow ()
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
    self.trends = ko.observableArray();
    var isBusy = false;
    var page = 1;
    var stopped = false;
    self.loadWindow = function () {
        tab++;
        if (tab == 1) {
            self.mode("lazyloading");
        }     
        if (tab > 0) {
            $.ajax({
                url: "https://api.vtcnews.tek4tv.vn/api/home/news/trending/" + page,
                type: 'GET'
            }).done(function (data) {
                $.each(data, function (index, item) {
                    self.trends.push(self.convertToKoObject(item))
                })
                isBusy = false;
                self.mode("");
                $(function () {
                    $('.lazy').lazy();
                });
              
            });
            $(window).scroll(function () {
                $element = $('#body-content');
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
                    $loadding.removeClass('hidden');
                    $.ajax({
                        url: "https://api.vtcnews.tek4tv.vn/api/home/news/trending/" + page,
                        type: 'GET'
                    }).done(function (data) {                     
                        $.each(data, function (index, item) {
                            self.trends.push(self.convertToKoObject(item))
                        })
                        $loadding.addClass('hidden');
                        isBusy = false
                    });
                    if (page > 1) {
                        $('.icon-loadding').css("visibility","")
                    }
                }
                $(function () {
                    $('.lazy').lazy();
                });             
            });
        }
    }
    self.trendDetail = ko.observable();
    self.tags = ko.observableArray();
    self.categoryNameData = ko.observableArray();
    self.listArticleRelated = ko.observableArray();
    self.selectTrend = function (item) {    
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api//home/news/detail/" + item.Id(),
            type: 'GET'
        }).done(function (data) {
            self.scrollToTop();
            self.trendDetail(data.DetailData)
            self.tags.removeAll();
            self.categoryNameData.removeAll();
            self.listArticleRelated.removeAll();
            $.each(data.ListTag, function (index, item) {
                self.tags.push(self.convertToKoObject(item))
            })
            $.each(data.ListArticleRelated, function (index, item) {
                self.listArticleRelated.push(self.convertToKoObject(item))
            })
            $.each(self.trends(), function (index, item) {
                if (item.CategoryName() == data.DetailData.CategoryName) {
                    if (item.Title() != data.DetailData.Title) {

                        self.categoryNameData.push(self.convertToKoObject(item))
                    }
                }
            })
            
            self.mode("detail")
            $('.loadding').css("visibility", "");
            $(function () {
                $('.lazy').lazy();
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
                    html += ' <video id="my-video"';
                    html += '  class="video-js lazy"';
                    html += 'controls';
                    html += ' preload="auto"';
                    html += ' height="300" ';
                    html += '  poster="MY_VIDEO_POSTER.jpg"';
                    html += ' data-setup="{}" style="width:100%">';
                    html += '  <source src="https://media.vtc.vn' + data[0].URL + '" type="video/mp4" />';
                    html += '   <source src="MY_VIDEO.webm" type="video/webm" />';                               
                    html += '</video> ';                 
                    $(".video-element").html(html);     
                    
                })
            }

        });         
    }    

    self.comnents = ko.observableArray();
    self.getComment = function (item) {
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/home/news/comment/GetComment/" + item.Id()+"/"+1,
            type: 'GET'
        }).done(function (data) {
            self.comnents.removeAll();
            $.each(data.Items, function (index, item) {
                self.comnents.push(self.convertToKoObject(item))
            })
           
        })
    }
}
$(function () {
    ko.cleanNode(document.getElementById("body-content"));
    var trendModel = new TrendModel();
    trendModel.loadWindow();
    trendModel.sideBar();
    ko.applyBindings(trendModel, document.getElementById("body-content"));
});
