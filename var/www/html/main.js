/*jslint browser: true, devel: true, eqeq: true, newcap: true, plusplus: true, sloppy: true, vars: true*/
/*global ol, jsPDF, osmtogeojson, FormData, $*/
var map;
var dragBox;
var bbox;
var punto;
var layerList = [];
var h = $(window).height(),
    hval = h - $("#top").height();

function success(string) {
    $("#messageContainer").show();
    $("#messageContainer").html(string);
    $("#messageContainer").css("opacity", "1");
    setTimeout(function () {
        $("#messageContainer").css("opacity", "0");
        $("#messageContainer").hide();
    }, 3000);
}

function successD(data) {
    console.log(data);
    var $res = $(data);
    var resText = $res.find('wps\\:LiteralData').text();
    doc = new jsPDF();
    doc.setFontSize(40);
    doc.text(50, 25, "Report Analysis");
    doc.setFontSize(18);
    doc.text(10, 40, resText);
    var btn = "<button onClick='doc.save(&quot;Report.pdf&quot;)'>Download Report</button>";
    $("#resBox").html("Report now available to download " + btn);
    console.log(resText);
}

function newF() {
    dragBox = new ol.interaction.DragBox({
        condition: ol.events.condition.shiftKeyOnly,
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: [0, 0, 255, 1]
            })
        })
    });
    map.addInteraction(dragBox);
    dragBox.on('boxend', function (e) {
        var info = [];
        var extent = dragBox.getGeometry().getExtent();
        console.log(extent);
        var topC = ol.proj.transform([extent[0], extent[1]], 'EPSG:3857', 'EPSG:4326');
        var bottomC = ol.proj.transform([extent[2], extent[3]], 'EPSG:3857', 'EPSG:4326');
        bbox = topC[1] + "," + topC[0] + "," + bottomC[1] + "," + bottomC[0];
        success("Selection performed");
    });
}

function geoCoding(name) {
    $.ajax({
        url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + name + "&key=AIzaSyCOEVIpatIxZJ4z-kCJhueNVO9S8jNeGIs", //Insert Your GMap key here
        type: "GET",
        success: function (res) {
            var coords = [];
            var lat, lng;
            try {
                lat = res.results[0].geometry.location.lat;
                lng = res.results[0].geometry.location.lng;
                coords.push(lng);
                coords.push(lat);
                coords = ol.proj.transform(coords, 'EPSG:4326', 'EPSG:3857');
                console.log(coords);
                map.getView().setCenter(coords);
                map.getView().setZoom(13);
            } catch (e) {}
        }
    });
}
$(document).ready(function () {
    map = new ol.Map({
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        target: 'map',
        controls: ol.control.defaults({
            attributionOptions: ({
                collapsible: false
            })
        }),
        view: new ol.View({
            center: [0, 0],
            zoom: 4,
            projection: "EPSG:3857"
        })
    });
    $("#map").css("height", hval + "px");
    map.updateSize();
    newF();
});

function switchStart() {
    $("#leftBar").show();
}

function lastChild(arr) {
    "use strict";
    var deep = arr[0],
        count = 0;
    while (deep[0][0]) {
        deep = deep[0];
        count = count + 1;
        if (count > 10) {
            return (deep);
        }
    }
    return (deep);
}

function compareVect(data1, data2, data3) {
$('#optMenu').click();
    if (data2) {
        data2.crs = data1.crs;
    }
    if (data3) {
        data3.crs = data1.crs;
    }
    console.log("compareReached");
    $("#resBox").html("Waiting for calculation from server");
    var input2 = JSON.stringify(data2);
    var input1 = JSON.stringify(data1);
    var mask;
    if (data3) {
        mask = JSON.stringify(data3);
    }
    console.log(mask);
    var buffer;
    buffer = $("#bufferSize").val();
    if (!buffer) {
        buffer = "15";
    }
    var xmlREQ =
        "<wps:Execute service=\"WPS\" version=\"1.0.0\" xmlns:wps=\"http://www.opengis.net/wps/1.0.0\" xmlns:ows=\"http://www.opengis.net/ows/1.1\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.opengis.net/wps/1.0.0/wpsExecute_request.xsd\"> " +
        "  <ows:Identifier>osm</ows:Identifier> " +
        "  <wps:DataInputs> " +
        "    <wps:Input> " +
        "      <ows:Identifier>input1</ows:Identifier> " +
        "      <wps:Data> " +
        "        <wps:ComplexData>" + input1 + "</wps:ComplexData> " +
        "      </wps:Data> " +
        "    </wps:Input> " +
        "    <wps:Input> " +
        "      <ows:Identifier>input2</ows:Identifier> " +
        "      <wps:Data> " +
        "	 <wps:ComplexData>" + input2 + "</wps:ComplexData> " +
        "      </wps:Data> " +
        "    </wps:Input> ";
    if (mask && data3) {
        xmlREQ +=
            "    <wps:Input> " +
            "      <ows:Identifier>mask</ows:Identifier> " +
            "      <wps:Data> " +
            "	 <wps:ComplexData>" + mask + "</wps:ComplexData> " +
            "      </wps:Data> " +
            "    </wps:Input> ";
    }
    xmlREQ +=
        "    <wps:Input> " +
        "      <ows:Identifier>buffer</ows:Identifier> " +
        "      <wps:Data> " +
        "	  <wps:LiteralData>" + buffer + "</wps:LiteralData>" +
        "      </wps:Data> " +
        "    </wps:Input> " +
        "  </wps:DataInputs> " +
        "</wps:Execute> ";
    console.log("req ready");
    $.ajax({
        type: "POST",
        url: 'http://131.175.143.84/WPS/reqcgi?Service=WPS&request=execute&version=1.0.0&identifier=osm', //URL of the WPS
        data: xmlREQ,
        contentType: "text/xml",
        dataType: "text",
        success: successD,
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
        }
    });
}
var doc;

