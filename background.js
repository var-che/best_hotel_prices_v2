(function() {
    console.log('bg')
    const tabStorage = {};
    const networkFilters = {
        urls: [
            "*://developer.mozilla.org/*",
            "*://www.booking.com/*"
        ]
    };

    chrome.webRequest.onBeforeRequest.addListener((details) => {
        const { tabId, requestId } = details;
        if (!tabStorage.hasOwnProperty(tabId)) {
            return;
        }

        tabStorage[tabId].requests[requestId] = {
            requestId: requestId,
            url: details.url,
            startTime: details.timeStamp,
            status: 'pending'
        };
        console.log(tabStorage[tabId].requests[requestId]);
    }, networkFilters);


    chrome.webRequest.onCompleted.addListener((details) => {
        const { tabId, requestId } = details;
        if (!tabStorage.hasOwnProperty(tabId) || !tabStorage[tabId].requests.hasOwnProperty(requestId)) {
            return;
        }

        const request = tabStorage[tabId].requests[requestId];

        Object.assign(request, {
            endTime: details.timeStamp,
            requestDuration: details.timeStamp - request.startTime,
            status: 'complete'
        });
        console.log(tabStorage[tabId].requests[details.requestId]);

        request_object = tabStorage[tabId].requests[details.requestId];

        includes_string = "https://www.booking.com/searchresults.html";

        result = request_object['url'].includes(includes_string)

        // console.log(request_object['url'], result)

        if(result){
            console.log('Sending to run content cop.');
            
            chrome.tabs.executeScript({
                file: 'content_bg.js'
            });
        }

        

    }, networkFilters);


    chrome.webRequest.onErrorOccurred.addListener((details)=> {
        const { tabId, requestId } = details;
        if (!tabStorage.hasOwnProperty(tabId) || !tabStorage[tabId].requests.hasOwnProperty(requestId)) {
            return;
        }

        const request = tabStorage[tabId].requests[requestId];
        Object.assign(request, {
            endTime: details.timeStamp,           
            status: 'error',
        });
        console.log(tabStorage[tabId].requests[requestId]);
    }, networkFilters);

    chrome.tabs.onActivated.addListener((tab) => {
        const tabId = tab ? tab.tabId : chrome.tabs.TAB_ID_NONE;
        if (!tabStorage.hasOwnProperty(tabId)) {
            tabStorage[tabId] = {
                id: tabId,
                requests: {},
                registerTime: new Date().getTime()
            };
        }
    });

    chrome.tabs.onRemoved.addListener((tab) => {
        const tabId = tab.tabId;
        if (!tabStorage.hasOwnProperty(tabId)) {
            return;
        }
        tabStorage[tabId] = null;
    });

    /* the listening mechanism from content script */
    
    var data;
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
            if (request.greeting1){

                data = request.greeting1;
                // chrome.tabs.create({"url": 'pages/activitiy-details.html'});
                    sendResponse({
                        farewell: "goodbye"
                    });

                chrome.tabs.create({
                    "url": chrome.extension.getURL('pages/hotel-details.html')
                }, function (tab1) {

                    chrome.tabs.sendMessage(tab1.id, {
                        "action": "setBackground"
                    });
                });
            } else if(request.greeting === "yo"){
                sendResponse({fag: data})
            }
        });
}());