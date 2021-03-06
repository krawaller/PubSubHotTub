
describe 'PubSubHotTub'
  describe '.sub'
    it 'sub should be a function'
      pb.sub.should.be_a Function
    end
    
    before_each
      pb.signaly = false
      pb.purgeSubs()
      args = false
      calls = 0
      fn = function(){ 
        calls++;
        args = [calls].concat(Array.prototype.slice.call(arguments))
      };
      
      fne = function(signal, ans){ 
        calls++;
        args = calls;
        if(ans == 0){ throw "Bad match: " + signal } 
      };
    end
    
    it 'should support /test'
      pb.sub('/test', fn, 'curry', 'nam')
      pb.pub('/test', 'arg', 'oh')
      args.should.eql [1, 'curry', 'nam', 'arg', 'oh']
    end
    
    it 'should support /*'
      pb.sub('/*', fn, 'curry', 'nam')
      pb.pub('/test', 'arg', 'oh')
      args.should.eql [1, 'curry', 'nam', 'arg', 'oh']
    end
    
    it 'should support /test/*'
      pb.sub('/test/*', fn, 'curry', 'nam')
      pb.pub('/test/hi', 'arg', 'oh')
      args.should.eql [1, 'curry', 'nam', 'arg', 'oh']
    end
    
    it 'should support /*/test/*/hi'
      pb.sub('/*/test/*/hi', fn, 'curry', 'nam')
      pb.pub('/a/test/b/hi', 'arg', 'oh')
      args.should.eql [1, 'curry', 'nam', 'arg', 'oh']
    end
    
    it 'should handle multiple matches /*'
      pb.signaly = true;
      pb.sub('/*', fne);
      
      // Should
      pb.pub('/a', 1);
      pb.pub('/*', 1);
      pb.pub('/b', 1);
      pb.pub('/**', 1);
      
      // Shouldn't
      pb.pub('/a/b', 0);
      pb.pub('/a/b/*', 0);
      pb.pub('/a/b/*/d', 0);
      pb.pub('/*/a', 0);
      
      args.should.eql 4
    end
    
    it 'should support /**'
      pb.sub('/**', fn, 'curry', 'nam')
      pb.pub('/a/b/c', 'arg', 'oh')
      args.should.eql [1, 'curry', 'nam', 'arg', 'oh']
    end
    
    it 'should support /test/**'
      pb.sub('/test/**', fn, 'curry', 'nam')
      pb.pub('/test/a/b/c', 'arg', 'oh')
      args.should.eql [1, 'curry', 'nam', 'arg', 'oh']
    end
    
    it 'should handle multiple matches /**'
      pb.signaly = true;
      pb.sub('/**', fne)
      pb.pub('/a', 1)
      pb.pub('/a/b', 1)
      pb.pub('/a/b/*', 1)
      pb.pub('/a/b/*/d', 1)
      pb.pub('/*/*/*', 1)
      pb.pub('/**', 1)
      pb.pub('/a/**', 1)
      
      pb.pub('foo', 0)
      args.should.eql 7
    end
   
  end
  
  describe '.pub'
    before_each
      pb.signaly = false
      pb.purgeSubs()
      args = false
      calls = 0
      fn = function(){ 
        calls++;
        args = [calls].concat(Array.prototype.slice.call(arguments))
      };
      
      fne = function(signal, ans){ 
        calls++;
        args = calls;
        if(ans == 0){ throw "Bad match: " + signal } 
      };
    end
  
    it 'pub should be a function'
      pb.pub.should.be_a Function
    end
    
    it 'should support /test'
      pb.sub('/test', fn, 'curry', 'nam')
      pb.pub('/test', 'arg', 'oh')
      args.should.eql [1, 'curry', 'nam', 'arg', 'oh']
    end
    
    it 'should support /*'
      pb.sub('/test', fn, 'curry', 'nam')
      pb.pub('/*', 'arg', 'oh')
      args.should.eql [1, 'curry', 'nam', 'arg', 'oh']
    end
    
    it 'should support /test/*'
      pb.sub('/test/hi', fn, 'curry', 'nam')
      pb.pub('/test/*', 'arg', 'oh')
      args.should.eql [1, 'curry', 'nam', 'arg', 'oh']
    end
    
    it 'should support /*/test/*/hi'
      pb.sub('/a/test/b/hi', fn, 'curry', 'nam')
      pb.pub('/*/test/*/hi', 'arg', 'oh')
      args.should.eql [1, 'curry', 'nam', 'arg', 'oh']
    end
    
    it 'should handle multiple matches /*'
      pb.signaly = true;
      
      // Should
      pb.sub('/a', fne, 1);
      pb.sub('/*', fne, 1);
      pb.sub('/b', fne, 1);
      pb.sub('/**', fne, 1);
      
      // Shouldn't
      pb.sub('/a/b', fne, 0);
      pb.sub('/a/b/*', fne, 0);
      pb.sub('/a/b/*/d', fne, 0);
      pb.sub('/*/a', fne, 0);
      
      pb.pub('/*');
      
      args.should.eql 4
    end
    
    it 'should support /**'
      pb.sub('/a/b/c', fn, 'curry', 'nam')
      pb.pub('/**', 'arg', 'oh')
      args.should.eql [1, 'curry', 'nam', 'arg', 'oh']
    end
    
    it 'should support /test/**'
      pb.sub('/test/a/b/c', fn, 'curry', 'nam')
      pb.pub('/test/**', 'arg', 'oh')
      args.should.eql [1, 'curry', 'nam', 'arg', 'oh']
    end
    
    it 'should handle multiple matches /**'
      pb.signaly = true;
      
      pb.sub('/a', fne, 1)
      pb.sub('/a/b', fne, 1)
      pb.sub('/a/b/*', fne, 1)
      pb.sub('/a/b/*/d', fne, 1)
      pb.sub('/*/*/*', fne, 1)
      pb.sub('/**', fne, 1)
      pb.sub('/a/**', fne, 1)
      
      pb.sub('foo', fne, 0)
      
      pb.pub('/**')
      args.should.eql 7
    end
  end
  
  describe '.unSub'
    before_each
      pb.signaly = false
      pb.purgeSubs()
      args = false
      calls = 0
      
      fne = function(signal, ans){ 
        calls++;
        args = calls;
        if(ans == 0){ throw "Bad match: " + signal } 
      };
    end
  
    it 'should be a function'
      pb.unSub.should.be_a Function
    end
    
    it 'should unsubscribe from channel'
      var h = pb.sub('/a', fne)
      pb.pub('/a')
      pb.unSub(h)
      pb.pub('/a')
      calls.should.eql 1
    end
  end
  
  describe '.oneSub'
    before_each
      pb.signaly = false
      pb.purgeSubs()
      args = false
      calls = 0
      
      fne = function(signal, ans){ 
        calls++;
        args = calls;
        if(ans == 0){ throw "Bad match: " + signal } 
      };
    end
  
    it 'should be a function'
      pb.unSub.should.be_a Function
    end
    
    it 'should run only once'
      pb.oneSub('/a', fne)
      pb.pub('/a')
      pb.pub('/a')
      calls.should.eql 1
    end
  end
end