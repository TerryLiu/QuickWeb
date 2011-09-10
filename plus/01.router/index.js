/**
 * �����REST���·������
 *
 */
 
var logger;

var router = require('./router');
 
var fs = require('fs');
var path = require('path'); 
 
exports.init_server = function (web, server, debug) {
	logger = debug;
	
	/** ����pathģ�� */
	var code_path =  web.get('code_path');
	var files = scanCodeFiles(code_path);
	files.forEach(function (v) {
		debug('Load code file [' + v + ']');
		var m = require(v);
		if (typeof m.paths != 'string')
			return;
			
		if (typeof m.get == 'function')
			router.register('get', m.paths, m.get);
		if (typeof m.post == 'function')
			router.register('post', m.paths, m.post);
		if (typeof m.delete == 'function')
			router.register('delete', m.paths, m.delete);
		if (typeof m.put == 'function')
			router.register('put', m.paths, m.put);
		if (typeof m.head == 'function')
			router.register('head', m.paths, m.head);
	});
	debug(router.handlers);
	
	/** ע������� */
	server.addListener(function (svr, req, res) {
		debug(req.method + '  ' + req.filename);
		var h = router.handler(req.method, req.filename);
		if (h) {
			req.path = h.value;
			h.handler(svr, req, res);
		}
		else {
			// ���û��ƥ��Ĵ���ģ�飬������һ������������
			svr.next();
		}
	});
}



/**
 * ɨ������ļ�
 *
 * @param {string} code_path Ŀ¼
 * @return {array}
 */
var scanCodeFiles = function (code_path) {
	var ret = [];
	try {
		var files = fs.readdirSync(code_path);
		files.forEach(function (v) {
			if (path.extname(v))
				ret.push(path.resolve(code_path, v));
		});
		return ret;
	}
	catch (err) {
		logger('Read code file error: ' + err);
		return [];
	}
}