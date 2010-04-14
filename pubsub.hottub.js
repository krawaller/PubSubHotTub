;(function(){

// Subscriber containers
var subscribers = {},
    wild = {},
    slice = Array.prototype.slice,
    rep = function(all,sub){ // Used to create signal RegExps directly below
        return "(" + sub + "|\\*)";
    },
    reify = function(signal){  // RegExpify signal, taking * and ** of both subscriber and publisher into account
        return new RegExp('^' + signal.replace(/\*\*/, ".+")
            .replace(/\*/g, '[^\/]+')
            .replace(/([^\/\^\+\[\]]+)/g, rep) + "$"); 
    };
    
_.mixin({
    // Subscribe
    // Parameters: signal, scope || func, [handlerName, args...
    sub: function(signal, scope, handlerName, args){
        var curryArray = slice.call(arguments, _.isFunction(scope) ? 2 : 3),
            fn = function(){
                var normalizedArgs = slice.call(arguments, 0);
                (scope[handlerName] || scope).apply((scope || window), curryArray.concat(normalizedArgs));
            };
        if (signal.indexOf("*") == -1) { // Plain signal
            (subscribers[signal] = subscribers[signal] || []).push(fn);
        } else { // Wildcard signal
            (wild[signal] = wild[signal] || []).push(fn);
            wild[signal].re = reify(signal);
        }
        fn.signal = signal; // Store signal reference
        return fn; // Return fn as handle - used for unsub
    },
    
    // Publish
    // Paramters: signal, args
    pub: function(signal, args){
        var args = slice.call(arguments, 1);
        
        if (signal.indexOf("*") == -1) { // Plain publishing
            if (subscribers[signal]) {
                for (var i = 0, len = subscribers[signal].length; i < len; i++) {
                    subscribers[signal][i].apply(this, args);
                }
            }
        } else { // Wildcard publishing
            var re_pub = reify(signal); // RegExpify signal
            for(var s in subscribers){
                if(re_pub.test(s)){ // Run funcs if wildcard signal matches subscriber
                    for(var i = 0, len = subscribers[s].length; i < len; i++){
                        subscribers[s][i].apply(this, args);
                    }
                }
            }
        }
        
        // Wildcard subscribers
        for (var reString in wild) {
            var fns = wild[reString], re = fns.re;
            if (re.test(signal)) {
                for (var i = 0, len = fns.length; i < len; i++) {
                    fns[i].apply(this, args);
                }
            }
        }
    },
    
    // Unsubscribe
    // Parameters: fn (handle returned from subscribe)
    unSub: function(fn){
        var signal = fn.signal;
        if(subscribers[signal]) subscribers[signal].splice(subscribers[signal].indexOf(fn), 1);
        if(wild[signal]) wild[signal].splice(wild[signal].indexOf(fn), 1);
    },
    
    // Subscribe once, then die
    oneSub: function(signal, scope, handlerName, args){
        var fn = _.isFunction(scope) ? scope : scope[handlerName],
            self = this,
            h = this.sub(signal, function(){
                fn.apply(scope, _.toArray(arguments));
                self.unSub(h);
            }, args);
    }
});

})();
