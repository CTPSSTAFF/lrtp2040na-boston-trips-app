// 'Trips to Boston' app for LRTP 2040 Needs Assessment
//
// The source code for this app was originally written by Mary McShane for the 2014 LRTP using OpenLayers version 2.
// It was migrated to OpenLayers version 3 by Ethan Ebinger in 2017.
// In 2018 it was (minimally) modified by yours truly to read data from a PostGIS data source rather than an Oracle/ArcGIS datasource.
//
// It is currently being modified by yours truly for the 2040 LRTP. 
//
// It is clear that aside from modifying the app fetch data for the 2040 LRTP, the code for this app is in need of a lot of TLC. 
// How much can be applied is a function of budget and schedule matters not under the control of yours truly.
// The only *requirement* is to make the thing work with the 2016/2040 data.
//
// BK 12 April 2019

var CTPS = {};
CTPS.bostonTrips = {};
CTPS.bostonTrips.map = {};
CTPS.bostonTrips.myData = [];

CTPS.bostonTrips.centerMPO = [239170.29457336952, 897210.5236749973];
CTPS.bostonTrips.zoomMPO = 2.9;
CTPS.bostonTrips.centerBBD = [235845.15915394976, 901258.5248540288];
CTPS.bostonTrips.zoomBBD = 5.5;


// CTPS.bostonTrips.szServerRoot = 'http://www.ctps.org:8080/geoserver/'; 
CTPS.bostonTrips.szServerRoot = location.protocol + '//' + location.hostname + '/maploc/';
CTPS.bostonTrips.szWMSserverRoot = CTPS.bostonTrips.szServerRoot + '/wms'; 
CTPS.bostonTrips.szWFSserverRoot = CTPS.bostonTrips.szServerRoot + '/wfs';

CTPS.bostonTrips.oCorridors = {}; // Vector layer for OpenLayers map

//  VARIABLES FOR FREQUENTLY USED LAYER FILES
var ne_states = 'postgis:mgis_nemask_poly';
var towns_base = 'postgis:dest2040_towns_modelarea';
var OD_corridors_2016 = 'dest2040_viewer:dest2040_od_boscen_2016'; 
var OD_corridors_2040 = 'dest2040_viewer:dest2040_od_boscen_2040'; 
var OD_corridors; // The value of this variable will either be OD_corridors_2012 or OD_corridors_2040
var roadways = 'postgis:ctps_roadinventory_grouped';
var MA_mask = 'postgis:ctps_ma_wo_model_area';

// OTHER GLOBAL VARIABLES
var t = 0;  //  NOTE:  't' is a flag used in function to toggle 'displayCore' function on and off--used because old jQuery 'toggle' function deprecated.
var strExtraLegend = '<span class="pix"><img src="images/BOS02.bmp" width="24" height="10" alt="" /></span><span id="BBD" class="pix_text">Boston Business District </span><br>'
strExtraLegend += '<span class="pix"><img src="images/CEN02.bmp" width="24" height="10" alt="" /></span><span id="CEN_area" class="pix_text">Central Area </span><br>'
var my_year = '';
 
 
/* ****************   1. UTILITY FUNCTIONS  ***************/
// hide/unhide toggle, works in conjunction with class definition in CSS file--
// see below, and see CSS file, for difference between 'unhide' and 'toggle_turn_on' 
function unhide(divID) {
	//function toggles hiding and unhiding a specified Div
	var item = document.getElementById(divID);
	if (item) {
		item.className=(item.className==='hidden')?'unhidden':'hidden';
	}
} // unhide()

// toggle elements on and off, works in conjunction with class definitions in CSS file
// NOTE: difference from 'unhide' above is that 'unhide' works with 'visibility' CSS; 'toggle..' works with 'display..' CSS
function toggle_turn_on(divID) {
	//function toggles hiding and unhiding a specified Div
	var item = document.getElementById(divID);
	if (item) {
		item.className=(item.className==='turned_off')?'turned_on':'turned_off';
	}
} // toggle_turn_on()

function toggle_disable(element) {
    var item2 = document.getElementById(element);
    if (item2) {
        item2.disabled=(item2.disabled===true)?false:true;
    }
}

function popup(url) {
    popupWindow = window.open(url,'popUpWindow','height=700,width=600,left=600,top=10,resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no,status=yes')
}; // popup()

//           END of UTILITY FUNCTIONS


