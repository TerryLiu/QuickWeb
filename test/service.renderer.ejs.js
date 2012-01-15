var should = require('should');
var Service = require('../lib/Service');
var ejs = require('ejs');

describe('service.renderer.ejs', function () {

  var renderer = Service.import('renderer.ejs');

  // ��Ⱦ
  it('#render', function () {
    var tpl = 'Hello, <%=name%>!';
    var data = {name: 'QuickWeb'}
    renderer.render(tpl, data).should.equal(ejs.render(tpl, data));
  });
  
  // ���ñ�����
  it('#config', function () {
    var conf = {open: '{{', close: '}}'}
    // ����
    renderer.config(conf).should.eql(conf);
    // ��ȡ����
    renderer.config().should.eql(conf);
    // ��Ⱦ
    var tpl = 'Hello, {{name}}';
    var data = {name: 'QuickWeb'}
    ejs.render(tpl, {open: conf.open, close: conf.close, name: data.name})
      .should.equal(renderer.render(tpl, data));
  });
  
  // ����
  it('#compile', function () {
    var tpl = 'Hello, {{name}}';
    var data = {name: 'QuickWeb'}
    var conf = {open: '{{', close: '}}'}
    renderer.config(conf);
    var f1 = ejs.compile(tpl, conf);
    var f2 = renderer.compile(tpl);
    f1(data).should.equal(f2(data));
  });
  
});