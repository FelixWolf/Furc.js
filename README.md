Furc.js
=======

A set of node.js APIs for use with Furcadia.

##Install
* Git Clone it, Download the zip from the sidebar, or from my website: http://wolf.it.cx/furcadia/furc.js/download
* Extract
* Pretty much it, but you got to actually modify the example bot, or start a new one.

##Function list
Add a event listener:
```javascript
bot.on(string Event_Name, function Callback([variables][,...]));
```

Remove a event listener:

```javascript
bot.off(string Event_Name);
```


Get a bot variable:

```javascript
bot.get(mixed Bot_Variable);
```



Send a raw protocol packet:

```javascript
bot.send(string Raw_String);
```

Say something:

```javascript
bot.say(string Message);
```

Emit loud a message:

```javascript
bot.emitloud(string Message);
```

Emote something:

```javascript
bot.emote(string Message);
```

Whisper something to someone:

```javascript
bot.whisper(string Name, string Message);
```

Join someone:

```javascript
bot.join(string Name);
```

Summon someone:

```javascript
bot.summon(string Name);
```

Stand:

```javascript
 bot.stand();
```

Sit:

```javascript
bot.sit();
```

Lie:

```javascript
bot.lie();
```

Send the decline message to someone whom sent a request:

```javascript
bot.decline();
```

Stop following/leading:

```javascript
bot.stop();
```

Move a direction(1/7/9/3, nw/ne/sw/se, and maybe 4/8/6/2):

```javascript
bot.move(mixed Direction);
```

Convert a UID to a name:

```javascript
bot.uid2Name(int Uid);
```

Get a list of furres in the dream:

```javascript
bot.playerList();
```

I forgot what this did:

```javascript
bot.playerLookup(string Name); //I think?
```

Queue the Phoenix Speak database:

```javascript
bot.ps(string Queue, function Callback(result));
```

Get a DS variable(Advanced, and probably not working):
```javascript
bot.getDreamVar.ds(string DS_Variable);
```
<br/>

#####Note: These last three only work AFTER it has been set by DS or live-edit.

Get the floor at a specific position:

```javascript
bot.getDreamVar.floorAt(integer X, integer Y);
```

Get the object at a specific position:

```javascript
bot.getDreamVar.objectAt(integer X, integer Y);
```

Get the wall at a specific position:

```javascript
bot.getDreamVar.wallAt(integer X, integer Y);
```

##Event list
####THESE ARE ALL LOWER CASE
For an example of how this is used, here is a simple `player.spawn` event trigger:
```javascript
bot.on("player.spawn", function(UID, PlayerData){ //Player data reference is in the next section
    bot.whisper(PlayerData.name, "Hello, "+PlayerData.name+"! Welcome to my dream!");
});
```
---
Called when connecting:

```javascript
connect: ()
```

Called when logging in:

```javascript
login: ()
```

Called when successfully logged in:

```javascript
success: ()
```

Called when failed to log in:

```javascript
failed: (string Message)
```

Called when any text should be displayed to the client:

```javascript
text: (string Message)
```

Called when receiving a whisper:

```javascript
whisper: (string Name, string ShortName, string Message)```

Called when receiving a PS command response:

```javascript
ps_raw: (string Response)
```

Called when receiving a PS command response that is handled by a callback:

```javascript
ps_id: (integer Callback_ID, string Message)
```

Called when a dragonspeak emit was heard:

```javascript
dragonspeak: (string Message)
```

Called when ANY emit is heard:

```javascript
emit: (string Message)
```

Called when a DS emit with `@` in front of it is heard(Useful for processing bot only emits):

```javascript
botcmd: (string Message) //May change in the future
```

Called when a player emitlouds/emits something:

```javascript
playeremit: (string Message)
```

Called when a system message is heard:

```javascript
system: (string Message)
```

Called when hearing someone chat:

```javascript
chat: (string Message)
```

Called when we didn't handle it with any of the above, only useful for debugging:

```javascript
msg: (string Message)
```

Called when a player spawns:

```javascript
player.spawn: (int UID, object Player_Variables) //See next section
```

Called when a player moves:

```javascript
player.move: (int UID, object Player_Variables) //See next section
```

Called when a player "updates", either shape or color:

```javascript
player.update: (int UID, object Player_Variables) //See next section
```

