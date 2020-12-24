var MenuModel = function () {
    var self = this;
    self.mode = ko.observable();
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
    var Id = $('#swiper-input').val();
    self.menuData = ko.observableArray();
    self.selectHomeMenuDetail = ko.observableArray();
    self.loadData = function () {
        self.mode("");  
        var i = 0;
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/home/news/menu",
            type: 'GET'
        }).done(function (data) {
            $.each(data, function (index, item) {
                if (item.ParentId == Id) {
                    item.Array = [];
                    item.Index = i++;
                    self.selectHomeMenuDetail.push(self.convertToKoObject(item));
                    self.menuData.push(self.convertToKoObject(item));
                }
            })                            
            self.initSwiperTab();
            $('.clicked-menu').click(function () {
                $('.clicked').removeClass('clicked');
                $(this).addClass('clicked');
            });
            $(`#news_0`).click();                         
        });       
    }
    self.initSwiperTab = function () {
        var n = 0;
        var setting = {
            autoHeight: true,
            direction: 'horizontal',         
            on: {
                slideChange: function () {
                    n = this.activeIndex;                                 
                    $(`#news_${n}`).click();
                    
                    $(`#news_${n}`)[0].scrollIntoView(false)
                   
                }
            }
        }
        swiper3 = new Swiper('.swiper3', setting);
    }   
    self.loadValueMenu = function (item) { 
        var index = item.Index();
        swiper3.slideTo(index, 500, false);    
        if (self.menuData()[index].Array().length == 0) {
            $.ajax({
                url: "https://api.vtcnews.tek4tv.vn/api/home/news/ArticleCategoryPaging/" + 1 + "/" + item.Id(),
                type: 'GET'
            }).done(function (data) {
                self.menuData()[index].Array.removeAll();
                $.each(data, function (i, item) {
                    self.menuData()[index].Array.push(self.convertToKoObject(item))
                });
                var obj = {
                    null :"Không có dữ liệu"
                }
                if (self.menuData()[index].Array().length == 0) {
                    self.menuData()[index].Array.push(self.convertToKoObject(obj))
                }
                console.log(self.menuData()[index].Array())
                self.lazy();
            });
        }
    }
    self.tags = ko.observableArray();
    self.categoryNameData = ko.observableArray();
    self.detailData = ko.observableArray();
    self.ListArticleRelated = ko.observableArray();
    self.articleSuggestionHome = ko.observableArray();
    self.articleHots = ko.observableArray();
    self.comnnetItems = ko.observableArray();
    self.comment = ko.observable();
    self.clickDetailNew2 = function (item) {
        self.scrollToTop();
        var urlWeb = "https://vtc.vn/" + item.SEOSlug() + "-ar" + item.Id() + ".html";
        $.ajax({
            url: 'https://api.vtcnews.tek4tv.vn/api/home/news/detail/' + item.Id(),
            type: 'GET',
            contentType: 'application/html; charset=utf-8',
            dataType: 'html',
            success: function (data) {            
                self.tags.removeAll();
                self.categoryNameData.removeAll();
                self.detailData.removeAll();
                self.ListArticleRelated.removeAll();            
                $.each(self.convertToJson(data).ListArticleRelated, function (index, item) {
                    self.ListArticleRelated.push(self.convertToKoObject(item))
                })
                self.detailData.push(self.convertToJson(data).DetailData);
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
                });
                self.mode("newDetailMenu");
                
                $('#_idArticle').val(item.Id())
                // load commnet
                $.ajax({
                    url: 'https://api.vtcnews.tek4tv.vn/api/home/news/comment/GetComment/' + item.Id() + '/1',
                    type: 'GET',
                    contentType: 'application/html; charset=utf-8',
                    dataType: 'html'
                }).done(function (data) {
                    self.comnnetItems.removeAll()
                    self.comment(JSON.parse(data))
                    $.each(JSON.parse(data).Items, function (index, item) {
                        self.comnnetItems.push(self.convertToKoObject(item))
                    })
                  
                })
                var urlContent = $(".detail-content p a").attr('href');
                $(".detail-content p a").attr("href", "#");
                $(".detail-content p a").click(function () {

                    MainActivity.openUrl(urlContent);
                })
                $(".share").click(function () {
                    MainActivity.shareApp(urlWeb);
                    window.webkit.messageHandlers.jsMessageHandler.postMessage(urlWeb);
                })
                var linkYoutube = "https://www.youtube.com/user/BAODIENTUVTCNEWS?sub_confirmation=1";
                $(".subYoutube").click(function () {
                    MainActivity.openUrl(linkYoutube);
                    window.webkit.messageHandlers.jsMessageHandler.postMessage(linkYoutube);
                })
                var srcLink = $('.inlink-remake').attr('href');
                $(".inlink-remake").attr("href", "#");
                $(".inlink-remake").click(function () {
                    var url = "https://vtc.vn/" + srcLink
                    MainActivity.openUrl(url);
                    window.webkit.messageHandlers.openURL.postMessage(url);
                })
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
                if (dataId) {
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
                }
            },
            error: function () {
                self.loadByVideoMenuByID(item)
            }
            
        })
    }
    self.loadByVideoMenuByID = function (item) {
        console.log(item)
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn//api/home/news/GetVideoDetail/" + item.Id(),
            type: 'GET'
        }).done(function (data) {
            console.log(item.Title())
            var path = "https://media.vtc.vn" + data[0].VideoURL
            var url = window.location.origin + "/VideoMenu/Index/" + item.Id();
            console.log(path);
            console.log(url)
            if (navigator.userAgent.match(/Android/i)
                || navigator.userAgent.match(/iPhone/i)
                || navigator.userAgent.match(/iPad/i)
                || navigator.userAgent.match(/iPod/i)) {
                var android = location.href.match(/#android$/) || navigator.userAgent.match(/Android/i) != null;
                if (android) {
                    MainActivity.goToDetail(path, url, 'https://vtcnews.tek4tv.vn/Header/Index', 50, false);
                } else {
                    webkit.messageHandlers.goToDetail.postMessage(
                        {
                            url: path,
                            urldetail: url,
                            urlWvHeader: 'https://vtcnews.tek4tv.vn/Header/Index',
                            height: 50,
                            isLive: false,
                            type: 0,
                            titleCast: item.Title(),
                            urlImage: item.image16_9()
                        });
                }
            };
        });

    }
    self.lazy = function () {
        let imgs = $(".lazy-img1");
        for (let a = 0; a < imgs.length; a++) {
            var elm = imgs[a]
            loadImage(elm);
        }
        function loadImage(elm) {
            let url = $(elm).attr("ref-src");         
            let newImg = new Image();
            newImg.onload = function () {
                $(elm).attr("src", url);
            }
            newImg.src = url;
        }
    }
    self.backSelectedMenu = function () {
        self.mode("");
    }
}

$(function () {
    ko.cleanNode($("#swiper-binding")[0]);
    var menuModel = new MenuModel();
    menuModel.loadData();
    ko.applyBindings(menuModel, $("#swiper-binding")[0]);
});