;( function($, window, document) {
	var reader,
			dataList = [],
			badgeList = [],
			badgeSize = { width: 2.25, height: 3.5},
			pageSize = { width: 11, height: 8.5},
			bgImgURL = 'images/badge.jpg',
			pdfFileName = "g0v NYC Hackathon Badges.pdf";
	
	// Check if choose any file
	document.getElementById('files').addEventListener('change', loadFile, false);

	// Load in file
	function loadFile(evt) {
		reader = new FileReader();

		reader.onload = function(e) {
			var data = reader.result;

			// convert to JSON data
			dataList = csvJSON(data);

			// Start marking badges
			createBadge();
		}

		reader.readAsText(evt.target.files[0]);
	}

	// Convert CSV to JSON
	function csvJSON(data) {
		var lines = data.split("\n");

		var result = [];

		var headers=lines[0].split(",");

		for(var i=1;i<lines.length;i++){

			var obj = {};
			var currentline=lines[i].split(",");

			for(var j=0;j<headers.length;j++){
				obj[headers[j]] = currentline[j];
			}

			// Check if current item is not empty
			if (obj['Order #']) {
				result.push(obj);
			}
	  }
	  
	  return result;
	}

	// Create Badge
	function createBadge() {
		// Reorangize the data
		filterData();

		// Load in image
		loadImage();
	}

	// Reorangize the data
	function filterData() {

		dataList.forEach(function(data) {
			var attendee = {};

			// Ticket Type
			var ticketType = data['Ticket Type'];
			
			if (ticketType.indexOf('Volunteer') != -1) {
				attendee.ticketType = 'Staff';
			} else if (ticketType.indexOf('Hackathon ticket') != -1) {
				attendee.ticketType = 'Attendee';
			} else if (ticketType.indexOf('Hacker Forum only ticket') != -1) {
				attendee.ticketType = 'Forum';
			} else {
				return;
			}

			// First Name
			attendee.firstName = data['First Name'];

			// Last Name
			attendee.lastName = data['Last Name'];

			// Skill
			var skill = data['Skills'];

			if (skill.indexOf('Coder') != -1) {
				attendee.skill = 'Coder';
			} else if (skill.indexOf('Project Manager') != -1) {
				attendee.skill = 'Project Manager';
			} else if (skill.indexOf('Designer') != -1) {
				attendee.skill = 'Designer';
			}

			badgeList.push(attendee);
		});
	}

	// Load in badge background image
	function loadImage() {
		var img = new Image();
		var dataURL;

		img.src = bgImgURL;

		img.onload = function() {
			var canvas = document.createElement('canvas');
			canvas.width = img.width;
			canvas.height = img.height;

			var context = canvas.getContext('2d');
			context.drawImage(img,0,0);

			dataURL = canvas.toDataURL('image/jpeg');

			createPDF(dataURL);
		}
	}

	// Create badge PDF
	function createPDF(imageData) {
		var midX = pageSize.width / 2;
		var midY = pageSize.height / 2;

		var doc = new jsPDF({
		  orientation: 'landscape',
		  unit: 'in',
		  format: [pageSize.height, pageSize.width]
		});

		for (var i = 0; i < badgeList.length; i++) {

			var itemNum = i % 8;	

			// If first item on the page then add new page, not include initial page
			if (itemNum == 0 && i != 0) {
				doc.addPage();
			}

			// If first time on the page then create the crop mark
			if (itemNum == 0) {
				createCropMark();
			}

			// Badge position
			var x = ((itemNum % 4) - 2) * badgeSize.width + midX;
			var y = (Math.floor(itemNum / 4) - 1) * badgeSize.height + midY;

			// Add background image
			doc.addImage(imageData, 'JPEG', x, y, badgeSize.width, badgeSize.height);

			// First Name
			doc.setFontSize(19);
			doc.text(x + 0.29, y + 2.45, badgeList[i].firstName);

			// Last Name
			doc.setFontSize(13);
			doc.text(x + 0.29, y + 2.68, badgeList[i].lastName);

			// Type
			doc.setFontSize(8);
			doc.text(x + 0.29, y + 3.05, badgeList[i].ticketType);

			// Skill
			if (badgeList[i].skill) {
				doc.setFontSize(8);
				doc.text(x + 0.29, y + 3.25, badgeList[i].skill);
			}
		}

		// Create crop mark
		function createCropMark() {
			var bw = badgeSize.width;
			var bh = badgeSize.height
			var x = midX - (bw * 2);
			var y = midY - bh;

			doc.setLineWidth(0.007);

			// Row 1 - 1
			doc.line(x - .3, y, x - .1, y);
			doc.line(x, y - .3, x, y - .1);
			// Row 1 - 2
			doc.line(x + bw, y - .3, x + bw, y - .1);
			// Row 1 - 3
			doc.line(x + bw * 2, y - .3, x + bw * 2, y - .1);
			// Row 1 - 4
			doc.line(x + bw * 4 + .3, y, x + bw * 4 + .1, y);
			doc.line(x + bw * 3, y - .3, x + bw * 3, y - .1);
			doc.line(x + bw * 4, y - .3, x + bw * 4, y - .1);
			// Row 2 - 1
			doc.line(x - .3, y + bh, x - .1, y + bh);
			doc.line(x - .3, y + bh * 2, x - .1, y + bh * 2);
			doc.line(x, y + bh * 2 + .3, x, y + bh * 2 + .1);
			// Row 2 - 2
			doc.line(x + bw, y + bh * 2 + .3, x + bw, y + bh * 2 + .1);
			// Row 2 - 3
			doc.line(x + bw * 2, y + bh * 2 + .3, x + bw * 2, y + bh * 2 + .1);
			// Row 2 - 4
			doc.line(x + bw * 4 + .3, y + bh, x + bw * 4 + .1, y + bh);
			doc.line(x + bw * 4 + .3, y + bh * 2, x + bw * 4 + .1, y + bh * 2);
			doc.line(x + bw * 3, y + bh * 2 + .3, x + bw * 3, y + bh * 2 + .1);
			doc.line(x + bw * 4, y + bh * 2 + .3, x + bw * 4, y + bh * 2 + .1);
		}
		
		// Save PDF
		doc.save(pdfFileName);
	}
})( jQuery, window, document );