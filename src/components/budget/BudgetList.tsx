"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  Spinner,
  useToast,
  Link,
  Flex,
  Image,
  Select,
  Stack,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Center,
  FormControl,
  Icon,
  IconButton,
  Tag,
  Text,
  Tooltip,
  VStack,
  SimpleGrid,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import {
  AddIcon,
  ArrowBackIcon,
  DownloadIcon,
  EditIcon,
  RepeatIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import { Budget, Transaction } from "../../interface/interface";
import DeleteBudget from "./DeleteBudget";
import EditBudget from "./EditBudget";

const BudgetLists: React.FC = () => {
  const router = useRouter();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [filteredBudget, setFilteredBudget] = useState<Budget[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const toast = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser") || "{}"
    );
    if (loggedInUser && loggedInUser.id) {
      setUserId(loggedInUser.id);
    }

    const fetchBudgets = async () => {
      try {
        const response = await fetch("http://localhost:5000/budgets");
        if (!response.ok) throw new Error("Failed to fetch budgets");
        const data = await response.json();
        const userBudgets = data.filter(
          (budget: Budget) => budget.userId === loggedInUser.id
        );
        setBudgets(userBudgets);
        setFilteredBudget(userBudgets);
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:5000/transactions");
        if (!response.ok) throw new Error("Failed to fetch transactions");
        const data = await response.json();
        const userTransactions = data.filter(
          (transaction: Transaction) => transaction.userId === loggedInUser.id
        );
        setTransactions(userTransactions);
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchBudgets();
      fetchTransactions();
    }
  }, [toast, userId]);

  const calculateExpensesByCategory = (category: string) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return transactions
      .filter(
        (transaction) =>
          transaction.category === category &&
          new Date(transaction.date).getMonth() === currentMonth &&
          new Date(transaction.date).getFullYear() === currentYear
      )
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  // Calculate remaining amount for each budget category
  const calculateLeftAmount = (budgetAmount: number, category: string) => {
    const totalExpense = calculateExpensesByCategory(category);
    return budgetAmount - totalExpense;
  };

  useEffect(() => {
    let filtered = budgets;

    if (categoryFilter) {
      filtered = filtered.filter(
        (budget) => budget.category === categoryFilter
      );
    }

    setFilteredBudget(filtered);
  }, [categoryFilter, budgets]);

  // Add this right after the budget and transaction state declarations
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const netBalance = budgets.reduce((sum, budget) => {
    const leftAmount = calculateLeftAmount(budget.amount, budget.category);
    return sum + leftAmount;
  }, 0);

  useEffect(() => {
    localStorage.setItem("netBalance", netBalance.toString());
  }, [netBalance]);

  const openEditModal = (budget: Budget) => {
    setSelectedBudget(budget);
    setIsEditModalOpen(true);
  };

  const handleUpdate = (updatedBudget: Budget) => {
    setBudgets((prevBudgets) =>
      prevBudgets.map((budget) =>
        budget.id === updatedBudget.id ? updatedBudget : budget
      )
    );
    setFilteredBudget((prevBudgets) =>
      prevBudgets.map((budget) =>
        budget.id === updatedBudget.id ? updatedBudget : budget
      )
    );
  };

  const handleDelete = (budgetId: string) => {
    setBudgets((prevBudgets) =>
      prevBudgets.filter((budget) => budget.id !== budgetId)
    );
    setFilteredBudget((prevBudgets) =>
      prevBudgets.filter((budget) => budget.id !== budgetId)
    );
  };

  const exportToCSV = () => {
    const headers = ["Category", "Amount", "Expense", "Left"];
    const csvRows = [headers.join(",")];

    filteredBudget.forEach((budget) => {
      const expense = calculateExpensesByCategory(budget.category);
      const left = calculateLeftAmount(budget.amount, budget.category);
      const row = [
        budget.category,
        budget.amount.toString(),
        expense.toString(),
        left.toString(),
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "budgets.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box p={6} maxW="1400px" mx="auto" bg="gray.50" minH="100vh">
      {/* Header Section */}
      <Card mb={6} bg="teal.500" color="white" boxShadow="lg">
        <CardBody>
          <Flex justifyContent="space-between" alignItems="center">
            <Flex alignItems="center" gap={4}>
              <Box p={2} bg="white" borderRadius="xl">
                <Image
                  src="https://cdn2.f-cdn.com/contestentries/200054/11318259/5533cc713abfd_thumb900.jpg"
                  alt="Budget App Logo"
                  w="40px"
                  h="40px"
                  borderRadius="lg"
                  objectFit="cover"
                />
              </Box>
              <VStack align="flex-start" spacing={0}>
                {/* <Text fontSize="sm" opacity={0.9}>Overview</Text> */}
                <Heading size="lg">Budget List</Heading>
              </VStack>
            </Flex>
            <Flex gap={4}>
              <Button
                leftIcon={<ArrowBackIcon />}
                colorScheme="whiteAlpha"
                variant="solid"
                size="md"
                onClick={() => router.push("/dashboard")}
                _hover={{ bg: "whiteAlpha.300" }}
              >
                Home
              </Button>
              <Button
                leftIcon={<DownloadIcon />}
                colorScheme="whiteAlpha"
                variant="solid"
                size="md"
                onClick={exportToCSV}
                _hover={{ bg: "whiteAlpha.300" }}
              >
                Export CSV
              </Button>
            </Flex>
          </Flex>
        </CardBody>
      </Card>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
        <Card
          p={6}
          bg="white"
          boxShadow="sm"
          borderTop="4px"
          borderColor="teal.500"
        >
          <Stat>
            <StatLabel fontSize="sm" color="gray.500">
              Total Budget
            </StatLabel>
            <StatNumber fontSize="2xl" color="teal.500">
              ${totalBudget.toLocaleString()}
            </StatNumber>
            <StatHelpText>
              <Icon as={RepeatIcon} color="teal.500" mr={1} />
              This month
            </StatHelpText>
          </Stat>
        </Card>

        <Card
          p={6}
          bg="white"
          boxShadow="sm"
          borderTop="4px"
          borderColor="teal.500"
        >
          <Stat>
            <StatLabel fontSize="sm" color="gray.500">
              Net Balance
            </StatLabel>
            <StatNumber fontSize="2xl" color="teal.500">
              ${netBalance.toLocaleString()}
            </StatNumber>
            <StatHelpText>
              <Icon as={RepeatIcon} color="teal.500" mr={1} />
              This month
            </StatHelpText>
          </Stat>
        </Card>
      </SimpleGrid>

      {/* Filter Section */}
      <Card mb={6} bg="white" boxShadow="sm">
        <CardBody>
          <Text mb={4} fontWeight="medium" color="gray.600">
            Filter Budget
          </Text>
          <FormControl>
            <Select
              placeholder="Filter by Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              bg="white"
              focusBorderColor="teal.500"
              _hover={{ borderColor: "teal.300" }}
            >
              <option value="Food">Food</option>
              <option value="Groceries">Groceries</option>
              <option value="Rent">Rent</option>
              <option value="Salary">Salary</option>
              <option value="Business">Business</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Utilities">Utilities</option>
            </Select>
          </FormControl>
        </CardBody>
      </Card>

      {/* Budget Table */}
      {isLoading ? (
        <Card>
          <CardBody>
            <Center py={8}>
              <VStack spacing={4}>
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="teal.500"
                  size="xl"
                />
                <Text color="gray.600">Loading budgets...</Text>
              </VStack>
            </Center>
          </CardBody>
        </Card>
      ) : filteredBudget.length > 0 ? (
        <Card boxShadow="sm" gap={10}>
          <CardBody p={0}>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th bg="teal.50" color="teal.700" width="5%">
                      Budget Category
                    </Th>
                    <Th bg="teal.50" color="teal.700" isNumeric width="15%">
                      Budget Amount
                    </Th>
                    <Th bg="teal.50" color="teal.700" isNumeric width="15%">
                      Expense
                    </Th>
                    <Th bg="teal.50" color="teal.700" isNumeric width="15%">
                      Remaining Amount
                    </Th>
                    <Th bg="teal.50" color="teal.700" width="5%">
                      Actions
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredBudget.map((budget) => (
                    <Tr
                      key={budget.id}
                      _hover={{ bg: "teal.50" }}
                      transition="all 0.2s"
                    >
                      <Td>
                        <Tag size="md" variant="subtle" colorScheme="teal">
                          {budget.category}
                        </Tag>
                      </Td>
                      <Td isNumeric fontWeight="medium">
                        ${budget.amount.toLocaleString()}
                      </Td>
                      <Td isNumeric fontWeight="medium" color="red.500">
                        $
                        {calculateExpensesByCategory(
                          budget.category
                        ).toLocaleString()}
                      </Td>
                      <Td
                        isNumeric
                        fontWeight="medium"
                        color={
                          calculateLeftAmount(budget.amount, budget.category) <
                          0
                            ? "red.500"
                            : "green.500"
                        }
                      >
                        $
                        {calculateLeftAmount(
                          budget.amount,
                          budget.category
                        ).toLocaleString()}
                      </Td>
                      <Td>
                        <ButtonGroup size="sm" spacing={2}>
                          <Tooltip label="Edit Budget" hasArrow>
                            <IconButton
                              icon={<EditIcon />}
                              colorScheme="teal"
                              variant="ghost"
                              onClick={() => openEditModal(budget)}
                              aria-label="Edit budget"
                              _hover={{ bg: "teal.50" }}
                            />
                          </Tooltip>
                          <DeleteBudget
                            budgetId={budget.id || ""}
                            onDelete={handleDelete}
                          />
                        </ButtonGroup>
                      </Td>
                    </Tr>
                  ))}{" "}
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody>
            <VStack py={8} spacing={4}>
              <Icon as={SearchIcon} w={8} h={8} color="teal.500" />
              <Text color="gray.600" fontSize="lg">
                No budgets found
              </Text>
              <Text color="gray.500" fontSize="sm">
                Try adjusting your filter or add a new budget
              </Text>
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Add Budget Button */}
      <Tooltip label="Add New Budget" placement="left" hasArrow>
        <IconButton
          icon={<AddIcon />}
          colorScheme="teal"
          size="lg"
          isRound
          position="fixed"
          bottom="8"
          right="8"
          boxShadow="xl"
          onClick={() => router.push("/budgetform")}
          _hover={{
            transform: "scale(1.1)",
            boxShadow: "2xl",
          }}
          transition="all 0.2s"
          aria-label="Add new budget"
        />
      </Tooltip>

      <EditBudget
        budget={selectedBudget}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdate}
      />
    </Box>
  );
};

export default BudgetLists;
