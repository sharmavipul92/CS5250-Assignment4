var fs = require('fs');

module.exports.shortestJobFirst = function shortestJobFirst(processes, alpha){

	processes.map((b,i) => {
    	b.push(i);
    	return b;
    });

	var completed = 0,
		totalProcesses = processes.length,
		queue = [],
		currentTime = 0,
		waitingTime = 0,
		transition = [],
		predictive_timings = {},
		shortestIndex = 0,
		predictive_value = 5;

	for(let proc of processes){
		predictive_timings[proc[0]] = predictive_value;
	}

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
				if(predictive_timings[queue[i][0]] < predictive_timings[queue[shortestIndex][0]]){
					shortestIndex = i;
				}
			}
			//queue.unshift(queue.splice(shortestIndex, 1)[0]);
			if(transition.length === 0 || (transition.length > 0 && transition[transition.length-1][2] !== queue[shortestIndex][3])){
				transition.push([currentTime, queue[shortestIndex][0], queue[shortestIndex][3]]);
			}

			currentTime += queue[shortestIndex][2];
			update_queue();
			waitingTime = waitingTime + (currentTime - queue[shortestIndex][1] - queue[shortestIndex][2]);
			predictive_timings[queue[shortestIndex][0]] = alpha*queue[shortestIndex][2] + (1 - alpha)*predictive_timings[queue[shortestIndex][0]];
			queue.splice(shortestIndex,1);
			completed++;
		}
		else{
			update_queue();
			if(queue.length === 0){
				currentTime++;
			}
		}
	}

	return {
		transition: transition,
		waitingTime: waitingTime/totalProcesses
	};

}