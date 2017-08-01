/**
 * 
 * 输入一个url, 则返回之后所有的key 和对应的value 的一个集合.
 * 他只能够应对 search (?) 后的内容返回
 * @param {Object} url									当前输入的 url
 */
export getSearch = (url) => {
    var str_search = url.slice(url.indexOf('?') !== -1 ? url.indexOf('?') + 1 : 0, url.length);
    var re = {};
    var i = 0;
    var arr_search = str_search.split('&');
    var ni = arr_search.length;
    var it;
    var key;
    var val;
    for (; i < ni; i++) {
        it = arr_search[i].split('=');
        if (it.length === 0) {
            continue;
        }
        key = it[0];
        val = it[1];
        if (!re[key] && val !== '') {
            re[key] =val;
            continue;
        }
        if (re[key]) {
            re[key] += ',' + val;
        }
    }
    return re;
}

/**
	 * 
	 * 	中间用::来间隔, 最后一位是用于存储的字段名, 如 userid::userid , 第一个userid 表示从search 里拿的值, 而第二个userid 则表示我们需要存入到session里的key.
	 *  按用户需要匹配的字段保存相应的内容进去.
	 * @param {Object} searchs							url 里获得的搜索内容的对象.
	 * @param {Array} local_data_keys					用户需要匹配的内容
	 */
export saveSearchData = (searchs, local_data_keys=[]) => {
    if (!searchs || !local_data_keys.length) return;
    
    return true;
}