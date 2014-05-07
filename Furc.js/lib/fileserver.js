var http = require('http');
var mod = {
	getFile: function(file, a, b){
		var callback = function(){}, server = 1;
		if(b==undefined)
			callback=a;
		else{
			callback=b;
			server=a;
		}
		http.get({
			host:"apollo.furcadia.com",
			port:80,
			path:"/dream/get.php?file="+file+"&type=1&server="+server
		}, function(resp){
			var data="";
			resp.on('data', function(chunk){data+=chunk;});
			resp.on('end', function(){callback(data);});
		}).on("error", function(e){console.error("[File Server] "+e);});
	},
	readRch: function(data){
		var contents = {}, offset = 28, fname = "", fsize = 0, eoftest = 0;
		if(data.substr(0,4)!="FR01") return {status:"ERROR1"};
		while(offset < data.length){
			if(data.substr(offset,2) != "FZ") return {status:"ERROR2"};
			offset+=2;
			name = data.substr(offset,40).toLowerCase().trimRight();
			offset+=43;
			fsize = parseInt(data.substr(offset,1));
			offset+=2;
			eoftest = parseInt(data.substr(offset,1));
			if (fsize < 0) return {status:"ERROR3"};
			contents[name]=data.substr("utf16le", offset,fsize);
			offset+=fsize;
		}
		return contents;
	},
	getAndRead: function(file, a, b){
		var callback = function(){}, server = 1;
		if(b==undefined)
			mod.getFile(file, function(data){a(mod.readRch(data));});
		else
			mod.getFile(file, a, function(data){b(mod.readRch(data));});
	}
};
module.exports = mod;