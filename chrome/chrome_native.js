var Native = (function() {

    function setIcon(state, getIconNameCallback) {

        // we need to set the icon globally first, 
        // to avoid blinking to default icon
        chrome.windows.getLastFocused(null, function(window) {
            chrome.tabs.getSelected(null, function(tab) {
                chrome.browserAction.setIcon({
                    'path': getIconNameCallback(state, tab.url)
                });
            });
        });

        // then we must set the icon for each tab,
        // without that the extension wont behave
        // properly with multiple windows
        chrome.tabs.query({}, function(tabs) {
            for (var i = 0; i < tabs.length; i++) {
                chrome.browserAction.setIcon({
                    'path': getIconNameCallback(state, tabs[i].url), 
                    'tabId': tabs[i].id
                });
            }
        });

    }

    function refresh(activeHrefs) {
        chrome.tabs.query({}, function(tabs) {
            for (var i = 0; i < tabs.length; i++) {
                if (activeHrefs.isActive(tabs[i].url)) {
                    chrome.tabs.reload(tabs[i].id);
                }
            }
        });
    }

    function clickHandler(activeHrefs, updateUI) {
        chrome.windows.getLastFocused(null, function(window) {
            chrome.tabs.getSelected(null, function(tab) {
                activeHrefs.toggleHref(tab.url);
                updateUI();
            });
        });
    }

    function initListeners(activeHrefs, updateUI) {
        chrome.browserAction.onClicked.addListener(function() {
            clickHandler(activeHrefs, updateUI);
        });
        chrome.tabs.onActivated.addListener(updateUI);
        chrome.tabs.onUpdated.addListener(updateUI);
        chrome.tabs.onCreated.addListener(updateUI);
    }

    return {
        setIcon: setIcon,
        refresh: refresh,
        initListeners: initListeners
    }

})();
