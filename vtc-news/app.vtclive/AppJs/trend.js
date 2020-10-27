var TrendModel = function () {
    var self = this;
    self.mode = ko.observable("")
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
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/home/news/trending/" + page,
            type: 'GET'
        }).done(function (data) {
            //  self.trends.removeAll();
            $.each(data, function (index, item) {
                self.trends.push(self.convertToKoObject(item))
            })
            isBusy = false
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
                    //  self.trends.removeAll();
                    $.each(data, function (index, item) {
                        self.trends.push(self.convertToKoObject(item))
                    })
                    $loadding.addClass('hidden');
                    isBusy = false
                });   
            }
        });
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
            $(".lazy").each(function () {
                $(this).attr("src", $(this).attr("data-src"));
                $(this).removeAttr("data-src");
                $(this).addClass('img-fluid');
            });
           
        }); 
    }
    
}
$(function () {
    ko.cleanNode(document.getElementById("body-content"));
    var trendModel = new TrendModel();
    trendModel.loadWindow();
    trendModel.sideBar();
    ko.applyBindings(trendModel, document.getElementById("body-content"));
});
