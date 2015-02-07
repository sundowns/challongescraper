
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
		console.log(URL);
		promises.push(Parse.Cloud.httpRequest
		({
			url: URL
		}).then(function(httpResponse)
		{
			console.log(httpResponse);
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


