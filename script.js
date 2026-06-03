/* ============================================================
   Employee Leave & Approval Management System
   Complete JavaScript Logic

   Modules:
   1. Dashboard & Navigation
   2. Employee Leave Request (CRUD + LocalStorage)
   3. Workflow Approval Process
   4. Data Entity Import/Export (CSV)
   5. REST API Integration (Public Holidays)
   6. Chain of Command Extension Simulation
   7. Event Handler Simulation
   8. Toast Notifications
   9. Modal Management
   ============================================================ */

// ==================== GLOBAL STATE ====================
var APP_STATE = {
    leaveRequests: [],
    publicHolidays: [],
    approvalHistory: [],
    currentRequestId: null,
    requestIdCounter: 1001
};

var EMPLOYEE_DATABASE = {
    '1': { name: 'Aarav Sharma', department: 'Information Technology' },
    '2': { name: 'Priya Patel', department: 'Finance' },
    '3': { name: 'Rajesh Kumar', department: 'Human Resources' },
    '4': { name: 'Sneha Gupta', department: 'Marketing' },
    '5': { name: 'Vikram Singh', department: 'Operations' },
    '6': { name: 'Ananya Reddy', department: 'Sales' },
    '7': { name: 'Karthik Nair', department: 'Legal' },
    '8': { name: 'Deepa Menon', department: 'Research & Development' },
    '9': { name: 'Rahul Verma', department: 'Information Technology' },
    '10': { name: 'Meera Joshi', department: 'Finance' },
    'EMP001': { name: 'Aarav Sharma', department: 'Information Technology' },
    'EMP002': { name: 'Priya Patel', department: 'Finance' },
    'EMP003': { name: 'Rajesh Kumar', department: 'Human Resources' },
    'EMP004': { name: 'Sneha Gupta', department: 'Marketing' },
    'EMP005': { name: 'Vikram Singh', department: 'Operations' },
    'EMP006': { name: 'Ananya Reddy', department: 'Sales' },
    'EMP007': { name: 'Karthik Nair', department: 'Legal' },
    'EMP008': { name: 'Deepa Menon', department: 'Research & Development' },
    'EMP009': { name: 'Rahul Verma', department: 'Information Technology' },
    'EMP010': { name: 'Meera Joshi', department: 'Finance' }
};

var HOLIDAY_CACHE = {};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setCurrentDate();
    loadFromLocalStorage();
    setupNavigation();
    setupFormListeners();
    setupSidebarToggle();
    setupDragAndDrop();
    refreshAllViews();
}

// ==================== LOCAL STORAGE ====================
function saveToLocalStorage() {
    localStorage.setItem('leaveRequests', JSON.stringify(APP_STATE.leaveRequests));
    localStorage.setItem('approvalHistory', JSON.stringify(APP_STATE.approvalHistory));
    localStorage.setItem('requestIdCounter', APP_STATE.requestIdCounter.toString());
    if (APP_STATE.publicHolidays.length > 0) {
        localStorage.setItem('publicHolidays', JSON.stringify(APP_STATE.publicHolidays));
    }
}

function loadFromLocalStorage() {
    try {
        var requests = localStorage.getItem('leaveRequests');
        if (requests) APP_STATE.leaveRequests = JSON.parse(requests);
        var history = localStorage.getItem('approvalHistory');
        if (history) APP_STATE.approvalHistory = JSON.parse(history);
        var counter = localStorage.getItem('requestIdCounter');
        if (counter) APP_STATE.requestIdCounter = parseInt(counter, 10);
        var holidays = localStorage.getItem('publicHolidays');
        if (holidays) APP_STATE.publicHolidays = JSON.parse(holidays);
    } catch (e) {
        console.error('Error loading from localStorage:', e);
    }
}

// ==================== NAVIGATION ====================
function setupNavigation() {
    var navItems = document.querySelectorAll('.nav-item');
    for (var i = 0; i < navItems.length; i++) {
        navItems[i].addEventListener('click', function(e) {
            e.preventDefault();
            navigateTo(this.getAttribute('data-section'));
        });
    }
}

function navigateTo(sectionName) {
    var navItems = document.querySelectorAll('.nav-item');
    for (var i = 0; i < navItems.length; i++) {
        navItems[i].classList.remove('active');
        if (navItems[i].getAttribute('data-section') === sectionName) {
            navItems[i].classList.add('active');
        }
    }
    var sections = document.querySelectorAll('.content-section');
    for (var j = 0; j < sections.length; j++) {
        sections[j].classList.remove('active');
    }
    var target = document.getElementById('section-' + sectionName);
    if (target) target.classList.add('active');
    var titles = {
        'dashboard': 'Dashboard',
        'leave-request': 'Leave Request',
        'workflow': 'Workflow Approval',
        'import-export': 'Data Import / Export',
        'api-integration': 'REST API Integration',
        'chain-of-command': 'Chain of Command Extension',
        'event-handlers': 'Event Handler Simulation',
        'd365-mapping': 'D365 F&O Mapping'
    };
    document.getElementById('pageTitle').textContent = titles[sectionName] || 'Dashboard';
}

// ==================== SIDEBAR TOGGLE ====================
function setupSidebarToggle() {
    var toggleBtn = document.getElementById('sidebarToggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            document.getElementById('sidebar').classList.toggle('collapsed');
        });
    }
}

