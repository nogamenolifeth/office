/**
 * Javascript Libraly for Ajax Front-end and Back-end
 *
 * @filesource js/common.js
 * @link http://www.kotchasan.com/
 * @copyright 2016 Goragod.com
 * @license http://www.kotchasan.com/license/
 */
var loader, modal = null;
function send(target, query, callback, wait, c) {
  var req = new GAjax();
  req.initLoading(wait || 'wait', false, c);
  req.send(target, query, function (xhr) {
    if (callback) {
      callback.call(this, xhr);
    }
  });
}
var hideModal = function () {
  if (modal != null) {
    modal.hide();
  }
};
function showModal(src, qstr, doClose) {
  send(src, qstr, function (xhr) {
    var ds = xhr.responseText.toJSON();
    var detail = '';
    if (ds) {
      if (ds.alert) {
        alert(ds.alert);
      } else if (ds.detail) {
        detail = decodeURIComponent(ds.detail);
      }
    } else {
      detail = xhr.responseText;
    }
    if (detail != '') {
      modal = new GModal({
        onclose: doClose
      }).show(detail);
      detail.evalScript();
    }
  });
}
function defaultSubmit(ds) {
  var _alert = '',
    _input = false,
    _url = false,
    _location = false,
    t, el,
    remove = /remove([0-9]{0,})/;
  for (var prop in ds) {
    var val = ds[prop];
    if (prop == 'error') {
      _alert = eval(val);
    } else if (prop == 'alert') {
      _alert = val;
    } else if (prop == 'modal') {
      if (modal && val == 'close') {
        modal.hide();
      }
    } else if (prop == 'location') {
      _location = val;
    } else if (prop == 'url') {
      _url = val;
      _location = val;
    } else if (prop == 'tab') {
      initWriteTab("accordient_menu", val);
    } else if (remove.test(prop)) {
      if ($E(val)) {
        $G(val).remove();
      }
    } else if (prop == 'input') {
      el = $G(val);
      t = el.title ? el.title.strip_tags() : '';
      if (t == '' && el.placeholder) {
        t = el.placeholder.strip_tags();
      }
      if (_input != el) {
        el.invalid(t);
      }
      if (t != '' && _alert == '') {
        _alert = t;
        _input = el;
      }
    } else if ($E(prop)) {
      $G(prop).setValue(decodeURIComponent(val).replace(/\%/g, '&#37;'));
    } else if ($E(prop.replace('ret_', ''))) {
      el = $G(prop.replace('ret_', ''));
      if (el.display) {
        el = el.display;
      }
      if (val == '') {
        el.valid();
      } else {
        if (val == 'this' || val == 'Please fill in' || val == 'Please browse file') {
          if (el.placeholder) {
            t = el.placeholder.strip_tags();
          } else {
            t = el.title.strip_tags();
          }
          val = val == 'this' ? t : trans(val) + ' ' + t;
        }
        if (_input != el) {
          el.invalid(val);
        }
        if (_alert == '') {
          _alert = val;
          _input = el;
        }
      }
    }
  }
  if (_alert != '') {
    alert(_alert);
  }
  if (_input) {
    _input.focus();
    var tag = _input.tagName.toLowerCase();
    if (tag != 'select') {
      _input.highlight();
    }
    if (tag == 'input') {
      var type = _input.get('type').toLowerCase();
      if (type == 'text' || type == 'password') {
        _input.select();
      }
    }
  }
  if (_location) {
    if (_location == 'reload') {
      loader.reload();
    } else if (_location == 'back') {
      loader.back();
    } else if (_location != _url) {
      loader.location(_location);
    } else {
      window.location = _location.replace(/&amp;/g, '&');
    }
  }
}
function doFormSubmit(xhr) {
  var datas = xhr.responseText.toJSON();
  if (datas) {
    defaultSubmit(datas);
  } else if (xhr.responseText != '') {
    alert(xhr.responseText);
  }
}
var dataTableActionCallback = function (xhr) {
  var el,
    prop,
    val,
    toplv = -1,
    ds = xhr.responseText.toJSON();
  if (ds) {
    for (prop in ds) {
      val = ds[prop];
      if (prop == 'location') {
        if (val == 'reload') {
          loader.reload();
        } else {
          window.location = val;
        }
      } else if (prop == 'remove') {
        if ($E(val)) {
          $G(val).remove();
        }
      } else if (prop == 'alert') {
        alert(val);
      } else if (prop == 'elem') {
        el = $E(val);
        if (el) {
          el.className = ds.class;
          el.title = ds.title;
        }
      } else if (prop == 'modal') {
        if (val == 'close') {
          if (modal) {
            modal.hide();
          }
        } else {
          modal = new GModal().show(val);
          val.evalScript();
        }
      } else if ($E(prop)) {
        as = val.split('|');
        $E(prop).innerHTML = as[0];
        $E('move_left_' + as[2]).className = (as[1] == 0 ? 'hidden' : 'icon-move_left');
        $E('move_right_' + as[2]).className = (as[1] > toplv ? 'hidden' : 'icon-move_right');
        toplv = as[1];
      }
    }
  } else if (xhr.responseText != '') {
    alert(xhr.responseText);
  }
};
function checkUsername() {
  var patt = /[a-zA-Z0-9@\.\-_]+/;
  var value = this.value;
  var ids = this.id.split('_');
  var id = '&id=' + floatval($E(ids[0] + '_id').value);
  if (value == '') {
    this.invalid(this.title);
  } else if (patt.test(value)) {
    return 'value=' + encodeURIComponent(value) + id;
  } else {
    this.invalid(this.title);
  }
}
function checkPassword() {
  var ids = this.id.split('_');
  var id = '&id=' + floatval($E(ids[0] + '_id').value);
  var Password = $E(ids[0] + '_password');
  var Repassword = $E(ids[0] + '_repassword');
  if (Password.value == '' && Repassword.value == '') {
    if (id == 0) {
      this.Validator.invalid(this.Validator.title);
    } else {
      this.Validator.reset();
    }
    this.Validator.reset();
  } else if (Password.value == Repassword.value) {
    Password.Validator.valid();
    Repassword.Validator.valid();
  } else {
    this.Validator.invalid(this.Validator.title);
  }
}
function checkIdcard() {
  var value = this.value;
  var ids = this.id.split('_');
  var id = '&id=' + floatval($E(ids[0] + '_id').value);
  var i, sum;
  if (value.length != 13) {
    this.invalid(this.title);
  } else {
    for (i = 0, sum = 0; i < 12; i++) {
      sum += parseFloat(value.charAt(i)) * (13 - i);
    }
    if ((11 - sum % 11) % 10 != parseFloat(value.charAt(12))) {
      this.invalid(this.title);
    } else {
      return 'value=' + encodeURIComponent(value) + '&id=' + id;
    }
  }
}
function initMailserver() {
  var doChanged = function () {
    var a = this.value.toInt();
    $E('email_SMTPSecure').disabled = (a == 0);
    $E('email_Username').disabled = (a == 0);
    $E('email_Password').disabled = (a == 0);
  };
  var el = $G('email_SMTPAuth');
  el.addEvent('change', doChanged);
  doChanged.call(el);
}
function replaceURL(key, value) {
  var q,
    prop,
    urls = window.location.toString().replace(/\#/g, '&').replace(/\?/g, '&').split('&'),
    new_url = new Object(),
    qs = Array(),
    l = urls.length;
  if (l > 1) {
    for (var n = 1; n < l; n++) {
      if (urls[n] != 'action=login' && urls[n] != 'action=logout') {
        q = urls[n].split('=');
        if (q.length == 2) {
          new_url[q[0]] = q[1];
        }
      }
    }
  }
  new_url[key] = value;
  for (prop in new_url) {
    if (new_url[prop]) {
      qs.push(prop + '=' + new_url[prop]);
    } else {
      qs.push(prop);
    }
  }
  return urls[0] + '?' + qs.join('&');
}
function initSystem() {
  new Clock('local_time');
  new Clock('server_time');
}
var initWeb = function () {
  loader = new GLoader(WEB_URL + 'loader.php/index/controller/loader/index', function (xhr) {
    var scroll_to = 'scroll-to';
    var content = $G('content');
    var datas = xhr.responseText.toJSON();
    if (datas) {
      for (var prop in datas) {
        var value = datas[prop];
        if (prop == 'detail') {
          content.setHTML(value);
          loader.init(content);
          value.evalScript();
        } else if (prop == 'topic') {
          document.title = value.unentityify();
        } else if (prop == 'menu') {
          selectMenu(value);
        } else if (prop == 'to') {
          scroll_to = value;
        } else if ($E(prop)) {
          $E(prop).innerHTML = value;
        }
      }
      if ($E(scroll_to)) {
        window.scrollTo(0, $G(scroll_to).getTop() - 10);
      }
    } else {
      content.setHTML(xhr.responseText);
    }
  });
  loader.initLoading('wait', false);
  loader.init(document);
};
function selectMenu(module) {
  if ($E('topmenu')) {
    var tmp = false;
    forEach($E('topmenu').getElementsByTagName('li'), function (item, index) {
      var cs = new Array();
      if (index == 0) {
        tmp = item;
      }
      forEach(this.className.split(' '), function (c) {
        if (c == module) {
          tmp = false;
          cs.push(c + ' select');
        } else if (c !== '' && c != 'select' && c != 'default') {
          cs.push(c);
        }
      });
      this.className = cs.join(' ');
    });
    if (tmp) {
      $G(tmp).addClass('default');
    }
  }
}
$G(window).Ready(function () {
  if (navigator.userAgent.indexOf("MSIE") > -1) {
    document.body.addClass("ie");
  }
  forEach($E(document.body).getElementsByTagName('nav'), function () {
    if ($G(this).hasClass('topmenu sidemenu slidemenu gddmenu')) {
      new GDDMenu(this);
    }
  });
  var _scrolltop = 0;
  var toTop = 100;
  if ($E('toTop')) {
    if ($G('toTop').hasClass('fixed_top')) {
      document.addEvent('toTopChange', function () {
        if (document.body.hasClass('toTop')) {
          var _toTop = $G('toTop').copy();
          _toTop.zIndex = -1;
          _toTop.id = 'toTop_temp';
          _toTop.setStyle('opacity', 0);
          _toTop.removeClass('fixed_top');
          $G('toTop').after(_toTop);
        } else if ($E('toTop_temp')) {
          $G('toTop_temp').remove();
        }
      });
    }
    toTop = $E('toTop').getTop();
  }
  document.addEvent('scroll', function () {
    var c = this.viewport.getscrollTop() > toTop;
    if (_scrolltop != c) {
      _scrolltop = c;
      if (c) {
        document.body.addClass('toTop');
        document.callEvent('toTopChange');
      } else {
        document.body.removeClass('toTop');
        document.callEvent('toTopChange');
      }
    }
  });
  var patt = /^lang_([a-z]{2,2})$/;
  forEach(document.body.getElementsByTagName("a"), function () {
    if (patt.test(this.id)) {
      callClick(this, function () {
        var hs = patt.exec(this.id);
        window.location = replaceURL('lang', hs[1]);
        return false;
      });
    }
  });
});