var HomeAppModel = function () {
    var self = this;
    self.loadMenu = function () {
        $.ajax({
            url: "/api/home/menu",
            type: 'GET'
        }).done(function (data) {
            console.log(data)
        });
    }
   
}
$(function () {
    ko.cleanNode(document.getElementById("body-content"));
    var homeAppModel = new HomeAppModel();
    homeAppModel.loadMenu();
    ko.applyBindings(homeAppModel, document.getElementById("body-content"));
});