function setCurrentDate() {
    var now = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var el = document.getElementById('currentDate');
    if (el) el.textContent = now.toLocaleDateString('en-US', options);
}

// ==================== FORM LISTENERS ====================
function setupFormListeners() {
    var form = document.getElementById('leaveRequestForm');
    if (form) form.addEventListener('submit', handleLeaveRequestSubmit);

    var startDate = document.getElementById('startDate');
    var endDate = document.getElementById('endDate');
    if (startDate) startDate.addEventListener('change', calculateLeaveDays);
    if (endDate) endDate.addEventListener('change', calculateLeaveDays);

    var resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            var msgs = document.getElementById('validationMessages');
            if (msgs) msgs.innerHTML = '';
            var count = document.getElementById('leaveDaysCount');
            if (count) count.textContent = '0';
        });
    }
}

// ==================== DRAG AND DROP ====================
function setupDragAndDrop() {
    var uploadArea = document.getElementById('uploadArea');
    var fileInput = document.getElementById('csvFileInput');
    if (!uploadArea || !fileInput) return;

    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    uploadArea.addEventListener('dragleave', function() {
        uploadArea.classList.remove('dragover');
    });
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            handleCSVImport({ target: fileInput });
        }
    });
    fileInput.addEventListener('change', handleCSVImport);
}

