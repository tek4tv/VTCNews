var LayoutModel = function () {
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
   
    self.scrollToTop = function () {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
    self.backHomeMenu = function () {
        self.showMode("HomeApp");
        $('#clicked-menu').addClass('clicked');
    }
    self.loadData = function () {
        self.scrollToTop()      
        self.loadMenu();  
        self.loadGetarticleHot();
        self.loadGetChannelHots();
        self.loadGetArticleSuggestionHome();
        self.loadVideos();      
        self.loadMusic();
        self.GetAllPodcast();
    };  
  
    //home 
    self.imgMusic = ko.observableArray();
    self.imgAudioBook = ko.observableArray();
    self.imgAudioBook2 = ko.observableArray();
    self.loadMusic = function () {
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/podcast/GetAlbumPaging/chanId/14/pageIndex/1",
            type: 'GET'
        }).done(function (data) {
            self.imgMusic.push(self.convertToKoObject(data[1]))
        });      
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/podcast/GetAlbumPaging/chanId/3/pageIndex/1",
            type: 'GET'
        }).done(function (data) {
            self.imgAudioBook.push(self.convertToKoObject(data[1]))
            self.imgAudioBook2.push(self.convertToKoObject(data[2]))
        });
       
    }
    setTimeout(function () {
        $('#screen-welcome').css('display', 'none');         
        self.loadGetChannelHots();
        self.showMode('HomeApp');
        $('#avg-nav-bar').css('visibility', '');  
        
    }, 3000);
    var count = 0;
    self.homeApp = function () {  
      
        if (count == 0) {
            self.showMode("screen-welcome"); 
        }          
        self.showMode('HomeApp');
    }    
   
    // load menu home app
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
    // selected menu
    self.selectHomeMenuDetail = ko.observableArray();

    var countMenu = 0;
    self.selectHomeMenu = function (item) {       
        if (countMenu == 0) {
            self.showMode('lazyloading');
        }
        countMenu++;
        var Id = item.Id();
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/home/news/menu",
            type: 'GET'
        }).done(function (data) {
            self.selectHomeMenuDetail.removeAll();
            $.each(data, function (index, item) {
                if (item.ParentId == Id) {
                    self.selectHomeMenuDetail.push(self.convertToKoObject(item))
                }
            })
            self.showMode("selectedMenu"); 
            $('.clicked-menu').click(function () {
                $('.clicked').removeClass('clicked');
                $(this).addClass('clicked');
            });
            $('#news_0').trigger('click');
            console.log(1)
        });
    }
    self.menuData = ko.observableArray();
    self.Id = ko.observable();
    self.loadValueMenu = function (item) {  
        self.scrollToTop();
        var Id = item.Id();
        self.page(1);
        self.Id(Id);
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/home/news/ArticleCategoryPaging/" +  1+ "/" + self.Id(),         
            type: 'GET'
        }).done(function (data) {
            self.menuData.removeAll();
            $.each(data, function (index, item) {
                self.menuData.push(self.convertToKoObject(item))
            })
            $(window).scroll(function () {
                if ($(window).scrollTop() + 120 >= $(document).height() - $(window).height()) {
                    if ($("#selectedMenu").css("display") != 'none') {
                        if (!self.isLoading()) {
                            self.loadMoreValueMenu(self.Id());
                        }
                    }
                }
            });                   
        });           
    }
    self.loadMoreValueMenu = function (Id) {
        self.isLoading(true);
        self.page(self.page() + 1);
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/home/news/ArticleCategoryPaging/" + self.page() + "/" + Id,
            type: 'GET',
        }).done(function (data) {
            self.isLoading(false);
            if (data.length == 0) {
                console.log('null')
                $('#loaddingMenu').css('visibility','hidden');
                self.isLoading(true);
            }
            else {
                $.each(data, function (index, item) {
                    self.menuData.push(self.convertToKoObject(item))
                })
            }
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
      
    }
    self.articleSuggestionHome = ko.observableArray();
    self.articleSuggestionHome1 = ko.observableArray();
    self.articleSuggestionHome2 = ko.observableArray();
    self.loadGetArticleSuggestionHome = function () {
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/home/news/GetArticleSuggestionHome",
            type: 'GET'
        }).done(function (data) {            
            for (var i = 0; i < 3; i++) {
                self.articleSuggestionHome.push(self.convertToKoObject(data[i]))
            }
            for (var i = 3; i < 6; i++) {
                self.articleSuggestionHome1.push(self.convertToKoObject(data[i]))
            }
            for (var i = 6; i < data.length; i++) {
                self.articleSuggestionHome2.push(self.convertToKoObject(data[i]))
            }
        });
    }
    //load ListChannel
    self.channels = ko.observableArray();
    self.loadListChannel = function () {
        self.showMode("loadListChannel")
        var _isBusy = false;
        var _page = 1;
        var _stopped = false; 
        
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/home/news/ListChannel/" + _page ,
            type: 'GET'
        }).done(function (data) {
            self.channels.removeAll();
            for (var i = 0; i < data.length; i++) {
                self.channels.push(self.convertToKoObject(data[i]))
            }
            console.log(self.channels())
            _isBusy = false;
           
        });
        $(window).scroll(function () {
            $element = $('.listchannel');
            //$loadding = $('#loaddingMenu');
            if ($(window).scrollTop() + $(window).height() >= $element.height()) {
                if (_isBusy == true) {
                    return false;
                }
                if (_stopped == true) {
                    return false;
                }
                _isBusy = true;
                _page++;
               
                $.ajax({
                    url: "https://api.vtcnews.tek4tv.vn/api/home/news/ListChannel/" + _page,
                    type: 'GET'
                }).done(function (data) {
                   // self.channels.removeAll();
                    for (var i = 0; i < data.length; i++) {
                        self.channels.push(self.convertToKoObject(data[i]))
                    }
                    _isBusy = false
                });
            }
           

        });   


    }
    self.slectedChannels = ko.observableArray();
    self.loadSelectedChannel = function (item) {     
        var id = item.Id();
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/home/news/IndexChannelPaging/1/"+id,
            type: 'GET'
        }).done(function (data) {
            self.slectedChannels.removeAll()
            $.each(data.Items, function (index, item) {
                self.slectedChannels.push(self.convertToKoObject(item))
            })
          
        });
        self.showMode("loadSelectedChannel");
        $(window).scroll(function (evt) {
            evt.preventDefault();
            if ($(window).scrollTop() + 120 >= $(document).height() - $(window).height()) {
                if ($("#loadSelectedChannel").css("display") != 'none') {
                    if (!self.isLoading()) {
                        self.loadMoreSelectedChannel(id);
                    }
                }
            }
        });  
        self.interval();
    }
    self.loadMoreSelectedChannel = function (id) {
        self.isLoading(true);
        self.page(self.page() + 1);
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/home/news/trending/" + self.page(),
            type: 'GET',
        }).done(function (data) {
            self.isLoading(false);
            if (data.length == 0) {
                $('#load-more').hide();
                self.isLoading(true);
            }
            else {
                $.each(data, function (index, item) {
                    self.trends.push(self.convertToKoObject(item))
                })
            }
        });
    }
    self.itemChannelDetail = function (item) {
       self.showMode("lazyloading");
        $.ajax({
            url: 'https://api.vtcnews.tek4tv.vn/api/home/news/detail/' + item.Id(),
            type: 'GET',
            contentType: 'application/html; charset=utf-8',
            dataType: 'html'
        }).done(function (data) {
            console.log(data)
            self.scrollToTop();
            self.tags.removeAll();
            self.categoryNameData.removeAll();
            self.ListArticleRelated.removeAll();
            // load List Article Related
            $.each(self.convertToJson(data).ListArticleRelated, function (index, item) {
                self.ListArticleRelated.push(self.convertToKoObject(item))
            })
            self.detailData(self.convertToJson(data).DetailData);
            $.each(self.convertToJson(data).ListTag, function (index, item) {
                self.tags.push(self.convertToKoObject(item))
            })
            $.each(self.slectedChannels(), function (index, item) {
                if (item.CategoryName() == self.convertToJson(data).DetailData.CategoryName) {
                    if (item.Title() != self.convertToJson(data).DetailData.Title) {
                        self.categoryNameData.push(self.convertToKoObject(item))
                    }
                }
            })
           
            self.showMode("newListChannelDetail");
            $('#_idArticle').val(item.Id())
            console.log(item.Id())
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
                console.log(self.comment().TotalAllRecord)
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
            
        });      
    }
    self.backChannelDetail = function () {
        self.showMode("loadSelectedChannel"); 
    }
    self.backLoadListChannel = function () {
        self.showMode("loadListChannel"); 
    }

    //load video
    self.videoHome = ko.observableArray();
    self.videoHomes = ko.observableArray();   
    self.loadVideos = function () {
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/home/news/GetVideoHome",
            type: 'GET'
        }).done(function (data) {                  
            for (var i = 1; i < 5; i++) {
                self.videoHomes.push(self.convertToKoObject(data[i]));
            }           
            for (var i = 0; i < 1; i++) {
                self.videoHome.push(self.convertToKoObject(data[i]));
            }
            
        });
    }
    self.tags = ko.observableArray();
    self.categoryNameData = ko.observableArray();
    self.detailData = ko.observableArray();
    self.ListArticleRelated = ko.observableArray();
    self.comment = ko.observable();
    self.comnnetItems = ko.observableArray();
    self.clickDetailNew1 = function (item) {
        var urlWeb = "https://vtc.vn/" + item.SEOSlug() + "-ar" + item.Id() + ".html";
        self.showMode("lazyloading");
        $.ajax({
            url: 'https://api.vtcnews.tek4tv.vn/api/home/news/detail/' + item.Id(),
            type: 'GET',
            contentType: 'application/html; charset=utf-8',
            dataType: 'html'
        }).done(function (data) {
            self.scrollToTop();
            self.tags.removeAll();
            self.categoryNameData.removeAll();
            self.ListArticleRelated.removeAll();
            // load List Article Related
            $.each(self.convertToJson(data).ListArticleRelated, function (index, item) {
                self.ListArticleRelated.push(self.convertToKoObject(item))
            })
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
            });
            self.showMode("newDetail");
            $('#_idArticle').val(item.Id())
            
            // load commnet
            $.ajax({
                url: 'https://api.vtcnews.tek4tv.vn/api/home/news/comment/GetComment/' + item.Id()+'/1' ,
                type: 'GET',
                contentType: 'application/html; charset=utf-8',
                dataType: 'html'
            }).done(function (data) {
                self.comnnetItems.removeAll()
                self.comment(JSON.parse(data))
                $.each(JSON.parse(data).Items, function (index, item) {
                    self.comnnetItems.push(self.convertToKoObject(item))
                })
                console.log(self.comment().TotalAllRecord)
            })

            var urlContent = $(".detail-content p a").attr('href');
            $(".detail-content p a").attr("href", "#");
            $(".detail-content p a").click(function () {
                
                MainActivity.openUrl(urlContent);
            })

       //     $(".detail-content p a").attr("href", "#");
            
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
        });
    }
    self.clickDetailNew2 = function (item) {
        var urlWeb = "https://vtc.vn/" + item.SEOSlug() + "-ar" + item.Id() + ".html";
           
        self.showMode("lazyloading");
        $.ajax({
            url: 'https://api.vtcnews.tek4tv.vn/api/home/news/detail/' + item.Id(),
            type: 'GET',
            contentType: 'application/html; charset=utf-8',
            dataType: 'html'
        }).done(function (data) {
            self.scrollToTop();
            self.tags.removeAll();
            self.categoryNameData.removeAll();
            self.ListArticleRelated.removeAll();
            // load List Article Related
            $.each(self.convertToJson(data).ListArticleRelated, function (index, item) {
                self.ListArticleRelated.push(self.convertToKoObject(item))
            })
            
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
            });
            self.showMode("newDetailMenu");
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
                console.log(self.comment().TotalAllRecord)
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
        });
    }
    self.clickDetailNew3 = function (item) {
        var urlWeb = "https://vtc.vn/" + item.SEOSlug() + "-ar" + item.Id() + ".html";

        self.showMode("lazyloading");
        $.ajax({
            url: 'https://api.vtcnews.tek4tv.vn/api/home/news/detail/' + item.Id(),
            type: 'GET',
            contentType: 'application/html; charset=utf-8',
            dataType: 'html'
        }).done(function (data) {
            self.scrollToTop();
            self.tags.removeAll();
            self.categoryNameData.removeAll();
            self.ListArticleRelated.removeAll();
            // load List Article Related
            $.each(self.convertToJson(data).ListArticleRelated, function (index, item) {
                self.ListArticleRelated.push(self.convertToKoObject(item))
            })

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
            });
            self.showMode("newDetailTrend");
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
                console.log(self.comment().TotalAllRecord)
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
        });
    }
    self.backSelectedMenu = function () {       
        self.showMode('selectedMenu');
    }
    

    //back home of loadListChannel
    self.backHomeApp = function () {
        self.showMode("HomeApp");  
       
    }
    
    // trend   
    var loadTrend = 0;
    self.trend = function () {             
        if (loadTrend == 0) {    
            self.loadMoreTrend();
            self.showMode('lazyloading');
            setTimeout(function () {               
                self.showMode("Trend");
                $(window).scroll(function (evt) {
                    evt.preventDefault();
                    if ($(window).scrollTop() + 120 >= $(document).height() - $(window).height()) {
                        if ($("#Trend").css("display") != 'none') {
                            if (!self.isLoading()) {
                                self.loadMoreTrend();
                            }
                        }
                    }
                });  
                self.interval();
            }, 500);
        } else {
            self.showMode("Trend");                            
            $(window).scroll(function (evt) {
                evt.preventDefault();
                if ($(window).scrollTop() + 120 >= $(document).height() - $(window).height()) {
                    if ($("#Trend").css("display") != 'none') {
                        if (!self.isLoading()) {
                            self.loadMoreTrend();
                        }
                    }
                }
            });            
        }      
        loadTrend++;
    }
    self.trends = ko.observableArray();
    var isBusy = false;
    var page = 1;
    var stopped = false;
    self.loadTrend = function () {   
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/home/news/trending/" + 1,
            type: 'GET'
        }).done(function (data) {
            $.each(data, function (index, item) {
                self.trends.push(self.convertToKoObject(item))
            })
        });
        
    }
    self.isLoading = ko.observable(false);
    self.page = ko.observable(0);
    self.loadMoreTrend = function () {    
        self.isLoading(true);
        self.page(self.page() + 1);
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/home/news/trending/" + self.page(),
            type: 'GET',
        }).done(function (data) {         
            self.isLoading(false);
            if (data.length == 0) {
                $('#load-more').hide();
               
                self.isLoading(true);
            }
            else {
                $.each(data, function (index, item) {
                    self.trends.push(self.convertToKoObject(item))
                })
            }
        });
    }

    
    
  
    self.backTrend = function () {
        self.showMode("Trend")       
    }
    // video  
    var videoapp = 0;
    self.videoApp = function () {      
        if (videoapp == 0) {
            self.loadVideoss();
            self.showMode('lazyloading');
            setTimeout(function () {
                self.showMode("Video")
            }, 500);
        } else {
            self.showMode("Video")
        }
        videoapp++;      
    }
    self.videoHomess = ko.observableArray();
    
    self.loadVideoss = function () {
        self.showMode("lazyloading")
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/home/news/GetVideoHome",
            type: 'GET'
        }).done(function (data) {
           
            $.each(data, function (index, item) {
                self.videoHomess.push(self.convertToKoObject(item));
            })         
        });
    }
   
    self.loadByVideoByID = function (item) { 
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn//api/home/news/GetVideoDetail/" + item.Id(),
            type: 'GET'
        }).done(function (data) {
            var path = "https://media.vtc.vn" + data[0].VideoURL
            var url = window.location.origin + "/VideoDetail/Index/" + item.Id();
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


    //Audio   
    
    var loadAudio = 0;
    self.audioApp = function () {
        if (loadAudio == 0) {
            self.GetAllPodcast()
            self.showMode('lazyloading');
            setTimeout(function () {
                self.showMode("Audio");
               // self.GetAllPodcast();
            }, 500);
        } else {
            self.showMode("Audio");
            $('#avg-nav-bar').css('visibility', '');      
        }
        loadAudio++;
   
    }
    self.audiobook = ko.observableArray();
    self.audioMusic = ko.observableArray();
    self.podcast = ko.observableArray();
    self.GetAllPodcast = function () {
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/podcast/GetAllPodcast",
            type: 'GET'
        }).done(function (data) {
            self.audiobook.removeAll();
            $.each(data, function (index, item) {
                if (item.Name == "Sách nói") {
                    self.audiobook.push(self.convertToKoObject(item));  
                    self.homeAudioDetails(self.convertToKoObject(item))
                    console.log(self.audiobook())
                }
            })          
            self.audioMusic.removeAll();
            $.each(data, function (index, item) {
                if (item.Name == "Âm nhạc") {
                    self.audioMusic.push(self.convertToKoObject(item));
                   self.homeAudioDetailsMusic(self.convertToKoObject(item))
                    console.log(self.audioMusic())
                }
            })
            self.podcast.removeAll();
            $.each(data, function (index, item) {
                if (item.Name == "Podcast") {
                    self.podcast.push(self.convertToKoObject(item));
                }
            })           
        });
    }

    self.homes = ko.observableArray();
    self.home = ko.observableArray();
    self.homeAudioDetails = function (item) {
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/podcast/ChannelByPodcast/" + item.Id(),
            type: 'GET'
        }).done(function (data) {            
            $.ajax({
                url: "https://api.vtcnews.tek4tv.vn/api/podcast/GetAlbumPaging/chanId/" + data[data.length - 1].Id + "/pageIndex/" + 1,
                type: 'GET'
            }).done(function (items) {
                self.home.removeAll();
                self.homes.removeAll();
                for (var i = 1; i < 5; i++) {
                    self.homes.push(self.convertToKoObject(items[i]))
                }
                self.home.push(self.convertToKoObject(items[0]))               
            });
        });
    }
    self.music = ko.observableArray();
    self.musics = ko.observableArray();
    self.homeAudioDetailsMusic = function (item) {
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/podcast/ChannelByPodcast/" + item.Id(),
            type: 'GET'
        }).done(function (data) {
            $.ajax({
                url: "https://api.vtcnews.tek4tv.vn/api/podcast/GetAlbumPaging/chanId/" + data[0].Id + "/pageIndex/" + 1,
                type: 'GET'
            }).done(function (items) {
                console.log(items)
                self.music.removeAll();
                self.musics.removeAll();
                for (var i = 1; i < 5; i++) {
                    self.musics.push(self.convertToKoObject(items[i]))
                }
                self.music.push(self.convertToKoObject(items[0]))
                console.log(self.musics())
            });
        });
    }
    // load detail in audio page
    self.changebackgound = function (item) {
        if (item.Name() == "Sách nói") {
            $('.detail-audio').css("background-color", "#fe6f61");
        }
        if (item.Name() == "Âm nhạc") {
            $('.detail-audio').css("background-color", "#50b6ba");
        }             
    }
    //get audiobook detail    
    self.selectedName = ko.observable();
    self.menuAuBook = ko.observableArray();
    self.audiobookDetails = function (item) {
        self.scrollToTop();
        self.showMode("audiobookDetail");
        $('#avg-nav-bar').css('visibility', 'hidden');
        $('#close-audio').css('bottom', '0px');  
      
        self.selectedName(item);
        self.changebackgound(item);    
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/podcast/ChannelByPodcast/"+item.Id(),
            type: 'GET'
        }).done(function (data) {
            self.menuAuBook.removeAll();
            if (data.length > 0) {
                $.each(data, function (index, item) {
                    self.menuAuBook.push(self.convertToKoObject(item));
                })
                self.loadMenuAudiobook(self.menuAuBook()[0]);
            }
        });
    }
    self.audiobooks = ko.observableArray();
    self.audiobook = ko.observableArray();
    self.loadMenuAudiobook = function (item) {    
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/podcast/GetAlbumPaging/chanId/"+item.Id()+"/pageIndex/" + 1,
            type: 'GET'
        }).done(function (data) {
            self.audiobooks.removeAll();
            self.audiobook.removeAll();
            if (data.length > 0) {
                for (var i = 1; i < data.length; i++) {
                    self.audiobooks.push(self.convertToKoObject(data[i]));
                }
                self.audiobook.push(self.convertToKoObject(data[0]));
            }
        });
    }
    self.audiobookSeleced = ko.observable();
    self.Items = ko.observableArray();
    self.selectedData = function (item) {        
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn//api/podcast/AlbumDetail/" + item.Id() ,
            type: 'GET'
        }).done(function (data) {                     
            self.audiobookSeleced(data);
            self.Items.removeAll();
            $.each(data.Items, function (index, item) {
                self.Items.push(self.convertToKoObject(item));               
            })
            self.scrollToTop();    
            self.showMode("selectedAudiobookDetail");
            console.log(data)
            console.log('ok');
            $('.slim-scroll').slimScroll({
                height: '250px',
               
            });
                           
        });
    }
    self.selectedData1 = function (item) {
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn//api/podcast/AlbumDetail/" + item.Id(),
            type: 'GET'
        }).done(function (data) {
            self.audiobookSeleced(data);
            self.Items.removeAll();
            $.each(data.Items, function (index, item) {
                self.Items.push(self.convertToKoObject(item));
            })
            self.scrollToTop();
            console.log(data)
            self.showMode("audiobookDetailHome");
            console.log('ok');
            $('.slim-scroll').slimScroll({
                height: '250px',
              
            });
        });
    }

   
    self.newItems = ko.observableArray();  
    self.selectedItem = function (item) {
        self.newItems.removeAll();
        $.each(self.Items(), function (index, item) {
            self.newItems.push(self.convertToKoObject(item));
        })
        self.loadFileUrl(item);
                 
    }
    self.loadFileUrl = function (item) {
        var fileUrl = "https://media.vtc.vn" + item.FileUrl();
        var text = item.Name()
        $("#name").text(text);
        $("#img-selected").attr("src", item.image182_182());
        $("#play-pause").attr("src", "/fonts/icon/pause.png");
        $("#close-audio").css({ 'visibility': '' });
        var audio = $("#audio-play");
        $("#audio-play").attr(
            'src', fileUrl
        );
        audio.load();
       // audio.next();
    }

    self.closeAudio = function () {
        $("#close-audio").css({ 'visibility': 'hidden' });
        $("#audio-play").get(0).pause(); 
    }
    self.rightNext = function () {
        var fileUrl =  $("#audio-play").attr('src');
        for (var i = 0; i < self.newItems().length; i++) {
            if (fileUrl == "https://media.vtc.vn" + self.newItems()[i].FileUrl()) {                           
                if (i == self.newItems().length - 1) {                  
                    self.loadFileUrl(self.convertToKoObject(self.newItems()[0]));
                } else {                  
                    self.loadFileUrl(self.convertToKoObject(self.newItems()[i + 1]));
                }
            }           
        }
    }
    self.leftNext = function () {
        var fileUrl = $("#audio-play").attr('src');
        for (var i = 0; i < self.newItems().length; i++) {
            if (fileUrl == "https://media.vtc.vn" + self.newItems()[i].FileUrl()) {
                if (i == 0) {
                    self.loadFileUrl(self.convertToKoObject(self.newItems()[self.newItems().length-1]));
                } else {
                    self.loadFileUrl(self.convertToKoObject(self.newItems()[i - 1]));
                }
            }
        }
    }
    var i = 1;  
    self.clickPlay = function () {
        if ($("#play-pause").val() % 2 == 0) {
            $("#play-pause").attr("src", "/fonts/icon/play.png");
            i++;
            $("#play-pause").val(i);
            $("#audio-play").get(0).pause();           
        } else {
            $("#play-pause").attr("src", "/fonts/icon/pause.png");
            i++;
            $("#play-pause").val(i);
            $("#audio-play").get(0).play();
        }
    }
    self.backAudiobookHome = function () {
        self.showMode("Audio");
    }
    self.backAudiobookDetail = function () {
        self.showMode("audiobookDetail");
    }
    self.backAudio = function () {            
        self.audioApp();              
    }
   
    self.interval = function () {
        var interval = setInterval(function () {
            $(function () {
                $('.lazy').lazy({
                });
            });
            clearInterval(interval);
        }, 500);
    }

    self.showModal = function () {
        $('#_username').val("");
        $('#_email').val("");
        $('#_value').val("");
        $('#checkvalue').text("");
        $('#checkusername').text("");
    }
    self.postCommnet = function () {
        var _idArticle = $('#_idArticle').val();
        var _idComment = 0;
        var _username = $('#_username').val();
        var _email = $('#_email').val();
        var _value = $('#_value').val();
        if (_value.length == 0) {
            $('#checkvalue').text("Bạn chưa bình luận.");
        }
        if (_username.length == 0) {           
            $('#checkusername').text("Bạn nhập tên.");
        }
        console.log(_idArticle)
        console.log(_username)
        console.log(_email)
        console.log(_value)
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/home/comment/PostComment?_username=" + _username + "&_email=" + _email + "&_idArticle=" + _idArticle + "&_idComment=" + _idComment + "&_value="+_value,
            type: 'POST'
        }).done(function (data) {
         
            console.log(data)
            Swal.fire({               
                title: 'Gửi bình luận thành công!',
                text: 'Mời bạn quay lại bài viết sau ít phút',               
                width: 300,
                height: 100,
                timer: 3000
            }           
            )
        });           
    }   

    self.listMode = ko.observableArray();
    self.initListMode = function () {
        self.listMode = [
            { Name: 'lazyloading' },
            { Name: 'HomeApp' },
            { Name: 'selectedMenu' },
            { Name: 'loadListChannel' },
            { Name: 'newListChannelDetail' },
            { Name: 'loadSelectedChannel' },
            { Name: 'newDetail' },
            { Name: 'Trend' },
            { Name: 'Video' },
            { Name: 'Audio' },
            { Name: 'audiobookDetail' },
            { Name: 'selectedAudiobookDetail' },
            { Name: 'newDetailMenu' },
            { Name: 'newDetailTrend' },
            { Name: 'audiobookDetailHome' },
            { Name: 'screen-welcome' },
            
        ];

       
    
    }
    
    self.showMode = function (name) {
        if ($("#HomeApp").css("display") != 'none') {
            scrollPotison = document.documentElement.scrollTop;
        }
        $.each(self.listMode, function (idx, item) {
            $("#" + item.Name).css("display", "none");
        });
        $("#" + name).css("display", "");
        modeName = name;
        console.log(modeName)
    }
}
   
$(function () {
    var layoutModel = new LayoutModel(); 
    layoutModel.homeApp();
    layoutModel.loadData();
    
    layoutModel.initListMode();
    ko.applyBindings(layoutModel);
}
);