const IsOldIE = !!node.attachEvent;
/**
 *
 * 获得需要创建的节点的类别
 * @param {String} resource	输入的url 地址
 */
const getType = (resource) =>{
    if (/\.css/.test(resource)) return 'css';
    if (/\.js/.test(resource)) return 'js';
    return '';
};

// 将 head 保存在临时对象里, 不重复拿取.
const DOC_HEAD = document.getElementsByTagName('head')[0] || document.documentElement;

const bindOnLoad = (node,time) => {
    return new Promise(function(resolve,reject){
        if(time){
            setTimeout(()=>{
                reject(new Error('time out'));
            },time);
        }
        if (IsOldIE) {
            node.onreadystatechange = function () {
                if (this.readyState === 'loaded' || this.readyState === 'complete') {
                    resolve();
                }
            }
        } else {
            node.onload = () => {resolve()};
        }
        node.onerror = evt => {
            reject(new Error('script error', `Script error for:${evt.currentTarget || evt.srcElement}`));
        };
    });
}
/**
 *
 * 创建一个link 或者 script 标签
 * @param {String} resource 资源的地址
 * @param {String} type 资源的类型
 */
const createNode = (resource, type) => {
    let node;
    if (type === 'css') {
        node = document.createElement('link');
        node.href = resource + '';
        node.type = 'text/css';
        node.rel = "stylesheet";
    }

    if (type === 'js') {
        node = document.createElement('script');
        node.type = 'text/javascript';
        node.charset = 'utf-8';
        node.src = resource;
        // 设置可以跨域
        node.crossorigin = 'crossorigin';
    }
    return node;
}

export default require = (resource,timeout= 0) => {
    // 这里暂时只考虑 webkit 为主的浏览器操作. 所以事件使用 onload. 另外我们约定目前的资源后缀必须是原后缀, 如 css || js
    const type = getType(resource);
    if(!type) throw new Error(`资源路径不对:${resource}`);

    let node = createNode(resource, type);
    DOC_HEAD.appendChild(node);

    return bindOnLoad(node , timeout * 1000);
};