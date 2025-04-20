This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# 💰 Personal Finance Tracker

A simple and responsive personal finance tracker built with [Next.js](https://nextjs.org).  
Track your income, expenses, savings goals, and budgets—all in one place.

---

## 🚀 Features

1. **User Registration (Simulated)**
   - Simulated sign-up and login (no real auth needed)
   - Login status stored in local storage
   - User data stored locally or on JSON server

2. **Expense and Income Tracking**
   - Add, edit, delete transactions
   - Each transaction includes: amount, category, date, and description
   - All data handled via JSON server

3. **Categorization and Filters**
   - Categorize by income or expenses
   - Filter by category (e.g., food, salary, rent) or date range

4. **Monthly Budgeting**
   - Set budgets per category
   - Track spending and remaining budget

5. **Transaction Summary**
   - Monthly summary of total income and expenses
   - Remaining balance shown based on budgets

6. **Data Visualization (Optional)**
   - Graphs and charts to show spending patterns
   - Visualize trends for income and expenses

7. **Saving Goals**
   - Set and track savings goals
   - Update progress toward goals

8. **Export Transactions**
   - Export all transactions to CSV

9. **Recurring Transactions**
   - Support for monthly recurring transactions
   - Automatically updated entries each month

10. **Responsive Design**
    - Mobile, tablet, and desktop-friendly UI

---

## 🛠 Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