/* **************   2. INITIALIZE PAGE, DRAW MAP  *****************/
CTPS.bostonTrips.init = function(){  
 	var i, oSelect, oOption, oBaseLayers;  
    
    // Populate #selected_corridor combo box of corridor names
    // Note that we do NOT list the "external" corridors (within the statewide model as well as outside of it)
	oSelect = document.getElementById("selected_corridor"); 
	oOption;  // An <option> to be added to the  <select>.
	for (i = 0; i < MPMUTILS.OD_corridors_2016.length; i++) {           
        oOption = document.createElement("OPTION");
        oOption.value = MPMUTILS.OD_corridors_2016[i][0];
        oOption.text = /*MPMUTILS.OD_corridors[i][0] + ', ' + */ MPMUTILS.OD_corridors_2016[i][4]; 
        oSelect.options.add(oOption);
    }
    
	// Define WMS layers
	oBaseLayers = new ol.layer.Tile({	
		source: new ol.source.TileWMS({
			url		:  CTPS.bostonTrips.szWMSserverRoot,
			params	: {
				'LAYERS': 	[	ne_states,
								roadways,
								towns_base,
								MA_mask	],
				'STYLES': 	[	'ne_states',
								'RoadsMultiscaleGroupedBGblue',
								'Plan2035_towns_OD_boundaries',
								'non_boston_mpo_gray_mask'	],
				'TRANSPARENT': 	[	'false',
									'true',
									'true',
									'true'	]
			}
		})
	});
	
	CTPS.bostonTrips.oCorridors = new ol.layer.Tile({	
		source: new ol.source.TileWMS({
			url		:  CTPS.bostonTrips.szWMSserverRoot,
			params	: {
				'LAYERS'		: 	OD_corridors_2016,
				'STYLES'		: 	'polygon',
				'TILED'			: 	'true',
				'TRANSPARENT'	: 	'true'
			}
		})
	});
	
	// Define vector layers (populated from WFS requests)
	CTPS.bostonTrips.oHighlightLayer = new ol.layer.Vector({
		//"Selected District"
		source	: new ol.source.Vector({
			wrapX: false 
		})
	});
	
	// Define MA State Plane Projection and EPSG:26986/EPSG:4326 transform functions
	// because neither defined by OpenLayers, must be created manually.
	// More on custom projections: 	http://openlayers.org/en/latest/examples/wms-custom-proj.html
	//								http://openlayers.org/en/master/apidoc/ol.proj.Projection.html
	//								https://openlayers.org/en/latest/apidoc/ol.proj.html#.addCoordinateTransforms
	var projection = new ol.proj.Projection({
		code: 'EPSG:26986',
		extent: [33861.26,777514.31,330846.09,1228675.50],	// bounds are MA's minx, miny, maxx, plus NH's maxy
		units: 'm'
	});
	ol.proj.addProjection(projection);
	// proj4js: http://proj4js.org/
	// https://epsg.io/26986#
	var MaStatePlane = '+proj=lcc +lat_1=42.68333333333333 +lat_2=41.71666666666667 +lat_0=41 +lon_0=-71.5 +x_0=200000 +y_0=750000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';
	ol.proj.addCoordinateTransforms(
		'EPSG:4326',
		projection,
		function(coordinate){
			var WGS_to_MAState = proj4(MaStatePlane).forward(coordinate);
			return WGS_to_MAState;
		},
		function(coordinate){
			var MAState_to_WGS = proj4(MaStatePlane).inverse(coordinate);
			return MAState_to_WGS;
		}
	);	
	
	// Define OpenLayers 3 map
	CTPS.bostonTrips.map = new ol.Map({
		target	: 'map2',
		controls: ol.control.defaults().extend([
			new ol.control.ScaleLine({
				units	: 'us'
			})
		]),
		layers	: [	oBaseLayers,
					CTPS.bostonTrips.oCorridors,
					CTPS.bostonTrips.oHighlightLayer	],
		view	: new ol.View({
			projection: projection,
			center	: CTPS.bostonTrips.centerMPO,
			zoom	: CTPS.bostonTrips.zoomMPO,
			maxZoom	: 9,
			minZoom	: 2
		})
	});

	//CTPS.bostonTrips.map.addControl(new OpenLayers.Control.LayerSwitcher()); --> 	this feature is not available in ol3,
	//																			but an add-in can be found here:
	//																			https://github.com/walkermatt/ol3-layerswitcher
    
    if (!Modernizr.svg) {
        alert("Display of SVG charts not supported in older browser versions;\n--click 'Accessible Table' button instead to see data table.");
    } else {
        // console.log('SVG supported');
    }
}; // END OF 'INIT' FUNCTION


