
var userName = "Beanss";
var apiKey = "M7QQVsJrKeXzyNUdhomb7OMh7Bw0BkWPHsywLpwh";

Parse.Cloud.define("getChallongeData", function(request, response) 
{
	var URL = "https://" + userName + ":" + apiKey + "@api.challonge.com/v1/tournaments.json";
	Parse.Cloud.httpRequest
	({
		url: URL
	}).then(function(httpResponse)
	{
		response.success(httpResponse.text);
	});
});

Parse.Cloud.define("getMatchesFromTournaments", function(request, response)
{
	var listOfMatches = [];
	var tournaments = request.params.newTornys;
	var promises = [];

	for (var i = 0; i < tournaments.length; i++)
	{
		var URL = "https://" + userName + ":" + apiKey + "@api.challonge.com/v1/tournaments/";
		URL += tournaments[i] + "/matches.json";
		promises.push(Parse.Cloud.httpRequest
		({
			url: URL
		}).then(function(httpResponse)
		{
			listOfMatches[listOfMatches.length] = httpResponse;
		}));
	}
	Parse.Promise.when(promises).then(function()
	{
		response.success(listOfMatches);
	},
	function (error)
	{
		response.error("Failed during get matches");
	});
});

Parse.Cloud.define("convertIDsToNames", function(request, response)
{
	var playerSet = request.params.playerSet;
	var promises = [];
	var participants = [];
	for (pid in playerSet)
	{
		if (!playerSet.hasOwnProperty(pid))
		{
			continue;
		}
		var bothParts = pid.split(':');
		var playerID = bothParts[0];
		var tornyID = bothParts[1];

		var URL = "https://" + userName + ":" + apiKey + "@api.challonge.com/v1/tournaments/";
		URL += tornyID + "/participants/" + playerID + ".json";
		console.log(URL);
		promises.push(Parse.Cloud.httpRequest
		({
			url: URL
		}).then(function(httpResponse)
		{
			participants.push(httpResponse);
		}));
	}

	Parse.Promise.when(promises).then(function()
	{
		response.success(participants);
	},
	function (error)
	{
		response.error("Failed during get names");
	});
});



