function StateWrapper(f, async){
    return (function(state, r){
        var listenFunc = null;
        var cb = function(res){
            state = true;
            listenFunc ? listenFunc() : 0;
            return res;
        }
        return {
            listen: function(func) {listenFunc = func},
            isComplete: function() { return state; },
            complete: function(){ return cb(r); },
            run: async ? function(){
                var args = Array.prototype.slice.call(arguments);
                args.push(cb);
                r = f.apply(null, args);
                return r;
            } : function(){
                return cb(f.apply(null,arguments));
            },
            reset: function(){ state = false; console.log('reset'); }
        };
    })(false);
}

//Test area
var psf = function plainSumFunction(a, b) {
    return a + b;
}

console.log(psf(1,2));

var statedPlainSum = StateWrapper(psf, false);
console.log(statedPlainSum.isComplete());
console.log(statedPlainSum.run(3,4));
console.log(statedPlainSum.isComplete());

//console.log(statedPlainSum.complete());

//console.log(statedPlainSum.isComplete());

var asf = function asyncSumFunction(a, b, callback) {
    callback(a + b);
}

var stateAsyncSum = StateWrapper(asf, true);
stateAsyncSum.run(5,6);
console.log(stateAsyncSum.isComplete());

var mockAjaxRequest = function(succCb,failCb,doneCb){
    var result = 'blah!';
    succCb(result);
};

//mockAjaxRequest(function(res){ console.logR}