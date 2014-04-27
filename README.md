Furc.js
=======

A way to write bots for furcadia using node.js.

##Install
* Git Clone it, Download the zip from the sidebar, or from my website: http://wolf.it.cx/furcadia/furc.js/download
* Extract
* Pretty much it, but you got to actually modify the example bot, or start a new one.

##Function list
Add a event listener:
```bot.on(string Event_Name, function Callback([variables][,...]));```

Remove a event listener:
```bot.off(string Event_Name);```

Get a bot variable:
```bot.get(mixed Bot_Variable);```

Send a raw protocol packet:
```bot.send(string Raw_String);```

Say something:
```bot.say(string Message);```

Emit loud a message:
```bot.emitloud(string Message);```

Emote something:
```bot.emote(string Message);```

Whisper something to someone:
```bot.whisper(string Name, string Message);```

Join someone:
```bot.join(string Name);```

Summon someone:
```bot.summon(string Name);```

Stand:
```bot.stand();```

Sit:
```bot.sit();```

Lie:
```bot.lie();```

Send the decline message to someone whom sent a request:
```bot.decline();```

Stop following/leading:
```bot.stop();```

Move a direction(1/7/9/3, nw/ne/sw/se, and maybe 4/8/6/2):
```bot.move(mixed Direction);```

Convert a UID to a name:
```bot.uid2Name(int Uid);```

Get a list of furres in the dream:
```bot.playerList();```

I forgot what this did:
```bot.playerLookup(string Name); //I think?```

Queue the Phoenix Speak database:
```bot.ps(string Queue, function Callback(result));```

Get a DS variable(Advanced, and probably not working):
```bot.getDreamVar.ds(string DS_Variable);```

Get the floor at a specific position, only works AFTER it has been set by DS.
```bot.getDreamVar.floorAt(integer X, integer Y);```

Get the object at a specific position, only works AFTER it has been set by DS.
```bot.getDreamVar.objectAt(integer X, integer Y);```

Get the wall at a specific position, only works AFTER it has been set by DS.
```bot.getDreamVar.wallAt(integer X, integer Y);```

##Event list
THESE ARE ALL LOWER CASE

Called when connecting:
```connect: ()```

Called when logging in:
```login: ()```

Called when successfully logged in:
```success: ()```

Called when failed to log in:
```failed: (string Message)```

Called when any text should be displayed to the client:
```text: (string Message)```

Called when receiving a whisper:
```whisper: (string Name, string ShortName, string Message)```

Called when receiving a PS command response:
```ps_raw: (string Response)```

Called when receiving a PS command response that is handled by a callback:
```ps_id: (integer Callback_ID, string Message)```

Called when a dragonspeak emit was heard:
```dragonspeak: (string Message)```

Called when ANY emit is heard:
```emit: (string Message)```

Called when a DS emit with @ in front of it is heard(Useful for processing bot only emits):
```botcmd: (string Message) //May change in the future```

Called when a player emitlouds/emits something:
```playeremit: (string Message)```

Called when a system message is heard:
```system: (string Message)```

Called when hearing someone chat:
```chat: (string Message)```

Called when we didn't handle it with any of the above, only useful for debugging:
```msg: (string Message)```

Called when a player spawns:
```player.spawn: (int UID, object Player_Variables) //See next section```

Called when a player moves:
```player.move: (int UID, object Player_Variables) //See next section```

Called when a player "updates", either shape or color:
```player.update: (int UID, object Player_Variables) //See next section```

Called when needing to hide a player:
```player.hide: (int UID, object Player_Variables) //See next section```

Called when removing a player(READ: Leave):
```player.remove: (int UID, object Player_Variables) //See next section```

Called when the server tries to move our camera, except we don't really have one:
```camera: (object {X: integer X, Y: Integer Y})```

Called when a object is at our feet:
```feet: (integer Object_ID)```

Called when we have a object in our paws:
```paws: (integer Object_ID)```

Called when messages are supposed to be suppressed:
```suppress: None```

Called when messages are to be resumed:
```resume: None```

Called when a sound is supposed to play:
```snd: (integer Sound_ID)```

Called when we receive a disconnect dialog, such as getting banned(E.G.: Goodbye.)
```disconnectdiag: (string Message)```

Called when we find our UID:
```uid: (integer UID)```

Called when we detect a uploaded dream:
```dream: (object {X: integer X, Y: integer Y}, string Uploader, string Caption)```

Called when music is supposed to play:
```music: (integer Music_ID)```

Called when we are supposed to load a dream's file:
```dreampackage: (string Name, String Checksum)```

Called when we need to load a patch:
```patch: (string Name, string Checksum)```

Called when a dream unloads:
```undream: (object {X: integer X, Y: integer Y})```

Called when we are authorized to upload:
```upload.begin: None```

Called when we are supposed to send our version:
```get.version: None```

Called when we need to update:
```update: None```

Called after calling uid:
```uid2: (Integer UID)```

Called when special effects are supposed to play(READ: Dragon breath and such):
```vfx: (string FX, object {X: integer X, Y: integer Y})```

Called when we can share edit:
```share-edit.begin```

Called when we can no longer share edit:
```share-edit.end```

Called when tabsability changes(EG: Tabs key usage)
```tabs: (integer True/False)```

Called when viewing user list ability changes:
```userlist: (integer True/False)```

Called when we need to add a bookmark:
```bookmark: (integer Temporary, string DreamURL)```

Called when a player has a offset:
```offset: (integer UID, object {X: integer X, Y: integer Y})```

Called when particles are supposed to display, currently no function to download/process the data:
```pfx: None```

Called when a dream has a webmap:
```webmap: (string Map_Name, String URL)```

Called when a portrait loads:
```portrait: (integer UID, integer Portrait_ID)```

Called when we are supposed to open a URL:
```openurl: (string URL)```

Called when the parental dialog displays:
```parental: None```

Called when we receive a online status request:
```onln: (integer True/False, string Name)```

Called when the screen flips:
```flipscreen: (integer True/False)```

Called when our Session ID is set:
```sessionid: (integer SID)```

Called when our colors change:
```colors: (string Color_String)```

Called when we get a popup, such as cookie request:
```popup: (string ID, string Type, string Message)```

Called WHENEVER we receive a packet:
```data: (string Data)```

Called when the connection dies, rip in piece:
```end: None```

##Data structures:
Positions:
```{
	X: integer X,
	Y: integer Y
}```

Player info:
```{
	x: integer X,
	y: integer Y,
	shape: integer Shape,
	name: string Name,
	colors: string Color_Code,
	flags: integer Flags,
	afk: integer Afk
}```

##Misc functions:
These are used internally, but may be useful somehow, and are exposed to the user
```
integer bot.util.b95d(base_95);
integer bot.util.b220d(base_220);
object bot.util.process_PS(PS_String);
```

##Remember:
When making your bot, make sure it follows the Terms of Service of Furcadia.

I am not, neither is this API, affiliated, or endorsed by Furcadia, Dragon's Eye Productions, or Catnip Studios.
Do not contact the Beekins for help with your bot. If you find a bug, feel free to report it to me(Felix Wolf), or fix it yourself(If you can access the repo).
