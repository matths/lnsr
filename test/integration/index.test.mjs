import tap from 'tap';
import {queue} from '../../index';

tap.test('index file', tap => {
    
    tap.test('when importing items using index file', tap => {
      tap.plan(1);
      tap.strictEqual(typeof queue, 'function', 'should return for e.g. queue a function');
      tap.end();
    });
 
    tap.end();
  })
  