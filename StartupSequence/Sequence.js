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

function Sequence(){
    var nextSeq = null;
    var completion = function(){
        if(thisSeq.reduce(function(p,c){return p && c.isComplete();}, true)) {
            if(nextSeq !== null){
                console.log('next sequence!');
                nextSeq.start();
            } else { console.log('all done!');}
            
        }
    }
    var thisSeq = Array.prototype.map.call(arguments, function(f){
        var sw = StateWrapper(f,true);
        sw.listen(completion);
        return sw;
    });
    return {
        followBy:function(){
            nextSeq = Sequence.apply(null,arguments);
            return nextSeq;
        },
        start:function(){
            thisSeq.map(function(f){if(!f.isComplete())f.run();});
        },
        reset: function(){
            thisSeq.map(function(f){f.reset();});
            if(nextSeq)
                nextSeq.reset();
        }
    };
}