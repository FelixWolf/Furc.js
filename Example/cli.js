//Félix's generic command line interface thing.
//This file may be used in anything provided the first two comments in the UNMODIFIED file stay intact.

var EventEmitter = require('events').EventEmitter;
module.exports = {
	open: function(prompt, enable_cur){
		function trun(a){var b=process.stdout.columns-module.exports._INTERNAL.prompt.length;a&&a.length>=b&&(a="..."+(a.slice(a.length-b+4)));return a;} 
		if(!this.isActive){
			var 
				input="",
				emitter = this._INTERNAL.emitter,
				mthis = this;
			
			if(prompt===undefined)this._INTERNAL.prompt="";
			else this._INTERNAL.prompt=prompt;
			
			if(enable_cur===undefined)enable_cur=true;
			
			process.stdin.setRawMode(true);   
			process.stdin.resume();

			process.stdin.setEncoding('utf8');
			
			console.log = function(d){
				process.stdout.clearLine();
				process.stdout.cursorTo(0);
				process.stdout.write(d+"\n"+module.exports._INTERNAL.prompt+trun(input));
			};

			this._INTERNAL.stdin_listener = function(chunk){
				if(chunk=="\r"){
					module.exports._INTERNAL.emitter.emit("input",input);
					module.exports._INTERNAL.hist.push(input);
					module.exports._INTERNAL.cur_offset.y=0;
					input="";
					process.stdout.clearLine();
					process.stdout.cursorTo(0);
					process.stdout.write(module.exports._INTERNAL.prompt);
				}else if(chunk=="\x03"){
					module.exports._INTERNAL.emitter.emit("reqclose");
				}else if(chunk=="\u001b[A"){ //Up
					if(enable_cur){
						if(module.exports._INTERNAL.cur_offset.y<=0&&(-module.exports._INTERNAL.cur_offset.y)!=module.exports._INTERNAL.hist.length)
							module.exports._INTERNAL.cur_offset.y--;
						input = module.exports._INTERNAL.hist[module.exports._INTERNAL.hist.length+module.exports._INTERNAL.cur_offset.y];
						process.stdout.clearLine();
						process.stdout.cursorTo(0);
						process.stdout.write(module.exports._INTERNAL.prompt+trun(input));
					}
					module.exports._INTERNAL.emitter.emit("up");
				}else if(chunk=="\u001b[B"){ //Down
					if(enable_cur){
						if(module.exports._INTERNAL.cur_offset.y<-1){
							module.exports._INTERNAL.cur_offset.y++;
							input = module.exports._INTERNAL.hist[module.exports._INTERNAL.hist.length+module.exports._INTERNAL.cur_offset.y];
						}else 
							input = "";
						process.stdout.clearLine();
						process.stdout.cursorTo(0);
						process.stdout.write(module.exports._INTERNAL.prompt+trun(input));
					}
					module.exports._INTERNAL.emitter.emit("down");
				}else if(chunk=="\u001b[C"){ //Right
					module.exports._INTERNAL.emitter.emit("right");
				}else if(chunk=="\u001b[D"){ //Left
					module.exports._INTERNAL.emitter.emit("left");
				}else if(chunk=="\x08"){ //Backspace
					input=input.slice(0,-1);
					process.stdout.clearLine();
					process.stdout.cursorTo(0);
					process.stdout.write(module.exports._INTERNAL.prompt+trun(input));
				}else{
					input+=chunk.split("\r")[0];
					process.stdout.clearLine();
					process.stdout.cursorTo(0);
					process.stdout.write(module.exports._INTERNAL.prompt+trun(input));
				}
			};
			process.stdin.on('data', this._INTERNAL.stdin_listener);
			this.isActive=true;
			this._INTERNAL.emitter.emit("open");
			return this._INTERNAL.emitter;
		}else{
			console.warn("\033[33m[WARN]\033[39m Please close the active CLI hook before opening a new one.");
			return false;
		}
	},
	close: function(){
		if(this.isActive){
			//Restore default settings
			process.stdin.setRawMode(false);   
			process.stdin.pause();
			//Remove stdin listener
			process.stdin.removeListener('data', this._INTERNAL.stdin_listener);
			//Restore console.log
			console.log = function(d){
				process.stdout.write(d+"\n");
			};
			this.isActive=false;
			this._INTERNAL.emitter.emit("closed");
			return true;
		}else{
			return false;
			console.warn("\033[33m[WARN]\033[39m No CLI hook was open.");
		}
	},
	prompt: function(prompt){
			if(prompt===undefined)this._INTERNAL.prompt="";
			else this._INTERNAL.prompt=prompt;
			return prompt;
	},
	_INTERNAL: {
		_YOU_SHOULD: "LEAVE THIS ALONE",
		prompt:"",
		isActive:false,
		stdin_listener:null,
		emitter: new EventEmitter(),
		hist: new Array(""),
		cur_offset: {
			x: 0,
			y: 0
		}
	}
}