//  CTPS.bostonTrips.toggleCoreDisplay = function(){                     //  put here in case this ends up being an old-fashioned function
$(document).ready(function(){
    // On-click handler for #displayCore radio button
	$('#displayCore').click(function(e){                            //  NOTE:  toggle method is DEPRECATED in most recent versions of jQuery  MMcS, July 17, 2014
		// alert('got within click function');                      //   --this is my half-assed replacement....
		if (t===0) {
			$('#displayMPO').attr('checked', false);
			$('#displayCore').attr('checked', true);
			// Update oCorridors style
			var new_style = 'Plan2040_core_outline';
			var params = CTPS.bostonTrips.oCorridors.getSource().getParams();
			params.STYLES = new_style;
			CTPS.bostonTrips.oCorridors.getSource().updateParams(params);
			// Pan and Zoom to 'Plan2040_core_outline'
			var view = CTPS.bostonTrips.map.getView();
			view.animate({
				center: CTPS.bostonTrips.centerBBD,
				zoom: CTPS.bostonTrips.zoomBBD,
				duration: 2000
			});
			// Add extraLegend
			$('#extraLegend').append(strExtraLegend);
			if ($('#extraLegend').attr('class')==='turned_off'){     
				toggle_turn_on('extraLegend');
			};
			t = 1;
		};
	});
    
    // On-click handler for #displayMPO radio button
	$('#displayMPO').click(function(e) {
		if (t!=0) {
			$('#displayMPO').attr('checked', true);
			$('#displayCore').attr('checked', false);
			// Update oCorridors style
			var new_style = 'polygon';
			var params = CTPS.bostonTrips.oCorridors.getSource().getParams();
			params.STYLES = new_style;
			CTSP.bostonTrips.oCorridors.getSource().updateParams(params);
			// Pan and Zoom to 'polygon' (aka full map), or previous feature extent
			if (CTPS.bostonTrips.oBoundsFull) {
				CTPS.bostonTrips.map.getView().fit(
					CTPS.bostonTrips.oBoundsFull,
					{ size: CTPS.bostonTrips.map.getSize(),
					  duration: 2000 }
				);
			} else {
				var view = CTPS.bostonTrips.map.getView();
				view.animate({
					center: CTPS.bostonTrips.centerMPO,
					zoom: CTPS.bostonTrips.zoomMPO,
					duration: 2000
				});
			}
			// Remove extraLegend
			$('#extraLegend').html('');
			if ($('#extraLegend').attr('class')==='turned_on'){      
				toggle_turn_on('extraLegend');
			}
			t = 0;
		}
	});
    
    // On-change handler for #selected_year <select> box
	$('#selected_year').change(function(e){
		my_year = $(this).val();     
		// my_year=$('#selected_year :selected').val(); 	// this also works 
		if(my_year==='2040'){
			OD_corridors = OD_corridors_2040;
		} else {
			OD_corridors = OD_corridors_2016;
		}
		
		if ($('#getCorridor').prop('disabled', true)) {
			toggle_disable('getCorridor');
		}
		
		CTPS.bostonTrips.resetDisplay();
	});    
}); 


