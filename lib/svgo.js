'use strict';

/**
 * SVGO is a Nodejs-based tool for optimizing SVG vector graphics files.
 *
 * @see https://github.com/svg/svgo
 *
 * @author Kir Belevich <kir@soulshine.in> (https://github.com/deepsweet)
 * @copyright © 2012 Kir Belevich
 * @license MIT https://raw.githubusercontent.com/svg/svgo/master/LICENSE
 */

var CONFIG = require('./svgo/config'),
    SVG2JS = require('./svgo/svg2js'),
    SVG2JSSYNC = require('./svgo/svg2jsSync'),
    PLUGINS = require('./svgo/plugins'),
    JSAPI = require('./svgo/jsAPI.js'),
    JS2SVG = require('./svgo/js2svg');

var SVGO = module.exports = function(config) {

    this.config = CONFIG(config);

};

SVGO.prototype.optimize = function(svgstr, callback) {

    var _this = this,
        config = this.config,
        maxPassCount = config.multipass ? 10 : 1,
        counter = 0,
        prevResultSize = Number.POSITIVE_INFINITY,
        optimizeOnceCallback = function(svgjs) {

            if (svgjs.error) {
                callback(svgjs);
                return;
            }

            if (++counter < maxPassCount && svgjs.data.length < prevResultSize) {
                prevResultSize = svgjs.data.length;
                _this._optimizeOnce(svgjs.data, optimizeOnceCallback);
            } else {
                callback(svgjs);
            }

        };

    _this._optimizeOnce(svgstr, optimizeOnceCallback);

};

SVGO.prototype._optimizeOnce = function(svgstr, callback) {

    var config = this.config;

    SVG2JS(svgstr, function(svgjs) {

        if (svgjs.error) {
            callback(svgjs);
            return;
        }

        svgjs = PLUGINS(svgjs, config.plugins);

        callback(JS2SVG(svgjs, config.js2svg));

    });

};

SVGO.prototype.optimizeSync = function(svgstr) {

    var _this = this,
        config = this.config,
        maxPassCount = config.multipass ? 10 : 1,
        counter = 0,
        svgjs,
        prevResultSize = Number.POSITIVE_INFINITY;

    svgjs = _this._optimizeOnceSync(svgstr);

    while (++counter < maxPassCount && svgjs.data.length < prevResultSize) {

        if (svgjs.error) break;
        prevResultSize = svgjs.data.length;
        svgjs = _this._optimizeOnceSync(svgjs.data);

    }

    return svgjs;
};

SVGO.prototype._optimizeOnceSync = function(svgstr) {

    var config = this.config;

    var svgjs = SVG2JSSYNC(svgstr);
    if (svgjs.error) {
        return svgjs;
    }
    svgjs = PLUGINS(svgjs, config.plugins);

    return JS2SVG(svgjs, config.js2svg);

};



/**
 * The factory that creates a content item with the helper methods.
 *
 * @param {Object} data which passed to jsAPI constructor
 * @returns {JSAPI} content item
 */
SVGO.prototype.createContentItem = function(data) {

    return new JSAPI(data);

};
