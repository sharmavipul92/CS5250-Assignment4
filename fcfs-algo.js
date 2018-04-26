var fs = require('fs');

module.exports.firstComeFirstServe = function firstComeFirstServe(processes){

	processes.map((b,i) => {
    	b.push(i);
    	return b;
    });

	var completed = 0,
		totalProcesses = processes.length,
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

		if(queue.length > 0){
			
			if(transition.length === 0 || (transition.length > 0 && transition[transition.length-1][2] !== queue[0][3])){
				transition.push([currentTime, queue[0][0], queue[0][3]]);
			}

			currentTime += queue[0][2];
			update_queue();
			waitingTime = waitingTime + (currentTime - queue[0][1] - queue[0][2]);
			queue.splice(0,1);
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