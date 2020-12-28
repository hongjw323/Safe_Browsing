document.addEventListener('DOMContentLoaded', function() {
var checkbox = document.getElementById('myonoffswitch3');
 checkbox.addEventListener('click', function() {
	if(checkbox.checked == true){
		var myNotificationID = null;
		chrome.notifications.create({
			  type:     'basic',
			  iconUrl:  'warning.png',
			  title:    'A! Safe Browsing',
			  message:  '브라우저 속도가 느려질 수도 있습니다.',
			}, function(id) {
				myNotificationID = id;
		});
	}
 });
});

document.addEventListener('DOMContentLoaded', function() {
var detail = document.getElementById('details');
 detail.addEventListener('click', function() {
	window.open('https://www.aisafebrowsing.ga/');
 });
});
 
document.addEventListener('DOMContentLoaded', function() {
var detail = document.getElementById('details2');
 detail.addEventListener('click', function() {
	window.open('https://www.aisafebrowsing.ga/');
 });
});