function startMap(JS1, name) {
    if (!JS1.crs){
    	JS1.crs={};
    	JS1.crs.properties={};
    }
		JS1.crs.properties.name = name;    

    $("#refLayer, #osmLayer, #maskLayer").append('<option value=' + layerList.length + '>' + name + '</option>');
$("#selectLayer").append('<option value=' + (layerList.length+1) + '>' + name + '</option>');
    layerList.push({
        name: name,
        layer: JS1
    });
    console.log("start calulation");
    var newCenter = [0, 0];
    var sColor1 = "#00FFFF";
    sColor1 = $("#sColor1").val();
    var patt = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/;
    var matches = patt.exec(sColor1);
    sColor1 = "rgba(" + parseInt(matches[1], 16) + "," + parseInt(matches[2], 16) + "," + parseInt(matches[3], 16) + ",0.6)";
    if (JS1.features[0] && JS1.features[0].geometry) {
        if (!isNaN(lastChild(JS1.features[0].geometry.coordinates)[0]) && !isNaN(lastChild(JS1.features[0].geometry.coordinates)[1])) {
            newCenter = [lastChild(JS1.features[0].geometry.coordinates)[0], lastChild(JS1.features[0].geometry.coordinates)[1]];
        } else {
            alert("projection file not valid");
        }
    }
    console.log(sColor1);
    var point1 = JS1;
    var s1 = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: sColor1,
            width: 2
        }),
        fill: new ol.style.Fill({
            color: sColor1
        })
    });
    var vectorSource1 = new ol.source.GeoJSON({
        object: JS1
    });
    var vectorLayer1 = new ol.layer.Vector({
        source: vectorSource1,
        style: s1
    });

    map.addLayer(vectorLayer1);
    map.getView().setCenter(newCenter);
    map.getView().setZoom(14);
}
$('#browseButton').click(function (e) {

$("#optionsOSM").addClass("up");
 $("#options").addClass("up");
$("#optionsOSM").removeClass("down");
 $("#options").removeClass("down");

    if ($("#optionsBrowse").hasClass("down")) {
        $("#optionsBrowse").removeClass("down");
        $("#optionsBrowse").addClass("up");
    } else {
        $("#optionsBrowse").removeClass("up");
        $("#optionsBrowse").addClass("down");

    }
});


$('#optMenu').click(function (e) {

$("#optionsOSM").addClass("up");
 $("#optionsBrowse").addClass("up");
$("#optionsOSM").removeClass("down");
 $("#optionsBrowse").removeClass("down");

    if ($("#options").hasClass("down")) {
        $("#options").removeClass("down");
        $("#options").addClass("up");
    } else {
        $("#options").removeClass("up");
        $("#options").addClass("down");
    }
});

$('#over').click(function (e) {
$("#options").addClass("up");
 $("#optionsBrowse").addClass("up");
$("#options").removeClass("down");
 $("#optionsBrowse").removeClass("down");

    if ($("#optionsOSM").hasClass("down")) {
        $("#optionsOSM").removeClass("down");
        $("#optionsOSM").addClass("up");

    } else {
        $("#optionsOSM").removeClass("up");
        $("#optionsOSM").addClass("down");
    }
});