// ==================== UTILITY FUNCTIONS ====================
function formatDate(dateStr) {
    if (!dateStr) return '';
    var d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateTime(isoStr) {
    if (!isoStr) return '-';
    var d = new Date(isoStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== LEAVE REQUEST MODULE ====================
function calculateLeaveDays() {
    var startDate = document.getElementById('startDate').value;
    var endDate = document.getElementById('endDate').value;
    var daysEl = document.getElementById('leaveDaysCount');
    if (!startDate || !endDate) { daysEl.textContent = '0'; return; }
    var start = new Date(startDate);
    var end = new Date(endDate);
    if (end < start) { daysEl.textContent = '0'; return; }
    var totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    var holidayCount = countHolidayConflicts(startDate, endDate);
    var effectiveDays = totalDays - holidayCount;
    if (holidayCount > 0) {
        daysEl.textContent = effectiveDays + ' (' + totalDays + ' total - ' + holidayCount + ' holiday(s))';
        daysEl.style.color = '#ff8c00';
    } else {
        daysEl.textContent = effectiveDays;
        daysEl.style.color = '#0078d4';
    }
}

function countHolidayConflicts(startDate, endDate) {
    if (APP_STATE.publicHolidays.length === 0) return 0;
    var start = new Date(startDate);
    var end = new Date(endDate);
    var count = 0;
    for (var i = 0; i < APP_STATE.publicHolidays.length; i++) {
        var hDate = new Date(APP_STATE.publicHolidays[i].date);
        if (hDate >= start && hDate <= end) count++;
    }
    return count;
}

function getHolidayConflicts(startDate, endDate) {
    var start = new Date(startDate);
    var end = new Date(endDate);
    var conflicts = [];
    for (var i = 0; i < APP_STATE.publicHolidays.length; i++) {
        var hDate = new Date(APP_STATE.publicHolidays[i].date);
        if (hDate >= start && hDate <= end) conflicts.push(APP_STATE.publicHolidays[i]);
    }
    return conflicts;
}

function calculateEffectiveDays(startDate, endDate) {
    var start = new Date(startDate);
    var end = new Date(endDate);
    var totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return totalDays - countHolidayConflicts(startDate, endDate);
}

function getWeekendDays(startDate, endDate) {
    var start = new Date(startDate);
    var end = new Date(endDate);
    var count = 0;
    var current = new Date(start);
    while (current <= end) {
        var day = current.getDay();
        if (day === 0 || day === 6) count++;
        current.setDate(current.getDate() + 1);
    }
    return count;
}

function handleLeaveRequestSubmit(e) {
    e.preventDefault();
    var employeeId = document.getElementById('employeeId').value.trim();
    var employeeName = document.getElementById('employeeName').value.trim();
    var department = document.getElementById('department').value;
    var leaveType = document.getElementById('leaveType').value;
    var startDate = document.getElementById('startDate').value;
    var endDate = document.getElementById('endDate').value;
    var reason = document.getElementById('reason').value.trim();
    var messagesEl = document.getElementById('validationMessages');
    messagesEl.innerHTML = '';
    var errors = [];
    if (!employeeId) errors.push('Employee ID is required.');
    if (!employeeName) errors.push('Employee Name is required.');
    if (!department) errors.push('Department is required.');
    if (!leaveType) errors.push('Leave Type is required.');
    if (!startDate) errors.push('Start Date is required.');
    if (!endDate) errors.push('End Date is required.');
    if (!reason) errors.push('Reason is required.');
    if (startDate && endDate) {
        if (new Date(endDate) < new Date(startDate)) errors.push('End Date cannot be before Start Date.');
        var weekendDays = getWeekendDays(startDate, endDate);
        if (weekendDays > 0) errors.push('Warning: ' + weekendDays + ' day(s) fall on weekends.');
        var conflicts = getHolidayConflicts(startDate, endDate);
        if (conflicts.length > 0) {
            var holidayNames = conflicts.map(function(h) { return h.name + ' (' + h.date + ')'; }).join(', ');
            errors.push('Warning: Leave overlaps with public holiday(s): ' + holidayNames);
        }
    }
    if (errors.length > 0) {
        var hasRealErrors = false;
        for (var i = 0; i < errors.length; i++) {
            var msgDiv = document.createElement('div');
            msgDiv.className = errors[i].startsWith('Warning') ? 'success-msg' : 'error-msg';
            msgDiv.textContent = errors[i];
            messagesEl.appendChild(msgDiv);
            if (!errors[i].startsWith('Warning')) hasRealErrors = true;
        }
        if (hasRealErrors) return;
    }
    var request = {
        requestId: 'LR-' + APP_STATE.requestIdCounter++,
        employeeId: employeeId,
        employeeName: employeeName,
        department: department,
        leaveType: leaveType,
        startDate: startDate,
        endDate: endDate,
        leaveDays: calculateEffectiveDays(startDate, endDate),
        reason: reason,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        reviewedBy: null,
        reviewDate: null,
        comments: null
    };
    APP_STATE.leaveRequests.unshift(request);
    saveToLocalStorage();
    showToast('Leave request ' + request.requestId + ' submitted successfully!', 'success');
    document.getElementById('leaveRequestForm').reset();
    document.getElementById('validationMessages').innerHTML = '';
    document.getElementById('leaveDaysCount').textContent = '0';
    refreshAllViews();
}

function deleteRequest(requestId) {
    if (confirm('Are you sure you want to delete this leave request?')) {
        APP_STATE.leaveRequests = APP_STATE.leaveRequests.filter(function(r) { return r.requestId !== requestId; });
        saveToLocalStorage();
        refreshAllViews();
        showToast('Leave request deleted.', 'info');
    }
}

function clearAllRequests() {
    if (confirm('Are you sure you want to clear all leave requests?')) {
        APP_STATE.leaveRequests = [];
        APP_STATE.approvalHistory = [];
        APP_STATE.requestIdCounter = 1001;
        saveToLocalStorage();
        refreshAllViews();
        showToast('All leave requests cleared.', 'info');
    }
}

// ==================== WORKFLOW APPROVAL MODULE ====================
function openApprovalModal(requestId) {
    APP_STATE.currentRequestId = requestId;
    var request = null;
    for (var i = 0; i < APP_STATE.leaveRequests.length; i++) {
        if (APP_STATE.leaveRequests[i].requestId === requestId) { request = APP_STATE.leaveRequests[i]; break; }
    }
    if (!request) return;
    var modalBody = document.getElementById('modalBody');
    document.getElementById('modalTitle').textContent = 'Review Leave Request - ' + request.requestId;
    modalBody.innerHTML =
        '<div class="detail-row"><span class="detail-label">Request ID:</span><span class="detail-value">' + escapeHtml(request.requestId) + '</span></div>' +
        '<div class="detail-row"><span class="detail-label">Employee ID:</span><span class="detail-value">' + escapeHtml(request.employeeId) + '</span></div>' +
        '<div class="detail-row"><span class="detail-label">Employee Name:</span><span class="detail-value">' + escapeHtml(request.employeeName) + '</span></div>' +
        '<div class="detail-row"><span class="detail-label">Department:</span><span class="detail-value">' + escapeHtml(request.department) + '</span></div>' +
        '<div class="detail-row"><span class="detail-label">Leave Type:</span><span class="detail-value">' + escapeHtml(request.leaveType) + '</span></div>' +
        '<div class="detail-row"><span class="detail-label">Start Date:</span><span class="detail-value">' + formatDate(request.startDate) + '</span></div>' +
        '<div class="detail-row"><span class="detail-label">End Date:</span><span class="detail-value">' + formatDate(request.endDate) + '</span></div>' +
        '<div class="detail-row"><span class="detail-label">Leave Days:</span><span class="detail-value">' + request.leaveDays + '</span></div>' +
        '<div class="detail-row"><span class="detail-label">Reason:</span><span class="detail-value">' + escapeHtml(request.reason) + '</span></div>' +
        '<textarea id="reviewComments" placeholder="Add review comments (optional)..." rows="3" style="width:100%;margin-top:12px;padding:8px;border:1px solid #c8c6c4;border-radius:4px;font-family:inherit;font-size:0.85rem;"></textarea>';
    document.getElementById('approvalModal').classList.add('active');
}

function closeModal() {
    document.getElementById('approvalModal').classList.remove('active');
    APP_STATE.currentRequestId = null;
}

function approveRequest() {
    var requestId = APP_STATE.currentRequestId;
    var request = null;
    for (var i = 0; i < APP_STATE.leaveRequests.length; i++) {
        if (APP_STATE.leaveRequests[i].requestId === requestId) { request = APP_STATE.leaveRequests[i]; break; }
    }
    if (!request) return;
    var comments = document.getElementById('reviewComments').value.trim();
    var now = new Date().toISOString();
    request.status = 'Approved';
    request.reviewedBy = 'HR Admin';
    request.reviewDate = now;
    request.comments = comments || 'Approved by manager';
    APP_STATE.approvalHistory.unshift({
        requestId: request.requestId, employeeName: request.employeeName,
        leaveType: request.leaveType, leaveDays: request.leaveDays,
        status: 'Approved', reviewedBy: 'HR Admin', reviewDate: now, comments: comments || 'Approved'
    });
    saveToLocalStorage();
    closeModal();
    refreshAllViews();
    showToast('Leave request ' + requestId + ' has been approved.', 'success');
}

function rejectRequest() {
    var requestId = APP_STATE.currentRequestId;
    var request = null;
    for (var i = 0; i < APP_STATE.leaveRequests.length; i++) {
        if (APP_STATE.leaveRequests[i].requestId === requestId) { request = APP_STATE.leaveRequests[i]; break; }
    }
    if (!request) return;
    var comments = document.getElementById('reviewComments').value.trim();
    if (!comments) { showToast('Please provide a reason for rejection.', 'warning'); return; }
    var now = new Date().toISOString();
    request.status = 'Rejected';
    request.reviewedBy = 'HR Admin';
    request.reviewDate = now;
    request.comments = comments;
    APP_STATE.approvalHistory.unshift({
        requestId: request.requestId, employeeName: request.employeeName,
        leaveType: request.leaveType, leaveDays: request.leaveDays,
        status: 'Rejected', reviewedBy: 'HR Admin', reviewDate: now, comments: comments
    });
    saveToLocalStorage();
    closeModal();
    refreshAllViews();
    showToast('Leave request ' + requestId + ' has been rejected.', 'error');
}

// ==================== DATA ENTITY IMPORT/EXPORT ====================
function downloadSampleCSV() {
    var csv = 'EmployeeID,EmployeeName,Department,LeaveType,StartDate,EndDate,Reason\n';
    csv += 'EMP001,Aarav Sharma,Information Technology,Annual Leave,2026-06-10,2026-06-15,Family vacation\n';
    csv += 'EMP002,Priya Patel,Finance,Sick Leave,2026-06-12,2026-06-13,Medical appointment\n';
    csv += 'EMP003,Rajesh Kumar,Human Resources,Personal Leave,2026-06-20,2026-06-22,Personal work\n';
    csv += 'EMP004,Sneha Gupta,Marketing,Annual Leave,2026-07-01,2026-07-05,Summer holiday\n';
    csv += 'EMP005,Vikram Singh,Operations,Sick Leave,2026-06-18,2026-06-19,Not feeling well\n';
    downloadFile(csv, 'leave_request_sample.csv', 'text/csv');
    showToast('Sample CSV file downloaded.', 'info');
}

function exportToCSV() {
    var filter = document.getElementById('exportFilter').value;
    var data = APP_STATE.leaveRequests;
    if (filter !== 'all') {
        data = data.filter(function(r) { return r.status === filter; });
    }
    if (data.length === 0) { showToast('No records to export.', 'warning'); return; }
    var csv = 'RequestId,EmployeeID,EmployeeName,Department,LeaveType,StartDate,EndDate,LeaveDays,Reason,Status,CreatedAt,ReviewedBy,ReviewDate,Comments\n';
    for (var i = 0; i < data.length; i++) {
        var r = data[i];
        csv += [r.requestId, r.employeeId, '"' + (r.employeeName || '').replace(/"/g, '""') + '"',
            '"' + (r.department || '').replace(/"/g, '""') + '"',
            '"' + (r.leaveType || '').replace(/"/g, '""') + '"',
            r.startDate, r.endDate, r.leaveDays,
            '"' + (r.reason || '').replace(/"/g, '""') + '"',
            r.status, r.createdAt, r.reviewedBy || '', r.reviewDate || '',
            '"' + (r.comments || '').replace(/"/g, '""') + '"'
        ].join(',') + '\n';
    }
    downloadFile(csv, 'leave_requests_' + filter + '_' + new Date().toISOString().slice(0, 10) + '.csv', 'text/csv');
    showToast('Exported ' + data.length + ' records to CSV.', 'success');
}

function handleCSVImport(e) {
    var file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) { showToast('Please select a valid CSV file.', 'error'); return; }
    var reader = new FileReader();
    reader.onload = function(event) {
        try {
            var csv = event.target.result;
            var lines = csv.split('\n').filter(function(l) { return l.trim() !== ''; });
            if (lines.length < 2) { showToast('CSV file is empty.', 'warning'); return; }
            var importedCount = 0;
            var errors = [];
            for (var i = 1; i < lines.length; i++) {
                var values = parseCSVLine(lines[i]);
                if (values.length < 7) { errors.push('Row ' + (i + 1) + ': Insufficient columns'); continue; }
                APP_STATE.leaveRequests.unshift({
                    requestId: 'LR-' + APP_STATE.requestIdCounter++,
                    employeeId: values[0].trim(), employeeName: values[1].trim(),
                    department: values[2].trim(), leaveType: values[3].trim(),
                    startDate: values[4].trim(), endDate: values[5].trim(),
                    leaveDays: calculateEffectiveDays(values[4].trim(), values[5].trim()),
                    reason: values[6].trim(), status: 'Pending',
                    createdAt: new Date().toISOString(), reviewedBy: null, reviewDate: null, comments: null
                });
                importedCount++;
            }
            saveToLocalStorage();
            refreshAllViews();
            if (errors.length > 0) showToast('Imported ' + importedCount + ' records. ' + errors.length + ' errors.', 'warning');
            else showToast('Successfully imported ' + importedCount + ' leave requests.', 'success');
        } catch (err) { showToast('Error parsing CSV: ' + err.message, 'error'); }
    };
    reader.readAsText(file);
    e.target.value = '';
}

function parseCSVLine(line) {
    var result = [], current = '', inQuotes = false;
    for (var i = 0; i < line.length; i++) {
        var ch = line[i];
        if (ch === '"') inQuotes = !inQuotes;
        else if (ch === ',' && !inQuotes) { result.push(current); current = ''; }
        else current += ch;
    }
    result.push(current);
    return result;
}

function downloadFile(content, fileName, mimeType) {
    var blob = new Blob([content], { type: mimeType });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url; link.download = fileName;
    document.body.appendChild(link); link.click();
    document.body.removeChild(link); URL.revokeObjectURL(url);
}

// ==================== REST API INTEGRATION ====================
function fetchPublicHolidays() {
    var country = document.getElementById('apiCountry').value;
    var year = document.getElementById('apiYear').value;
    var fetchBtn = document.getElementById('fetchHolidaysBtn');
    var cacheKey = country + '_' + year;

    if (HOLIDAY_CACHE[cacheKey]) {
        APP_STATE.publicHolidays = HOLIDAY_CACHE[cacheKey];
        saveToLocalStorage();
        renderHolidayCalendar();
        updateApiStatus('success', 'Loaded from cache: ' + APP_STATE.publicHolidays.length + ' holidays');
        showToast('Holidays loaded from cache.', 'info');
        return;
    }

    updateApiStatus('loading', 'Fetching holidays for ' + country + ' ' + year + '...');
    fetchBtn.disabled = true;
    fetchBtn.innerHTML = '<span class="btn-icon">&#8987;</span> Fetching...';

    fetch('https://date.nager.at/api/v3/PublicHolidays/' + year + '/' + country)
        .then(function(response) {
            if (!response.ok) throw new Error('API status ' + response.status);
            return response.json();
        })
        .then(function(data) {
            APP_STATE.publicHolidays = data.map(function(h) {
                return { name: h.name, date: h.date, localName: h.localName || h.name, countryCode: h.countryCode };
            });
            HOLIDAY_CACHE[cacheKey] = APP_STATE.publicHolidays;
            saveToLocalStorage();
            renderHolidayCalendar();
            updateApiStatus('success', 'Fetched ' + APP_STATE.publicHolidays.length + ' holidays successfully');
            showToast('Fetched ' + APP_STATE.publicHolidays.length + ' public holidays.', 'success');
        })
        .catch(function() {
            APP_STATE.publicHolidays = getFallbackHolidays(country, year);
            HOLIDAY_CACHE[cacheKey] = APP_STATE.publicHolidays;
            saveToLocalStorage();
            renderHolidayCalendar();
            updateApiStatus('success', 'Loaded ' + APP_STATE.publicHolidays.length + ' holidays (fallback data)');
            showToast('API unavailable. Loaded sample holiday data.', 'warning');
        })
        .finally(function() {
            fetchBtn.disabled = false;
            fetchBtn.innerHTML = '<span class="btn-icon">&#9729;</span> Fetch Holidays';
        });
}

function updateApiStatus(status, message) {
    var el = document.getElementById('apiStatus');
    el.className = 'api-status ' + status;
    el.querySelector('.status-text').textContent = message;
}

function getFallbackHolidays(country, year) {
    var holidays = {
        'IN': [
            { name: 'Republic Day', date: year + '-01-26' },
            { name: 'Holi', date: year + '-03-14' },
            { name: 'Good Friday', date: year + '-04-03' },
            { name: 'Ambedkar Jayanti', date: year + '-04-14' },
            { name: 'May Day', date: year + '-05-01' },
            { name: 'Independence Day', date: year + '-08-15' },
            { name: 'Ganesh Chaturthi', date: year + '-08-27' },
            { name: 'Gandhi Jayanti', date: year + '-10-02' },
            { name: 'Dussehra', date: year + '-10-20' },
            { name: 'Diwali', date: year + '-11-08' },
            { name: 'Christmas', date: year + '-12-25' }
        ],
        'US': [
            { name: 'New Year\'s Day', date: year + '-01-01' },
            { name: 'Martin Luther King Jr. Day', date: year + '-01-19' },
            { name: 'Presidents\' Day', date: year + '-02-16' },
            { name: 'Memorial Day', date: year + '-05-25' },
            { name: 'Independence Day', date: year + '-07-04' },
            { name: 'Labor Day', date: year + '-09-07' },
            { name: 'Thanksgiving Day', date: year + '-11-26' },
            { name: 'Christmas Day', date: year + '-12-25' }
        ],
        'GB': [
            { name: 'New Year\'s Day', date: year + '-01-01' },
            { name: 'Good Friday', date: year + '-04-03' },
            { name: 'Easter Monday', date: year + '-04-06' },
            { name: 'Early May Bank Holiday', date: year + '-05-04' },
            { name: 'Spring Bank Holiday', date: year + '-05-25' },
            { name: 'Summer Bank Holiday', date: year + '-08-31' },
            { name: 'Christmas Day', date: year + '-12-25' },
            { name: 'Boxing Day', date: year + '-12-28' }
        ],
        'AE': [
            { name: 'New Year\'s Day', date: year + '-01-01' },
            { name: 'Eid Al Fitr', date: year + '-03-30' },
            { name: 'Arafat Day', date: year + '-06-06' },
            { name: 'Eid Al Adha', date: year + '-06-07' },
            { name: 'Islamic New Year', date: year + '-07-27' },
            { name: 'National Day', date: year + '-12-02' },
            { name: 'Commemoration Day', date: year + '-12-01' }
        ],
        'SG': [
            { name: 'New Year\'s Day', date: year + '-01-01' },
            { name: 'Chinese New Year', date: year + '-01-29' },
            { name: 'Labour Day', date: year + '-05-01' },
            { name: 'Vesak Day', date: year + '-05-12' },
            { name: 'National Day', date: year + '-08-09' },
            { name: 'Hari Raya Haji', date: year + '-06-17' },
            { name: 'Deepavali', date: year + '-11-01' },
            { name: 'Christmas Day', date: year + '-12-25' }
        ]
    };
    var result = holidays[country] || holidays['IN'];
    return result.map(function(h) { return { name: h.name, date: h.date, localName: h.name, countryCode: country }; });
}

function renderHolidayCalendar() {
    var container = document.getElementById('holidayCalendar');
    var badge = document.getElementById('holidayCountBadge');
    var holidays = APP_STATE.publicHolidays;

    if (holidays.length === 0) {
        container.innerHTML = '<div class="calendar-placeholder"><p>&#128197; No holidays loaded. Click "Fetch Holidays" to load.</p></div>';
        badge.textContent = '0 Holidays';
        return;
    }

    badge.textContent = holidays.length + ' Holidays';
    var html = '<div class="holiday-grid">';
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (var i = 0; i < holidays.length; i++) {
        var d = new Date(holidays[i].date);
        html += '<div class="holiday-card">' +
            '<div class="holiday-date"><div class="day">' + d.getDate() + '</div><div class="month">' + months[d.getMonth()] + '</div></div>' +
            '<div class="holiday-info"><h4>' + escapeHtml(holidays[i].name) + '</h4><p>' + formatDate(holidays[i].date) + '</p></div></div>';
    }
    html += '</div>';
    container.innerHTML = html;
}

// ==================== CHAIN OF COMMAND SIMULATION ====================
function runChainOfCommandSimulation() {
    var startDate = document.getElementById('simStartDate').value;
    var endDate = document.getElementById('simEndDate').value;
    if (!startDate || !endDate) { showToast('Please select both dates.', 'warning'); return; }
    if (new Date(endDate) < new Date(startDate)) { showToast('End date must be after start date.', 'error'); return; }
    var baseDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
    var bonusDays = 2;
    var extendedDays = baseDays + bonusDays;
    document.getElementById('baseResult').textContent = baseDays;
    document.getElementById('extendedResult').textContent = extendedDays;
    document.getElementById('bonusResult').textContent = bonusDays;
    showToast('Chain of Command simulation complete. Base: ' + baseDays + ' days, Extended: ' + extendedDays + ' days.', 'info');
}

// ==================== EVENT HANDLER SIMULATION ====================
var eventLogEntries = [];

function addEventLog(type, message) {
    var now = new Date();
    var timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    eventLogEntries.unshift({ time: timeStr, type: type, message: message });
    renderEventLog();
}

function renderEventLog() {
    var container = document.getElementById('eventLog');
    if (eventLogEntries.length === 0) {
        container.innerHTML = '<div class="log-empty">No events triggered yet.</div>';
        return;
    }
    var html = '';
    for (var i = 0; i < eventLogEntries.length; i++) {
        var entry = eventLogEntries[i];
        html += '<div class="log-entry">' +
            '<span class="log-time">[' + entry.time + ']</span>' +
            '<span class="log-type ' + entry.type + '">[' + entry.type.toUpperCase() + ']</span>' +
            '<span class="log-message">' + escapeHtml(entry.message) + '</span></div>';
    }
    container.innerHTML = html;
}

function clearEventLog() {
    eventLogEntries = [];
    renderEventLog();
}

function lookupEmployee(id) {
    if (!id) return null;
    var trimmed = id.trim();
    // Direct match
    if (EMPLOYEE_DATABASE[trimmed]) return EMPLOYEE_DATABASE[trimmed];
    // Case-insensitive match (EMP001 -> emp001)
    var upper = trimmed.toUpperCase();
    if (EMPLOYEE_DATABASE[upper]) return EMPLOYEE_DATABASE[upper];
    // Try extracting number from input (e.g., "emp5" -> "5", "EMP005" -> "005" -> "5")
    var num = trimmed.replace(/[^0-9]/g, '');
    if (num && EMPLOYEE_DATABASE[num]) return EMPLOYEE_DATABASE[num];
    // Pad number to match EMP format (e.g., "5" -> "EMP005")
    var padded = 'EMP' + num.padStart(3, '0');
    if (EMPLOYEE_DATABASE[padded]) return EMPLOYEE_DATABASE[padded];
    return null;
}

function onEmployeeIdChanged(value) {
    addEventLog('info', 'OnChanged Event: Employee ID changed to "' + value + '"');
    var nameField = document.getElementById('demoEmpName');
    var validation = document.getElementById('empIdValidation');
    if (!value) {
        nameField.value = '';
        validation.textContent = '';
        validation.className = 'field-validation';
        return;
    }
    var emp = lookupEmployee(value);
    if (emp) {
        nameField.value = emp.name;
        validation.textContent = 'Valid employee: ' + emp.name + ' (' + emp.department + ')';
        validation.className = 'field-validation valid';
        addEventLog('success', 'Employee "' + emp.name + '" found in database. Department: ' + emp.department);
    } else {
        nameField.value = '';
        validation.textContent = 'Employee ID not found. Try 1-10 or EMP001-EMP010.';
        validation.className = 'field-validation invalid';
        addEventLog('warning', 'Employee ID "' + value + '" not found. Valid IDs: 1-10 or EMP001-EMP010.');
    }
}

function onDateChanged() {
    var start = document.getElementById('demoStartDate').value;
    var end = document.getElementById('demoEndDate').value;
    if (start && end) {
        addEventLog('info', 'OnChanged Event: Leave dates changed (' + start + ' to ' + end + ')');
        if (new Date(end) < new Date(start)) {
            addEventLog('error', 'Validation Error: End date is before start date.');
        } else {
            var days = calculateEffectiveDays(start, end);
            addEventLog('info', 'Calculated leave days: ' + days);
        }
    }
}

function onLeaveTypeChanged() {
    var val = document.getElementById('demoLeaveType').value;
    if (val) {
        addEventLog('info', 'OnChanged Event: Leave type changed to "' + val + '"');
    }
}

function validateAndSaveEventDemo() {
    addEventLog('info', '--- OnValidating Event: Validating leave request ---');
    var empId = document.getElementById('demoEmpId').value.trim();
    var empName = document.getElementById('demoEmpName').value;
    var startDate = document.getElementById('demoStartDate').value;
    var endDate = document.getElementById('demoEndDate').value;
    var leaveType = document.getElementById('demoLeaveType').value;
    var valid = true;
    if (!empId) { addEventLog('error', 'Validation failed: Employee ID is required.'); valid = false; }
    else if (!lookupEmployee(empId)) { addEventLog('error', 'Validation failed: Invalid Employee ID "' + empId + '". Valid IDs: 1-10 or EMP001-EMP010.'); valid = false; }
    if (!startDate) { addEventLog('error', 'Validation failed: Start date is required.'); valid = false; }
    if (!endDate) { addEventLog('error', 'Validation failed: End date is required.'); valid = false; }
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
        addEventLog('error', 'Validation failed: End date is before start date.'); valid = false;
    }
    if (!leaveType) { addEventLog('error', 'Validation failed: Leave type is required.'); valid = false; }

    if (valid) {
        addEventLog('success', 'All validations passed. Record saved successfully.');
        addEventLog('info', 'OnPost Event: Leave request "' + empId + '" has been inserted into LeaveRequestTable.');
        showToast('Event validation passed! Record saved.', 'success');
    } else {
        addEventLog('warning', 'OnValidating Event: Record NOT saved due to validation errors.');
        showToast('Validation failed. Check the event log.', 'error');
    }
}

// ==================== VIEW REFRESH ====================
function refreshAllViews() {
    refreshDashboard();
    refreshMyRequests();
    refreshPendingApprovals();
    refreshApprovalHistory();
    refreshDataPreview();
    refreshExportCount();
}

function refreshDashboard() {
    var requests = APP_STATE.leaveRequests;
    var total = requests.length;
    var pending = 0, approved = 0, rejected = 0;
    for (var i = 0; i < requests.length; i++) {
        if (requests[i].status === 'Pending') pending++;
        else if (requests[i].status === 'Approved') approved++;
        else if (requests[i].status === 'Rejected') rejected++;
    }
    document.getElementById('totalRequests').textContent = total;
    document.getElementById('pendingRequests').textContent = pending;
    document.getElementById('approvedRequests').textContent = approved;
    document.getElementById('rejectedRequests').textContent = rejected;

    var tbody = document.getElementById('recentRequestsBody');
    if (requests.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="7">No leave requests found. Create your first request!</td></tr>';
    } else {
        var html = '';
        var showCount = Math.min(requests.length, 5);
        for (var j = 0; j < showCount; j++) {
            var r = requests[j];
            html += '<tr>' +
                '<td>' + escapeHtml(r.requestId) + '</td>' +
                '<td>' + escapeHtml(r.employeeName) + '</td>' +
                '<td>' + escapeHtml(r.department) + '</td>' +
                '<td>' + escapeHtml(r.leaveType) + '</td>' +
                '<td>' + formatDate(r.startDate) + '</td>' +
                '<td>' + formatDate(r.endDate) + '</td>' +
                '<td><span class="status-badge status-' + r.status.toLowerCase() + '">' + r.status + '</span></td></tr>';
        }
        tbody.innerHTML = html;
    }
}

function refreshMyRequests() {
    var tbody = document.getElementById('myRequestsBody');
    var requests = APP_STATE.leaveRequests;
    if (requests.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="8">No leave requests yet.</td></tr>';
        return;
    }
    var html = '';
    for (var i = 0; i < requests.length; i++) {
        var r = requests[i];
        html += '<tr>' +
            '<td>' + escapeHtml(r.requestId) + '</td>' +
            '<td>' + escapeHtml(r.employeeName) + '</td>' +
            '<td>' + escapeHtml(r.leaveType) + '</td>' +
            '<td>' + formatDate(r.startDate) + '</td>' +
            '<td>' + formatDate(r.endDate) + '</td>' +
            '<td>' + r.leaveDays + '</td>' +
            '<td><span class="status-badge status-' + r.status.toLowerCase() + '">' + r.status + '</span></td>' +
            '<td><button class="btn btn-xs btn-danger" onclick="deleteRequest(\'' + r.requestId + '\')">Delete</button></td></tr>';
    }
    tbody.innerHTML = html;
}

function refreshPendingApprovals() {
    var tbody = document.getElementById('pendingBody');
    var badge = document.getElementById('pendingCountBadge');
    var pending = APP_STATE.leaveRequests.filter(function(r) { return r.status === 'Pending'; });
    badge.textContent = pending.length + ' Pending';
    if (pending.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="10">No pending requests to review.</td></tr>';
        return;
    }
    var html = '';
    for (var i = 0; i < pending.length; i++) {
        var r = pending[i];
        html += '<tr>' +
            '<td>' + escapeHtml(r.requestId) + '</td>' +
            '<td>' + escapeHtml(r.employeeId) + '</td>' +
            '<td>' + escapeHtml(r.employeeName) + '</td>' +
            '<td>' + escapeHtml(r.department) + '</td>' +
            '<td>' + escapeHtml(r.leaveType) + '</td>' +
            '<td>' + formatDate(r.startDate) + '</td>' +
            '<td>' + formatDate(r.endDate) + '</td>' +
            '<td>' + r.leaveDays + '</td>' +
            '<td>' + escapeHtml(r.reason) + '</td>' +
            '<td><button class="btn btn-xs btn-primary" onclick="openApprovalModal(\'' + r.requestId + '\')">Review</button></td></tr>';
    }
    tbody.innerHTML = html;
}

function refreshApprovalHistory() {
    var tbody = document.getElementById('approvalHistoryBody');
    var history = APP_STATE.approvalHistory;
    if (history.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="8">No approval history yet.</td></tr>';
        return;
    }
    var html = '';
    for (var i = 0; i < history.length; i++) {
        var h = history[i];
        html += '<tr>' +
            '<td>' + escapeHtml(h.requestId) + '</td>' +
            '<td>' + escapeHtml(h.employeeName) + '</td>' +
            '<td>' + escapeHtml(h.leaveType) + '</td>' +
            '<td>' + h.leaveDays + '</td>' +
            '<td><span class="status-badge status-' + h.status.toLowerCase() + '">' + h.status + '</span></td>' +
            '<td>' + escapeHtml(h.reviewedBy) + '</td>' +
            '<td>' + formatDateTime(h.reviewDate) + '</td>' +
            '<td>' + escapeHtml(h.comments || '-') + '</td></tr>';
    }
    tbody.innerHTML = html;
}

function refreshDataPreview() {
    var tbody = document.getElementById('previewBody');
    var badge = document.getElementById('previewCountBadge');
    var requests = APP_STATE.leaveRequests;
    badge.textContent = requests.length + ' Records';
    if (requests.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="9">Import data or create requests to see preview.</td></tr>';
        return;
    }
    var html = '';
    for (var i = 0; i < requests.length; i++) {
        var r = requests[i];
        html += '<tr>' +
            '<td>' + escapeHtml(r.employeeId) + '</td>' +
            '<td>' + escapeHtml(r.employeeName) + '</td>' +
            '<td>' + escapeHtml(r.department) + '</td>' +
            '<td>' + escapeHtml(r.leaveType) + '</td>' +
            '<td>' + formatDate(r.startDate) + '</td>' +
            '<td>' + formatDate(r.endDate) + '</td>' +
            '<td>' + r.leaveDays + '</td>' +
            '<td>' + escapeHtml(r.reason) + '</td>' +
            '<td><span class="status-badge status-' + r.status.toLowerCase() + '">' + r.status + '</span></td></tr>';
    }
    tbody.innerHTML = html;
}

function refreshExportCount() {
    document.getElementById('exportableCount').textContent = APP_STATE.leaveRequests.length;
}

// ==================== TOAST NOTIFICATIONS ====================
function showToast(message, type) {
    var container = document.getElementById('toastContainer');
    var toast = document.createElement('div');
    toast.className = 'toast ' + (type || 'info');
    var icons = { success: '&#10003;', error: '&#10007;', warning: '&#9888;', info: '&#8505;' };
    toast.innerHTML = '<span class="toast-icon">' + (icons[type] || icons.info) + '</span>' +
        '<span class="toast-message">' + escapeHtml(message) + '</span>' +
        '<button class="toast-close" onclick="this.parentElement.remove()">&times;</button>';
    container.appendChild(toast);
    setTimeout(function() {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(function() { if (toast.parentElement) toast.remove(); }, 300);
    }, 4000);
}