/* ***************  3. GET DESIRED CORRIDOR, ADD TO HIGHLIGHT LAYER ****************/
// This is the on-change handler for the #selected_corridor <select> box
CTPS.bostonTrips.searchForCorridor = function(e){
    var params, myselect, i, corr_text, pos, cqlFilter, szUrl;
    
    // initialize variables/data store
	CTPS.bostonTrips.oHighlightLayer.getSource().clear();
	
	// ensure that map is not displaying Boston Business District and Central Area
	params = CTPS.bostonTrips.oCorridors.getSource().getParams();
	params.STYLES = 'polygon';
	CTPS.bostonTrips.oCorridors.getSource().updateParams(params);
	// Remove extraLegend
	$('#extraLegend').html('');
	if ($('#extraLegend').attr('class')==='turned_on'){      
		toggle_turn_on('extraLegend');
	}
    // Note: This 't' is global. -- BK 04/12/2019
	t = 0;
	$('#displayMPO').attr('checked', true);
	$('#displayCore').attr('checked', false);
 
	if ($('#page_bottom').attr('class')==='unhidden'){
		// unhide('page_bottom');
	}
	if ($('#getCorridor').prop('disabled', false)) {
		toggle_disable('getCorridor');
	}
     
	$('#trips_grid').html('');
	$('#transit_grid').html('');
     
	if(!(my_year)){     
		alert('No data YEAR selected yet--\nUse first combo box to select desired year, \nthen hit "Get Data" again');
		return;
	}
    // Get selected corridor
	myselect = document.getElementById("selected_corridor")
	for (i = 0; i < myselect.options.length; i++){
		if (myselect.options[i].selected == true){          
			 CTPS.bostonTrips.choice_corridor = myselect.options[i].value;
             corr_text = myselect.options[i].text;
             pos = corr_text.indexOf(',');           
             CTPS.bostonTrips.choice_text = (corr_text.slice(pos + 1)).toUpperCase();    
		}
	}
	
	if (CTPS.bostonTrips.choice_corridor === '') { 
		alert("No corridor selected: try again.");
		return;
	}

    //  create WFS query to display district on map    
    if ($('#legendCorr').attr('class')==='turned_off'){
		toggle_turn_on('legendCorr');
    }
    
    cqlFilter = "(corridor_no=='" + CTPS.bostonTrips.choice_corridor + "')";
	$('#corridorName').html('Selected Trip Source: &nbsp;&nbsp; <span style="color: #7c1900">' + CTPS.bostonTrips.choice_text + '</span>');
    
	szUrl = CTPS.bostonTrips.szWFSserverRoot + '?';
    szUrl += '&service=wfs';
    szUrl += '&version=1.0.0';
    szUrl += '&request=getfeature';
    szUrl += '&typename=' + OD_corridors;
    szUrl += '&srsname=EPSG:26986';
    szUrl += '&outputformat=json';
    szUrl += '&cql_filter=' + cqlFilter;
	$.ajax({ url		: szUrl,
			 type		: 'GET',
			 dataType	: 'json',
			 success	: 	function (data, textStatus, jqXHR) {	
                                var reader, aFeatures, feature, attrs, extent, source, i, j, corridor, oBounds;
                                
								reader = new ol.format.GeoJSON();
								aFeatures = reader.readFeatures(jqXHR.responseText);
								if (aFeatures.length !== 1) {
									alert('Error: WFS request returned ' + aFeatures.length + ' features.');
									CTPS.bostonTrips.clearSelection();
									return;
								}
								// Clear, then add highlight layer features to map
								CTPS.bostonTrips.oHighlightLayer.getSource().clear();
								CTPS.bostonTrips.myData = [];
								source = CTPS.bostonTrips.oHighlightLayer.getSource();
                                
                                // Process single feature returned
                                feature = aFeatures[0];
                                attrs = feature.getProperties();
								source.addFeature(new ol.Feature(attrs));
									
                                var fld_name = [
                                    'Highway',
                                    'Transit',
                                    'Bike',
                                    'Walk',
                                    'Total', 
                                    'Percent of all trips to Boston Business District or Central Area'
                                ];
                                var transit_fld = [
                                    'Bus',
                                    'Rapid Transit',
                                    'Commuter Rail',
                                    'Ferry',
                                    'Total Transit',
                                    'Percent of all transit trips to Boston Business District or Central Area'
                                ];
                                var BBD_val = [
                                    +(attrs['bbd_highway']),
                                    +(attrs['bbd_transit']),
                                    +(attrs['bbd_bike']),
                                    +(attrs['bbd_walk']),
                                    +(attrs['bbd_total']),
                                    ''
                                ];
                                var BBD_pct = [
                                    +(attrs['bbd_highway_pct']),      
                                    +(attrs['bbd_transit_pct']),
                                    +(attrs['bbd_bike_pct']),
                                    +(attrs['bbd_walk_pct']),          
                                    0,   
                                    +(attrs['bbd_corr_share_ptrips'])
                                ];
                                BBD_pct[4] = BBD_pct[0] + BBD_pct[1] + BBD_pct[2] + BBD_pct[3];
                                var BBD_T_val = [
                                    +(attrs['bbd_t_bus']),
                                    +(attrs['bbd_t_rt']),
                                    +(attrs['bbd_t_cr']),
                                    +(attrs['bbd_t_ferry']),
                                    0,
                                    ''
                                ];
                                BBD_T_val[4] = (BBD_T_val[0] + BBD_T_val[1] + BBD_T_val[2] + BBD_T_val[3]).toFixed(0);
									
                                var BBD_T_val_pct = [];
                                for (j = 0; j < 5; j++) {
                                    BBD_T_val_pct[j] = BBD_T_val[j] / BBD_T_val[4];
                                }
                                BBD_T_val_pct[5] = attrs['bbd_corr_share_ttrips']; 
                                var CEN_val = [
                                    +(attrs['cen_highway']),
                                    +(attrs['cen_transit']),
                                    +(attrs['cen_bike']),
                                    +(attrs['cen_walk']),
                                    +(attrs['cen_total']),
                                    ''
                                ];									
                                var CEN_pct = [
                                    +(attrs['cen_highway_pct']),  
                                    +(attrs['cen_transit_pct']),
                                    +(attrs['cen_bike_pct']),
                                    +(attrs['cen_walk_pct']),
                                    0,
                                    +(attrs['cen_corr_share_ptrips'])
                                ];
								CEN_pct[4] = CEN_pct[0] + CEN_pct[1] + CEN_pct[2] + CEN_pct[3];
									
                                var CEN_T_val = [
                                    +(attrs['cen_t_bus']),
                                    +(attrs['cen_t_rt']),
                                    +(attrs['cen_t_cr']),
                                    +(attrs['cen_t_ferry']),
                                    0,
                                    ''
                                ];
                                CEN_T_val[4] = (CEN_T_val[0] + CEN_T_val[1] + CEN_T_val[2] + CEN_T_val[3]).toFixed(0);
									
								var CEN_T_val_pct = [];
                                for (j = 0; j < 5; j++) {
                                    CEN_T_val_pct[j] = CEN_T_val[j] / CEN_T_val[4];
                                }
                                CEN_T_val_pct[5] = attrs['cen_corr_share_ttrips'];                                        

                                for (j = 0; j < 6; j++) {
                                    corridor = attrs['od_corridor'];
                                    CTPS.bostonTrips.corridor_name = attrs['OD_CORRIDOR_NAME'];             
                                    CTPS.bostonTrips.myData.push([
                                        corridor,
                                        CTPS.bostonTrips.corridor_name,
                                        fld_name[j],
                                        BBD_val[j],
                                        BBD_pct[j],
                                        CEN_val[j],
                                        CEN_pct[j],
                                        BBD_T_val[j],
                                        CEN_T_val[j]
                                    ]);
                                }

                                for (i = 0; i < 6; i++) {
                                    var commas_BBD_T = ((+BBD_T_val[i])===0) ? BBD_T_val[i].toLocaleString() : (+BBD_T_val[i]).toLocaleString();
                                    var commas_CEN_T = ((+CEN_T_val[i])===0) ? CEN_T_val[i].toLocaleString() : (+CEN_T_val[i]).toLocaleString();
                                    
                                    CTPS.bostonTrips.myData[i] = {
                                       "field_name"			:	fld_name[i],
                                       "transit_fld"        :	transit_fld[i],
                                       "BBD_val"            :	(BBD_val[i]).toLocaleString(),
                                       "BBD_pct"            :	(+(BBD_pct[i])*100).toFixed(1) + '%',
                                       "CEN_val"            :	(CEN_val[i]).toLocaleString(),
                                       "CEN_pct"            :	(+(CEN_pct[i])*100).toFixed(1) + '%',
                                       "BBD_T_val"          :	+BBD_T_val[i],
                                       "commas_BBD_T_val"   :	commas_BBD_T, 	// NEED BOTH NUMBERS AND COMMA-DELINEATED (TEXT) ITEMS: numbers for chart, text for table
                                       "BBD_T_val_pct"      :	(+(BBD_T_val_pct[i])*100).toFixed(1) + '%',
                                       "CEN_T_val"          :	+CEN_T_val[i],
                                       "commas_CEN_T_val"   :	commas_CEN_T, 	// NEED BOTH NUMBERS AND COMMA-DELINEATED (TEXT) ITEMS: numbers for chart, text for table
                                       "CEN_T_val_pct"      :	(+(CEN_T_val_pct[i])*100).toFixed(1) + '%'
                                    };
                                }									 
								
								// Pan and Zoom to feature
								oBounds = { minx: [], miny: [], maxx: [], maxy: [] };
                                extent = feature.getGeometry().getExtent();
                                oBounds.minx.push(extent[0]);
                                oBounds.miny.push(extent[1]);
                                oBounds.maxx.push(extent[2]);
                                oBounds.maxy.push(extent[3]);                               
								CTPS.bostonTrips.oBoundsFull = [ Math.min.apply(null,oBounds.minx),
                                                                 Math.min.apply(null,oBounds.miny),
                                                                 Math.max.apply(null,oBounds.maxx),
                                                                 Math.max.apply(null,oBounds.maxy) ];
								CTPS.bostonTrips.map.getView().fit(CTPS.bostonTrips.oBoundsFull,
									                               { size: CTPS.bostonTrips.map.getSize(), duration: 2000 });
								
								// Create accessible grids and create pie charts
								CTPS.bostonTrips.renderToGrid();
								CTPS.bostonTrips.createPieCharts();
							},  // success handler
			failure		: 	function (qXHR, textStatus, errorThrown ) {
								alert('WFS request in timerFunc failed.\n' +
										'Status: ' + textStatus + '\n' +
										'Error:  ' + errorThrown);
							}   // failure handler
	}); // WFS request
    
	// ALTERNATIVE STYLE FOR 'DISTRICT SELECTION' VECTOR LAYER--PINK-ish, WITH MINIMAL BORDER
	CTPS.bostonTrips.style = function(feature) {
		return [
			new ol.style.Style({
				text	: new ol.style.Text({
							font: 'bold 10px Arial',
							text: CTPS.bostonTrips.corridor_name,
							fill: new ol.style.Fill({ 
								color: 'black'
							}),
							stroke: new ol.style.Stroke({ 
								color: 'white',
								width: 3
							})
						}),
				geometry: function(feature) {
                            // The feature may have EITHER Polygon OR MultiPolygon geometry.
                            // Legacy comments from Ethan:
							//      expecting a MultiPolygon here, makes sure only one label is generated:
							//      https://stackoverflow.com/questions/33484283/restrict-labeling-to-one-label-for-multipolygon-features
                            var geom, ftype, interiorPoints, interiorPoints, retval;
                            geom = feature.getGeometry();
                            ftype = geom.getType();
                            if (ftype === "MultiPolygon") {
                                interiorPoints = geom.getInteriorPoints();
                                retval = interiorPoints.getPoint(0);
                            } else {
                                interiorPoint = geom.getInteriorPoint();
                                retval = interiorPoint;
                            }                             
							return retval;
						}
			}),
			new ol.style.Style({
				fill	: new ol.style.Fill({ 
							color: 'rgba(255,68,102,0.25)'
						}), 
				stroke 	: new ol.style.Stroke({ 
							color: "#aaaaaa",
							width: 0.5
						})
			})
		];
	};
	CTPS.bostonTrips.oHighlightLayer.setStyle(CTPS.bostonTrips.style);	
}; // END 'searchForCorridor' FUNCTION