$('#toolMenu').click(function (e) {
    "use strict";
    if ($("#leftBar").hasClass("lef")) {
        $("#leftBar").removeClass("lef");
        $("#leftBar").addClass("rig");
    } else {
        $("#leftBar").removeClass("rig");
        $("#leftBar").addClass("lef");
    }
});
$('#compareBtn').click(function (e) {
    var l1 = $("#refLayer").val();
    var l2 = $("#osmLayer").val();
    var l3 = $("#maskLayer").val();

    if (l1 != "null" && l2 != "null" && l3 != "null") {
        compareVect(layerList[l1].layer, layerList[l2].layer, layerList[l3].layer);
    } else if (l1 != "null" && l2 != "null") {
        compareVect(layerList[l1].layer, layerList[l2].layer);
    } else {
        alert("Select at least one Reference and one OSM layer");
    }
});
$('#searchBtn').click(function (e) {
    var val = $('#searchInput').val();
    geoCoding(val);
});


function clearFileInput(id) 
{ 
    var oldInput = document.getElementById(id); 

    var newInput = document.createElement("input"); 

    newInput.type = "file"; 
    newInput.id = oldInput.id; 
    newInput.name = oldInput.name; 
    newInput.className = oldInput.className; 
    newInput.style.cssText = oldInput.style.cssText; 

    oldInput.parentNode.replaceChild(newInput, oldInput); 
}

$('#send').click(function (e) {
$('#browseButton').click();
    "use strict";
    var file1 = document.getElementById('myFile1').files[0],
        vector1,
        fd1 = new FormData(),
        proj1 = "EPSG:32632";
    fd1.append('upload', file1);
    if ($("#proj1").val()) {
        proj1 = $("#proj1").val();
    }
    console.log("source PRJ: " + proj1);
    var name = document.getElementById('myFile1').files[0].name;
    fd1.append('sourceSrs', proj1);
    fd1.append('targetSrs', "EPSG:3857");
    fd1.append('skipFailures', "true");
    console.log("send file1");
clearFileInput("myFile1");
    $.ajax({
        url: 'http://131.175.143.84/WPS/convert ', //URL of Conversion service 
        data: fd1,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (data) {
            console.log("file1 ready");
            console.log(data);
            console.log(name);
            vector1 = data;
            startMap(vector1, name);
        },
        error: function (e) {
            console.log("error: " + JSON.stringify(e));
        }
    });
});

function overPass3(){
var s = $("#selectLayer").val();
if(!s){
alert("Please select a layer!");
return;
}
extent=map.getLayers().a[s].getSource().getExtent();
 var topC = ol.proj.transform([extent[0], extent[1]], 'EPSG:3857', 'EPSG:4326');
 var bottomC = ol.proj.transform([extent[2], extent[3]], 'EPSG:3857', 'EPSG:4326');
  bbox = topC[1] + "," + topC[0] + "," + bottomC[1] + "," + bottomC[0];
overPass(bbox);
}
function overPass2(){
  var extent = map.getView().calculateExtent(map.getSize());
        var topC = ol.proj.transform([extent[0], extent[1]], 'EPSG:3857', 'EPSG:4326');
        var bottomC = ol.proj.transform([extent[2], extent[3]], 'EPSG:3857', 'EPSG:4326');
        bbox = topC[1] + "," + topC[0] + "," + bottomC[1] + "," + bottomC[0];
overPass(bbox);
}
function overPass(selection) {

if(selection){
bbox=selection;
}
    if (!bbox) {
      alert("Please perform a selection before");
return;
    }
$('#over').click();

    var colorDef="#00FFFF";
    if ($("#sColor2").val()){
 	 colorDef = $("#sColor2").val();
    }
    var s3 = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: colorDef,
            width: 2
        })
    });
    var data = '[out:json][timeout:25];(way["highway"](' + bbox + '););out body;>;out skel qt;';
    console.log(data);
    $.ajax({
        url: 'http://overpass-api.de/api/interpreter',
        data: data,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (data) {
            console.log("overpass ready");
            data = osmtogeojson(data);
            var vectorPass = new ol.source.GeoJSON({
                object: data,
                projection: 'EPSG:3857'
            });
            var vectorLayerPass = new ol.layer.Vector({
                source: vectorPass,
                style: s3
            });
            var name;
            name=$("#layerName").val();
	if (!name){
name="OSM layer";
}
            $("#refLayer, #osmLayer, #maskLayer").append('<option value=' + layerList.length + '>' + name + '</option>');
$("#selectLayer").append('<option value=' + (layerList.length+1) + '>' + name + '</option>');
            map.addLayer(vectorLayerPass);
            var geojson = new ol.format.GeoJSON();
            var features = vectorPass.getFeatures();
            var json = geojson.writeFeatures(features);
            layerList.push({
                name: name,
                layer: JSON.parse(json)
            });
$("#layerName").val("");
        },
        error: function (e) {
            console.log("error: " + JSON.stringify(e));
        }
    });
}
