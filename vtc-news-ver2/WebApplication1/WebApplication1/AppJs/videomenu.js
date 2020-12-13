var VideoDetailModel = function () {
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
        self.loadId();
       
    }
    self.videos = ko.observableArray();
    self.loadId = function () {
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/home/news/menu",
            type: 'GET'
        }).done(function (data) {
            var id;
            $.each(data, function (index, item) {               
                if (item.Title == "Video") {                   
                    id = item.Id;                   
                } 
                if (item.ParentId == id) {
                    var id2 = item.Id;
                    self.array.push(id2);
                    
                }  

            })
            console.log(self.array())
            var i = 0;
            var item = self.array()[i];  
            self.loadVideos(item)
           /* $(window).scroll(function () {
                if ($(window).scrollTop() + 120 >= $(document).height() - $(window).height()) {
                    i++;
                    self.loadVideos(item)
                } 
            })*/
        });
    }

    self.array = ko.observableArray();
    self.loadVideos = function (id2) {
        var url = document.location.href;
        var idUrl = url.substring(url.lastIndexOf('/') + 1);
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/home/news/ArticleCategoryPaging/1/"+id2,
            type: 'GET'
        }).done(function (data) {          
            $.each(data, function (index, item) {
                self.videos.push(self.convertToKoObject(item))
                if (item.Id == idUrl) {                  
                    self.videoByID(item)                 
                }
            })
            console.log (self.videoByID()  )
            $(".hidden-div").css('visibility', '');
            
        });
    }    
    self.videoByID = ko.observableArray();   
    self.clickNextVideoSelected = function (item) {
        $.each(self.videos(), function (index, item2) {
            if (item2.Id() == item.Id()) {
                self.videoByID(item);              
            }
        })
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn//api/home/news/GetVideoDetail/" + item.Id(),
            type: 'GET'
        }).done(function (data) {
            var path = "https://media.vtc.vn" + data[0].VideoURL;
            alert('{"url":"' + path + '","urlwv":"","isLive":false}');
            $(".hidden-div").css('visibility', '');
        })

    }  
}
$(function () {
    var videoDetailModel = new VideoDetailModel();
    videoDetailModel.loadData();
    ko.applyBindings(videoDetailModel);
});