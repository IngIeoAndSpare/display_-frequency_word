window.addEventListener('load', initModule);

var vectorLayer;

// json 형식으로 받아옴 


function initModule() {
    let resultArray;
    $('form').on('submit', function (event) {
        event.preventDefault();

        let inputText = $('input[name="textKeyword"]').val();

        if (!inputText) {
            alert("키워드가 없습니다!");
            return;
        }

        fetch(`${location.protocol}//${location.host}/keyword?keyword=${inputText}`)
            .then(res => res.json())
            .then(objArr => {
                resultArray = objArr;
            });

        positionForVector(resultArray);

    });//키워드 텍스트 검색

}


function positionForVector(resultArray) {

    vectorLayer = clearLayer(vectorLayer);

    let pointX = [];
    let pointY = [];
    let meanForSum = 0;
    let meanForPlace = [];

    for(let key of resultArray){
        pointX.push(key.coorX);
        pointY.push(key.coorY);
        meanForPlace.push(key.count);
        meanForSum += key.count;
    }

    for(let i = 0; i < meanForPlace.length; i++){
        meanForPlace[i] = (meanForPlace[i] / meanForSum) * 100;
    }

    createkeywordLayer(pointX, pointY, meanForPlace);

}


function createkeywordLayer(pointX, pointY, meanForPlace) {

    var vectorSource = new ol.source.Vector({
        projection: 'EPSG:4326',
        wrapX: false
    });

    vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        updateWhileAnimating: true
    });

    for (let i = 0; i < pointY.length; i++) {
        let placePoint = ol.proj.transform([pointX[i], pointY[i]], "EPSG:4326", "EPSG:3857");
        addKeywordLayer(vectorSource, placePoint, meanForPlace[i]);
    }

    vmap.addLayer(vectorLayer);
}


function addKeywordLayer(src, pointForPlace, meanForPlace) {

    let opacity = meanForPlace * 3000;
    let circle = new ol.geom.Circle(pointForPlace, opacity);
    let circleFeature = new ol.Feature(circle);

    let style = new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 100, 50, 0.3)'
        }),
        stroke: new ol.style.Stroke({
            width: 2,
            color: 'rgba(255, 100, 50, 0.8)'
        }),
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: 'rgba(55, 200, 150, 0.5)'
            }),
            stroke: new ol.style.Stroke({
                width: 1,
                color: 'rgba(55, 200, 150, 0.8)'
            }),
            radius: 7
        }),
    });
    circleFeature.setStyle(style);
    src.addFeature(circleFeature);

}

function clearLayer(inLayer) {

    if (inLayer != null) {
        vmap.removeLayer(inLayer);
        inLayer = null;
    }

    return inLayer;
}
