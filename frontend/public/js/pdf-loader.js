var pagenbr = 1;
var currPageNumber = 1;
var pdfL=null; 
var title = "";
function readpdf(pdf, cpg) {
	console.log(cpg);
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


//DownloadPDF

/*function edit_pdf_menu_toggle(){
	console.log("echo");
	 $("#edit_pdf_menu").toggle('hidden');
}*/
//---JQuery Stuff
//$modal = $("#PDFModal")
$("#PDFModal").on('shown.bs.modal', function(){
	var request_url = "https://litrev.dyn.wpi.edu/LitRev/backend/LitRevBackend/project/1/paper/6";
	$.get(request_url, function(data) {
		currPageNumber = 1;
		responseJSON = JSON.parse(data);
		pdfL = atob(responseJSON.PDF);
		title = responseJSON.Title;
		//savetoDisk();
		readpdf(pdfL, currPageNumber);
	});
});
$("#PDFModal").on('hidden.bs.modal', function(){
	console.log("closed");
	pagenbr = 1;
	currPageNumber = 1;
	pdfL=null; 
	title = "";

});


$("#btn-prv").on('click',function(){
	var pageNumber = Math.min(pagenbr, currPageNumber + 1);
    if (pageNumber !== currPageNumber) {
        currPageNumber = pageNumber;
        console.log(currPageNumber);
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


