var Argent = (function() {

    var state = {
        connected: false
    };

    var activeHrefs = {
        getAll: function() {
            var all = localStorage.getItem('activeHrefs');
            if (all) {
                return JSON.parse(all);
            } else {
                return [];
            }
        },
        add: function(href) {
            var all = this.getAll();
            all.push(href);
            localStorage.setItem('activeHrefs', 
                JSON.stringify(all)
            );
        },
        remove: function(href) {
            var all = this.getAll();
            var index = all.indexOf(href);
            while (-1 !== index) {
                all.splice(index, 1);
                index = all.indexOf(href);
            }
            localStorage.setItem('activeHrefs', 
                JSON.stringify(all)
            );
        },
        isActive: function(href) {
            var all = this.getAll();
            if (-1 !== all.indexOf(href)) {
                return true;
            } else {
                return false;
            }
        },
        toggleHref: function(url) {
            if (!activeHrefs.isActive(url)) {
                activeHrefs.add(url);
            } else {
                activeHrefs.remove(url);
            }
        }
    }

    var getIconName = function (state, tab_url) {
        var name;
        var activity = activeHrefs.isActive(tab_url);

        if (true === state.connected) {
            if (true === activity) {
                name = 'active';
            } else {
                name = 'connected';
            }
        } else {
            if (true === activity) {
                name = 'inactive';
            } else {
                name = 'disconnected';
            }        
        }

        return 'shared/media/' + name + '.png';
    }

    var updateUI = function() {
        Native.setIcon(state, getIconName);
    }

    function connect(settings) {
        try {
            var host = 'ws://' + settings.host + ':' + settings.port;
            var socket = new WebSocket(host);

            socket.onopen = function() {
                state.connected = true;
                updateUI();
            }

            socket.onmessage = function(msg) {
                var data = JSON.parse(msg.data);
                if (data.hasOwnProperty('refresh') && true === data.refresh) {
                    Native.refresh(activeHrefs);
                }
            }
            
            socket.onclose = function() {
                setTimeout(function() {
                    var last_state_connected = state.connected;
                    state.connected = false;
                    if (true === last_state_connected) {
                        updateUI();
                    }
                    connect(settings);
                }, 1000);
            }

        } catch(e) {
            console.error(e);
        }
    }

    function getSettings() {
        var settings = localStorage.getItem('settings');
        if (!settings) {
            settings = JSON.stringify({
                host: 'localhost',
                port: '1988'
            });
            localStorage.setItem('settings', settings);
        }
        return JSON.parse(settings);
    }

    function init() {
        Native.initListeners(activeHrefs, updateUI);
        connect(getSettings());
    }

    return {
        init: init
    }

})();

Argent.init();
