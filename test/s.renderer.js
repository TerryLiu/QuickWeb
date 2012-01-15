var should = require('should');
var Service = require('../lib/Service');
var fs = require('fs');

describe('service.renderer', function () {

  var ejsrenderer = Service.import('renderer.ejs');
  var renderer = Service.import('renderer');

  // ��Ⱦ
  it('#render', function () {
    var tpl = 'Hello, <%=name%>!';
    var data = {name: 'QuickWeb'}
    renderer.render('ejs', tpl, data)
      .should.equal(ejsrenderer.render(tpl, data));
  });
  
  // ����
  it('#config', function () {
    var conf = {open: '{{', close: '}}'}
    renderer.config('ejs', conf).should.eql(ejsrenderer.config(conf));
    renderer.config('ejs').should.eql(conf);
    ejsrenderer.config(conf).should.eql(conf);
  });
  
  // ��Ⱦ
  it('#render', function () {
    var conf = {open: '{{', close: '}}'}
    renderer.config('ejs', conf);
    var tpl = 'Hello, {{=name}}';
    var data = {name: 'QuickWeb'}
    renderer.render('ejs', tpl, data)
      .should.equal(ejsrenderer.render(tpl, data));
  });
  
  // ����
  it('#compile', function () {
    var conf = {open: '{{', close: '}}'}
    renderer.config('ejs', conf);
    var tpl = 'Hello, {{=name}}';
    var data = {name: 'QuickWeb'}
    var f1 = renderer.compile('ejs', tpl);
    var f2 = ejsrenderer.compile(tpl);
    f1(data).should.equal(f2(data));
  });
  
  // �����ļ�
  it('#compileFile', function (done) {
    var conf = {open: '{{', close: '}}'}
    renderer.config('ejs', conf);
    var f = '__render.txt';
    var tpl = 'Hello, {{=name}}';
    var data = {name: 'QuickWeb'}
    fs.writeFileSync(f, tpl);
    renderer.compileFile('ejs', f, function (err, render) {
      if (err)
        throw Error();
      console.log(render(data));
      render(data).should.equal(renderer.render('ejs', tpl, data));
      done();
    });
  });
  
  // ��Ⱦ�ļ�
  it('#renderFile', function (done) {
    var conf = {open: '{{', close: '}}'}
    renderer.config('ejs', conf);
    var f = '__render.txt';
    var tpl = 'Hello, {{=name}}';
    var data = {name: 'QuickWeb'}
    fs.writeFileSync(f, tpl);
    renderer.renderFile('ejs', f, data, function (err, text) {
      if (err)
        throw Error();
      console.log(text);
      text.should.equal(renderer.render('ejs', tpl, data));
      fs.unlink(f);
      done();
    });
  });
  
});