LitRev.NewProject = function() {

	var arrayOfValues = [];

	var mapOfNames = {};
	var colaborators = null;

	var init = function() {
		$("#mainContent").load("snippets/newproject.html", _handleViewLoad);
	};

	///////////////////////////////////////////////////////////////////////////
	var _handleViewLoad = function() {


		$("#addProjectSubmit").on("mousedown", submitNewProject);

		var request_url = "https://litrev.dyn.wpi.edu/LitRev/backend/LitRevBackend/users";
		$.get(request_url, function(data){
			var responceJson = JSON.parse(data);
			for(var i = 0; i < responceJson.length; i++) {
				arrayOfValues.push(responceJson[i].user_metadata.full_name);
				mapOfNames[responceJson[i].user_metadata.full_name] = responceJson[i].user_id.replace("auth0|", "");
			}

			activateOutocomplete();
		})
	};

	///////////////////////////////////////////////////////////////////////////
	var submitNewProject = function(){
		var add_project_title = $("#add_project_title");
		var add_project_description = $("#add_project_description");
		var add_project_venue = $("#add_project_venue");
		var add_project_deadline = $("#add_project_deadline");

		var profile = JSON.parse(localStorage.getItem('profile'));


		var current_user_id = profile.user_id.replace("auth0|", "");

		//add_project_title.val();
		//add_project_description.val();
		//add_project_venue.val();
		//add_project_deadline.val();

		var request_url = "https://litrev.dyn.wpi.edu/LitRev/backend/LitRevBackend/project";
		var selectedColaborators = colaborators.tag.values;
		var selectedIds = [];

		//console.log(mapOfNames);

		for(var i = 0; i < selectedColaborators.length; i++) {

			console.log(selectedColaborators[i]);
			
			//console.log(mapOfNames[selectedColaborators[i]]);

			if( mapOfNames.hasOwnProperty(selectedColaborators[i]) ) {
				selectedIds.push(mapOfNames[selectedColaborators[i]]);
			}
			
		}

		//console.log(selectedIds);

		//current_user_id

		if( selectedIds.indexOf(current_user_id) === -1 ){
			selectedIds.push(current_user_id);
		}


		var requestJson = {
			"title": add_project_title.val(),
			"deadline": add_project_deadline.val(),
			"description": add_project_description.val(),
			"target_venue": add_project_venue.val(),
			"userids": selectedIds
		};





		
		$.post(request_url, requestJson).done(function(data){

			
			if(data === "true") {
				LitRev.Profile.init();
			}else{
				alert("Unable to create project");
			}

		});/* */

	}

	///////////////////////////////////////////////////////////////////////////
	var activateOutocomplete = function() {

		colaborators = new Taggle('add_project_colaborators',{
			placeholder: "Who are you working with?", 
			allowDuplicates: false
		});
		
		var container = colaborators.getContainer();
		var input = colaborators.getInput();

		
		$(input).autocomplete({
		    source: arrayOfValues, // See jQuery UI documentaton for options
		    appendTo: container,
		    duplicateTagClass: "bounce",
		    position: { at: "left bottom", of: container },
		    select: function(event, data) {

		        event.preventDefault();
		        //Add the tag if user clicks
		        if (event.which === 1) {
		            colaborators.add(data.item.value);
		        }

		    }
		});

	};

	///////////////////////////////////////////////////////////////////////////
	return {
		init: init
	};
}();