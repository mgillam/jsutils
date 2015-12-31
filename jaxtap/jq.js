var root = 'http://jsonplaceholder.typicode.com';
var LOG = function(hook) {
  console.log(hook);
  return hook;
};

Function.prototype.clone = function() {
  var that = this;
  var temp = function temporary() {
    return that.apply(this, arguments);
  };
  for (var key in this) {
    if (this.hasOwnProperty(key)) {
      temp[key] = this[key];
    }
  }
  return temp;
};

var areq = $.ajax.clone();
$.ajax = function(arg) {
  console.log('request');
  console.log(JSON.stringify(arg));
  var myres = areq(arg);
  var oldThen = myres.then.clone();
  var tapThen = function(cb) {
    var tcb = function(res) {
      console.log('response');
      console.log(res);
      return cb(res);
    };
    return oldThen(tcb);
  };

  myres.then = tapThen;
  return myres;
};

$.ajax({
  url: root + '/posts/3',
  method: 'GET'
}).then(function(data) {
  $('#myList').append('<li>' + data.id + ': ' + data.title + '</li>');
});