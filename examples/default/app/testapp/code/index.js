/**
 * 测试APP
 */
 
exports.paths = '/testapp';

exports.get = function (server, request, response) {
	response.redirect('/testapp/');
}