var
	//Emitter Library
	EventEmitter = require('events').EventEmitter,
	//Net Library
	net = require('net'),
	//Utils
	util = require("util"),
	sys =
	{
		_YOU_SHOULD: "LEAVE THIS ALONE",
		handle: undefined,
		client: undefined,
		botvar:{},
		playervar:{},
		ps_callbacks:[],
		dreamvar:{dsvar:[],floors:[],objects:[],walls:[]},
		_INFO:{isConnected:false},
		emitter: new EventEmitter()
	},
	utils = {
		//Tiny B95 decoder
		b95d:function(a){
			for(var d=a.length,b=0,c=1;d>0;d--)
				b+=(a.charCodeAt(d-1)-32)*(d==a.length?c:c=c*95);
			return b;
		},
		b220d:function(a){
			for(var d=0,b=0,c=1;d<a.length;d++)
				b+=(a.charCodeAt(d)-35)*(d==0?c:c=c*220);
			return b;
		},
		process_PS:function(str){
			var result={};
			//(PS 9999 Error: Sorry, unknown PhoenixSpeak command.
			var tmp = str.split(": ");
			if(tmp[0]=="Ok"){
				result.status=true;
				if(tmp[1]=="get"){
					result.method="get";
					if(tmp[2]=="result"&&tmp[3]!="<empty>"){
						tmp = tmp.splice(3).join(": ").split(", ");
						result.results={};
						for(var i=0;i<tmp.length;i++){
							var tmp2=tmp[i].replace("'","").split("=");
							result.results.kv[tmp2[0]]=tmp2[1];
							result.results.iv[i]={"key":tmp2[0],"value":tmp2[1]};
						}
					}else result.results=false;
				}else if(tmp[1]=="set"){//No more info?
					result.method="set";
					if(tmp[2]=="Ok") result.state=true;
					else result.state=false;
				}
			}else if(tmp[0]=="Error"){
				result.status=false;
				result.method=tmp[1];
				result.msg=tmp.splice(2).join(": ");
			}
			return result;
		}
	},
	mod =
	{
		connect: function(options){
			if(!sys._INFO.isConnected){
				//Default variables in case non was specified
				options=options||{};
				options["host"]=options["host"]||"lightbringer.furcadia.com";
				options["port"]=options["port"]||6500;
				
				sys.client = net.connect({host:options["host"], port: options["port"]}, function(){
					sys.emitter.emit("connect");
				});
				
				sys.client.on("data", function(raw){
					blocks=raw.toString("ascii").split("\n");
					for(var i=0, len=blocks.length; i<len;i++){
						data=blocks[i];
						if(data=="Dragonroar"){ //We login
							if(options.username!==undefined&&options.password!==undefined) //We will automatically login.
								sys.client.write("connect "+options.username.replace(/ /g,"|")+" "+options.password.replace(/ /g,"|")+"\n");
							sys._INFO.isConnected=true;
							sys.botvar["username"]=options.username;
							sys.emitter.emit("login");
						}else if(data=="&&&&&&&&&&&&&"){
							if(options.colors!==undefined) //Set the colors
								sys.client.write("color "+options.colors+"\n");
							if(options.desc!==undefined) //Set the colors
								sys.client.write("desc "+options.desc+"\n");
							if(options.home!==undefined) //Set the colors
								sys.client.write("fdl "+options.home+"\n");
							sys.botvar.loggedin=true;
							sys.emitter.emit("success");
						}else{
							switch(data[0]){
								//Todo:
								/*
									0
									1
									2
									3
									4
									5
									6
									7
									8
									>
									]f
									]M
									
								*/
								case "0":
									/* TODO
										sys.dreamvar.dsvar[parseInt(utils.b95d(data.substr(1,2)))]={
											x:parseInt(utils.b95d(data.substr(3,3))),
											y:parseInt(utils.b95d(data.substr(6,3)))
										};
										sys.dreamvar.dsvar.left = parseInt(utils.b95d(data.substr(10,2)))
									*/
								break;
								case "(":
									msg = data.substr(1);
									regex = msg.match(/^\<font color='whisper'>\[ <name shortname='([a-z0-9]+)' src='whisper-from'>([^<]+)<\/name> whispers, "(.*)" to you. \]<\/font>$/);
									if(regex!=null){
										sys.emitter.emit("whisper",regex[1],regex[2],regex[3]);
										sys.emitter.emit("text",regex[2].replace(/\|/g," ")+"> "+regex[3]);
										break;
									}
									
									regex = msg.match(/^\PS (.*)$/);
									if(regex!=null){
										var tmp=regex[1].split(" ");
										var id=parseInt(tmp.shift());
										if(!isNaN(parseInt(id))){
											var ps = utils.process_PS(tmp.join(" "));
											sys.emitter.emit("ps_id",id,ps);
											if(sys.ps_callbacks[id]!=undefined) sys.ps_callbacks[id](ps);
											delete sys.ps_callbacks[id];
										}else	sys.emitter.emit("ps",utils.process_PS(regex[1]));
										sys.emitter.emit("ps_raw",regex[1]);
										break;
									}
									
									regex = msg.match(/^\<font color='dragonspeak'><img src='fsh\:\/\/system.fsh\:91' alt='@emit' \/><channel name='@emit' \/> @(.*)<\/font>$/);
									if(regex!=null){
										sys.emitter.emit("dragonspeak",regex[1]);
										sys.emitter.emit("emit",regex[1]);
										sys.emitter.emit("botcmd",regex[1]);
										//sys.emitter.emit("text","[*] "+regex[1]);
										break;
									}
									
									regex = msg.match(/^\<font color='dragonspeak'><img src='fsh\:\/\/system.fsh\:91' alt='@emit' \/><channel name='@emit' \/> (.*)<\/font>$/);
									if(regex!=null){
										sys.emitter.emit("dragonspeak",regex[1]);
										sys.emitter.emit("emit",regex[1]);
										sys.emitter.emit("text","[*] "+regex[1]);
										break;
									}
									regex = msg.match(/^\<font color='emit'><img src='fsh\:\/\/system.fsh\:91' alt='@emit' \/><channel name='@emit' \/> (.*)<\/font>$/);
									if(regex!=null){
										sys.emitter.emit("playeremit",regex[1]);
										sys.emitter.emit("emit",regex[1]);
										sys.emitter.emit("text","[*] "+regex[1]);
										break;
									}
									regex = msg.match(/^<img src='fsh\:\/\/system\.fsh\:86' \/> (.*)$/);
									if(regex!=null){
										sys.emitter.emit("system",regex[1]);
										sys.emitter.emit("text","[!] "+regex[1]);
										break;
									}
									regex = msg.match(/^\<name shortname='([a-z0-9]+)'>([^<]+)<\/name>\: (.*)$/);
									if(regex!=null){
										sys.emitter.emit("chat",regex[1],regex[2],regex[3]);
										sys.emitter.emit("text",regex[2].replace(/\|/g," ")+": "+regex[3]);
										break;
									}
									sys.emitter.emit("msg",msg);
								break;
								case "<":
									p=parseInt(utils.b220d(data.substr(1,4)));
									namesize=parseInt(utils.b220d(data.substr(11,1)));
									sys.playervar[p] = {
										x: parseInt(utils.b220d(data.substr(5,2))),
										y: parseInt(utils.b220d(data.substr(7,2))),
										shape: parseInt(utils.b220d(data.substr(9,2))),
										name: data.substr(12,namesize),
										colors: data.substr(12+namesize,10),
										flags: parseInt(utils.b220d(data.substr(22+namesize,1))),
										afk: parseInt(utils.b220d(data.substr(23+namesize,4)))
									};
									sys.emitter.emit("player.spawn",p,sys.playervar[p]);
								break;
								case "A":
								case "/":
									p=parseInt(utils.b220d(data.substr(1,4)));
									if(sys.playervar[p]!==undefined){
										sys.playervar[p].x = parseInt(utils.b220d(data.substr(5,2)));
										sys.playervar[p].y = parseInt(utils.b220d(data.substr(7,2)));
									}
									sys.emitter.emit("player.move",p,sys.playervar[p]);
								break;
								case "B":
									p=parseInt(utils.b220d(data.substr(1,4)));
									if(sys.playervar[p]!==undefined){
										sys.playervar[p].shape = parseInt(utils.b220d(data.substr(5,2)));
										sys.playervar[p].colors = data.substr(7,10);
									}
									sys.emitter.emit("player.update",p,sys.playervar[p]);
								break;
								case "C":
									p=parseInt(utils.b220d(data.substr(1,4)));
									if(sys.playervar[p]!==undefined){
										sys.playervar[p].x = parseInt(utils.b220d(data.substr(5,2)));
										sys.playervar[p].y = parseInt(utils.b220d(data.substr(7,2)));
									}
									sys.emitter.emit("player.hide",p,sys.playervar[p]);
								break;
								case ")":
									p=parseInt(utils.b220d(data.substr(1,4)));
									sys.emitter.emit("player.remove",p,sys.playervar[p]);
									delete sys.playervar[p];
								break;
								case "@":
									sys.botvar.camera = {
										x:utils.b95d(data.substr(1,2)),
										y:utils.b95d(data.substr(3,2))
									};
									sys.emitter.emit("camera",sys.botvar.camera);
								break;
								case "%":
									sys.botvar.objAtFeet = utils.b95d(data.substr(1));
									sys.emitter.emit("feet",sys.botvar.objAtFeet);
								break;
								case "~":
									sys.emitter.emit("resume",sys.botvar.objAtFeet);
								break;
								case "=":
									sys.emitter.emit("suppress",sys.botvar.objAtFeet);
								break;
								case "^":
									sys.botvar.objInPaws = utils.b95d(data.substr(1));
									sys.emitter.emit("paws",sys.botvar.objAtFeet);
								break;
								case "!": //Bots can have ears.
									sys.emitter.emit("snd",utils.b95d(data.substr(1)));
								break;
								case ";":
									sys.botvar.currentMap = data.substr(1);
									//console.log(data);
								break;
								case "[":
									sys.emitter.emit("disconnectdiag",data.substr(1));
									//console.log(data);
								break;
								case "]":
									switch(data[1]){
										case "c":
											if(data[2]=="c"){
												sys.playervar={};
												sys.dreamvar={dsvar:[],objects:[],walls:[],floors:[]};
												sys.client.write("vascodagama\n");
												sys.botvar.marbled = data.substr(3);
											}
										break;
										case "B":
											sys.botvar.uid=parseInt(data.substr(2));
											sys.emitter.emit("uid",sys.botvar.uid);
										break;
										case "s":
											vars = data.substr(8).split(" ");
											sys.emitter.emit("dream",{
												x:utils.b95d(data.substr(2,2)),
												y:utils.b95d(data.substr(4,2))
											},vars[0],vars[1]);
										break;
										case "j":
											sys.emitter.emit("music",parseInt(utils.b95d(data.substr(2))));
										break;
										case "q":
											vars = data.substr(3," ");
											sys.emitter.emit("dreampackage",vars[0],vars[1]);
										break;
										case "r":
											vars = data.substr(3," ");
											sys.emitter.emit("patch",vars[0],vars[1]);
										break;
										case "t":
											sys.emitter.emit("undream",{
												x:utils.b95d(data.substr(2,2)),
												y:utils.b95d(data.substr(4,2))
											});
										break;
										case "u":
											sys.emitter.emit("upload.begin");
										break;
										case "w":
											sys.emitter.emit("get.version");
										break;
										case "x":
											sys.emitter.emit("update");
										break;
										case "z":
											sys.emitter.emit("uid",parseInt(data.substr(2)));
										break;
										case "v":
											sys.emitter.emit("vfx",data.substr(2,1),{
												x:utils.b95d(data.substr(3,2)),
												y:utils.b95d(data.substr(5,2))
											});
										break;
										case "D":
										case "E":
											sys.emitter.emit("share-edit.begin");
										break;
										case "F":
											sys.emitter.emit("share-edit.end");
										break;
										case "G":
											sys.emitter.emit("tab",(data.substr(2,1)!="1"?"enable":"disable"));
										break;
										case "3":
											sys.emitter.emit("userlist",(data.substr(2,1)!="1"?"enable":"disable"));
										break;
										case "C":
											sys.emitter.emit("bookmark",(data.substr(2,1)!="1"?"enable":"disable"),data.substr(3));
										break;
										case "H":
											sys.emitter.emit("player.offset",utils.b220d(data.substr(2,4)),
											{
												x:utils.b220d(data.substr(6,2)),
												y:utils.b220d(data.substr(8,2))
											});
										break;
										case "I":
											sys.emitter.emit("pfx");
										break;
										case "J":
											sys.emitter.emit("webmap",data.substr(2),"http://www.furcadia.com/services/maps/maps.php5?map="+data.substr(2));
										break;
										case "&":
											vars = data.substr(2," ");
											sys.emitter.emit("portrait",vars[0],vars[1]);
										break;
										case "&":
											sys.emitter.emit("openurl",data.substr(2));
										break;
										case "!":
											sys.emitter.emit("parental");
										break;
										case "!":
											sys.emitter.emit("onln",data.substr(2,1),data.substr(3));
										break;
										case "|":
											sys.emitter.emit("flipscreen",data.substr(2));
										break;
										case "]":
											sys.emitter.emit("failed",data.substr(2));
										break;
										case "{":
											sys.emitter.emit("sessionid",parseInt(data.substr(2)));
										break;
										case "}":
											sys.emitter.emit("colors",parseInt(data.substr(2)));
										break;
										case "#":
											vars = data.substr(2," ");
											sys.emitter.emit("popup",vars[0],vars[1],vars[2]);
										break;
									}
								break;
							}
						}
						sys.emitter.emit("data",data); //Push raw data for advanced scripting.
					}
				});
				
				sys.client.on("end", function(){
					sys._INFO.isConnected=false;
					sys.emitter.emit("end");
				});
			}
			//Set up the handle if not exist.
			sys.handle = sys.handle||{
				on: function(a,b){sys.emitter.on(a,b);},
				off: function(a){sys.emitter.off(a);},
				get: function(val){
					if(sys.botvar[val]!==undefined)
						return sys.botvar[val];
					else
						return false;
				},
				send: function(raw){
					if(sys._INFO.isConnected){
						sys.client.write(raw+"\n");
						return true;
					}else return false;
				},
				say: function(a){
					if(sys._INFO.isConnected){
						sys.client.write("\""+(a||"")+"\n");
						return true;
					}else return false;
				},
				emitloud: function(a){
					if(sys._INFO.isConnected){
						sys.client.write("\"emitloud "+(a||"")+"\n");
						return true;
					}else return false;
				},
				emote: function(a){
					if(sys._INFO.isConnected){
						sys.client.write(":"+(a||"")+"\n");
						return true;
					}else return false;
				},
				whisper: function(a,b){
					if(sys._INFO.isConnected){
						sys.client.write("\wh "+(a||"").replace(/ /g,"|")+" "+b+"\n");
						return true;
					}else return false;
				},
				join: function(a){
					if(sys._INFO.isConnected){
						sys.client.write("join "+(a||"").replace(/ /g,"|")+"\n");
						return true;
					}else return false;
				},
				summon: function(a){
					if(sys._INFO.isConnected){
						sys.client.write("summon "+(a||"").replace(/ /g,"|")+"\n");
						return true;
					}else return false;
				},
				stand: function(){
					if(sys._INFO.isConnected){
						sys.client.write("stand\n");
						return true;
					}else return false;
				},
				sit: function(){
					if(sys._INFO.isConnected){
						sys.client.write("sit\n");
						return true;
					}else return false;
				},
				lie: function(){
					if(sys._INFO.isConnected){
						sys.client.write("lie\n");
						return true;
					}else return false;
				},
				decline: function(){
					if(sys._INFO.isConnected){
						sys.client.write("decline\n");
						return true;
					}else return false;
				},
				stop: function(){
					if(sys._INFO.isConnected){
						sys.client.write("stop\n");
						return true;
					}else return false;
				},
				move: function(a){
					if(sys._INFO.isConnected){
						if(a===Number)
							sys.client.write("m "+(a||0)+"\n");
						else
							sys.client.write("m "+(a||"").toString().replace("nw","7").replace("ne","9").replace("sw","1").replace("se","3")+"\n");
					}else return false;
				},
				uid2Name: function(a){
					if(sys._INFO.isConnected){
						for(var key in sys.playervar) {
							if(sys.playervar.hasOwnProperty(key)&&/^0$|^[1-9]\d*$/.test(key)&&key<=4294967294){
								if(sys.playervar[key].name==(a||0)) return true;
							}
						}
						return false;
					}else return false;
				},
				playerList: function(){
					if(sys._INFO.isConnected){
						resp=[];
						for(var key in sys.playervar) {
							resp.push(key);
						}
						return resp;
					}else return false;
				},
				playerLookup: function(a){
					if(sys._INFO.isConnected){
						if(sys.playervar[(a||0)]!==undefined) return sys.playervar[(a||0)];
						else return false;
					}else return false;
				},
				ps: function(a,b){
					if(sys._INFO.isConnected&&typeof(a)!=undefined){
						var tmp = Math.floor((Math.random()*65535)+1);
						sys.client.write("ps "+tmp+" "+a+"\n");
						sys.ps_callbacks[tmp]=b;
						return tmp;
					}else return false;
				},
				getDreamVar: {
					ds: function(a){
						if(sys._INFO.isConnected){
							if(sys.dreamvar.dsvar[(a||0)]!==undefined) return sys.dreamvar.dsvar[(a||0)];
							else return false;
						}else return false;
					},
					floorAt: function(x,y){
						if(sys._INFO.isConnected){
							if(sys.dreamvar.floors[(x||0)]!==undefined){
								if(sys.dreamvar.floors[x][y]!==undefined)
									return sys.dreamvar.floors[x][y];
								else return false;
							}else return false;
						}else return false;
					},
					objectAt: function(x,y){
						if(sys._INFO.isConnected){
							if(sys.dreamvar.objects[x]!==undefined){
								if(sys.dreamvar.objects[x][y]!==undefined)
									return sys.dreamvar.objects[x][y];
								else return false;
							}else return false;
						}else return false;
					},
					wallAt: function(x,y){
						if(sys._INFO.isConnected){
							if(sys.dreamvar.walls[x]!==undefined){
								if(sys.dreamvar.walls[x][y]!==undefined)
									return sys.dreamvar.walls[x][y];
								else return false;
							}else return false;
						}else return false;
					}
				}
			};
			return sys.handle;
		},
		util:utils,
		_INTERNAL: sys
	};
module.exports = mod;