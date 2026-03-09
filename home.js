// API Endpoints
const apiALL = 'https://phi-lab-server.vercel.app/api/v1/lab/issues'
const apiSingle = 'https://phi-lab-server.vercel.app/api/v1/lab/issue'
const apiSearch = 'https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q='

// Global variable
let allIssues = [];
let currentFilter = 'all';

//  Fetch all issues from API
async function fetchIssues() {
  showLoader(true); // show loading animation
  try {
    const res = await fetch(apiALL);
    const data = await res.json();
    console.log('Fetched data:', data);
    allIssues = data.data || data || [];
    document.getElementById('total').textContent = allIssues.length;
    renderIssues(allIssues);
  } catch (err) {
    console.error('Error fetching issues:', err);
  } finally {
    showLoader(false); // hide loader after fetch
  }
};

// Loader toggle
function showLoader(show) {
  document.getElementById('loader').classList.toggle('hidden', !show);
  document.getElementById('issuesGrid').classList.toggle('hidden', show);
};