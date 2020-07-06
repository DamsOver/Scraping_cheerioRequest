var request = require('request');
var cheerio = require('cheerio');

var resultat = [];

request('https://news.ycombinator.com', function (error, response, html) {
	if (!error && response.statusCode == 200) {
		var $ = cheerio.load(html);
		var parsedResults = [];

		$('span.comhead').each(function(i, element){
			// Selectionne l'élément précédent
			var a = $(this).prev();
			// Obtient son rang en parsant l'élément 2 niveaux au dessus de l'élément <a>
			var rank = a.parent().parent().text();
			// Parse le lien en titre
			var title = a.text();
			// Parse l'attribut href à l'élément "a"
			var url = a.attr('href');
			// Obtenez les enfants du sous-texte de la ligne suivante dans le tableau HTML
			var subtext = a.parent().parent().next().children('.subtext').children();
			// Extrait les information de l'élément enfant
			var points = $(subtext).eq(0).text();
			var username = $(subtext).eq(1).text();
			var comments = $(subtext).eq(2).text();
			// Notre Objet de données parsé
			var metadata = {
				rank: parseInt(rank),
				title: title,
				url: url,
				points: parseInt(points),
				username: username,
				comments: parseInt(comments)
			};

			// Push metadata dans le tableau parsedResults
			parsedResults.push(metadata);
		});
		resultat = parsedResults;
	}
});

var http = require('http');

// Création du server
var server = http.createServer(function(req, res) {

	res.writeHead(200);
	res.end(JSON.stringify(resultat));
});

server.listen(1997);