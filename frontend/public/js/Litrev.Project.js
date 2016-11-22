LitRev.Project = function() {
	
	conf = {
		"ID" : null,
		"ProjectViewModel": null,
		"Curently_Editing_Paper_ID":null,
		"filter_url":"",
		"filter_showing": false
	};
	
	var ProjectViewModel = function(data) {
		this.Project_ID = data.Project_ID;
		this.Title = ko.observable(data.Title);
		this.Description = ko.observable(data.Description);
		this.Target_Deadline = ko.observable(data.Target_Deadline);
		this.Target_Venue = ko.observable(data.Target_Venue);
		this.papers = ko.observableArray(data.papers);
	}
	
	var _handleViewLoad = function() {
		//$("#project_filters_toggle_open").on("mousedown", openFiltersDialog);


		$("#project_filters_toggle").on("mousedown", function(event){
			

			if(conf.filter_showing){
				$("#project_filters").hide();
				$(event.target).css("background-color", "#FFFFFF");
				conf.filter_showing = false;
			}else{
				$("#project_filters").show();
				$(event.target).css("background-color", "#333333");
				conf.filter_showing = true;
			}
		});

		//$("#project_add_paper").on("mousedown", openAddNewPaperDialog);
		
		$("#project_filters_toggle_close").on("mousedown", closeFiltersDialog);
		$("#project_new_paper_toggle_close").on("mousedown", closeAddNewPaperDialog);
		
		
		$("#project_new_paper_save_button").on("mousedown", closeAddNewPaperDialog);
		$("#project_new_paper_cancel_button").on("mousedown", closeAddNewPaperDialog);
		


		$("#project_filter_submit").on("click", function() {
			
			var project_filter_type = $("#project_filter_type option:selected").val();
			var project_filter_value = $("#project_filter_value").val();


	        var request_url = "https://litrev.dyn.wpi.edu/LitRev/backend/LitRevBackend";

	        //console.log(project_filter_type);

			if(project_filter_value !== "") {

				switch(project_filter_type) {
				    case "Author":
				        request_url += "/search/paper/author/" + project_filter_value
				        break;
				    case "Title":
				        request_url += "/search/paper/title/" + project_filter_value
				        break;
				    case "Keywords":
				        request_url += "/search/paper/keywords/" + project_filter_value
				        break;
				}
				conf.filter_url = request_url;
				//console.log(request_url);
				$.get(conf.filter_url, function(data){
					conf.ProjectViewModel.papers(JSON.parse(data).papers);
				});

			}
			return false;
		});

		$("#project_filter_clear").on("mousedown", function(){
			$("#project_filter_value").val("");
			conf.filter_url = "";
			refreshTableData();
			return false;
		})/* */

		$("#project_delete").on("mousedown", function() {
			if(confirm("Are you sure you want to permenantly remove this project?")) {
				
				var request_url = "https://litrev.dyn.wpi.edu/LitRev/backend/LitRevBackend/project/"
					 + conf.ID + "/del";

				$.get(request_url, function(data) {
					LitRev.Profile.init();
					
				});
			}

		});

		$("#project_bibtex_download").attr("href", "https://litrev.dyn.wpi.edu/LitRev/backend/LitRevBackend/project/"+conf.ID+"/BibTeX");


		var request_url = "https://litrev.dyn.wpi.edu/LitRev/backend/LitRevBackend/project/" + conf.ID;
		$.get(request_url, procesTableData);

		
	};
	
	var init = function(projectId) {
		conf.ID = projectId;

		$("#project_menu").show();

		$("#mainContent").load("snippets/project.html", _handleViewLoad);

		//----------------------------------------
		//TODO: on open on close events for the Modals
		$("#addPaperModal").on('shown.bs.modal', function (data) {

		});
		$("#addPaperModal").on('hidden.bs.modal', function (data) {
			$("#addPaper_title").val("");
			$("#addPaper_authors").val("");
			$("#addPaper_venue").val("");
			$("#addPaper_citations").val("");
			$("#addPaper_year").val("");
			$("#addPaper_keywords").val("");
			$("#addPaper_blbtex").val("");	
			$("#addPaper_summary").val("");
			$("#addPaper_pdf").val("");
		});
		$("#addPaperSubmit").on('click', function (data) {
			var addPaper_pdf = $("#addPaper_pdf"),
				reader = new FileReader();

	        reader.onload = function(event) {
	        	//console.log("onload");


	        	var request_url = "https://litrev.dyn.wpi.edu/LitRev/backend/LitRevBackend/project/"+
				conf.ID+"/paper",
				addPaper_title = $("#addPaper_title"),
				addPaper_authors = $("#addPaper_authors"),
				addPaper_venue = $("#addPaper_venue"),
				addPaper_citations = $("#addPaper_citations"),
				addPaper_year = $("#addPaper_year"),	
				addPaper_keywords = $("#addPaper_keywords"),
				addPaper_blbtex = $("#addPaper_blbtex"),				
				addPaper_summary = $("#addPaper_summary"),
				encodePDF = btoa(event.target.result);

				var requestJSON = {
			        "title": addPaper_title.val(),
			        "pdf": encodePDF,
			        "authors": addPaper_authors.val(),
			        "venue": addPaper_venue.val(),
			        "citations": addPaper_citations.val(),
			        "year": addPaper_year.val(),
			        "keywords": addPaper_keywords.val(),
			        "bibtex": addPaper_blbtex.val(),
			        "summary": addPaper_summary.val()
				};


				$.post(request_url, requestJSON).done(function( data ) {
				    if(data === "true"){
				    	refreshTableData();
				    } else {
				    	alert("Something went horribly, horribly wrong");
				    }
				});
	        };


        	reader.readAsBinaryString(addPaper_pdf[0].files[0]);

		});

		//----------------------------------------
		$("#editPaperModal").on('shown.bs.modal', function (data) {

			var paperid = $(data.relatedTarget).attr("paperid"),
				request_url = "https://litrev.dyn.wpi.edu/LitRev/backend/LitRevBackend/project/"+conf.ID+"/paper/"+paperid;
			
			//console.log(request_url);

			$.get(request_url, function(data) {


				//console.log(data);

				var responceJson = JSON.parse(data);



				var editPaper_title = $("#editPaper_title"),
				editPaper_authors = $("#editPaper_authors"),
				editPaper_venue = $("#editPaper_venue"),
				editPaper_citations = $("#editPaper_citations"),
				editPaper_year = $("#editPaper_year"),
				editPaper_keywords = $("#editPaper_keywords"),
				editPaper_blbtex = $("#editPaper_blbtex"),
				editPaper_summary = $("#editPaper_summary");


				editPaper_title.val(responceJson.Title);
				editPaper_authors.val(responceJson.Authors);
				editPaper_venue.val(responceJson.Venue);
				editPaper_citations.val(responceJson.Citations);
				editPaper_year.val(responceJson.Year_Published);
				editPaper_keywords.val(responceJson.Keywords);
				editPaper_blbtex.val(responceJson.BibTeX);
				editPaper_summary.val(responceJson.Summary);

				conf.Curently_Editing_Paper_ID = responceJson.Paper_ID;


			});



		});
		$("#editPaperModal").on('hidden.bs.modal', function (data) {

		});

		$("#editPaperSubmit").on('click', function () {


			alert("sumbinting dialog...");
				var Paper_ID = conf.Curently_Editing_Paper_ID;
				var request_url = "https://litrev.dyn.wpi.edu/LitRev/backend/LitRevBackend/project/"+conf.ID+"/paper/"+Paper_ID;


				var editPaper_title = $("#editPaper_title"),
				editPaper_authors = $("#editPaper_authors"),
				editPaper_venue = $("#editPaper_venue"),
				editPaper_citations = $("#editPaper_citations"),
				editPaper_year = $("#editPaper_year"),
				editPaper_keywords = $("#editPaper_keywords"),
				editPaper_blbtex = $("#editPaper_blbtex"),
				editPaper_summary = $("#editPaper_summary");

				var requestJSON = {
			        "title": editPaper_title.val(),
			        "authors": editPaper_authors.val(),
			        "venue": editPaper_venue.val(),
			        "citations": editPaper_citations.val(),
			        "year": editPaper_year.val(),
			        "keywords": editPaper_keywords.val(),
			        "bibtex": editPaper_blbtex.val(),
			        "summary": editPaper_summary.val()
				};

				//console.log(JSON.stringify(requestJSON))

				//console.log(request_url);
				$.post(request_url, requestJSON).done(function( data ) {
					//console.log(data);
				    if(data === "true"){
				    	refreshTableData();
				    } else {
				    	alert("Something went horribly, horribly wrong");
				    }
				});
		});


		$("#editProjectModal").on('shown.bs.modal', function (data) {
			var request_url = "https://litrev.dyn.wpi.edu/LitRev/backend/LitRevBackend/project/"+conf.ID;
			$.get(request_url, function(data) {
				var responceJson = JSON.parse(data);

				$("#edit_project_title").val(responceJson.Title);
				$("#edit_project_description").val(responceJson.Description);
				$("#edit_project_venue").val(responceJson.Target_Venue);
				$("#edit_project_deadline").val(responceJson.Target_Deadline);
			});
		});
		$("#editProjectModal").on('hidden.bs.modal', function (data) {
			$("#edit_project_title").val("");
			$("#edit_project_description").val("");
			$("#edit_project_venue").val("");
			$("#edit_project_deadline").val("");
		});
		$("#editProjectSubmit").on('click', function (data) {
			var request_url = "https://litrev.dyn.wpi.edu/LitRev/backend/LitRevBackend/project/"+conf.ID;
			var edit_project_title = $("#edit_project_title").val();
			var edit_project_description = $("#edit_project_description").val();
			var edit_project_venue = $("#edit_project_venue").val();
			var edit_project_deadline = $("#edit_project_deadline").val();

			var requestJSON = {
				title: edit_project_title,
				description: edit_project_description,
				deadline: edit_project_deadline,
				target_venue: edit_project_venue
			};

			$.post(request_url, requestJSON).done(function(data){
				//console.log(data);
				if(data === "true") {
					conf.ProjectViewModel.Title(edit_project_title);
					conf.ProjectViewModel.Description(edit_project_description);
					conf.ProjectViewModel.Target_Deadline(edit_project_deadline);
					conf.ProjectViewModel.Target_Venue(edit_project_venue);
				}else{
					alert("Could not update project data");
				}

			});

		});
		//----------------------------------------
		LitRev.Paper.init(conf.ID);
	};
	
	var refreshTableData = function() {
		var request_url;

		if(conf.filter_url !== "") {
			request_url = conf.filter_url;
		}else{
			request_url = "https://litrev.dyn.wpi.edu/LitRev/backend/LitRevBackend/project/" + conf.ID;
		}

		$.get(request_url, function(data) {
			var responceJson = JSON.parse(data);
			conf.ProjectViewModel.papers(responceJson.papers)
		});
	}

	var procesTableData = function(data) {

		//console.log(data);

		var projectTabeObj = JSON.parse(data);

		//console.log(projectTabeObj);
		conf.ProjectViewModel = new ProjectViewModel(projectTabeObj);
		ko.applyBindings(conf.ProjectViewModel, document.getElementById("project_view"));

	}

	/*var openFiltersDialog = function() {
		$("#project_filters").css({"display": "block"});
		$("#project_filters").animate({
		    height: conf.HEIGHT_OF_DIALOG_PANES + "px"
		  }, 600);
	};/* */
	
	var closeFiltersDialog = function() {
		$("#project_filters").animate({
		    height: "0px"
		  }, 600, function(){
			  $("#project_filters").css({"display": "none"});
		  });
	}
	
	var openAddNewPaperDialog = function(event, type) {
		var type = type || "new";
		
		$("#project_new_paper").css({"display": "block"});
		$("#project_new_paper").animate({
		    height: conf.HEIGHT_OF_DIALOG_PANES + "px"
		  }, 600);
	};
	
	var closeAddNewPaperDialog = function() {
		$("#project_new_paper").animate({
		    height: "0px"
		  }, 600, function(){
			  $("#project_new_paper").css({"display": "none"});
		  });
	}
	
	var deletePaper = function(target) {
		
		if(confirm("Are you sure you want this paper to be delete?")) {
			var paperid = $(target).attr("paperid");
			var request_url = "https://litrev.dyn.wpi.edu/LitRev/backend/LitRevBackend/project/"
						+conf.ID+"/paper/"+paperid+"/del";

			$.get(request_url, function(data) {
				if(data === "true"){
					refreshTableData();
				} else {
					alert("Delete didnt work!")
				}
			});
		}

	};
	
	var openPaper = function(origin) {
		
	};
	
	return {
		init: init,
		deletePaper: deletePaper,
		openPaper: openPaper
	};
}();

LitRev.Project.tempData = {
	
};
