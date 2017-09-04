const assert = require('assert');

const {
    init,
    getSearch,
    getRedirectPath
} = require('../src/index');

describe('pageload', function () {
    describe('#getSearch', function () {
        it('parse query success', function () {
            let query = getSearch('?a=1&a=2&b=3');
            assert.deepEqual(query, {
                a: ['1', '2'],
                b: '3'
            });
        });
    });

    describe('#getRedirectPath', function () {
        it('should return /index/?a={b} when the path is ?a=1&a=2&b=3', function () {
            let url = getRedirectPath('?a=1&a=2&b=3',{'a=1':'/index/?a={b}'});
            assert.equal(url,'/index/?a={b}');
        });
    });
});