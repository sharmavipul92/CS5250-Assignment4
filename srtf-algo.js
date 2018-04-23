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
		queue = [],
		currentTime = 0,
		waitingTime = 0,
		transition = [],
		shortestIndex = 0;

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

	if(queue.length > 0){
		
		shortestIndex = 0;
		for(let i=1;i<queue.length;i++){
			if(queue[i][2] < queue[shortestIndex][2]){
				shortestIndex = i;
			}
		}
		//queue.unshift(queue.splice(shortestIndex, 1)[0]);
		if(transition.length === 0 || (transition.length > 0 && transition[transition.length-1][2] !== queue[shortestIndex][4])){
			transition.push([currentTime, queue[shortestIndex][0], queue[shortestIndex][4]]);
		}

		if(queue[shortestIndex][2] === 1){
			queue[shortestIndex][2]--;
			currentTime++;
			waitingTime = waitingTime + (currentTime - queue[shortestIndex][1] - queue[shortestIndex][3]);
			queue.splice(shortestIndex,1);
			completed++;
		}
		else{
			queue[shortestIndex][2]--;
			currentTime++;
		}
		update_queue();
	}
	else{
		update_queue();
		if(queue.length === 0){
			currentTime++;
		}
	}
}

var logger = fs.createWriteStream('SRTF.txt', {
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