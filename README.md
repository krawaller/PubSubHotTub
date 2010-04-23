
# PubSubHotTub

Since there seem to be an unwritten law that every PubSub broker should have a lame name, we went for PubSubHotTub. Catchy, ey?
So why another pubsub broker in town? Well, being focused on functional-meta-thingy-fun mobile programming we felt the need for a lightweight pubsub broker with wildcard support. Since we did not find any such project, we built upon marcuswestin's excellent super simple PubSubBroker. The result was PubSubHotTub, which currently weighs in on 624 bytes minified and gzipped - now that's lightweight! 

Caveat: this is an early release of PubSubHotTub, so please bear with us as it grows up to be all it can be. No, really - it's completely untested (apart from the test suite, that is).

## API Documentation

PubSubHotTub normally lives in the `pb` object. However, if it finds jQuery and/or underscore it merges itself with these, creating zero global variables.

### Subscribe

`pb.sub(channel, func, curry...);` or `pb.sub(channel, obj, method, curry...);` returns handle used when unsubscribing.

convenient method for run-once-subscriptions:
`pb.oneSub(channel, func, curry...);` or `pb.oneSub(channel, obj, method, curry...);`

### Publish

`pb.pub(channel, args...);`

### Unsubscribe

`pb.unSub(handle);`


### Examples:

    var func = function(){ console.log(Array.prototype.slice.call(arguments)); };
    
    pb.sub('/root/leaf/meatloaf', func, 'i', 'like', 'curry');
    pb.pub('/root/leaf/meatloaf', 'and', 'cheese'); // => i like curry and cheese
    
    pb.sub('/*/leaf/*', func);
    pb.pub('/root/leaf/meatloaf', 'cheese'); // => cheese
    
    pb.sub('/cheese/**/', func);
    pb.pub('/cheese/doodles/rocks', 'yeah'); // => yeah
    
    pb.oneSub('/sausage', func);
    pb.pub('/sausage', 'bratwurst'); // => bratwurst
    pb.pub('/sausage', 'chorizo'); // => *nothing*
    
    var handle = pb.sub('/goat/cheese', func);
    pb.pub('/goat/*', 'cheese?'); // => cheese
    pb.unSub(handle);
    pb.pub('/goat/*', 'butter?'); // => *nothing*


## License 

(The MIT License)

Copyright (c) 2010 Krawaller <info@krawaller.se>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.