/* **************   4.  WRITE DATA TO GRID 'trips_grid' USING SELECTED DATA SOURCE   ******************  */
CTPS.bostonTrips.renderToGrid = function() {
 
    //  CLEAR, THEN RENDER, MAIN GRID
	$('#trips_grid').html('');
    $('#transit_grid').html('');
   
	var colDesc = [    
		// { header : 'index', dataIndex : 'MyID', width: '0px', style: 'align="right"' },
		{ header : 'Mode', dataIndex : 'field_name', width: '200px', style: 'align="right"' }, 
		{header : 'To Boston Business District', dataIndex : 'BBD_val' , width: '100px', style: 'align="right"' }, 
		{ header : 'Percent by Mode', dataIndex : 'BBD_pct', width: '180px',	style: 'align="right"' } ,
		{ header : 'To Central Area', dataIndex : 'CEN_val', width: '100px',	style: 'align="right"' }, 
		{ header : 'Percent by Mode', dataIndex : 'CEN_pct', width: '100px', style: 'align="right"' }        
	];
	CTPS.bostonTrips.TripsGrid = new AccessibleGrid({ 
		divId 		:	'trips_grid',
		tableId		:	'trips_table',
		summary		: 	'rows are different modes including highway and transit and columns are 1 mode 2 total trips to Boston C B D 3 percent by mode 4 total trips to Central area 5 percent by mode',
		caption		:	'Trips to Boston Business District & Surrounding Central Area from <br /><span style="color: #7c1900">' + CTPS.bostonTrips.choice_text + '</span> by Mode <br />for Year: <span style="color: #7c1900">' + my_year + '</span>',
		ariaLive	:	'assertive',
		colDesc		: 	colDesc
	});
	CTPS.bostonTrips.TripsGrid.loadArrayData(CTPS.bostonTrips.myData);

	var colDescTransit = [
		// {header : 'index', dataIndex : 'MyID', width: '0px', style: 'align="right"' },
		{ header : 	'Transit Mode', dataIndex : 'transit_fld' , width: '200px', style: 'align="right"' }, 
		{ header : 	'To Boston Business District', dataIndex : 'commas_BBD_T_val' , width: '100px', style: 'align="right"'}, 
		{ header : 	'Percent by Mode', dataIndex : 'BBD_T_val_pct', width: '180px', style: 'align="right"' } ,
		{ header : 	'To Central Area', dataIndex : 'commas_CEN_T_val' , width: '100px', style: 'align="right"'},
		{ header : 	'Percent by Mode', dataIndex : 'CEN_T_val_pct', width: '100px', style: 'align="right"' }        
	];
	
	CTPS.bostonTrips.TransitGrid = new AccessibleGrid({ 
		divId 		:	'transit_grid',
		tableId 	:	'transit_table',
		summary		: 	'rows are transit modes including bus and rapid transit and columns are 1 mode 2 total trips to Boston C B D 3 percent by mode 4 total trips to Central area 5 percent by mode',
		caption		:	'Mode Shares for Transit Trips Only',
		ariaLive	:	'assertive',
		colDesc		: 	colDescTransit
	});			
	CTPS.bostonTrips.TransitGrid.loadArrayData(CTPS.bostonTrips.myData);
	
	if($('#chart_header').attr('class') === 'hidden'){
		unhide('chart_header');
	}	
};

