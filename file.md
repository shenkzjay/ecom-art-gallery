🎯 Project Prompt: Build a Social Betting App
📘 Overview
You are tasked with building a Social Betting App — a platform where users can create custom bets among friends or peers. Unlike traditional sports betting apps, this app focuses on peer-to-peer wagers on arbitrary events like "Who eats the most tacos?" or "Who wins in arm wrestling?"

The goal is to enable user-generated bets , facilitate secure settlements, and provide a fair mechanism to resolve disputes using a referee system.

💡 Key Features & Functionality

1. User Authentication
   Users must be signed in to:
   Create, accept, or manage bets
   View their wallet balance
   Access notifications
2. Create Bet (Host Flow)
   A user (the host) creates a bet via a form with these fields:
   Bet Title : e.g., "Taco Eating Challenge"
   Description : Details about the bet
   Amount : The stake each party puts up
   Opponent : Select from contacts or enter opponent’s username/email
   Upon submission:
   A notification (email or in-app) is sent to the opponent.
   The bet status is set to PENDING.
3. Accept/Decline Bet (Opponent Flow)
   Opponent receives a notification and clicks a link to:
   Review the bet details
   Accept or decline the bet
   If accepted:
   Deduct the bet amount from both parties’ wallets
   Update bet status to ACTIVE
   Create a corresponding transaction record
4. Bet Resolution
   Only the host or a designated bet referee can declare the winner.
   Referee can be invited by the host to ensure fairness.
   Once resolved:
   Transfer the total staked amount (minus fees if any) to the winner’s wallet
   Mark the bet as RESOLVED
5. Wallet System
   Each user has a virtual wallet with:
   Deposit funds
   Track transactions (win, loss, deposit, withdrawal)
   Wallet updates occur automatically during:
   Bet acceptance
   Bet resolution
6. Notifications
   Use web push notifications or email to:
   Notify opponent of new bet
   Notify host of bet acceptance
   Notify users when a bet is resolved
   🛠️ Tech Stack
   Frontend : React + Remix.js (React Router v7), TailwindCSS
   Backend : Node.js + Express or Prisma ORM with PostgreSQL
   Database : PostgreSQL
   Authentication : Supabase Auth / Firebase Auth / Custom JWT-based auth
   Push Notifications : Web Push API or Firebase Cloud Messaging
   Email : Nodemailer or Resend

🧱 Data Model
Below are the core database schemas:
// Enums
export const betStatusEnum = pgEnum("bet_status", ["PENDING", "ACTIVE", "RESOLVED"]);
export const betPositionEnum = pgEnum("bet_position", ["AGAINST", "FOR"]);

// Tables
export const bettingTable = pgTable("betting", {
id: serial("id").primaryKey(),
bettingTitle: text("betting_title").notNull(),
bettingAmount: integer("betting_amount").notNull(),
bettingBalance_id: integer("betting_balance").notNull().references(() => betBalance.id),
betStatus: betStatusEnum("bet_status").default("PENDING").notNull(),
betPosition: betPositionEnum("bet_position").notNull(),
creatorId: integer("creator_id").notNull().references(() => userTable.id),
opponentId: integer("opponent_id").references(() => userTable.id), // nullable until accepted
winnerId: integer("winner_id").references(() => userTable.id),
createdAt: timestamp("created_at").notNull().defaultNow(),
updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
});

export const betBalance = pgTable("bet_balances", {
id: serial("id").primaryKey(),
userId: integer("user_id").notNull().unique().references(() => userTable.id),
balance: integer("balance").notNull().default(0),
});

export const transactionTypeEnum = pgEnum("transaction_type", [
"DEPOSIT",
"BET_PLACED",
"BET_WON",
"BET_LOST",
"WITHDRAWAL",
]);

export const transactionTable = pgTable("bet_transaction", {
id: serial("id").primaryKey(),
userId: integer("user_id").notNull().references(() => userTable.id),
bettingId: integer("betting_id").notNull().references(() => bettingTable.id),
amount: integer("amount").notNull(),
transactionType: transactionTypeEnum("transaction_type").notNull(),
createdAt: timestamp("created_at").notNull().defaultNow(),
});

FOLDER STRUCTURE

/app
/routes
/bet
create-bet.tsx
view-bet.tsx
accept-bet.tsx
/wallet
index.tsx
/notifications
index.tsx
/components
/ui
Button.tsx
Card.tsx
Modal.tsx
NotificationItem.tsx
BetCard.tsx
/lib
db.ts
auth.server.ts
notifications.server.ts
/utils
formatCurrency.ts
formatDate.ts

🖼️ UI Requirements
Homepage (/)
Hero section with a call-to-action: “Start a Bet”
Brief explanation of how the app works
Simple navigation bar (Login | Sign Up | Create Bet)
Create Bet Page (/bet/create)
Form with:
Bet title
Description
Amount
Opponent selection
Submit button
Accept Bet Page (/bet/:id/accept)
Display bet details
Accept / Decline buttons
Login prompt if not authenticated
View Bet Page (/bet/:id)
Bet title, description, participants
Status badge (Pending / Active / Resolved)
Option to declare winner (if host/referee)
🧪 Development Workflow
Setup Project
Initialize project with Remix + TailwindCSS
Configure Postgres DB + Prisma ORM
Implement Core Pages
Home page with CTA
Create Bet form
Accept Bet confirmation screen
View Bet detail page
Build Wallet & Transaction System
Add deposit functionality
Handle automatic deductions on bet acceptance
Implement win/loss logic
Add Notification System
In-app or email alerts
Redirect links for bet acceptance
Secure User Flows
Protect routes with authentication
Ensure only authorized users can act on bets
Test End-to-End
Simulate full flow: create → accept → resolve → settle
Check data consistency across tables
✅ Success Criteria
Users can create and send bets
Opponents receive and respond to bet invites
Bets are tracked in real-time
Wallet balances update correctly
Winner is declared and notified
Transactions are logged accurately
App is responsive and mobile-friendly
