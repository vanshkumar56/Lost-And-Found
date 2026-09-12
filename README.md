Lost & Found
A modern, responsive Lost & Found web application designed to help people report, discover, and recover lost belongings through community-powered listings and ownership verification.
✨ Overview
Lost & Found makes it easier to reconnect people with their missing belongings.
Users can:
Create an account and securely sign in
Report a lost item
Add item details, images, date, time, and location
Create private ownership-verification questions
Browse reported lost and found items
Search and filter listings
View detailed item information
Chat with other users
Manage their profile and notification preferences
Receive possible-match alerts
Verify ownership before private contact information is revealed
The interface follows a clean, modern and minimal visual style using a consistent red and white brand identity.
---
🎯 Core Idea
The application is built around one important principle:
> **Finding an item is not enough — we also need to make sure it reaches the rightful owner.**
To support this, reported items can have private multiple-choice verification questions.
When someone claims an item, they can be asked questions created by the person who reported it. The answers can later be evaluated by the application's ownership-verification system before contact information is shared.
This helps reduce false claims and protects users' private information.
---
🚀 Features
🔐 Authentication
Login page
Signup page
Forgot-password flow
OTP verification
Six-digit OTP interface
Email validation
Password-strength validation
Responsive authentication screens
📦 Report Lost Item
The reporting flow is divided into multiple steps:
Item details
Location
Review details
Ownership-verification questions
Submission
The report draft is preserved between steps so information entered on earlier pages can be displayed on later pages.
🧠 Ownership Verification
Reporters can:
Select an item category
Choose between 5–15 questions
Create custom questions
Add up to 5 MCQ options per question
Select the correct answer
Use category-specific suggested questions
Keep sensitive identifying information private
Examples include:
Phone
Laptop
Bag
Wallet
Bottle
ID Card
Earphones
Watch
Keys
Other
🔎 Search
The search page includes:
Keyword search
Lost / Found / All tabs
Category filters
Location filters
Recent searches
Result cards
Responsive mobile result layout
Empty search state
🏠 Dashboard
The dashboard is designed around community listings and supports:
Lost and found item cards
Images
Locations
Dates
Categories
Item details
Responsive layouts
The mobile interface is designed to feel similar to a modern marketplace feed.
💬 Chat
A dedicated chat interface allows users to communicate regarding reported items.
The interface is designed around a marketplace-style conversation experience.
👤 Profile
The profile section includes:
User information
Items reported
Items returned
Successful matches
Personal information
Password & security
Email notifications
Match alerts
Logout confirmation
Profile preferences are currently persisted locally and can later be connected to the authentication/database backend.
---
🎨 Design System
The application uses a minimal visual language.
Primary Brand Color
```text
Red: #E63946
```
Supporting Colors
```text
White: #FFFFFF
Background: #F8F8F8
Text: #171817
Muted Text: #777C77
Borders: #E0E0E0
```
The design intentionally avoids unnecessary colors and uses red primarily for:
Primary buttons
Active states
Important actions
Verification/security indicators
Brand elements
Warnings
Status indicators
---
🛠️ Tech Stack
The project is designed around a modern React frontend.
Frontend
React
TypeScript
CSS
Tailwind utility classes where appropriate
Lucide React icons
Routing
TanStack Router
State / Temporary Storage
React state
`sessionStorage` for multi-step report drafts
`localStorage` for temporary profile/settings persistence
Backend
The application can be connected to:
Supabase Authentication
Supabase Database
Supabase Storage
Supabase Realtime
for production functionality.
---
📁 Suggested Project Structure
```text
src/
├── components/
│   └── BottomNav.tsx
│
├── pages/
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── ForgotPasswordPage.tsx
│   ├── VerifyOtpPage.tsx
│   ├── DashboardPage.tsx
│   ├── SearchPage.tsx
│   ├── ChatPage.tsx
│   ├── ProfilePage.tsx
│   │
│   └── report/
│       ├── ReportItemDetailsPage.tsx
│       ├── ReportLocationPage.tsx
│       ├── ReportReviewPage.tsx
│       └── ReportQuestionsPage.tsx
│
├── styles/
│   ├── login.css
│   ├── signup.css
│   ├── forgot-password.css
│   ├── verify-otp.css
│   ├── dashboard.css
│   ├── search.css
│   ├── chat.css
│   ├── profile.css
│   │
│   └── report/
│       ├── report-item-details.css
│       ├── report-location.css
│       ├── report-review.css
│       └── report-questions.css
│
└── lib/
    └── report-draft.ts
```
---


📱 Responsive Design
The application is designed for:
Desktop
Laptop
Tablet
Android phones
iPhones
Small mobile screens
Important UI elements such as:
Bottom navigation
Item cards
Search results
Forms
Modals
Chat
Profile settings
adapt to smaller screens.
On mobile, item listings use a compact marketplace-style layout to make browsing easier.
---
🔒 Privacy & Security
Sensitive item information should not be exposed publicly.
Reporters should avoid placing details such as:
IMEI numbers
Serial numbers
Exact identifying marks
Private passwords
Highly specific identifying information
in the public item description.
Instead, these details can be used as private ownership-verification questions.
Important
Passwords should never be stored manually in `localStorage`, `sessionStorage`, or the browser.
When authentication is connected to production, password management should be handled by a trusted authentication provider such as Supabase Auth.
---
🧪 Current Development State
The UI currently contains example/mock data in some areas.
For example, the search page currently uses sample lost/found listings.
These should eventually be replaced with database queries.
The next backend integration should connect:
```text
User
  ↓
Authentication
  ↓
Report Item
  ↓
Database
  ↓
Image Storage
  ↓
Dashboard / Search
  ↓
Item Details
  ↓
Ownership Verification
  ↓
Chat / Contact
```
---
🔮 Future Improvements
Recommended next steps:
Backend
Supabase authentication
User profiles
Lost-item database
Found-item database
Image uploads
Real-time chat
Row Level Security
Private contact information
Report moderation
Smart Matching
Implement matching using:
Category
Location
Date
Color
Item description
Image similarity
Time proximity
Ownership Verification
The planned flow is:
```text
User clicks "Is it Yours?"
          ↓
Private verification questions
          ↓
User answers MCQs
          ↓
Answers evaluated
          ↓
High confidence match
          ↓
Contact information becomes available
```
The exact verification threshold should be implemented server-side so users cannot manipulate the result from the browser.
---
🖼️ Brand Assets
The project includes a Lost & Found favicon/logo using the application's red and white visual identity.
Recommended favicon:
```text
lost-and-found.ico
```
HTML:
```html
<link
  rel="icon"
  type="image/x-icon"
  href="/lost-and-found.ico"
/>
```
---
▶️ Running the Project
Install dependencies:
```bash
npm install
```
Start the development server:
```bash
npm run dev
```
Then open the local development URL shown by your frontend tooling.
---
🧹 Production Checklist
Before deploying:
[ ] Connect authentication
[ ] Connect Supabase database
[ ] Configure Supabase Storage
[ ] Add Row Level Security policies
[ ] Replace mock dashboard/search data
[ ] Connect real user profiles
[ ] Connect real chat
[ ] Move ownership verification to server-side logic
[ ] Validate uploaded images
[ ] Add report moderation
[ ] Add rate limiting
[ ] Protect private contact information
[ ] Test mobile layouts
[ ] Test authentication flows
[ ] Test all report steps
[ ] Test invalid form submissions
[ ] Test database permissions
[ ] Configure production environment variables
---
Project Goal
Lost & Found is designed to make recovering lost belongings simpler, safer and more community-driven.
Report it. Find it. Verify it. Get it back.