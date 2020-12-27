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
        $('.swiper-height').css("height", "");
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
            $.each(data, function (index, item)
            {
                if (item.Name == name) {
                    self.loadMenu(item.Id);
                    
                }
            })
        })
    }
    var swiper4;
    self.initSwiperTab = function () {
        var n = 0;
        var setting = {
            autoHeight: true,  
            direction: 'horizontal',
            on: {
                slideChange: function () {                  
                    n = this.activeIndex;
                    $(`#podcast_${n}`).click();                  
                    $(`#podcast_${n}`)[0].scrollIntoView(false);   
                    
                    $('.swiper-height').css("height", "");
                }
            }
        }
        swiper4 = new Swiper('.swiper4', setting);
    }   
}
$(function () {
    ko.cleanNode($("#swiper-podcast")[0]);
    var menuPodcastModel = new MenuPodcastModel();
    menuPodcastModel.loadData();
    ko.applyBindings(menuPodcastModel, $("#swiper-podcast")[0]);
});