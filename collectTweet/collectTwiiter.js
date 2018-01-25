var TwitterStreamChannels = require('twitter-stream-channels');
var credentials = require('./keyfile.json');

var fs = require('fs');
var client = new TwitterStreamChannels(credentials);

var channels = {
    "languages": ['창원터널', '피파온라인4', '월드시리즈', '호날두', '권오현'],
};

var stream = client.streamChannels({ track: channels });

stream.on('channels/languages', function (tweet) {

    var dataForTwitter;

    if (tweet.coordinates !== null) {

        let inputCoordinates = Number(tweet.coordinates.split(','));
        var place = CheckCoodinaterForLocation(inputCoordinates[0], inputCoordinates[1]);

        dataForTwitter = {
            twiiterText: tweet.text,
            twitterKeyword: tweet.$keywords[0],
            twitterPlace: place,
        };
    }

    dataForTwitter = {
        twiiterText: tweet.text,
        twitterKeyword: tweet.$keywords[0],
        twitterPlace: tweet.user.location,
    };

    fs.appendFile('./collect/twiiterJson3.json', JSON.stringify(dataForTwitter) + ",\r\n", 'utf8', function (error) {
        if (error) throw error;
    });
});


function CheckCoodinaterForLocation(lat, lng) {
    $.getScript("https://openapi.map.naver.com/openapi/v3/maps.js?clientId=YourClientCode&submodules=geocoder", function () {
        naverSubModule.naver.maps.Service.reverseGeocode({
            location: new naverSubModule.maps.LatLng(lat, lng),
        }, function (status, response) {
            if (status !== naverSubModule.naver.maps.Service.Stauts.OK) {
                console.log('error! ' + status);
            }

            var result = response.result,
                items = result.items;

            return items.addrdetail.sido;
        });
    });

}