/* **************   5.  CREATE 2 PIE CHARTS SHOWING TRANSIT DISTRIBUTION FOR EACH DESTINATION   ******************  */
CTPS.bostonTrips.createPieCharts = function() {	
	// var color_choice = ['#66c2a5','#fc8d62','#8da0cb', '#e78ac3'];
	var color_choice = ['#66c2a5','#f79bac','#8da0cb','#a6d854'];  		// Mary McShane's Preferred Set
	// var color_choice = ['#fbb4ae','#b3cde3','#ccebc5','#decbe4'];	// very pastel...
	// var color_choice = ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c'];	// very blue/green...
	
	if ($('#page_bottom').attr('class')==='hidden'){
		unhide('page_bottom');
	}
	
	// Attempted hack to get pie chart to show sections with "0%", even if value === 0,
	// although not fully working -- pie chart often shows "1%" even though data value is = 0.1%.
	// FYI: this will only work because the table is already rendered -- this will display 
	// the wrong data in the table if it is rendered again after calling the pie charts.
	/*
	for (var i=0; i<4; i++){
		if (CTPS.bostonTrips.myData[i].BBD_T_val === 0) {
			CTPS.bostonTrips.myData[i].BBD_T_val = +(CTPS.bostonTrips.myData[4].BBD_T_val)/1000;
		};
		if (CTPS.bostonTrips.myData[i].CEN_T_val === 0) {
			CTPS.bostonTrips.myData[i].CEN_T_val = +(CTPS.bostonTrips.myData[4].CEN_T_val)/1000;
		};
	};
	*/
	
	var pie1 = new d3pie("pieChart01", {
		// see http://d3pie.org/#docs  for documentation
		"footer": {
			"text": "To Boston Business District",
			"color": "#143987",                     
			"fontSize": 14,
			// "font": "arial bold",
			"location": "bottom-center"
		}, 
		"size": {
			"canvasHeight": 200,
			"canvasWidth": 300,
			"pieOuterRadius": 60
		},
		"data": {
			"content": [
				{
					"label": "Bus",
					"value": +(CTPS.bostonTrips.myData[0].BBD_T_val),               
					"color": color_choice[0]    // "#0066cc"
				},
				{
					"label": "Rapid Trans.",
					"value": +(CTPS.bostonTrips.myData[1].BBD_T_val),
					"color": color_choice[1]        //"#003366"
				},
				{
					"label": "Comm. Rail",
					"value": +(CTPS.bostonTrips.myData[2].BBD_T_val),
					"color": color_choice[2]        //"#336600"
				},
				{
					"label": "Ferry",
					"value": +(CTPS.bostonTrips.myData[3].BBD_T_val),
					"color": color_choice[3]        //  "#669966"
				}
			]
		},
		"labels": {
			"outer": {
				"pieDistance": 13,
				"format":    "label-percentage2"
			},
			"inner": {
				"format": "value",  //  "value" / "percentage"
				"hideWhenLessThanPercentage": 5
			},
			"mainLabel": {
				"font": "verdana",
				"color": "#7c1900"
			},
			"percentage": {
				// "color": "#e1e1e1",
				"color": "#7c1900",
				"font": "verdana",
				"decimalPlaces": 0
			},
			"value": {
				// "color": "#e1e1e1",
				"color": "#eeeeee",
				"font": "verdana"
			},
			"lines": {
				"enabled": true,
				"color": "#cccccc",
				"style": "curved"
			}
		},
		"effects": {
			"load": {
				"effect": "default", // none / default
				speed: 1000
			},
			"pullOutSegmentOnClick": {		//turned off because error on first click because "pie" not defined
				"effect": "none", //"linear",
				//"speed": 400,
				//"size": 8
			},
			"highlightSegmentOnMouseover": true,
			"highlightLuminosity": -0.5
		}  
	});
	
	var pie2 = new d3pie("pieChart02", {               
		"footer": {
			"text": "To Central Area",
			"color": "#143987",                      
			"fontSize": 14,
			// "font": "verdana bold",
			"location": "bottom-center"
		}, 
		"size": {
			"canvasHeight": 200,
			"canvasWidth": 300,
			"pieOuterRadius": 60
		},
		"data": {
			"content": [
				{
					"label": "Bus",
					"value": +(CTPS.bostonTrips.myData[0].CEN_T_val),               
					"color": color_choice[0]        
				},
				{
					"label": "Rapid Trans.",
					"value": +(CTPS.bostonTrips.myData[1].CEN_T_val),               
					"color": color_choice[1]       
				},
				{
					"label": "Comm. Rail",
					"value": +(CTPS.bostonTrips.myData[2].CEN_T_val),
					"color": color_choice[2]       
				},
				{
					"label": "Ferry",
					"value": +(CTPS.bostonTrips.myData[3].CEN_T_val),
					"color": color_choice[3]       
				}
			]
		},
		"labels": {
			"outer": {
				"pieDistance": 13,
				"format":    "label-percentage2"
			},
			"inner": {
				"format": "value",  //  "value" / "percentage"
				"hideWhenLessThanPercentage": 5
			},
			"mainLabel": {
				"font": "verdana",
				"color": "#7c1900"
			},
			"percentage": {
				// "color": "#e1e1e1",
				"color": "#7c1900",
				"font": "verdana",
				"decimalPlaces": 0
			},
			"value": {
				// "color": "#e1e1e1",
				"color": "#eeeeee",
				"font": "verdana"
			},
			"lines": {
				"enabled": true,
				"color": "#cccccc",
				"style": "curved"
			}
		},
		"effects": {
			"load": {
				"effect": "default", // none / default
				speed: 1000
			},
			"pullOutSegmentOnClick": {		//turned off because error on first click because "pie" not defined
				"effect": "none", //"linear",
				//"speed": 400,
				//"size": 8
			},
			"highlightSegmentOnMouseover": true,
			"highlightLuminosity": -0.5
		}  
	});      
}; // END 'renderToGrid' FUNCTION


