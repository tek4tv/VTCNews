var AudioDetailModel = function () {
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
    

    self.podcasts = ko.observableArray();
    self.podcast = ko.observableArray();
    self.podcastLenth = ko.observable();
    self.imagePoster = ko.observable();
    self.loadAudioPodcast = function () {
        $.ajax({
            url: "https://api.vtcnews.tek4tv.vn/api/audio/episode",
            type: 'GET'
        }).done(function (data) {
            var item = [];
            item.push(data[0])
            var url = "https://vodovp.tek4tv.vn/" + self.convertToJson(data[0].Image)[1].Url;
            console.log(url)
            self.imagePoster(self.convertToKoObject(url))
            self.podcast.removeAll();
            $.each(item, function (index, item) {
                self.podcast.push(self.convertToKoObject(item))
            })
            self.podcastLenth(data.length);
        });
        console.log(self.podcast())
        console.log(self.imagePoster())

    }
}
$(function () {
    ko.cleanNode(document.getElementById("body-content"));
    var audioDetailModel = new AudioDetailModel();
    ko.applyBindings(audioDetailModel, document.getElementById("body-content"));
});
