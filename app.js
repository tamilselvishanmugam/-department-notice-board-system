const API_BASE_URL = 'http://localhost:3000/api';

let allNotices = [];
let currentEditingId = null;

// DOM Elements
const noticesContainer = document.getElementById('noticesContainer');
const addNoticeBtn = document.getElementById('addNoticeBtn');
const noticeModal = document.getElementById('noticeModal');
const viewModal = document.getElementById('viewModal');
const noticeForm = document.getElementById('noticeForm');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const closeViewModal = document.getElementById('closeViewModal');
const closeViewBtn = document.getElementById('closeViewBtn');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const editBtn = document.getElementById('editBtn');
const deleteBtn = document.getElementById('deleteBtn');
const modalTitle = document.getElementById('modalTitle');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadNotices();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    addNoticeBtn.addEventListener('click', openAddModal);
    closeModal.addEventListener('click', closeAddModal);
    cancelBtn.addEventListener('click', closeAddModal);
    closeViewModal.addEventListener('click', closeViewNoticeModal);
    closeViewBtn.addEventListener('click', closeViewNoticeModal);
    noticeForm.addEventListener('submit', handleFormSubmit);
    searchInput.addEventListener('input', filterNotices);
    categoryFilter.addEventListener('change', filterNotices);
    editBtn.addEventListener('click', editCurrentNotice);
    deleteBtn.addEventListener('click', deleteCurrentNotice);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === noticeModal) closeAddModal();
        if (e.target === viewModal) closeViewNoticeModal();
    });
}

// Fetch all notices from API
async function loadNotices() {
    try {
        const response = await fetch(`${API_BASE_URL}/notices`);
        if (!response.ok) throw new Error('Failed to fetch notices');
        
        allNotices = await response.json();
        displayNotices(allNotices);
    } catch (error) {
        console.error('Error loading notices:', error);
        noticesContainer.innerHTML = '<div class="empty-state"><h3>Error loading notices</h3></div>';
    }
}

// Display notices
function displayNotices(notices) {
    if (notices.length === 0) {
        noticesContainer.innerHTML = `
            <div class="empty-state">
                <h3>No notices found</h3>
                <p>Click "Add Notice" to create the first one</p>
            </div>
        `;
        return;
    }

    noticesContainer.innerHTML = notices.map(notice => `
        <div class="notice-card ${notice.category}" onclick="viewNotice('${notice.id}')">
            <div class="notice-header">
                <h3 class="notice-title">${escapeHtml(notice.title)}</h3>
                <span class="notice-badge">${notice.category}</span>
            </div>
            <p class="notice-content">${escapeHtml(notice.content)}</p>
            <div class="notice-footer">
                <div class="notice-meta">
                    <span class="notice-department">${notice.department}</span>
                    <span class="notice-author">By ${notice.author}</span>
                </div>
                <span class="notice-date">${formatDate(notice.createdDate)}</span>
            </div>
        </div>
    `).join('');
}

// Filter notices based on search and category
function filterNotices() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filtered = allNotices.filter(notice => {
        const matchesSearch = notice.title.toLowerCase().includes(searchTerm) ||
                             notice.content.toLowerCase().includes(searchTerm) ||
                             notice.department.toLowerCase().includes(searchTerm);
        const matchesCategory = !selectedCategory || notice.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    displayNotices(filtered);
}

// Open add notice modal
function openAddModal() {
    currentEditingId = null;
    modalTitle.textContent = 'Add New Notice';
    noticeForm.reset();
    noticeModal.classList.add('show');
}

// Close add notice modal
function closeAddModal() {
    noticeModal.classList.remove('show');
    noticeForm.reset();
    currentEditingId = null;
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();

    const formData = {
        title: document.getElementById('noticeTitle').value,
        content: document.getElementById('noticeContent').value,
        category: document.getElementById('noticeCategory').value,
        department: document.getElementById('noticeDepartment').value,
        author: document.getElementById('noticeAuthor').value
    };

    try {
        let response;
        if (currentEditingId) {
            response = await fetch(`${API_BASE_URL}/notices/${currentEditingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        } else {
            response = await fetch(`${API_BASE_URL}/notices`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        }

        if (!response.ok) throw new Error('Failed to save notice');

        closeAddModal();
        loadNotices();
        alert(currentEditingId ? 'Notice updated successfully!' : 'Notice added successfully!');
    } catch (error) {
        console.error('Error saving notice:', error);
        alert('Error saving notice. Please try again.');
    }
}

// View notice details
async function viewNotice(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/notices/${id}`);
        if (!response.ok) throw new Error('Failed to fetch notice');

        const notice = await response.json();

        document.getElementById('viewTitle').textContent = notice.title;
        document.getElementById('viewCategory').textContent = notice.category;
        document.getElementById('viewDepartment').textContent = notice.department;
        document.getElementById('viewAuthor').textContent = notice.author;
        document.getElementById('viewDate').textContent = formatDate(notice.createdDate);
        document.getElementById('viewContent').textContent = notice.content;

        currentEditingId = id;
        viewModal.classList.add('show');
    } catch (error) {
        console.error('Error viewing notice:', error);
        alert('Error loading notice details');
    }
}

// Close view notice modal
function closeViewNoticeModal() {
    viewModal.classList.remove('show');
    currentEditingId = null;
}

// Edit current notice
function editCurrentNotice() {
    if (!currentEditingId) return;

    const notice = allNotices.find(n => n.id === currentEditingId);
    if (!notice) return;

    document.getElementById('noticeTitle').value = notice.title;
    document.getElementById('noticeContent').value = notice.content;
    document.getElementById('noticeCategory').value = notice.category;
    document.getElementById('noticeDepartment').value = notice.department;
    document.getElementById('noticeAuthor').value = notice.author;

    modalTitle.textContent = 'Edit Notice';
    closeViewNoticeModal();
    noticeModal.classList.add('show');
}

// Delete current notice
async function deleteCurrentNotice() {
    if (!currentEditingId) return;

    if (!confirm('Are you sure you want to delete this notice?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/notices/${currentEditingId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete notice');

        closeViewNoticeModal();
        loadNotices();
        alert('Notice deleted successfully!');
    } catch (error) {
        console.error('Error deleting notice:', error);
        alert('Error deleting notice. Please try again.');
    }
}

// Utility functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
