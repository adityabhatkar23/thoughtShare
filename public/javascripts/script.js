

function timeAgo(date) {
	const now = new Date();
	const secondsAgo = Math.floor((now - new Date(date)) / 1000);
  
	if (secondsAgo < 60) return `${secondsAgo} second${secondsAgo !== 1 ? 's' : ''} ago`;
  
	const minutesAgo = Math.floor(secondsAgo / 60);
	if (minutesAgo < 60) return `${minutesAgo} minute${minutesAgo !== 1 ? 's' : ''} ago`;
  
	const hoursAgo = Math.floor(minutesAgo / 60);
	if (hoursAgo < 24) return `${hoursAgo} hour${hoursAgo !== 1 ? 's' : ''} ago`;
  
	const daysAgo = Math.floor(hoursAgo / 24);
	if (daysAgo < 30) return `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`;
  
	const monthsAgo = Math.floor(daysAgo / 30);
	if (monthsAgo < 12) return `${monthsAgo} month${monthsAgo !== 1 ? 's' : ''} ago`;
  
	const yearsAgo = Math.floor(monthsAgo / 12);
	return `${yearsAgo} year${yearsAgo !== 1 ? 's' : ''} ago`;
  }
  
  document.querySelectorAll('[id^="timeAgo-"]').forEach(function(el) {
	const postDate = el.getAttribute('data-createdat'); 
	el.innerHTML = timeAgo(postDate);
  });
  