<?php
if (PHP_SAPI == 'cli-server') {
    // To help the built-in PHP dev server, check if the request was actually for
    // something which should probably be served as a static file
    $url  = parse_url($_SERVER['REQUEST_URI']);
    $file = __DIR__ . $url['path'];
    if (is_file($file)) {
        return false;
    }
}

require __DIR__ . '/../vendor/autoload.php';

session_start();

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
// Instantiate the app
$settings = require __DIR__ . '/../src/settings.php';
$app = new \Slim\App($settings);

// Set up dependencies
require __DIR__ . '/../src/dependencies.php';

// Register middleware
require __DIR__ . '/../src/middleware.php';

// Register routes
require __DIR__ . '/../src/routes.php';

// Display all projects associated with a user
$app->get('/{usrid}/projects', function(Request $request, Response $response){

});
//---------------------------------------------------------------------------------Project
//Get All Information associated with a research project
$app->get('/project/{projectid}', function(Request $request, Response $response){

});
// Add a new research project.
$app->post('/project', function (Request $request,Response $response){

});
// Modify an Existing Project
$app->post('/project/{projectid}', function(Request $request, Response $response){

});
//DELETE research project
$app->get('/project/{projectid}/del', function(Request $request, Response $response){

});
// SEARCH Project by Title
$app->get('/search/project/{title}',function(Request $request, Response $response){

});
//GENERATE a BibTeXFile
$app->get('/project/{projectid}/BibTeX', function(Request $request, Response $response){

});
//-------------------------------------------------------------------------------------Paper
//Get A Paper
$app->get('/project/{projectid}/paper/{paperid}', function(Request $request, Response $response){

});
// Add a new paper to a project
$app->post('/project/{projectid}/paper', function (Request $request,Response $response){

});
// Modify an Existing Paper in a Project
$app->post('/project/{projectid}/paper/{paperid}', function(Request $request, Response $response){

});
//DELETE research paper
$app->get('/project/{projectid}/paper/{paperid}/del', function(Request $request, Response $response){

});
// SEARCH paper by Title
$app->get('/search/paper/title/{title}',function(Request $request, Response $response){

});
// SEARCH paper by Authors
$app->get('/search/paper/author/{author}',function(Request $request, Response $response){

});
//---------------------------------------------------------------------------------------
// Run app
$app->run();
