var fs = require('fs'),
		filename = 'input.txt';

var processes = fs.readFileSync(filename, 'utf-8')
    .split('\n').map(line => line.split(' ').map(a => parseInt(a,10))).map((b,i) => {
    	b.push(b[2]);
    	b.push(i);
    	return b;
    });

var completed = 0,
		totalProcesses = processes.length,
		quantum = 2,
		queue = [],
		currentTime = 0,
		waitingTime = 0,
		transition = [];

function update_queue(){
	for(var i=0;i<processes.length;i++){
		if(processes[i][1] <= currentTime){
			queue.push([...processes[i]]);
			processes.splice(i,1);
			i--;
		}
	}
}

while(completed != totalProcesses){
/*	for(var i=processes.length-1;i>=0;i--){
		if(processes[i][1] <= currentTime){
			queue.unshift([...processes[i]]);
			processes.splice(i,1);
		}
	}*/

	if(queue.length > 0){
		if(transition.length === 0 || (transition.length > 0 && transition[transition.length-1][2] !== queue[0][4])){
			transition.push([currentTime, queue[0][0], queue[0][4]]);
		}

		if(queue[0][2] > quantum){
			queue[0][2] -= quantum;
			currentTime += quantum;
			update_queue();
			queue.push(queue.splice(0, 1)[0]);
			//console.log(queue);
		}
		else{
			currentTime += queue[0][2];
			waitingTime = waitingTime + (currentTime - queue[0][1] - queue[0][3]);
			queue.splice(0,1);
			update_queue();
			completed += 1;
		}
	}
	else{
		update_queue();
		if(queue.length === 0){
			currentTime++;
		}
	}
}

var logger = fs.createWriteStream('RR.txt', {
  flags: 'a'
});

for(let trans of transition){
	logger.write(`(${trans[0]}, ${trans[1]})\r\n`);
}
logger.write(`average waiting time ${waitingTime/totalProcesses}`);
logger.end();

console.log(transition);
console.log(waitingTime/totalProcesses);
console.log(currentTime);