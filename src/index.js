import require from './load';
import _ from './util';

/**
 * 
 * 提供一整套的包括加载完成操作等等处理模式.
 * @param {Object}      opts
 * @param {String}		opts.default_url     '#/index/' 提供完整的
 * @parm {Function}	opts.before_load     Function(next); 提供下一步的工作, 可以为空, 也可以是甄别
 * @param {Function}	opts.on_load         Function(next); 当读取时的操作
 * @param {Object}		opts.call_keys       {}	被哪些词呼起会起反应.
 *                                              {
 *                                                  'key': 'url'    //url 里可以包含相应的key 值.  'key' 的值为 'a=2&b=2&c=3' ...
 *                                              }
 * @param {Array}		opts.local_data_keys []	需要获得的一些关键字，表达方式为 'search_user::local_user' 
 * @param {Array}		opts.resources       [],      需要加载的资源列表
 * 											 加载列表有直接的path, 如 ['./a/b/a.js', 'b.js'], 也有带有依赖关系的
 * 												[
 * 													{
 * 														depend: [],
 * 														path: ''
 * 													}
 * 												],
 * 												    暂时不提供指向性不明的 css/js (即没有js/css 后缀的)
 * @param {Function}	opts.complete Function()    当模板加载都完成时
 * @param {Number}		opts.timeout  Number        单位 s, 是否超时之后提醒
 * @param {Function}	opts.func_timeout Function	超时之后的操作流程.
 * 		
 */
let timeoutHandler;
const init = (opts={}) => {
	let {
		timeout, 
		defaultUrl,
		callKeys,
		onRedirect=()=>{},
		curUrl = location.href ,
		hash = location.hash,
		local_data_keys = []
	} = opts;

	if (!defaultUrl) return;

	let search = _.getSearch(hash);

	// 缓存
	local_data_keys.map(item => {
		let [key, value] = item.split('::');
		search[key] && window.sessionStorage && window.sessionStorage.setItem(value, decodeURIComponent(search[key]));
	});

	let redirect = getRedirectPath(curUrl,callKeys);
	if(redirect){
		onRedirect && onRedirect();
		return location.href = redirect;
	} 
	
	// 将延时限定在一个范围内. 但是延时内自己的规则自己处理

	if (!!timeout && funcTimeout && /^\d+$/.test(timeout) && !timeoutHandler) {
		timeoutHandler = setTimeout(() => { funcTimeout();} , timeout * 1000);
	}
	
	// 我们将进一步的减少跳转次数，以方便我们更合适的处理业务流程
	this._afterHashchange(opts);
}

/**
	 * 根据传入的 url , callKeys 等计算可以跳转的页面.
	 * @param {String} url									传入的url.
	 * @param {Object} callKeys							如有呼起需要做的操作
	 * 
	 */
const getRedirectPath = (url='', callKeys={}) => {
	let filterPath = Object.keys(callKeys).map(key=>{
		let isMatched = true;
		key.split('&').map(item=>{
			isMatched = Boolean(~url.indexOf(decodeURIComponent(item));
		});
		return isMatched ? callKeys[key] : '';
	});

	return filterPath[filterPath.length - 1 ] || '';
};