/* *************** 6.  TOGGLE BETWEEN PIE CHARTS AND ACCESSIBLE TABLE  **************************************** */
CTPS.bostonTrips.accessible_table = function() {
	if ($('#pie_charts').attr('class') === 'turned_on') {
		toggle_turn_on('pie_charts');
		toggle_turn_on('transit_grid');
		$('#table_switch_text').html('To switch transit share display back to charts, click here:');
		$('#switchTable').val('Charts');
	} else {
		toggle_turn_on('pie_charts');
		toggle_turn_on('transit_grid');
		$('#table_switch_text').html('For accessible table of transit mode shares, click here:&nbsp;&nbsp;&nbsp;');
		$('#switchTable').val('Accessible Table');
	}
}; // END TOGGLE PIE CHARTS/ACCESSIBLE TABLE FUNCTION                                                                                             


/* ************  7. RESET DISPLAY AFTER COMBO BOX SELECTION CHANGES--BUT **NOT COMBO BOX ITSELF**  ****************/
/* ************      (invokes 'resetMode'--which keeps same selected district but zeroes out map and grid) *********/
CTPS.bostonTrips.resetDisplay = function() {
    //t = 1;
    //$('#displayCore').click();
    CTPS.bostonTrips.resetMode();
	CTPS.bostonTrips.oHighlightLayer.getSource().clear();	
	// CTPS.bostonTrips.map.panTo(new OpenLayers.LonLat(234000,896500));
	// CTPS.bostonTrips.map.zoomTo(2);
}; //  END 'resetDisplay' FUNCTION

