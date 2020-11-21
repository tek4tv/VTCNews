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

    //home 
    self.homeApp = function () {
        if (pointHome == 0) {
            self.mode("lazyloading");  
        }         
        self.mode("HomeApp");      
        pointHome++;     
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
    //load ListChannel
    self.channels = ko.observableArray();
    self.loadListChannel = function () {
        self.mode("loadListChannel")
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/home/news/ListChannel/1",
            type: 'GET'
        }).done(function (data) {
            self.channels.removeAll();
            for (var i = 0; i < data.length; i++) {
                self.channels.push(self.convertToKoObject(data[i]))
            }
        });
    }
    self.slectedChannels = ko.observableArray();
    self.loadSelectedChannel = function (item) {
        self.mode("loadSelectedChannel");      
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/home/news/IndexChannelPaging/1/"+item.Id(),
            type: 'GET'
        }).done(function (data) {
            self.slectedChannels.removeAll()
            $.each(data.Items, function (index, item) {
                self.slectedChannels.push(self.convertToKoObject(item))
            })          
        });
    }
    self.itemChannelDetail = function (item) {
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
           
            self.mode("newListChannelDetail");
            var srcLink = $('.inlink-remake').attr('href');
            $(".inlink-remake").attr("href", "#");         
            $(".inlink-remake").click(function () {
                var url = "https://vtc.vn/" + srcLink               
               // alert(url);
                MainActivity.openUrl(url);
              //  MainActivity.shareApp(url);
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
        self.mode("loadSelectedChannel"); 
    }
    self.backLoadListChannel = function () {
        self.mode("loadListChannel"); 
    }

























    //load video
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
    self.clickDetailNew1 = function (item) {       
        scrollClick = document.documentElement.scrollTop;      
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
            self.mode("newDetail");
            var srcLink = $('.inlink-remake').attr('href');
            $(".inlink-remake").attr("href", "https://vtc.vn/" + srcLink);
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

    //back home of loadListChannel
    self.backHomeApp = function () {
        self.mode("HomeApp");      
    }
    
    // trend
    var pointTrend = 1;
    self.trend = function () {      
        if (pointTrend == 1) {
            self.mode("lazyloading");   
        } 
        
        self.mode("Trend");    
        pointTrend++;
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
            
            $(function () {
                $('.lazy').lazy();
                $('.lazy').addClass("img-fluid");
            });
        });
        $(window).scroll(function () {          
            $element = $('.trend');
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
        console.log("ok")
        self.loadVideoss();
        self.mode("Video")
    }
    self.videoHomess = ko.observableArray();
    
    self.loadVideoss = function () {
        self.mode("lazyloading")
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
    self.audioApp = function () {          
        self.mode("Audio");
        self.GetAllPodcast();
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
                }
            })          
            self.audioMusic.removeAll();
            $.each(data, function (index, item) {
                if (item.Name == "Âm nhạc") {
                    self.audioMusic.push(self.convertToKoObject(item));
                   self.homeAudioDetailsMusic(self.convertToKoObject(item))
                        
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
        self.mode("audiobookDetail");
        $('#avg-nav-bar').css('visibility', 'hidden');
        $('#close-audio').css('bottom', '0px');  
       // $('#detail-catagory').css('margin-bottom', '100px');
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
            self.mode("selectedAudiobookDetail");          
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
            $("#audio-play").get(0).load();
        }
    }
    self.backAudiobookDetail = function () {
        self.mode("audiobookDetail");
    }
    self.backAudio = function () {
        $('#avg-nav-bar').css('visibility', '')
        $('#close-audio').css('bottom', '40px');  
        self.audioApp();
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
        layoutModel.loadTrend();
        index++
    }
    
    ko.applyBindings(layoutModel);
}
);