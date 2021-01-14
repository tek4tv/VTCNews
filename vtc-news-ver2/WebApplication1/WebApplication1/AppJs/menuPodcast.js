var MenuPodcastModel = function () {
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
    self.loadData = function () {
        self.getAllPodcast();   
    }   
    self.menuAuBook = ko.observableArray();
    var name = $('#swiper-input').val();
    self.loadMenu = function (Id) {
        let i = 0;
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/podcast/ChannelByPodcast/"+Id,
            type: 'GET'
        }).done(function (data) {
            self.menuAuBook.removeAll();
            $.each(data, function (index, item) {
                item.Array = [];
                item.Index = i++;
                item.ArrayFirst = [];
                self.menuAuBook.push(self.convertToKoObject(item));
            })  
            self.initSwiperTab(); 
            $('.clicked-menu').click(function () {
                $('.clicked').removeClass('clicked');
                $(this).addClass('clicked');         
                $('.swiper-height').css("height", "")
            });
            $(`#podcast_0`).click();               
        })    
    }
    self.loadAlbumPage = function (item) {         
        var index = item.Index();
        swiper4.slideTo(index, 500, true);  
        if (self.menuAuBook()[index].Array().length == 0) {
            $.ajax({
                url: "https://api.vtcnews.tek4tv.vn/api/podcast/GetAlbumPaging/chanId/" + item.Id() + "/pageIndex/" + 1,
                type: 'GET'
            }).done(function (data) {
                console.log(data)
                self.menuAuBook()[index].Array.removeAll();
                self.menuAuBook()[index].ArrayFirst.removeAll();
                self.menuAuBook()[index].ArrayFirst.push(self.convertToKoObject(data[0]));
                for (let i = 1; i < data.length; i++) {
                    self.menuAuBook()[index].Array.push(self.convertToKoObject(data[i]));
                }           
            })
        }
    }
    self.getAllPodcast = function () {
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/podcast/GetAllPodcast",
            type: 'GET'
        }).done(function (data) {
            self.showMode("podcast");
            $.each(data, function (index, item)
            {
                if (item.Name == name) {
                    self.loadMenu(item.Id);                  
                }
            })
        })
    }
    var swiper4;
    var n = 0;
    self.initSwiperTab = function () {       
        var setting = {
            //calculateHeight: true,  
            
            on: {
                slideChange: function () {                  
                    n = this.activeIndex;
                    $(`#podcast_${n}`).click();                  
                    $(`#podcast_${n}`)[0].scrollIntoView(false);                    
                   
                },
                autoHeight: true
            }
        }
        swiper4 = new Swiper('.swiper4', setting);
    }   
    self.audiobookSeleced = ko.observable();
    self.Items = ko.observableArray();
    self.selectedData = function (item) {      
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn//api/podcast/AlbumDetail/" + item.Id(),
            type: 'GET'
        }).done(function (data) {
            self.showMode("selectedAudiobookDetail");
            self.audiobookSeleced(data);
            self.Items.removeAll();
            $.each(data.Items, function (index, item) {
                self.Items.push(self.convertToKoObject(item));
            })
            self.scrollToTop();
            if (data.Items.length > 4) {
                $('.slim-scroll').css('height', '250px');           
            }
            self.loadCategory();
        });
       
    }
    self.category = ko.observableArray();
    self.loadCategory = function () {
        self.category.removeAll();
        $.each(self.menuAuBook(), function (index, item) {
            if (item.Index() == n) {
                $.each(item.Array(), function (ind, ite) {
                    self.category.push(self.convertToKoObject(ite));
                })
            }
           
        })
    }
   
    self.newItems = ko.observableArray();
    self.selectedItem = function (item) {
        self.newItems.removeAll();
        $.each(self.Items(), function (index, item) {
            self.newItems.push(self.convertToKoObject(item));
        })
        console.log(self.newItems());
        if (item) {
            self.loadFileUrl(item);
        }
        
    }
    self.loadFileUrl = function (item) {
        console.log(item)
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
        var url = audio.data("url");
        audio.load(url);
        // audio.next();
    }
    self.closeAudio = function () {
        $("#close-audio").css({ 'visibility': 'hidden' });
        $("#audio-play").get(0).pause();
    }
    $('#right-audio').click(function () {
        var fileUrl = $("#audio-play").attr('src');
        for (var i = 0; i < self.newItems().length; i++) {
            if (fileUrl == "https://media.vtc.vn" + self.newItems()[i].FileUrl()) {
                if (i == self.newItems().length - 1) {
                    self.loadFileUrl(self.convertToKoObject(self.newItems()[0]));
                } else {
                    self.loadFileUrl(self.convertToKoObject(self.newItems()[i + 1]));
                }
            }
        }
    })
    $('#left-audio').click(function () {
        var fileUrl = $("#audio-play").attr('src');
        for (var i = 0; i < self.newItems().length; i++) {
            if (fileUrl == "https://media.vtc.vn" + self.newItems()[i].FileUrl()) {
                if (i == 0) {
                    self.loadFileUrl(self.convertToKoObject(self.newItems()[self.newItems().length - 1]));
                } else {
                    self.loadFileUrl(self.convertToKoObject(self.newItems()[i - 1]));
                }
            }
        }
    })
   
    var i = 1;
    self.clickPlay = function () {
        console.log('lick')
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
    self.backMenu = function () {       
        self.showMode("podcast");            
    }


    self.listMode = ko.observableArray();
    self.initListMode = function () {
        self.listMode = [
            { Name: 'podcast' },
            { Name: 'selectedAudiobookDetail' },                  
        ];
    }
    self.showMode = function (name) {    
        $.each(self.listMode, function (idx, item) {
            $("#" + item.Name).css("display", "none");
        });
        $("#" + name).css("display", "");
        modeName = name;  
    }
}
$(function () {
    ko.cleanNode($("#swiper-podcast")[0]);
    var menuPodcastModel = new MenuPodcastModel();
    menuPodcastModel.loadData();
    menuPodcastModel.initListMode();
    ko.applyBindings(menuPodcastModel, $("#swiper-podcast")[0]);
});