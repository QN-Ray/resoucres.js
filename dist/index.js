(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.pageload = {})));
}(this, (function (exports) { 'use strict';

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var src = createCommonjsModule(function (module) {
/**
 * 输入一个url, 则返回之后所有的key 和对应的value 的一个集合.
 * 他只能够应对 search (?) 后的内容返回
 * @param {Object} url	当前输入的 url
 */
const getSearch = (url) => {
    let resp = {};
    url.split('?').pop().split('&').map(item => {
        let [key,val] = item.split('=');
        val !== undefined && (resp[key] = resp[key] || []) && resp[key].push(val);
    });
    Object.keys(resp).forEach(name => resp[name].length === 1 && (resp[name] = resp[name].join('')));
    return resp;
};

/**
 * 根据传入的 url , callKeys 等计算可以跳转的页面.
 * @param {String} url									传入的url.
 * @param {Object} callKeys							如有呼起需要做的操作
 * 
*/
const getRedirectPath = (url='', callKeys={}) => {
	url = url.split('&');
	let filterPath = Object.keys(callKeys).map(key=>{
		let isMatched = true;
		key.split('&').map(item=>{
			isMatched = Boolean(~url.indexOf(decodeURIComponent(item)));
		});
		return isMatched ? callKeys[key] : '';
	});

	return filterPath.pop() || '';
};



// 缓存的方式
const storageActions = {
	session(key,value){
		window.sessionStorage.setItem(key, decodeURIComponent(value));
	},
	local(key,value){
		window.localStorage.setItem(key, decodeURIComponent(value));
	}
};

// 页面跳转处理缓存
const init = (opts={}) => {
	let {
		callKeys = {} ,
		cacheMap = {} ,
		onRedirect = ()=>{},
		curUrl = location.href ,
		hash = location.hash,
	} = opts;

	let search = getSearch(hash);

	// 缓存
	Object.keys(cacheMap).forEach(name =>{
		let opts = cacheMap[name];
		if( typeof opts === 'string') opts = {rename : opts};

		opts = Object.assign({storage:'session'} , opts);

		if(!search[name]) return console.error('[error]:pageload cache error ' , name );

		typeof opts.storage === 'function' ? 
		opts.storage(rename || name , search[name]) :
		storageActions[opts.storage](rename || name , search[name]);
	});

	let redirect = getRedirectPath(curUrl,callKeys) || callKeys['*'];

	if(redirect){
		redirect = redirect.replace(/\{(\S+)\}/g , (a , param) => search[param]);
		onRedirect && onRedirect();
		return location.href = redirect;
	}
};

module.exports = {
	init,
	getSearch,
	getRedirectPath
};
});

var src_1 = src.init;
var src_2 = src.getSearch;
var src_3 = src.getRedirectPath;

exports['default'] = src;
exports.init = src_1;
exports.getSearch = src_2;
exports.getRedirectPath = src_3;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
