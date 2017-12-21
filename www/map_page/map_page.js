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

// 171220 DONE 現在位置の保存と読み出し機能を追加する。
// 171221 DONE refreshAdFrame() adFrameの位置更新メソッドを追加
// 171221 TODO オーバレイとドロワーを追加する。
//          DONE オーバレイをまず実装する。
//          TODO 次いでドロワーを実装する。

var returnvisitor = RETURNVISITOR_APP.namespace('work.c_kogyo.returnvisitor'); 
// var mapPage = RETURNVISITOR_APP.namespace('work.c_kogyo.returnvisitor.mapPage');
returnvisitor.mapPage = function() {

    var _this = this,
        adFrame,
        appFrame,
        mapDiv,
        map,
        logoButton,
        drawerOverlay,
        isDrawerOverlayShowing = false,
        drawer,
        isDrawerOpen = false,
        AD_FRAME_HEIGHT = 50,
        WIDTH_BREAK_POINT = 500,
        DRAWER_WIDTH = 240,
        LATITUDE = 'latitude',
        LONGTUDE = 'longitude',
        CAMERA_ZOOM = 'camera_zoom';

    this.initialize = function() {

        console.log('mapPage.initialize called!');
    
        appFrame = document.getElementById('app_frame');
    
        document.addEventListener('deviceready', _this.onDeviceReady, false);
    
        window.addEventListener('resize', _this.onResizeScreen);
    }
    
    this.onDeviceReady = function() {
        console.log('onDeviceReady called!');
    
        _this.initAdFrame();
        _this.refreshAdFrame();

        _this.refreshAppFrame();
        _this.initGoogleMap();
        _this.initLogoButton();

        _this.initDrawerOverlay();
        _this.initDrawer();
    }
    
    this.onResizeScreen = function() {
        console.log('onResiseScreen called!');
        cordova.fireDocumentEvent('plugin_touch', {});
    
        if (resizeTimer !== false) {
            clearTimeout(resizeTimer);
        }
        var resizeTimer = setTimeout(function () {
            console.log('Window resized!');
            _this.refreshAppFrame();
            _this.refreshAdFrame();
        }, 200);
    }
    
    this.refreshAppFrame = function() {
        // console.log('window.innerHeight: ' + window.innerHeight);
        appFrame.style.height = (window.innerHeight - AD_FRAME_HEIGHT) + 'px';
      
        console.log('appFrame.style.height: ' + appFrame.style.height);
        
    }
    
    this.initGoogleMap = function() {
    
        mapDiv = document.getElementById('map_div');

        var position = this.loadCameraPosition();

        var options = {
            'mapType': plugin.google.maps.MapTypeId.HYBRID,
            'controls': {
                'compass': true,
                'zoom': true,
                'myLocationButton': true
            },
            'preferences': {
                'padding': {
                    top: 50
                }
            }, 
            'camera': {
                'target': {
                    lat: 0,
                    lng: 0
                },
                'zoom': 4
            }
        };

        if (position) {
            options['camera'] = {
                'target' : {
                    lat: position.target.lat,
                    lng: position.target.lng
                },
                'zoom' : position.zoom
            }
        }
    
        map = plugin.google.maps.Map.getMap(mapDiv, options);
        map.on(plugin.google.maps.event.CAMERA_MOVE_END, function() {
            // console.log('Camera move ended.')
            var cameraPosition = map.getCameraPosition();
            // console.log(JSON.stringify(cameraPosition.target));
            _this.saveCameraPosition(cameraPosition);
        });
    }
    
    this.saveCameraPosition = function (position) {
        var storage = window.localStorage;
        storage.setItem(LATITUDE, position.target.lat);
        storage.setItem(LONGTUDE, position.target.lng);
        storage.setItem(CAMERA_ZOOM, position.zoom);
    };

    this.loadCameraPosition = function () {
        var storage = window.localStorage;
        var lat = storage.getItem(LATITUDE);
        if (!lat) {
            return null;
        }
        var lng = storage.getItem(LONGTUDE);
        if (!lng) {
            return null;
        }
        var zoom = storage.getItem(CAMERA_ZOOM);
        if (!zoom) {
            return null;
        }
        return {
            target: {
                lat: lat,
                lng: lng
            },
            zoom: zoom
        };
    };

    this.initLogoButton = function () {
        console.log('initLogoButton called!')
        logoButton = document.getElementById('logo-button');
        logoButton.addEventListener('click', function(){
            // console.log('Logo button clicked!');
            _this.switchDrawerOverlay(true);
            _this.switchDrawer(true);
        });
    };

    this.initAdFrame = function() {
        adFrame = document.getElementById('ad_frame');
    }

    this.refreshAdFrame = function() {
        adFrame.style.top = (window.innerHeight - AD_FRAME_HEIGHT) + 'px';
    }

    this.initDrawerOverlay = function() {
        drawerOverlay = document.getElementById('drawer_overlay');
        drawerOverlay.addEventListener('click', function(){
            _this.refreshDrawerOverlay(false, true);
            _this.openCloseDrawer(false, true);
        });
        _this.refreshDrawerOverlay(false, false);
    }

    this.refreshDrawerOverlay = function(fadeIn, animated) {

        console.log('refreshDrawerOverlay called! fadeIn: ' + fadeIn + ', animated: ' + animated);

        if (animated) {
            if (fadeIn) {
                drawerOverlay.style.width = '100%';
                $(drawerOverlay).fadeTo('slow', 1);
                isDrawerOverlayShowing = true;
            } else {
                $(drawerOverlay).fadeTo('slow', 0, function(){
                    drawerOverlay.style.width = 0;
                    isDrawerOverlayShowing = false;    
                });
            }
        } else {
            if (fadeIn) {
                drawerOverlay.style.width = '100%';
                drawerOverlay.style.opacity = 1;
                isDrawerOverlayShowing = true;
            } else {
                drawerOverlay.style.opacity = 0;
                drawerOverlay.style.width = 0;
                isDrawerOverlayShowing = false;
            }
        }
    } 

    this.switchDrawerOverlay = function(animated) {

        // console.log('switchDrawerOverlay called!')

        _this.refreshDrawerOverlay(!isDrawerOverlayShowing, animated);
    }

    this.initDrawer = function() {
        drawer = document.getElementById('drawer');
        _this.openCloseDrawer(false, false);
    }

    this.openCloseDrawer = function(open, animated) {
        if (animated) {
            if (open) {
                $(drawer).animate({'left' : '0px'}, 'slow');
            } else {
                $(drawer).animate({'left' : '-' + DRAWER_WIDTH + 'px'}, 'slow');
            }

        } else {
            if (open) {
                drawer.style.left = 0;
            } else {
                drawer.style.left = '-' + DRAWER_WIDTH + 'px';
            }
        }

        isDrawerOpen = open;
    }

    this.switchDrawer = function(animated) {
        _this.openCloseDrawer(!isDrawerOpen, animated);
    }

}

new returnvisitor.mapPage().initialize();