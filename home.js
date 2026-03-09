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

//all tab filtering
function filterIssues(type) {
  currentFilter = type;
  const baseClass = 'bg-white text-gray-600 px-5 py-2 w-24 rounded text-sm font-semibold border border-gray-200 hover:bg-gray-50';
  const activeClass = 'tab-active px-5 py-2 w-24 rounded text-sm font-semibold';

  ['tabAll', 'tabOpen', 'tabClosed'].forEach(id => {
    document.getElementById(id).className = baseClass;
  });
  const activeMap = { all: 'tabAll', open: 'tabOpen', closed: 'tabClosed' };
  document.getElementById(activeMap[type]).className = activeClass;

  const filtered = type === 'all' ? allIssues : allIssues.filter(i => i.status?.toLowerCase() === type);
  renderIssues(filtered);
};

// Open modal with issue details
async function openModal(id) {
  const modal = document.getElementById('issueModal');
  document.getElementById('modalLoader').classList.remove('hidden');
  document.getElementById('modalContent').classList.add('hidden');
  modal.showModal();

  try {
    const res = await fetch(`${apiSingle}/${id}`);
    const data = await res.json();
    const issue = data.data || data;

    document.getElementById('modalTitle').textContent = issue.title || 'No Title';
    const isOpen = issue.status?.toLowerCase() === 'open';
    const statusEl = document.getElementById('modalStatus');
    statusEl.textContent = isOpen ? 'Opened' : 'Closed';
    statusEl.className = `badge px-3 py-1 rounded-full text-xs font-semibold text-white ${isOpen ? 'badge-success' : 'badge-secondary'}`;
    document.getElementById('modalAuthor').textContent = `Opened by ${issue.author || 'unknown'}`;
    document.getElementById('modalDate').textContent = formatDate(issue.created_at || issue.createdAt);
    document.getElementById('modalDescription').textContent = issue.description || '';
    document.getElementById('modalAssignee').textContent = issue.assignee || issue.author || 'N/A';
    const priorityEl = document.getElementById('modalPriority');
    priorityEl.textContent = issue.priority?.toUpperCase() || 'N/A';
    priorityEl.className = `badge px-3 py-1 text-xs font-bold ${getPriorityClass(issue.priority)}`;

    const labels = Array.isArray(issue.labels) ? issue.labels : issue.label ? [issue.label] : [];
    document.getElementById('modalLabels').innerHTML = labels.map(l => `<span class="text-xs px-2 py-1 rounded-full font-semibold ${getLabelClass(l)}">${getLabelIcon(l)} ${l}</span>`).join('');

    document.getElementById('modalLoader').classList.add('hidden');
    document.getElementById('modalContent').classList.remove('hidden');

  } catch (err) {
    console.error('Error fetching issue details:', err);
  }
};

// Search issues
async function doSearch() {
  const q = document.getElementById('searchInput').value.trim();
  if (!q) {
    renderIssues(allIssues);
    return;
  }
  showLoader(true);
  try {
    const res = await fetch(apiSearch + encodeURIComponent(q));
    const data = await res.json();
    const results = data.data || data || [];
    renderIssues(results);
  } catch (err) {
    console.error('Search error:', err);
  } finally {
    showLoader(false);
  }
};

// Add event listeners
document.getElementById('searchBtn').addEventListener('click', doSearch);
document.getElementById('searchInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') doSearch();
});

// Initial fetch on page load
fetchIssues();

