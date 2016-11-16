LitRev.Profile = function() {
	
	var init = function() {
		$("#project_menu").hide();
		$("#mainContent").load("snippets/profile.html", setupPage);
	};
	
	var setupPage = function() {
		var profile = JSON.parse(localStorage.getItem('profile')),
		user_id = profile.user_id.replace("auth0|", ""),


		//TODO: make the base url global
		request_url = "https://litrev.dyn.wpi.edu/LitRev/backend/LitRevBackend/"+user_id+"/projects";


		//console.log(request_url);

//		request_url = "https://litrev.dyn.wpi.edu/LitRev/backend" + "?user_id=" + user_id;

		$("#profile_info_name").html(profile.user_metadata.full_name);
		$("#profile_info_position").html(profile.user_metadata.Position);
		$("#profile_info_email").html(profile.email);
		$("#profile_info_iamge").attr("src", profile.picture);

		$.get(request_url, loadProjectsList);
		//loadProjectsList();
	};

	var loadProjectsList = function(data) {
		var responceAsJson = JSON.parse(data);
		var profile_projectList = $("#profile_projectList");
		var project_title_li;
		var project_description_li;

		/*

			Target_Deadline : "2016-10-31"
			Target_Venue : "ACM SIGTEST"

		/* */

		for(var i = 0; i < responceAsJson.length; i++) {

			var projectObj = responceAsJson[i];

			project_title_li = $("<li class='projectTitle' data-projectid='"+projectObj.Project_ID+"'>"+projectObj.Title+"</li>");
			project_title_li.on("mousedown", openProject);
			
			profile_projectList.append(project_title_li);

			project_description_li = $("<li class='projectDescription'>"+projectObj.Description+"</li>");
			profile_projectList.append(project_description_li);

			//TODO: Add Target Deadline and Venue to the list.
			//TODO: add bio .
			//var project_venue
			//var project_deadline

		}

	};

	var openProject = function(event) {

	

		var projectid = $(event.target).data("projectid");

		LitRev.Project.init(projectid);


	}
	
	return {
		init: init,
		openProject: openProject
	};
}();

LitRev.Profile.tempData = {
	
}
