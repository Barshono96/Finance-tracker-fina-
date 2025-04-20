"use client";
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  Container,
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Transaction, Goal } from "../interface/interface";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import Link from "next/link";
import { HomeIcon, ListIcon, WalletIcon, TargetIcon } from "lucide-react";

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [netBalance, setNetBalance] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/transactions")
      .then((response) => response.json())
      .then((data) => setTransactions(data));

    fetch("http://localhost:5000/budgets")
      .then((response) => response.json())
      .then((data) => setBudgets(data));

    fetch("http://localhost:5000/goals")
      .then((response) => response.json())
      .then((data) => setGoals(data));

    const storedNetBalance = localStorage.getItem("netBalance");
    if (storedNetBalance) {
      setNetBalance(parseFloat(storedNetBalance));
    }
  }, []);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // Filter for the latest month and latest year
  const latestMonthTransactions = transactions.filter(
    (t) =>
      new Date(t.date).getMonth() + 1 === currentMonth &&
      new Date(t.date).getFullYear() === currentYear
  );
  const latestYearTransactions = transactions.filter(
    (t) => new Date(t.date).getFullYear() === currentYear
  );

  // Calculate totals for the latest month and year
  const latestMonthIncome = latestMonthTransactions
    .filter((t) => t.transactionType === "Income")
    .reduce((acc, t) => acc + t.amount, 0);
  const latestMonthExpenses = latestMonthTransactions
    .filter((t) => t.transactionType === "Expenses")
    .reduce((acc, t) => acc + t.amount, 0);
  const latestYearIncome = latestYearTransactions
    .filter((t) => t.transactionType === "Income")
    .reduce((acc, t) => acc + t.amount, 0);
  const latestYearExpenses = latestYearTransactions
    .filter((t) => t.transactionType === "Expenses")
    .reduce((acc, t) => acc + t.amount, 0);

  // Monthly Income by Category
  const monthlyIncomeByCategory = [
    {
      name: "Salary",
      value: latestMonthTransactions
        .filter(
          (t) => t.category === "Salary" && t.transactionType === "Income"
        )
        .reduce((acc, t) => acc + t.amount, 0),
    },
    {
      name: "Business",
      value: latestMonthTransactions
        .filter(
          (t) => t.category === "Business" && t.transactionType === "Income"
        )
        .reduce((acc, t) => acc + t.amount, 0),
    },
    {
      name: "Freelancing",
      value: latestMonthTransactions
        .filter(
          (t) => t.category === "Freelancing" && t.transactionType === "Income"
        )
        .reduce((acc, t) => acc + t.amount, 0),
    },
    {
      name: "Other",
      value: latestMonthTransactions
        .filter((t) => t.category === "Other" && t.transactionType === "Income")
        .reduce((acc, t) => acc + t.amount, 0),
    },
  ];

  // Monthly Expenses by Category
  const monthlyExpensesByCategory = [
    {
      name: "Rent",
      value: latestMonthTransactions
        .filter(
          (t) => t.category === "Rent" && t.transactionType === "Expenses"
        )
        .reduce((acc, t) => acc + t.amount, 0),
    },
    {
      name: "Food",
      value: latestMonthTransactions
        .filter(
          (t) => t.category === "Food" && t.transactionType === "Expenses"
        )
        .reduce((acc, t) => acc + t.amount, 0),
    },
    {
      name: "Groceries",
      value: latestMonthTransactions
        .filter(
          (t) => t.category === "Groceries" && t.transactionType === "Expenses"
        )
        .reduce((acc, t) => acc + t.amount, 0),
    },
    {
      name: "Entertainment",
      value: latestMonthTransactions
        .filter(
          (t) =>
            t.category === "Entertainment" && t.transactionType === "Expenses"
        )
        .reduce((acc, t) => acc + t.amount, 0),
    },
    {
      name: "Transportation",
      value: latestMonthTransactions
        .filter(
          (t) =>
            t.category === "Transportation" && t.transactionType === "Expenses"
        )
        .reduce((acc, t) => acc + t.amount, 0),
    },

    {
      name: "Utilities",
      value: latestMonthTransactions
        .filter(
          (t) => t.category === "Utilities" && t.transactionType === "Expenses"
        )
        .reduce((acc, t) => acc + t.amount, 0),
    },
  ];

  // Calculate total budget vs expense by category
  const budgetVsExpense = budgets.map((budget: any) => {
    const budgetCategory = budget.category;
    const totalBudget = budget.amount;

    const totalExpensesForCategory = latestMonthTransactions
      .filter(
        (transaction) =>
          transaction.category === budgetCategory &&
          transaction.transactionType === "Expenses"
      )
      .reduce((acc, t) => acc + t.amount, 0);

    return {
      name: budgetCategory,
      budget: totalBudget,
      expense: totalExpensesForCategory,
    };
  });

  const goalProgressData = goals.map((goal) => ({
    name: goal.goalCategory,
    goalAmount: goal.amount,
    currentSavings: netBalance,
  }));

  const COLORS = ["#4CAF50", "#FF5733", "#36A2EB", "#FFCE56"];

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading
              size="xl"
              mb={2}
              bgGradient="linear(to-r, teal.500, blue.500)"
              bgClip="text"
            >
              Finance Tracker Dashboard
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Track your financial journey
            </Text>
          </Box>

          <Flex
            gap={4}
            wrap="wrap"
            bg="white"
            p={4}
            borderRadius="lg"
            shadow="sm"
          >
            <Button
              as="a"
              href="/dashboard"
              colorScheme="teal"
              variant="solid"
              size="lg"
            >
              Dashboard
            </Button>
            <Button
              as="a"
              href="/transactionlist"
              colorScheme="teal"
              variant="outline"
              size="lg"
            >
              Transactions
            </Button>
            <Button
              as="a"
              href="/budgetlist"
              colorScheme="teal"
              variant="outline"
              size="lg"
            >
              Budget
            </Button>
            <Button
              as="a"
              href="/goallist"
              colorScheme="teal"
              variant="outline"
              size="lg"
            >
              Goals
            </Button>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Box
              bg="white"
              p={6}
              borderRadius="lg"
              shadow="sm"
              _hover={{ transform: "translateY(-2px)", shadow: "md" }}
              transition="all 0.2s"
            >
              <Text fontSize="lg" color="gray.600">
                Total Income (This month)
              </Text>
              <Text fontSize="3xl" color="green.500" fontWeight="bold" mt={2}>
                ₹{latestMonthIncome}
              </Text>
            </Box>

            <Box
              bg="white"
              p={6}
              borderRadius="lg"
              shadow="sm"
              _hover={{ transform: "translateY(-2px)", shadow: "md" }}
              transition="all 0.2s"
            >
              <Text fontSize="lg" color="gray.600">
                Total Expenses (This month)
              </Text>
              <Text fontSize="3xl" color="red.500" fontWeight="bold" mt={2}>
                ₹{latestMonthExpenses}
              </Text>
            </Box>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            <Box
              bg="white"
              p={6}
              borderRadius="lg"
              shadow="sm"
              _hover={{ shadow: "md" }}
              transition="all 0.2s"
            >
              <Heading size="md" mb={4}>
                Transaction Overview
              </Heading>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Income", value: latestMonthIncome },
                      { name: "Expenses", value: latestMonthExpenses },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    <Cell fill="#38B2AC" />
                    <Cell fill="#F56565" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            <Box
              bg="white"
              p={6}
              borderRadius="lg"
              shadow="sm"
              _hover={{ shadow: "md" }}
              transition="all 0.2s"
            >
              <Heading size="md" mb={4}>
                Monthly Income by Category
              </Heading>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyIncomeByCategory}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#38B2AC">
                    {monthlyIncomeByCategory.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`hsl(${index * 45}, 70%, 50%)`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>

            <Box
              bg="white"
              p={6}
              borderRadius="lg"
              shadow="sm"
              _hover={{ shadow: "md" }}
              transition="all 0.2s"
            >
              <Heading size="md" mb={4}>
                Monthly Expenses by Category
              </Heading>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyExpensesByCategory}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#F56565">
                    {monthlyExpensesByCategory.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`hsl(${index * 45}, 70%, 50%)`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>

            <Box
              bg="white"
              p={6}
              borderRadius="lg"
              shadow="sm"
              _hover={{ shadow: "md" }}
              transition="all 0.2s"
            >
              <Heading size="md" mb={4}>
                Budget vs Expense by Category
              </Heading>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={budgetVsExpense}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="budget"
                    stroke="#38B2AC"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="#F56565"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>

            <Box
              bg="white"
              p={6}
              borderRadius="lg"
              shadow="sm"
              _hover={{ shadow: "md" }}
              transition="all 0.2s"
            >
              <Heading size="md" mb={4}>
                Goal Amount vs Savings
              </Heading>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={goalProgressData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="goalAmount" fill="#38B2AC" name="Goal Amount" />
                  <Bar
                    dataKey="currentSavings"
                    fill="#ECC94B"
                    name="Current Savings"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default Dashboard;
