(function (w,d) {
    function encodeParam(data) {
        return Object.keys(data).map(function(key) {
            d = data[key];
            if(d.constructor === Array)
                return [encodeURIComponent(key), d.map(function(i){
                    if(i.constructor === Array)
                        return i.map(encodeURIComponent).join(',');
                    return encodeURIComponent(i);
                }).join("|")].join("=");
            return [key, data[key]].map(encodeURIComponent).join("=");
        }).join("&");
    }

    var ctx = {};
    var fn = {
        _pi: function() {
            fn['_trackUrl']('pi');
        },
        _trackUrl: function(endpoint, params) {
            var src;
            params = params || {};
            if(params) {
                var encodedParams  = encodeParam(params);
                src = "//stats.ps.stylight.net/track/fa33548538a7fa92bf1f59501cf5117d/" + endpoint + '?' + encodedParams;
            } else {
                src = "//stats.ps.stylight.net/track/fa33548538a7fa92bf1f59501cf5117d/" + endpoint;
            }
            (new Image()).src = src;
        }
    }

    var call_ref = w['StylightAnalyticsRef'] || 'sty';
    w[call_ref] = function() {
        try{
            if(arguments[0] in fn)
            {
                return fn[arguments[0]](arguments);
            }else{
                return fn['_trackUrl'](arguments[0], arguments[1]);
            }
        }
        catch(e){
            return -1;
        }
    }
    w[call_ref]( '_pi' );
 }(window, document));