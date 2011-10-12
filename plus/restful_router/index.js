/**
 * �����REST���·������
 *
 */
 
var router = require('./router');
var web = QuickWeb;
 
var fs = require('fs');
var path = require('path'); 

/* �����ļ��б� */
var code_file_array = [];
 
exports.init_server = function (web, server) {
	
	/** ����·�ɴ������ */
	var code_path =  web.get('code_path');
	// ���Ϊ���飬����ض��Ŀ¼
	if (code_path instanceof Array) {
		var files = [];
		code_path.forEach(function (v) {
			files = files.concat(scanCodeFiles(v));
		});
	}
	else
		var files = scanCodeFiles(code_path);
		
	loadCodeFiles(files);		// �������
	watchCodePath(code_path);	// ���Ӹ�Ŀ¼�ĸ���
	
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
			if (path.extname(v) == '.js')
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
	
	// ���ļ������뵽�����ļ����б�
	for (var i in code_file_array)
		if (code_file_array[i] == filename)
			return;
	code_file_array.push(filename);
}

/**
 * ����һ������ļ�����ע��
 *
 * @param {array} files �ļ�������
 */
var loadCodeFiles = function (files) {
	files.forEach(function (v) {
		web.log('router', 'Load code file [' + v + ']', 'debug');
		try {
			// ����ģ��
			var m = require(v);
			if (typeof m.paths != 'string')
				return;
			
			// ע�ᴦ�����
			registerCodeFile(m);
			
			// �����ļ��Ķ�
			watchCodeFile(v);
		}
		catch (err) {
			web.log('load code file', err, 'error');
		}
	});
}

/**
 * ����ָ������Ŀ¼����������ļ������Զ�����
 *
 * @param {string} code_path ����Ŀ¼
 */
var watchCodePath = function (code_path) {
	code_path = path.resolve(code_path);
	fs.unwatchFile(code_path);
	fs.watchFile(code_path, function () {
		web.log('code path changed', code_path, 'info');
		
		// ����ɨ��Ŀ¼���ļ�
		var files = scanCodeFiles(code_path);
		
		// ���ˣ�ֻ�����������ļ���
		files = subArray(files, code_file_array);
		
		// ����
		loadCodeFiles(files);
	});
}

/**
 * ���Ԫ��A�������У���ɾ����
 *
 * @param {array} arr ����
 * @param {string} v Ԫ��
 * @return {array}
 */
var delFromArray = function (arr, v) {
	for (var i in arr)
		if (arr[i] == v) {
			arr.splice(i, 1);
			break;
		}
	return arr;
}

/**
 * ����A - B
 *
 * @param {array} a ����A
 * @param {array} b ����B
 * @return {array}
 */
var subArray = function (a, b) {
	for (var i in b)
		a = delFromArray(a, b[i]);
	return a;
}
