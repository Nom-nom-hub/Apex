"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.json = json;
exports.redirect = redirect;
function json(data, init = {}) {
    return {
        status: init.status || 200,
        headers: {
            'Content-Type': 'application/json',
            ...init.headers
        },
        body: JSON.stringify(data)
    };
}
function redirect(url, init = {}) {
    return {
        status: init.status || 302,
        headers: {
            Location: url,
            ...init.headers
        },
        body: ''
    };
}
