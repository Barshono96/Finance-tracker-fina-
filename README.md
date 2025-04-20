This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Personal Finance Tracker
A simple personal finance tracker that allows users to manage their income, expenses, and savings goals. The app includes features such as transaction categorization, budgeting, and data visualization to help users stay on top of their finances.

Instructions
Fork this repository to your own GitHub account.
Implement the requested features.
When you are done, submit a Pull Request (PR) back to the original repository.
Features
1. User Registration (Simulated)
Users can sign up and log in (no real authentication required).
User data can be stored locally or on the JSON server.
Local storage is used to manage login status.
2. Expense and Income Tracking
Add, edit, and delete transactions.
Each transaction includes an amount, category (e.g., groceries, rent, salary), date, and a description.
All data is stored and fetched from the JSON server.
3. Categorization and Filters
Categorize transactions into different types such as income or expenses.
Filter transactions by category (e.g., food, salary, rent) or by date range.
4. Monthly Budgeting
Users can set a monthly budget for each category (e.g., $200 for groceries, $1000 for rent).
Track how much of the budget has been spent for each category.
5. Transaction Summary
View a summary of total income and expenses for the current month.
The app shows the remaining balance based on the user’s budget.
6. Data Visualization (Optional)
Display spending patterns and category-wise expenses using charts or graphs.
Show monthly trends for both income and expenses.
7. Saving Goals
Users can set savings goals (e.g., save $500 for a vacation).
Track progress towards goals and update the amount saved.
8. Export Transactions
Export all financial transactions as a CSV file for external use.
9. Recurring Transactions
Set up recurring transactions such as monthly rent or salary.
Recurring transactions are automatically updated each month.
10. Responsive Design
Fully responsive UI to ensure the app works across mobile, tablet, and desktop devices.

## Getting Started

First, run the development server:

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
