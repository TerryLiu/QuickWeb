/**
 * �����REST���·������
 *
 */
 
var router = require('./router');
var web = require('../../core/web');
 
var fs = require('fs');
var path = require('path'); 
 
exports.init_server = function (web, server) {
	
	/** ����pathģ�� */
	var code_path =  web.get('code_path');
	var files = scanCodeFiles(code_path);
	files.forEach(function (v) {
		web.log('router', 'Load code file [' + v + ']', 'debug');
		var m = require(v);
		if (typeof m.paths != 'string')
			return;
		
		// ע�ᴦ�����
		registerCodeFile(m);
		
		// �����ļ��Ķ�
		watchCodeFile(v);
	});
	
	
	/** ע������� */
	server.addListener(function (svr, req, res) {
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
		web.log('router', 'read code file error: ' + err, 'error');
		return [];
	}
}

/**
 * ע������ļ�
 *
 * @param {object} m ģ��
 */
var registerCodeFile = function (m) {
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
}

/**
 * ������ע��ĳ����ļ������޸��Զ���������
 *
 * @param {string} filename �ļ���
 */
var watchCodeFile = function (filename) {
	fs.unwatchFile(filename);
	fs.watchFile(filename, function () {
		try {
			// ɾ��֮ǰ�Ļ���
			if (filename in require.cache)
				delete require.cache[filename];
			// ��������ģ��
			var m = require(filename);
			web.log('reload code file', filename, 'info');
			// ע��
			if (typeof m.paths != 'string')
				return;
			registerCodeFile(m);
			watchCodeFile(filename);
		}
		catch (err) {
			web.log('reload code file', err, 'error');
		}
	});
}