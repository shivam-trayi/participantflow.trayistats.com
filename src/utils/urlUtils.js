export function getUrlVars() {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

export function getUrlParam(parameter, defaultvalue) {
    var urlparameter = defaultvalue;
    if (window.location.href.indexOf(parameter) > -1) {
        var parsed = getUrlVars()[parameter];
        urlparameter = parsed !== undefined ? parsed : defaultvalue;
    }
    return urlparameter || defaultvalue;
}
