function Sequence(){
    var nextSeq = null;
    var thisSeq = [];
    var completion = function(){
    	//if thisSeq is all complete
        //-- if nextSeq not null
        //-- -- nextSeq.start();
    }
	return {
    	then:function(){
            nextSeq = Sequence.apply(null,arguments);
            return nextSeq;
        },
        start:function(){
        	console.log('start');
        }
    };
}