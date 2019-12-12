module.exports = {
    start_at: "collect",
    states: {
        collect: {
            event: function(params, next) {
                console.log(
                    `[${new Date().toISOString()}] [${
                        params.index
                    }] collect  (${JSON.stringify(params)})`
                );
                params.states = [];
                params.states.push("collect");
                next(null, params);
            },
            next: "evaluate"
        },
        evaluate: {
            event: function(params, next) {
                console.log(
                    `[${new Date().toISOString()}] [${
                        params.index
                    }] evaluate (${JSON.stringify(params)})`
                );
                params.states.push("evaluate");
                next(null, params);
            },
            next: "choice"
        },
        choice: {
            event: function(params, next) {
                console.log(
                    `[${new Date().toISOString()}] [${
                        params.index
                    }] choice   (${JSON.stringify(params)})`
                );
                params.states.push("choice");
                if (params.goto) {
                    next(null, params, params.goto);
                } else {
                    next(null, params);
                }
            },
            next: "print"
        },
        print: {
            event: function(params, done) {
                console.log(
                    `[${new Date().toISOString()}] [${
                        params.index
                    }] print    (${JSON.stringify(params)})`
                );
                params.states.push("print");
                done();
            },
            end: true
        },
        failover: {
            event: function(params, next) {
                console.log(
                    `[${new Date().toISOString()}] [${
                        params.index
                    }] failover (${JSON.stringify(params)})`
                );
                params.states.push("failover");
                next(null, params);
            },
            next: "notify"
        },
        notify: {
            delay: 5000,
            event: function(params, done) {
                console.log(
                    `[${new Date().toISOString()}] [${
                        params.index
                    }] notify   (${JSON.stringify(params)})`
                );
                done();
            },
            end: true
        }
    }
};
