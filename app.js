

// Requirements from the ArcGIS API
require([
      "esri/Map",
      "esri/views/SceneView",
      "esri/layers/SceneLayer",
      "esri/layers/FeatureLayer",
      "esri/tasks/support/RelationParameters",
      "esri/tasks/GeometryService",
      "esri/widgets/Legend"
    ], 

  function(Map, SceneView, SceneLayer, FeatureLayer, RelationParameters, GeometryService, Legend) {

    //Creation of the map
    var map = new Map({
      basemap: "topo-vector",
      ground: "world-elevation"  // show elevation
    });

    // Creation of the SceneView to display the map
    var view = new SceneView({
      //Div container for the view
      container: "viewDiv",
      map: map,
      camera: {
        position: {  // observation point
          x: 4.477,
          y: 51.858,
          z: 2500 // altitude in meters
        },
        tilt: 59  // perspective in degrees
      }
    });


    //Popup for our 3D buildings layer
    var popup_BAG_3D = {
      title: "Building Information", // the title of the popup
      "content": [{
        "type": "fields",
        "fieldInfos": [
            {
              "fieldName": "Gebruiksdoel",
              "label": "Gebruiksdoel",
              "isEditable": true,
              "tooltip": "",
              "visible": true,
              "format": null,
              "stringFieldOption": "text-box"
            },
            {
              "fieldName": "Bouwjaar",
              "label": "Bouwjaar",
              "isEditable": true,
              "tooltip": "",
              "visible": true,
              "format": null,
              "stringFieldOption": "text-box"
            },
            {
              "fieldName": "Oppervlakte",
              "label": "Oppervlakte",
              "isEditable": true,
              "tooltip": "",
              "visible": true,
              "format": null,
              "stringFieldOption": "text-box"
            },
            {
              "fieldName": "Gemeentecode",
              "label": "Gemeentecode",
              "isEditable": true,
              "tooltip": "",
              "visible": true,
              "format": {
                "places": 2,
                "digitSeparator": true
              },
              "stringFieldOption": "text-box"
            }
          ]
        }]
      }

    //3D Buildings layer
    var BAG_3D_WGS_layer = new SceneLayer({
      portalItem: {
        id: "62037f70d64e433083517cf064469040"
      },
      outFields: ["Gebruiksdoel","Bouwjaar","Oppervlakte","Gemeentecode"], // fields to retrieve
      popupTemplate: popup_BAG_3D // we add our personal popup
    });

    map.add(BAG_3D_WGS_layer, 0); // add the layer to the map

    BAG_3D_WGS_layer.definitionExpression = "Gemeentecode = 599" // only showing Rotterdam buildings


    var BAG_Verblijfsobject_layer = new FeatureLayer({
    	url: "https://basisregistraties.arcgisonline.nl/arcgis/rest/services/BAG/BAGv2/FeatureServer/1"
    })


    document
      .getElementById("optionsDiv") // get the buildings type selector
      .addEventListener("change", updateSelection); // update our buildings selection

    //Creation of a legend
    var legend = new Legend({
      view: view, 
      layerInfos: [
        {
          layer: BAG_3D_WGS_layer,
          title: " "
        }
      ]
    });

    view.ui.add(legend, "bottom-right"); // add the legend to the map

    // Slider specifications
    $("#js-range-slider").ionRangeSlider({
        type: "double",
        min: 1700,
        max: 2020,
        from: 1700,
        to: 2020,
        skin: "round"
    });
      
    $("#js-range-slider").on("change", updateSelection) // when the user move the slider, we update the selection






    // Update buildings selection to match new query
    function updateSelection()
      {
        var slider = $("#js-range-slider").data("ionRangeSlider"); // our slider data
        var from = slider.result.from; // beginning selected date
        var to = slider.result.to; // end selected date

        var select_element = document.getElementById("optionsDiv"); // get our select object 
        // get the value of the select object
        var select_value = select_element.options[select_element.selectedIndex].value; 
        
        // expression to retrieve only the buildings in the right range of date and with the right type in Rotterdam
        BAG_3D_WGS_layer.definitionExpression = "Bouwjaar >= " + from + " AND Bouwjaar <= " + to +" AND " 
        + select_value + " AND Gemeentecode = 599"; 

      };

  }
);