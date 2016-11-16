var LitRev = function() {
	
	var init = function() {
		LitRev.Profile.init();
	};
	
	var logout = function() {
		$("#mainContent").html("");
		$.get ('https://rom.eu.auth0.com/v2/logout?returnTo=https://litrev.dyn.wpi.edu/LitRev/frontend/public/html/index.html&client_id=rVaeNCrDTttA0F5dYCPR9sbag1klfFe');		
		localStorage.clear();
		lock.show({rememberLastLogin: false});
	};
	
	return {
		init: init,
		logout: logout
	};
}();
