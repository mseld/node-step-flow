const StepFlow = require("../");
const workflow = require("./workflow");

function execute(payload) {
    let stepFlow = new StepFlow(workflow);

    stepFlow.start(payload, function(err) {
        if (err) console.log(err.message);
        else console.log("END");
    });
}

function execute_many() {
    let healthy = true;
    for (let i = 0; i < 10; i++) {
        healthy ^= true;

        let payload = {
            index: i,
            goto: healthy ? "" : "failover"
        };

        execute(payload);
    }
}

execute_many();