Called when needing to hide a player:

```javascript
player.hide: (int UID, object Player_Variables) //See next section
```

Called when removing a player(READ: Leave):

```javascript
player.remove: (int UID, object Player_Variables) //See next section
```

Called when the server tries to move our camera, except we don't really have one:

```javascript
camera: (object {X: integer X, Y: Integer Y})
```

Called when a object is at our feet:

```javascript
feet: (integer Object_ID)
```

Called when we have a object in our paws:

```javascript
paws: (integer Object_ID)
```

Called when messages are supposed to be suppressed:

```javascript
suppress: None
```

Called when messages are to be resumed:

```javascript
resume: None
```

Called when a sound is supposed to play:

```javascript
snd: (integer Sound_ID)
```

Called when we receive a disconnect dialog, such as getting banned(E.G.: Goodbye.)
```javascript
disconnectdiag: (string Message)
```

Called when we find our UID:

```javascript
uid: (integer UID)
```

Called when we detect a uploaded dream:

```javascript
dream: (object {X: integer X, Y: integer Y}, string Uploader, string Caption)
```

Called when music is supposed to play:

```javascript
music: (integer Music_ID)
```

Called when we are supposed to load a dream's file:

```javascript
dreampackage: (string Name, String Checksum)
```

Called when we need to load a patch:

```javascript
patch: (string Name, string Checksum)
```

Called when a dream unloads:

```javascript
undream: (object {X: integer X, Y: integer Y})
```

Called when we are authorized to upload:

```javascript
upload.begin: None
```

Called when we are supposed to send our version:

```javascript
get.version: None
```

Called when we need to update:

```javascript
update: None
```

Called after calling uid:

```javascript
uid2: (Integer UID)
```

Called when special effects are supposed to play(READ: Dragon breath and such):

```javascript
vfx: (string FX, object {X: integer X, Y: integer Y})
```

Called when we can share edit:

```javascript
share-edit.begin
```

Called when we can no longer share edit:

```javascript
share-edit.end
```

Called when tabsability changes(EG: Tabs key usage)
```javascript
tabs: (integer True/False)
```

Called when viewing user list ability changes:

```javascript
userlist: (integer True/False)
```

Called when we need to add a bookmark:

```javascript
bookmark: (integer Temporary, string DreamURL)
```

Called when a player has a offset:

```javascript
offset: (integer UID, object {X: integer X, Y: integer Y})
```

Called when particles are supposed to display, currently no function to download/process the data:

```javascript
pfx: None
```

Called when a dream has a webmap:

```javascript
webmap: (string Map_Name, String URL)
```

Called when a portrait loads:

```javascript
portrait: (integer UID, integer Portrait_ID)
```

Called when we are supposed to open a URL:

```javascript
openurl: (string URL)
```

Called when the parental dialog displays:

```javascript
parental: None
```

Called when we receive a online status request:

```javascript
onln: (integer True/False, string Name)
```

Called when the screen flips:

```javascript
flipscreen: (integer True/False)
```

Called when our Session ID is set:

```javascript
sessionid: (integer SID)
```

Called when our colors change:

```javascript
colors: (string Color_String)
```

Called when we get a popup, such as cookie request:

```javascript
popup: (string ID, string Type, string Message)
```

Called WHENEVER we receive a packet:

```javascript
data: (string Data)
```

Called when the connection dies, rip in piece:

```javascript
end: None
```

##Data structures:
Positions:

```javascript
{
	X: integer X,
	Y: integer Y
}
```

Player info:

```javascript
{
	x: integer X,
	y: integer Y,
	shape: integer Shape,
	name: string Name,
	colors: string Color_Code,
	flags: integer Flags,
	afk: integer Afk
}
```

##Misc functions:
These are used internally, but may be useful somehow, and are exposed to the user
```javascript
integer bot.util.b95d(base_95);
integer bot.util.b220d(base_220);
object bot.util.process_PS(PS_String);
```

##Remember:
When making your bot, make sure it follows the Terms of Service of Furcadia.

I am not, neither is this API, affiliated, or endorsed by Furcadia, Dragon's Eye Productions, or Catnip Studios.
Do not contact the Beekins for help with your bot. If you find a bug, feel free to report it to me(Felix Wolf), or fix it yourself(If you can access the repo).
