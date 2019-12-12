# Step Flow
Step Flow for Node.js, Inspired from AWS Step Function

```js
const StepFlow = require('node-step-flow');

let obj = {
    start_at: "collect",
    states: {
        collect: {
            event: function(params, next) {
                console.log(`[${(new Date()).toISOString()}] collect  (${JSON.stringify(params)})`);
                params.states = [];
                params.states.push('collect');
                next(null, params);
            },
            next: 'evaluate'
        },
        evaluate: {
            event: function(params, next) {
                console.log(`[${(new Date()).toISOString()}] evaluate (${JSON.stringify(params)})`);
                params.states.push('evaluate');
                next(null, params);
            },
            next: 'choice'
        },
        choice: {
            event: function(params, next) {
                console.log(`[${(new Date()).toISOString()}] choice   (${JSON.stringify(params)})`);
                params.states.push('choice');
                if (params.goto) {
                    next(null, params, params.goto);
                } else {
                    next(null, params);
                }
            },
            next: 'print'
        },
        print: {
            event: function(params, done) {
                console.log(`[${(new Date()).toISOString()}] print    (${JSON.stringify(params)})`);
                params.states.push('print');
                done();
            },
            end: true
        },
        failover: {
            event: function(params, next) {
                console.log(`[${(new Date()).toISOString()}] failover (${JSON.stringify(params)})`);
                params.states.push('failover');
                next(null, params);
            },
            next: 'notify'
        },
        notify: {
            delay: 3000,
            event: function(params, done) {
                console.log(`[${(new Date()).toISOString()}] notify   (${JSON.stringify(params)})`);
                done();
            },
            end: true
        }
    }
}

let stepFlow = new StepFlow(obj);

let payload = {
    goto: '' // 'failover'
};

stepFlow.start(payload, function(err) {
    if (err) console.log(err.message);
    else console.log('END');
});
```