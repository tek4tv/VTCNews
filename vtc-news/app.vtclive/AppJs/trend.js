var TrendModel = function () {
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
    
}
$(function () {
    ko.cleanNode(document.getElementById("body-content"));
    var trendModel = new TrendModel();
    trendModel.loadWindow();
    trendModel.sideBar();
    ko.applyBindings(trendModel, document.getElementById("body-content"));
});
