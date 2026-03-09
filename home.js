const apiALL = 'https://phi-lab-server.vercel.app/api/v1/lab/issues'
const apiSingle = 'https://phi-lab-server.vercel.app/api/v1/lab/issue'
const apiSearch = 'https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q='

let allIssues = [];
let currentFilter = 'all';