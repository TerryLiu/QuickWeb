/**
 * QuickWeb renderer with Ejs
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.2.0
 */
 
var ejs = require('ejs');
var fs = require('fs');

/** ģ�建�� */
exports.cache = {}

/**
 * ��Ⱦ�ļ�
 *
 * @param {string} tpl ģ������
 * @param {object} view ����
 * @param {object} options ѡ��
 * @return {string}
 */
exports.render = function (tpl, view, options) {
	// ���û�������ļ�������ֱ�ӱ��벢����
	if (!options || options.filename)
		return ejs.compile(tpl)(view);
		
	// ����������ļ����������Ƿ��л���
	var fn = exports.cache[options.filename];
	if (typeof fn == 'function')
		return fn(view);
		
	// �����û�л��棬���ȱ��룬�����棬�ٷ�����Ⱦ���
	var fn = ejs.compile(tpl);
	fs.watchFile(options.filename, function () {
		delete exports.cache[options.filename];
	});
	return fn(view);
}
