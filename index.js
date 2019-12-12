/**
 * State Machine Object
 *
 * @param {*} options
 */
function StepFlow(options) {
    if (!options || Object.keys(options).length < 2)
        throw new Error("Invalid Object");

    if (!options.states || Object.keys(options.states).length == 0)
        throw new Error("Invalid/Missing [states] property");

    if (!options.start_at)
        throw new Error("Invalid/Missing [start_at] property");

    if (!options.states.hasOwnProperty(options.start_at))
        throw new Error(
            "Invalid [states] property - [states] not includes start point"
        );

    this.transitions = new Map();
    this.start_at = options.start_at;
    this.previous = null;
    this.next = null;

    for (const key in options.states) {
        if (options.states.hasOwnProperty(key)) {
            let state = options.states[key];

            state.name = key;

            if (key == this.start_at) this.next = state.next;

            this.transitions.set(key, state);
        }
    }
}

StepFlow.prototype.start = function(args, callback) {
    this.state(this.start_at, args, callback);
};

StepFlow.prototype.state = function(key, args, done) {
    let self = this;
    done = typeof done === "function" ? done : function() {};

    (function next(...params) {
        // let args = null;

        if (params && params.length > 0) {
            // [0] err
            if (params[0] instanceof Error) return done(params[0]);

            // [1] params
            if (params.length >= 2) args = params[1];

            // [2] next transition
            if (params.length >= 3) key = params[2];
        }

        let state = self.transitions.get(key);
        let _next = state.next;
        let _delay = state.delay || 0;
        let _end = state.end || false;
        let _event = state.event;

        key = _next;

        let callback = _end == true ? done : next;

        // if (_event.length == 1) _event(callback);
        // else _event(args, callback);

        if (_delay > 0) {
            setTimeout(() => {
                _event(args, callback);
            }, _delay);
        } else {
            process.nextTick(function() {
                _event(args, callback);
            });
        }
    })(null);
};

module.exports = StepFlow;
