var fs = require('fs');
var filename = 'input.txt';
var rr = require('./rr-algo');
var srtf = require('./srtf-algo');
var sjf = require('./sjf-algo');

function read_input(){
	return fs.readFileSync(filename, 'utf-8').split('\n').map(line => line.split(' ').map(a => parseInt(a,10)));
}

function write_output(outputfile, schedule, waiting_time){
	var logger = fs.createWriteStream(outputfile, {
	  flags: 'a'
	});

	for(let trans of schedule){
		logger.write(`(${trans[0]}, ${trans[1]})\r\n`);
	}
	logger.write(`average waiting time ${waiting_time}`);
	logger.end();
}

function sleep(millis) {
	return new Promise(resolve => setTimeout(resolve, millis));
}

function main(){
	var processes = read_input();
	console.log("printing input ----");
	console.log(processes);
	console.log("simulating RR ----");
	var output_rr = rr.roundRobin(processes.map(function(arr) { return arr.slice(); }), 2);
	write_output('RR.txt', output_rr.transition, output_rr.waitingTime);
	//await sleep(1000);
	console.log("simulating SRTF ----");
	var output_srtf = srtf.shortestRemainingTimeFirst(processes.map(function(arr) { return arr.slice(); }));
	write_output('SRTF.txt', output_srtf.transition, output_srtf.waitingTime);
	//await sleep(1000);
	console.log("simulating SJF ----");
	var output_sjf = sjf.shortestJobFirst(processes.map(function(arr) { return arr.slice(); }), 0.5);
	write_output('SJF.txt', output_sjf.transition, output_sjf.waitingTime);
}

main();