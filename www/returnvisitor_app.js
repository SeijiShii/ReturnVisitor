/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

'use strict';

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.app = (function() {

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        viewComponents = returnvisitor.viewComponents,
        common = returnvisitor.common,
        loadFile = common.loadFile,
        adFrame,
        appFrame,
        mapFrame,
        controlFrame,
        AD_FRAME_HEIGHT = 50,
        WIDTH_BREAK_POINT = 500,
        HEIGHT_BREAK_POINT = 250,
        CONTROL_CLOSED_WIDTH = 120,     /** Control frame width of closed state in wide screen mode*/
        CONTROL_OPEN_WIDTH = 300,       /** Control frame width of open state in wide screen mode */
        CONTROL_CLOSED_HEIGHT = 50,     /** Control frame height of closed state in narrow portrait mode */
        CONTROL_OPEN_HEIGT = 350,       /** Control frame height of open state in narrow portrait mode */

        mapPane,
        recordVisitPane;
    
    function initFrames() {
        appFrame        = document.getElementById('app_frame');
        mapFrame        = document.getElementById('map_frame');
        controlFrame    = document.getElementById('control_frame');
        adFrame         = document.getElementById('ad_frame');
    }

    function resizeAppFrame() {

        appFrame.style.height = (window.innerHeight - AD_FRAME_HEIGHT) + 'px';
    }

    function resizeMapFrame() {

        var $mapFrame = $(mapFrame);

        if (isWideScreen()) {

            $mapFrame.css({
                top : 0,
                left : CONTROL_CLOSED_WIDTH,
                height : '100%',
                width : window.innerWidth - CONTROL_CLOSED_WIDTH,
                float : 'right'
            });

        } else {

            $mapFrame.css({
                top : 0,
                left : 0,
                height : appFrame.clientHeight - CONTROL_CLOSED_HEIGHT,
                width : '100%'
            });

        }
    }

    function resizeControlFrame() {

        var $cFrame = $(controlFrame);

        if (isWideScreen()) {

            $cFrame.css({
                top : 0,
                left : 0,
                height : '100%',
                width : CONTROL_CLOSED_WIDTH,
                float : 'left'
            });

        } else {

            $cFrame.css({
                top : appFrame.clientHeight - CONTROL_CLOSED_HEIGHT,
                left : 0,
                height : CONTROL_CLOSED_HEIGHT,
                width : '100%'
            });
        }
    }
    
    function onDeviceReady() {
        // console.log('onDeviceReady called!');

        initFrames();

        resizeAppFrame();
        resizeMapFrame();
        resizeControlFrame();

        loadMapPaneFiles();
        
    }
    
    function onResizeScreen() {
        cordova.fireDocumentEvent('plugin_touch', {});
    
        if (cordova.platform === 'browser') {
            // ブラウザでは連続的に呼ばれるので
            if (resizeTimer !== false) {
                clearTimeout(resizeTimer);
            }

            var resizeTimer = setTimeout(refreshScreenElements, 200);

        } else {
            refreshScreenElements();
        }
    }
    
    function refreshScreenElements() {

        resizeAppFrame();
        resizeMapFrame();
        resizeControlFrame();

    }

    function isWideScreen() {
        return window.innerWidth > WIDTH_BREAK_POINT;
    }

    function loadMapPaneFiles() {

        loadFile.loadScript('./view_components/map_pane/map_pane.js', function(){

            mapPane = viewComponents.mapPane;
            mapPane.initialize(mapFrame);
            
            mapPane.onMapLongClick = function(latLng) {

            };

            mapPane.onClickMarker = function(place) {

            };

        });
    }

    // function loadRecordVisitPageFiles(options, postFadeInCallback) {
    //     loadFile.loadCss('./record_visit_page/record_visit_page.css');
    //     loadFile.appendHtmlToAppFrame('./record_visit_page/record_visit_page.html', function() {
    //         loadFile.loadScript('./record_visit_page/record_visit_page.js', function() {
    //             recordVisitPage = returnvisitor.recordVisitPage;
    //             recordVisitPage.initialize(options, postFadeInCallback);
    //             recordVisitPage.onOkClicked = function(_place) {
    //                 mapPage.onFinishEditVisit(_place);
    //             };
    //             recordVisitPage.beforeFadeOutPage = function() {
    //                 mapPage.hideFrame(false);
    //             };
    //         });
    //     }, 0);
    // }

    // function onNewPlaceVisit(latLng) {

    //     var options = {
    //         method: 'NEW_PLACE_VISIT',
    //         latLng: {
    //             lat: latLng.lat,
    //             lng: latLng.lng
    //         }
    //     };

    //     var postFadeInRVPage = function() {
    //         mapPage.hideFrame(true);
    //     };

    //     if (recordVisitPage) {
    //         recordVisitPage.initialize(options, postFadeInRVPage);
    //     } else {
    //         loadRecordVisitPageFiles(options, postFadeInRVPage);
    //     }
    // }

    //test
    // function testPersonDialog() {
    //     loadFile.loadScript('./dialogs/dialog_base/dialog_base.js', function(){
    //         loadPersonDialogScript();
    //     });
    // }

    // function loadPersonDialogScript() {
    //     loadFile.loadScript('./dialogs/person_dialog/person_dialog.js', function(){
    //         var newPersonDialog = new returnvisitor.PersonDialog();
    //     });
    // }


    document.addEventListener('deviceready', onDeviceReady, false);
    window.addEventListener('resize', onResizeScreen);

   
}());


