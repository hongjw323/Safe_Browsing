document.getElementById('target').addEventListener('click', function () { 
  var url_list = document.querySelector('#url_list').value;
  localStorage.setItem('url_listWords',url_list);
});

document.addEventListener('DOMContentLoaded', function() {
var checkbox = document.getElementById('target');
 checkbox.addEventListener('click', function() {
		var myNotificationID = null;
		chrome.notifications.create({
			  type:     'basic',
			  iconUrl:  'save.png',
			  title:    'A! Safe Browsing',
			  message:  '저장되었습니다.',
			}, function(id) {
				myNotificationID = id;
		});
 });
});