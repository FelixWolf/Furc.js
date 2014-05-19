var furc = require("../Furc.js").client,
    cli = require("./cli.js"), prompt="> ",
	query = {};

input = cli.open("> ", false);
bot = furc.connect({
	username:process.argv[2],
	password:process.argv[3],
	desc: process.argv[4]||"",
	colors: process.argv[5]||""
});
bot.on("disconnectdiag",function(a){console.log("Disconnected: "+a);});
bot.on("login",function(){console.log("Logging in...");});
bot.on("success",function(){console.log("Logged in.");});
bot.on("failed",function(e){console.log(e);});
bot.on("text",function(a){console.log(a.replace(/(<([^>]+)>)/ig,""));});
bot.on("dream",function(a,b,c){/*console.log("Detected "+b+":"+c+" at ("+a.x+","+a.y+").");*/});
//bot.on("player.spawn",function(a,b){console.log(a,b);});
//bot.on("chat",function(a,b,c){console.log(b.replace(/\|/g," ")+"> "+c);});
/*
	{
		"_INDEX": "Test",
		"cat1": {
			"_INDEX": "cat1 index",
			"cat1.1": "yep.."
			"cat1.2": "nope.."
		}
		"cat2": "maybe.."
	}
*/
input.on("up",function(){bot.move(9);});
input.on("down",function(){bot.move(1);});
input.on("left",function(){bot.move(7);});
input.on("right",function(){bot.move(3);});
input.on("input",function(data){
	console.log("] "+data);
	params = data.split(" ");
	cmd = params.shift();
	if(cmd=="move"){
		bot.move(params[0]);
	}else if(cmd=="exec"){
		try {
			eval(params.join(" ")); 
		} catch (e) {
			if (e instanceof SyntaxError) {
				console.log(e);
			}
		}
	}else if(cmd=="wh"){
		bot.whisper(params.shift(),params.join(" ")); 
	}else if(cmd=="join"){
		bot.join(params.join("|"));
	}else if(cmd=="quit"){
		bot.send("quit");
		process.exit();
	}else{
		console.log(bot.get("username")+": "+data);
		bot.say(data);
	}
});
setInterval(function(){
	bot.send("ping");
},10000);