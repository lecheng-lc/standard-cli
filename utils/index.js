const varType = Object.prototype.toString;
export function dumpObject(obj) {
    var buff, prop;
    buff = [];
    for (prop in obj) {
        buff.push(dumpToString("key", prop) + ': ' + dumpToString("value", obj[prop]));
    }
    return '{' + buff.join(',') + '}';
}
function dumpArray(arr) {
    var buff, i, len;
    buff = [];
    for (i = 0, len = arr.length; i < len; i++) {
        buff.push(dumpToString('value', arr[i]));
    }
    return '[' + buff.join(',') + ']';
}
function dumpToString(type, obj) {
    if (varType.call(obj) == '[object Function]') {
        return obj.toString();
    }
    else if (varType.call(obj) == '[object Array]') {
        return dumpArray(obj);
    }
    else if (varType.call(obj) == '[object String]') {
        if (type === 'key') {
            return obj.replace('"', '\\"');
        }
        return '"' + obj.replace('"', '\\"') + '"';
    }
    else if (varType.call(obj) == '[object RegExp]') {
        return obj;
    }
    else if (obj === Object(obj)) {
        return dumpObject(obj);
    }
    return obj.toString();
}
