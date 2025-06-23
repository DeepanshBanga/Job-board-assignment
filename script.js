// DOM Elements
const jobList = document.getElementById("jobList");
const departmentFilter = document.getElementById("departmentFilter");
const searchInput = document.getElementById("searchInput");
const jobModal = document.getElementById("jobModal");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const applyLink = document.getElementById("applyLink");
const closeModal = document.getElementById("closeModal");
const loader = document.getElementById("loader");
const themeToggle = document.getElementById("themeToggle");

let jobs = [];

// Load job data
fetch('jobs.json')
  .then(res => res.json())
  .then(data => {
    loader.style.display = "none";
    jobs = data;
    populateDepartmentFilter(jobs);
    displayJobs(jobs);
  })
  .catch(error => {
    loader.style.display = "none";
    jobList.innerHTML = "<p>Failed to load jobs.</p>";
    console.error("Error:", error);
  });

// Display job cards
function displayJobs(jobData) {
  jobList.innerHTML = "";

  if (jobData.length === 0) {
    jobList.innerHTML = "<p>No job postings found.</p>";
    return;
  }

  jobData.forEach(job => {
    const card = document.createElement("div");
    card.className = "job-card";

    card.innerHTML = `
      <h3>${job.title}</h3>
      <p><strong>Department:</strong> ${job.department}</p>
      <p><strong>Location:</strong> ${job.location}</p>
      <button onclick="openModal(${job.id})">Apply</button>
    `;

    jobList.appendChild(card);
  });
}

// Filter jobs by search and department
function applyFilters() {
  const searchText = searchInput.value.toLowerCase();
  const departmentValue = departmentFilter.value;

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchText) &&
    (departmentValue === "" || job.department === departmentValue)
  );

  displayJobs(filteredJobs);
}

// Populate department dropdown
function populateDepartmentFilter(jobs) {
  const departments = [...new Set(jobs.map(job => job.department))];

  departments.forEach(dept => {
    const option = document.createElement("option");
    option.value = dept;
    option.textContent = dept;
    departmentFilter.appendChild(option);
  });
}

// Open job modal
function openModal(jobId) {
  const job = jobs.find(j => j.id === jobId);
  if (!job) return;

  modalTitle.textContent = job.title;
  modalDescription.textContent = job.description;
  applyLink.href = "#"; // replace with actual link if available
  jobModal.classList.remove("hidden");

  // delay fade-in
  setTimeout(() => {
    jobModal.classList.add("show");
  }, 10);
}

// Close modal
function closeJobModal() {
  jobModal.classList.remove("show");
  setTimeout(() => {
    jobModal.classList.add("hidden");
  }, 300);
}

closeModal.addEventListener("click", closeJobModal);

window.addEventListener("click", e => {
  if (e.target === jobModal) closeJobModal();
});

window.addEventListener("keydown", e => {
  if (e.key === "Escape") closeJobModal();
});

// Search and filter events
searchInput.addEventListener("input", applyFilters);
departmentFilter.addEventListener("change", applyFilters);

// Dark mode toggle logic
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.checked = true;
  }
});

themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark", themeToggle.checked);
  localStorage.setItem("theme", themeToggle.checked ? "dark" : "light");
});
