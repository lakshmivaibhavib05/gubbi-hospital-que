# Gubbi Hospital Queue System

A token (queue number) system for a government hospital in Gubbi, Karnataka. Patients take a token on their phone, staff call the next patient, and a waiting-hall screen shows who is being called, so nobody has to stand in a line.

> Student project. This is not the official hospital website.

**Live site:** https://magenta-ganache-61fc22.netlify.app

## Features

| Page | Who uses it | What it does |
|------|-------------|--------------|
| Homepage (`index.html`) | Everyone | Hospital photo, location with a Google Maps button, staff list, links to the other pages |
| Get a token (`token.html`) | Patients | Choose a department (General OPD, Laboratory, Pharmacy, Dental) and get a token like `G-001`. Printable slip |
| Now serving (`display.html`) | Waiting-hall screen | Shows the token being called in each department and how many are waiting. Updates by itself, live |
| Staff panel (`staff.html`) | Hospital staff only | Login with email and password, then "Call next" for each department |

Other details:
- Tokens are shared across all phones and computers, through a cloud database.
- Each day starts a fresh queue automatically.
- Only logged-in staff can call the next token. Patients can only take a token.
- Patient names and phone numbers are **not** saved in the database.
- Works on phones, tablets and computers.

## Built With

- HTML, CSS and JavaScript
- Firebase Firestore (database) and Firebase Authentication (staff login)
- Netlify (hosting)
- Git and GitHub (version control)

## Project Structure

```
gubbi-hospital-que/
├── index.html           # Homepage
├── token.html           # Patient token page
├── staff.html           # Staff login and panel
├── display.html         # Now serving screen
├── style.css            # Styles for homepage, staff and display pages
├── token.css            # Styles for the token page
├── token.js             # Token logic
├── staff.js             # Staff login and "Call next"
├── display.js           # Live now-serving board
├── firebase-config.js   # Firebase project settings
├── firebase-init.js     # Connects the pages to Firebase
├── hospital.webp        # Hospital photo
└── README.md
```

## How to Run on Your Computer

1. Clone the repository.
2. Open the folder in VS Code and install the **Live Server** extension.
3. Click **Go Live**, then open `token.html`, `staff.html` or `display.html`.

The pages must run through a server (Live Server). Double-clicking the files will not work, because the Firebase code needs a server address.

## How the Database Is Protected

Each day and department has one record with two numbers: `issued` (tokens given) and `serving` (token being called). The Firestore rules make sure that:
- anyone can read the numbers,
- a patient can only add 1 to `issued`,
- only a logged-in staff member can add 1 to `serving`,
- nothing can be deleted.

## Version History

| Version | What was added |
|---------|----------------|
| v1.0.0 | Hospital homepage |
| v2.0.0 | Token generation page |
| v3.0.0 | Staff panel, now serving screen, new homepage design |
| v4.0.0 | Firebase database (shared across devices), real staff login, hospital photo, location and staff section, live website |

## Future Ideas

- SMS or WhatsApp alert when a patient's turn is near
- Kannada language option
- Separate counters or doctors inside each department
- Daily report of how many patients were served

## Author

Created by **Lakshmi Vaibhavi B**, 1st-year CSE student at CIT Gubbi.