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

//Helper: map priority to CSS class
function getPriorityClass(priority) {
  if (!priority) return 'priority-low';
  const p = priority.toLowerCase();
  if (p === 'high') return 'priority-high';
  if (p === 'medium') return 'priority-medium';
  return 'priority-low';
};

//Helper: map label to CSS class
function getLabelClass(label) {
  if (!label) return 'label-default';
  const l = label.toLowerCase();
  if (l.includes('bug')) return 'label-bug';
  if (l.includes('enhancement')) return 'label-enhancement';
  if (l.includes('help')) return 'label-help';
  return 'label-default';
};

// Helper: map label to icon
function getLabelIcon(label) {
  if (!label) return '<i class="fa-solid fa-life-ring"></i>';
  const l = label.toLowerCase();
  if (l.includes('bug')) return '<i class="fa-solid fa-bug"></i>';
  return '<i class="fa-solid fa-life-ring"></i>';
};

// Helper: format date
function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });
};

//Render issues as cards
function renderIssues(issues) {
  const grid = document.getElementById('issuesGrid');
  const noResults = document.getElementById('noResults');
  document.getElementById('total').textContent = issues.length;


// Show 'No results' if empty
if (issues.length === 0) {
    grid.innerHTML = '';
    grid.classList.add('hidden');
    noResults.classList.remove('hidden');
    return;
  };

  noResults.classList.add('hidden');
  grid.classList.remove('hidden');
// Render issue cards
  grid.innerHTML = issues.map(issue => {
    const isOpen = issue.status?.toLowerCase() === 'open';
    const borderClass = isOpen ? 'card-open' : 'card-closed';
    const priorityClass = getPriorityClass(issue.priority);
    const labels = Array.isArray(issue.labels)
      ? issue.labels
      : issue.label ? [issue.label] : [];
    const labelsHTML = labels.map(l => `<span class="text-xs px-2 py-0.5 rounded-full font-medium ${getLabelClass(l)}">${getLabelIcon(l)} ${l}</span>`).join('');
    const statusIcon = isOpen
      ? `<img src="./assets/Open-Status.png" class="w-5 h-5" alt="open">`
      : `<img src="./assets/Closed-Status.png" class="w-5 h-5" alt="closed">`;

    return `
      <div class="bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow ${borderClass} flex flex-col gap-2" onclick="openModal(${issue.id})">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1">${statusIcon}</div>
          <span class="text-xs px-2 py-0.5 rounded-full font-medium ${priorityClass}">${issue.priority?.toUpperCase() || 'N/A'}</span>
        </div>
        <h3 class="font-bold text-gray-800 text-sm leading-snug">${issue.title || 'No Title'}</h3>
        <p class="text-gray-400 text-xs leading-relaxed line-clamp-2">${issue.description || ''}</p>
        <div class="flex flex-wrap gap-1 mt-1">${labelsHTML}</div>
        <div class="mt-auto pt-2 border-t border-gray-100 text-xs text-gray-400">
          <p>#${issue.id} by ${issue.author || 'unknown'}</p>
          <p>${formatDate(issue.created_at || issue.createdAt)}</p>
        </div>
      </div>
    `;
  }).join('');
};
