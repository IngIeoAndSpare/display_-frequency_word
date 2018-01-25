window.addEventListener('load', initMap);

var vmap;
var div_vmap;

window.onpopstate = function (event) {
    loadState(event.state);
};

function initMap() {

    div_vmap = document.getElementById('v_map');
    vw.ol3.MapOptions = {
        basemapType: vw.ol3.BasemapType.GRAPHIC
        , controlDensity: vw.ol3.DensityType.EMPTY
        , interactionDensity: vw.ol3.DensityType.BASIC
        , controlsAutoArrange: true
        , homePosition: vw.ol3.CameraPosition
        , initPosition: vw.ol3.CameraPosition
    };
    vmap = new vw.ol3.Map(div_vmap, vw.ol3.MapOptions);

    vmap.getView().setCenter(ol.proj.transform([127.8945727, 36.3505553], "EPSG:4326", "EPSG:3857"));
    vmap.getView().setZoom(8);

}