/* ********************   NOTE:  resetMode can be invoked separately if only desired mode changes   *************************/
CTPS.bostonTrips.resetMode = function(){
	$('#trips_grid').html('');
    $('#transit_grid').html('');
    $('#pieChart01').html('');
    $('#pieChart02').html('');
    if ($('#pie_charts').attr('class') === 'turned_off') {
        CTPS.bostonTrips.accessible_table();
    }
	if ($('#getCorridor').prop('disabled', true)) {
        toggle_disable('getCorridor');
    }
    if ($('#legendCorr').attr('class') === 'turned_on') {
		toggle_turn_on('legendCorr');
    }
    if ($('#chart_header').attr('class') === 'unhidden') {
		unhide('chart_header');
    };      
    if ($('#page_bottom').attr('class') === 'unhidden') { //  has toggle for pie charts/accessible table
		unhide('page_bottom');
    }
}; //  END 'resetMode' FUNCTION


/* *************      8. CLEAR ALL VECTOR LAYERS AS WELL AS COMBO BOX USED TO SELECT CORRIDOR   *************/
CTPS.bostonTrips.clearSelection = function() {
	var oElt = document.getElementById("selected_corridor");
	oElt.selectedIndex = 0; 
	CTPS.bostonTrips.resetDisplay(); 
}; // END 'clearSelection' FUNCTION
