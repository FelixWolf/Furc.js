var furc = require("../Furc.js").client, //If you put furc.js in the same folder, remember to change "../furc.js" to "./furc.js"!
    cli = require("./cli.js"), prompt="> "; //This line is not part of furc.js, it just opens the CLI ability.

input = cli.open("> ", false); //Also part of CLI, not really needed

//Here we connect the bot
bot = furc.connect({
	//The username of the bot goes here:
	username:"Username",
	//And the password:
	password:"Password",
	//The description, optional, just remove the line and the , above to not set it.
	desc: "Hello, world!",
	//This sets the color, also optional, just remove it and the , to not use it.
	colors: "t:#<:5+$/?8%&$"
});

//Called when logging in
bot.on("login",function(){
	console.log("Logging in...");
});

//Called when we successfully logged in
bot.on("success",function(){
	console.log("Logged in.");
});

//Display ANY text that would be displayed to the client:
bot.on("text",function(text){
	//Since we are displaying it to the terminal, remove all <a href=""></a> and <B></B> like stuff.
	console.log(text.replace(/(<([^>]+)>)/ig,""));
});

//We received a whisper!
bot.on("whisper",function(name,shortname,message){
	//split it so we can get the commands
	data = message.split(" ");
	switch(data[0]){
		case "summon":
			bot.summon(shortname);
		break;
	}
	
	//Log it to console so we can see whispers
	//Since some stuff breaks in console, we will use shortnames and convert | to " "
	console.log(shortname.replace(/\|/g," ") + ") " + message);
});

//Someone said something
bot.on("chat",function(name,shortname,message){

	//Log it to console so we can see whispers
	//Since some stuff breaks in console, we will use shortnames and convert | to " "
	console.log(shortname.replace(/\|/g," ") + "> " + message);
});

//Below is stuff mostly related to the CLI.js file, but it also shows off some other functions
//Basic movements
input.on("up",function(){
	//These are related to the number pad and the movement buttons on the A tab
	//You can also, optionally, use strings, such as bot.move("nw");
	bot.move(9);
});
input.on("down",function(){
	//Same as above
	bot.move(1);
});
input.on("left",function(){
	//Same as above
	bot.move(7);
});
input.on("right",function(){
	//Same as above
	bot.move(3);
});

//Here we handle input from the terminal
input.on("input",function(data){
	//Show what we typed in the terminal
	console.log("] "+data);
	//And split it, much like in the whisper handler
	cmd = data.split(" ");
	
	if(cmd[0]=="move"){
		//Was it move?
		bot.move(cmd[1]);
	}else if(cmd[0]=="join"){
		//If not, was it to join someone?
		bot.join(cmd[1]);
	}else if(cmd[0]=="quit"){
		//What about quitting?
		bot.send("quit");
		process.exit();
	}else{
		//Otherwise, say it!
		bot.say(data);
	}
});
