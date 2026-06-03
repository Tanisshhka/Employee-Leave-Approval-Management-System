# Employee Leave & Approval Management System

A professional web application inspired by **Microsoft Dynamics 365 Finance & Operations** demonstrating key D365 F&O development concepts including Workflow Approval, Data Entity Import/Export, REST API Integration, Chain of Command Extensions, and Event Handlers.

## Live Demo

Open `index.html` in your browser or run a local server:

```bash
python -m http.server 3000
# Visit http://localhost:3000
```

---

## Modules

### 1. Employee Leave Request Module
- Submit leave requests with Employee ID, Name, Department, Leave Type, Dates, and Reason
- Auto-calculates leave days
- Detects public holiday conflicts and excludes them from day count
- All requests stored in LocalStorage

### 2. Workflow Approval Module
- Manager Dashboard with pending approvals
- Approve or Reject requests with comments
- 4-step workflow visual (Request Created → Manager Review → Approved/Rejected → Status Updated)
- Full approval history tracking

### 3. Data Entity Import/Export Module
- Import leave data from CSV files with drag-and-drop
- Export leave records to CSV with status filters
- Data preview table for all records
- Sample CSV download for reference

### 4. REST API Integration Module
- Fetches public holidays from [date.nager.at](https://date.nager.at) API
- Supports 5 countries: India, US, UK, UAE, Singapore
- Holiday calendar display with visual cards
- Prevents leave requests on public holidays (auto-excludes from day count)
- Fallback data when API is unavailable

### 5. Chain of Command Extension Simulation
- Interactive demo of D365 Chain of Command pattern
- Base class: simple date difference calculation
- Extended class: adds +2 bonus leave days
- Side-by-side X++ code comparison
- Run simulation to see base vs extended results

### 6. Event Handler Simulation
- Live Employee ID validation against database (IDs: 1-10 or EMP001-EMP010)
- OnChanged event: real-time field validation
- OnValidating event: pre-save data integrity checks
- OnPost event: post-save confirmation
- Live event log console showing all triggered events

### 7. D365 F&O Mapping Section
Detailed mapping cards explaining:
- LeaveRequestTable → D365 Table
- LeaveRequestForm → D365 Form
- Workflow Approval Process → D365 Workflow Framework
- Data Entity Import/Export → D365 Data Entities
- REST API Integration → D365 External Services
- Chain of Command Extension → D365 CoC Pattern
- Event Handlers → D365 Event Subscribers

---

## Dashboard Features

| Metric | Description |
|--------|-------------|
| Total Requests | All leave requests in the system |
| Pending | Awaiting manager approval |
| Approved | Approved by manager |
| Rejected | Rejected by manager |

---

## Employee Database

| ID | Name | Department |
|----|------|------------|
| 1 | Aarav Sharma | Information Technology |
| 2 | Priya Patel | Finance |
| 3 | Rajesh Kumar | Human Resources |
| 4 | Sneha Gupta | Marketing |
| 5 | Vikram Singh | Operations |
| 6 | Ananya Reddy | Sales |
| 7 | Karthik Nair | Legal |
| 8 | Deepa Menon | Research & Development |
| 9 | Rahul Verma | Information Technology |
| 10 | Meera Joshi | Finance |

---

## Technology Stack

- **HTML5** — Page structure and semantic markup
- **CSS3** — D365 F&O-inspired professional UI with CSS variables
- **JavaScript (ES5+)** — Application logic, no frameworks
- **LocalStorage** — Client-side data persistence

---

## Project Structure

```
Employee Leave and approval management system/
├── index.html    # Main HTML (Dashboard, Forms, Modals, Sections)
├── style.css     # D365 F&O-inspired responsive styling
├── script.js     # Complete application logic
└── README.md     # Project documentation
```

---

## Workflow

```
Employee Creates Leave Request
        ↓
  Workflow Validation
        ↓
  Manager Approval
        ↓
  Status Update
        ↓
  Data Import/Export
        ↓
  Report Generation
```

---

## How to Use

1. **Leave Request** — Navigate to Leave Request, fill the form, and submit
2. **Approval** — Go to Workflow Approval, click Review on pending items, approve or reject
3. **Import/Export** — Upload CSV files or export existing data
4. **Holidays** — Fetch public holidays, then create leave requests to see conflict detection
5. **Chain of Command** — Select dates and run the simulation to compare base vs extended logic
6. **Event Handlers** — Enter Employee IDs (1-10), change dates, and watch the event log

---

## Browser Support

- Chrome (recommended)
- Firefox
- Edge
- Safari

---

## License

This project is for educational and demonstration purposes.
