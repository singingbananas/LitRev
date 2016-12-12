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
function getConnection() {
	try {
		$db_username = "litrev-user";
		$db_password = "";
		$conn = new PDO('mysql:host=localhost;dbname=Database', $db_username, $db_password);
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	} catch(PDOException $e) {
		echo 'ERROR: ' . $e->getMessage();
	}
	return $conn;
}

require __DIR__ . '/vendor/autoload.php';





session_start();
use Auth0\SDK\API\Management as Management;
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJlSmx6M255VWI2THAxRmViWFY0YllKVjNVdDBtR3FOayIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbInJlYWQiLCJ1cGRhdGUiXX0sInVzZXJzX2FwcF9tZXRhZGF0YSI6eyJhY3Rpb25zIjpbInJlYWQiXX19LCJpYXQiOjE0Nzg0NjU1OTcsImp0aSI6IjI4MmU0YmQzYmNiMzBkMzMzMDBlODU5ZDA2MGFlZTViIn0.WvwzYAaRpYXeoJDHVodjHawD8dGK6t81ATf0QZ8cRQc";
$domain = "rom.eu.auth0.com";

$auth0Api = new Management($token, $domain);
$app = new \Slim\App();


// Display all projects associated with a user
$app->get('/{usrid}/projects', function(Request $request, Response $response){
	$usrid = $request->getAttribute('usrid');
	$sql = "SELECT * FROM `project` where Project_ID in (SELECT Project_ID from `project-reviewer` where `project-reviewer`.`Reviewer_ID` = :usrid)";
	try {
		$dbCon = getConnection(); 
		$stmt = $dbCon->prepare($sql);  
		$stmt->bindParam("usrid", $usrid);
		$stmt->execute();
		$project = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$dbCon = null;
		echo json_encode($project); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
});
//---------------------------------------------------------------------------------Project
//Get All Information associated with a research project
$app->get('/project/{projectid}', function(Request $request, Response $response){
	$sql1 = "SELECT * FROM `project` where Project_ID = :projectid ";
	$sql2 = "SELECT Paper_ID, Title, Venue, BibTeX,Citations, Year_Published, Keywords, Authors FROM papers where Paper_ID in (SELECT Paper_ID from `project-paper` where Project_ID = :projectid)";
	$projectid = $request->getAttribute('projectid');
	try {
		$dbCon = getConnection();
		$stmt = $dbCon->prepare($sql1);  
		$stmt->bindParam("projectid", $projectid);
		$stmt->execute();
		$project = $stmt->fetchObject();  
		$stmt = $dbCon->prepare($sql2);  
		$stmt->bindParam("projectid", $projectid);
		$stmt->execute();
		$project->papers = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$dbCon = null;
		echo json_encode($project); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
});
// Add a new research project.
$app->post('/project', function (Request $request,Response $response){
	$body = $request->getParsedBody();
	$userids = $body ['userids'];
	foreach($userids as $d){
    	$question_marks[$d] = '(@A,?)';
	}
	$sql = "START TRANSACTION; 
				INSERT INTO `project` (`Project_ID`, `Title`, `Description`, `Target_Deadline`, `Target_Venue`) 
				VALUES (NULL, ?, ?, ?, ?); 
				SELECT @A:=LAST_INSERT_ID();
				INSERT INTO `project-reviewer` (Project_ID, Reviewer_ID) VALUES " . implode(',', $question_marks);
; // NEED TO GET THE PROJECT ID and CREATE PROJECT-USER ENTRIES.
	
	$sql = $sql.";\nCOMMIT;";
	try {
        $dbCon = getConnection();
        $stmt = $dbCon->prepare($sql);  
        $stmt->bindParam(1,$body['title']);
        $stmt->bindValue(3,$body['deadline']);
        $stmt->bindValue(2,$body['description']);
        $stmt->bindValue(4,$body['target_venue']);
         foreach($userids AS $index => $usrid){
            $stmt->bindValue($index+5,$usrid , PDO::PARAM_STR);
        }
       $status = $stmt->execute();
        $dbCon = null;
       echo json_encode($status);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
});
// Modify an Existing Project
$app->post('/project/{projectid}', function(Request $request, Response $response){
	$projectid = $request->getAttribute('projectid');
	$sql = "UPDATE `project` SET  Title = :title, Description = :description, Target_Deadline = :deadline, Target_Venue = :target_venue
				WHERE Project_ID = :projectid"; 
	$body = $request->getParsedBody();
	try {
        $dbCon = getConnection();
        $stmt = $dbCon->prepare($sql);  
        $stmt->bindParam("projectid", $projectid);
        $stmt->bindValue("title",$body['title']);
        $stmt->bindValue("deadline",$body['deadline']);
        $stmt->bindValue("description",$body['description']);
        $stmt->bindValue("target_venue",$body['target_venue']);
        $status = $stmt->execute();
        $dbCon = null;
        echo json_encode($status);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }

});
//DELETE research project
$app->get('/project/{projectid}/del', function(Request $request, Response $response){
	$sql = "DELETE FROM `project` WHERE Project_ID = :projectid;";
	$projectid = $request->getAttribute('projectid');
	print_r($projectid);
	 try {
        $dbCon = getConnection();
        $stmt = $dbCon->prepare($sql);  
        $stmt->bindParam("projectid", $projectid);
        $status = $stmt->execute();
        $dbCon = null;
        echo json_encode($status);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
});
// SEARCH Project by Title
$app->get('/search/project/{title}',function(Request $request, Response $response){
	$title = $request->getAttribute('title');
	$sql = "SELECT * from `project` WHERE title like concat('%', :title, '%')";
	try {
		$dbCon = getConnection(); 
		$stmt = $dbCon->prepare($sql);  
		$stmt->bindParam("title", $title);
		$stmt->execute();
		$project->papers = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$dbCon = null;
		echo json_encode($project); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
});
//GENERATE a BibTeXFile
$app->get('/project/{projectid}/BibTeX', function(Request $request, Response $response){
	$projectid = $request->getAttribute('projectid');
	$sql = "SELECT BibTeX FROM `papers` where Paper_ID IN (SELECT Paper_ID from `project-paper` where Project_id = :projectid);";
	try {
		$dbCon = getConnection(); 
		$stmt = $dbCon->prepare($sql);  
		$stmt->bindParam("projectid", $projectid);
		$stmt->execute();
		$project = $stmt->fetchAll(PDO::FETCH_COLUMN);
		$dbCon = null;
		$resp = implode ('\n', $project); 
		echo($resp);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
});
//-------------------------------------------------------------------------------------Paper
//Get A Paper
$app->get('/project/{projectid}/paper/{paperid}', function(Request $request, Response $response){
	$paperid = $request->getAttribute('paperid');
	$sql = "SELECT * FROM `papers` where Paper_ID = :paperid;";
	try {
		$dbCon = getConnection(); 
		$stmt = $dbCon->prepare($sql);  
		$stmt->bindParam("paperid", $paperid);
		$stmt->execute();
		$project = $stmt->fetchObject();
		$dbCon = null;
		echo json_encode($project); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}

});
// Add a new paper to a project
$app->post('/project/{projectid}/paper', function (Request $request,Response $response){
	$sql ="START TRANSACTION;
		INSERT INTO `papers` (`Paper_ID`, `Title`, `PDF`, `Authors`, `Venue`, `Citations`, `Year_Published`, `Keywords`, `BibTeX`, `Summary`) 
    VALUES (NULL, :title,:pdf, :authors, :venue, :citations, :year, :keywords, :bibtex, :summary);
    SELECT @A:=LAST_INSERT_ID();
    INSERT INTO `project-paper` (`Project_ID`, `Paper_ID`) VALUES (:projectid, @A);
	COMMIT;";
	$body = $request->getParsedBody();
	$projectid = $request->getAttribute('projectid');

	try {
        $dbCon = getConnection();

        $stmt = $dbCon->prepare($sql);  
        $stmt->bindValue("title",$body['title']);
        $stmt->bindValue("pdf",$body['pdf']);
        $stmt->bindValue("authors",$body['authors']);
        $stmt->bindValue("venue",$body['venue']);
        $stmt->bindValue("citations",$body['citations']);
        $stmt->bindValue("year",$body['year']);
        $stmt->bindValue("keywords",$body['keywords']);
        $stmt->bindValue("bibtex",$body['bibtex']);
        $stmt->bindValue("summary",$body['summary']);
        $stmt->bindParam("projectid", $projectid);
        $status = $stmt->execute();
        $dbCon = null;
        echo json_encode($status);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }

});
// Modify an Existing Paper in a Project
$app->post('/project/{projectid}/paper/{paperid}', function(Request $request, Response $response){
	$sql= "UPDATE `papers` SET Title= :title, 
									Authors = :authors,
									Venue =:venue, 
									Citations = :citations,
									 Year_Published= :year, 
									 Keywords = :keywords , 
									 BibTeX =:bibtex, 
									 Summary=:summary
	WHERE Paper_ID = :paperid";
	$body = $request->getParsedBody();
	$paperid= $request->getAttribute('paperid');
	$projectid = $request->getAttribute('projectid');
	try {
        $dbCon = getConnection();
        $stmt = $dbCon->prepare($sql);  
        $stmt->bindValue("title",$body['title']);
        $stmt->bindValue("authors",$body['authors']);
        $stmt->bindValue("venue",$body['venue']);
        $stmt->bindParam("citations",$body['citations']);
        $stmt->bindParam("year",$body['year']);
        $stmt->bindValue("keywords",$body['keywords']);
        $stmt->bindValue("bibtex",$body['bibtex']);
        $stmt->bindValue("summary",$body['summary']);
        $stmt->bindParam("paperid", $paperid);
        $status = $stmt->execute();
        $dbCon = null;
        echo json_encode($status);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
});
//modify a pdf paper in a project 
$app->post('/project/{projectid}/paper/{paperid}/ChangePDF', function(Request $request, Response $response){
	$sql= "UPDATE `papers` SET `PDF` = :pdf
	WHERE Paper_ID = :paperid";
	$body = $request->getParsedBody();
	//echo $body['pdf'];
	$paperid= $request->getAttribute('paperid');
	try {
        $dbCon = getConnection();
        $stmt = $dbCon->prepare($sql);  
        $stmt->bindValue("pdf",$body['pdf']);
        $stmt->bindParam("paperid", $paperid);
        $status = $stmt->execute();
        $dbCon = null;
        echo json_encode($status);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
});
//DELETE research paper
$app->get('/project/{projectid}/paper/{paperid}/del', function(Request $request, Response $response){
	$sql = "DELETE FROM papers WHERE Paper_ID = :paperid;";
	$paperid = $request->getAttribute('paperid');
	 try {
        $dbCon = getConnection();
        $stmt = $dbCon->prepare($sql);  
        $stmt->bindParam("paperid", $paperid);
        $status = $stmt->execute();
        $dbCon = null;
        echo json_encode($status);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
});
// SEARCH paper by Title
$app->get('/search/paper/title/{title}',function(Request $request, Response $response){
	$title = $request->getAttribute('title');
	$sql = "SELECT * FROM papers where Title like concat('%', :title, '%');";
	try {
		$dbCon = getConnection(); 
		$stmt = $dbCon->prepare($sql);  
		$stmt->bindValue("title", $title);
		$stmt->execute();
		$project->papers = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$dbCon = null;
		echo json_encode($project); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
});
// SEARCH paper by Authors
$app->get('/search/paper/author/{author}',function(Request $request, Response $response){
	$author = $request->getAttribute('author');
	$sql = "SELECT * FROM papers where Authors like concat('%', :author, '%');";
	try {
		$dbCon = getConnection(); 
		$stmt = $dbCon->prepare($sql);  
		$stmt->bindValue("author", $author);
		$stmt->execute();
		$project->papers= $stmt->fetchAll(PDO::FETCH_ASSOC);
		$dbCon = null;
		echo json_encode($project); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
});
$app->get('/search/paper/keywords/{keyword}',function(Request $request, Response $response){
	$keyword = $request->getAttribute('keyword');
	$sql = "SELECT * FROM papers where keywords like concat('%', :keyword, '%');";
	try {
		$dbCon = getConnection(); 
		$stmt = $dbCon->prepare($sql);  
		$stmt->bindValue("keyword", $keyword);
		$stmt->execute();
		$project = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$dbCon = null;
		echo json_encode($project); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
});
//Get USERS LIST:

$app->get('/users',function(Request $request, Response $response){
	global $auth0Api;;	
	$usersList = $auth0Api->users->search([ "q" => "" ]);
	echo json_encode($usersList);
});
//---------------------------------------------------------------------------------------
// Run app
$app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response;
});

$app->add(function ($req, $res, $next) {
    $response = $next($req, $res);
    return $response
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); //temporary
});

$app->run();
