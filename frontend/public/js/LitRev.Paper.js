LitRev.Paper = function() {

	var pagenbr = 1;
	var currPageNumber = 1;
	var pdfL= null; 
	var title = "";
	var currentProjectID;

	var init = function(projectID) {
		currentProjectID = projectID;	
		$("#PDFModal").on('shown.bs.modal', function(data){
			
			var paperid = $(data.relatedTarget).attr("paperid");


			
			var request_url = "https://litrev.dyn.wpi.edu/LitRev/backend/LitRevBackend/project/"+
				currentProjectID+"/paper/"+paperid;

			$.get(request_url, function(data) {
				currPageNumber = 1;
				responseJSON = JSON.parse(data);
				pdfL = atob(responseJSON.PDF);
				title = responseJSON.Title;

				if(!responseJSON.PDF) {
					alert("no pdf available");

					var canvas = document.getElementById('the-canvas');

					var ctx = canvas.getContext("2d");

					ctx.clearRect(0, 0, $(canvas).width(), $(canvas).height());
					return;

				}
				readpdf(pdfL, currPageNumber);
			});

		});

		$("#PDFModal").on('hidden.bs.modal', function(){
			//console.log("closed");
			pagenbr = 1;
			currPageNumber = 1;
			pdfL=null; 
			title = "";

		});


		$("#btn-prv").on('click',function(){
			var pageNumber = Math.min(pagenbr, currPageNumber + 1);
		    if (pageNumber !== currPageNumber) {
		        currPageNumber = pageNumber;
		        //console.log(currPageNumber);
		        readpdf(pdfL, currPageNumber);
		    }
		});

		$("#btn-nxt").on('click',function(){
			var pageNumber = Math.max(pagenbr, currPageNumber - 1);
		    if (pageNumber !== currPageNumber) {
		        currPageNumber = pageNumber;
		        readpdf(pdfL, currPageNumber);
		    }
		});

		$("#dwnload").on('click', function (){
			var blob = new Blob([pdfL], {type: "application/pdf"});
			saveAs(blob, title+".pdf");
		});

		$("#editpdf").on("click",function(){
			 $("#edit_pdf_menu").toggleClass('hidden');
		});

	};
		
	var readpdf = function (pdf, cpg) {
		//console.log(cpg);
		PDFJS.getDocument({
			data: pdf
		}).then(function(pdf) {
			pagenbr = pdf.pdfInfo.numPages;
			var str = cpg +"/"+ pagenbr;
			$("#page-count").text(str);
			pdf.getPage(cpg).then(function(page) {
				var scale = 1.40;
				var viewport = page.getViewport(scale);

				// Prepare canvas using PDF page dimensions.
				var canvas = document.getElementById('the-canvas');
				var context = canvas.getContext('2d');
				canvas.height = viewport.height;
				canvas.width = viewport.width;

				// Render PDF page into canvas context.
				var renderContext = {
					canvasContext: context,
					viewport: viewport
				};
				page.render(renderContext);
			});
		});
	};


	return {
		init: init
	};
}();

