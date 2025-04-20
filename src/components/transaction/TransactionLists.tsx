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
  Input,
  Text,
  Button,
  ButtonGroup,
  Card,
  Center,
  Icon,
  IconButton,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Tag,
  VStack,
  FormControl,
  StatHelpText,
  Tooltip,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import {
  AddIcon,
  ArrowBackIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  DownloadIcon,
  EditIcon,
  RepeatIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import EditTransaction from "./EditTransaction";
import DeleteTransaction from "./DeleteTransaction";
import { Transaction } from "../../interface/interface";

const TransactionLists: React.FC = () => {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const toast = useToast();

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // January is 0
  const currentYear = currentDate.getFullYear();

  //  total income for the current month
  const totalIncome = filteredTransactions
    .filter(
      (transaction) =>
        transaction.transactionType === "Income" &&
        new Date(transaction.date).getMonth() === currentMonth &&
        new Date(transaction.date).getFullYear() === currentYear
    )
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  //  total expense for the current month
  const totalExpense = filteredTransactions
    .filter(
      (transaction) =>
        transaction.transactionType === "Expenses" &&
        new Date(transaction.date).getMonth() === currentMonth &&
        new Date(transaction.date).getFullYear() === currentYear
    )
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  useEffect(() => {
    const loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser") || "{}"
    );
    if (loggedInUser && loggedInUser.id) {
      setUserId(loggedInUser.id);
    }

    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:5000/transactions");
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();
        const userTransactions = data.filter(
          (transaction: Transaction) => transaction.userId === loggedInUser.id
        );
        setTransactions(userTransactions);
        setFilteredTransactions(userTransactions);
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
      fetchTransactions();
    }
  }, [toast, userId]);

  useEffect(() => {
    let filtered = transactions;

    if (typeFilter) {
      filtered = filtered.filter(
        (transaction) => transaction.transactionType === typeFilter
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(
        (transaction) => transaction.category === categoryFilter
      );
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filtered = filtered.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= start && transactionDate <= end;
      });
    }

    setFilteredTransactions(filtered);
  }, [typeFilter, categoryFilter, startDate, endDate, transactions]);

  const openEditModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleUpdate = (updatedTransaction: Transaction) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === updatedTransaction.id
          ? updatedTransaction
          : transaction
      )
    );
    setFilteredTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === updatedTransaction.id
          ? updatedTransaction
          : transaction
      )
    );
  };

  const handleDelete = (transactionId: string) => {
    setTransactions((prevTransactions) =>
      prevTransactions.filter((transaction) => transaction.id !== transactionId)
    );
    setFilteredTransactions((prevTransactions) =>
      prevTransactions.filter((transaction) => transaction.id !== transactionId)
    );
  };

  const exportToCSV = () => {
    const headers = ["Type", "Category", "Amount", "Date", "Description"];
    const csvRows = [headers.join(",")];

    filteredTransactions.forEach((transaction) => {
      const row = [
        transaction.transactionType,
        transaction.category,
        transaction.amount.toString(),
        new Date(transaction.date).toLocaleDateString(),
        transaction.description || "",
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box p={6} maxW="1400px" mx="auto" bg="gray.50" minH="100vh">
      {/* Header Section */}
      <Card mb={6} p={6} bg="teal.500" color="white" boxShadow="lg">
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center" gap={4}>
            <Box p={2} bg="white" borderRadius="xl">
              <Image
                src="https://cdn2.f-cdn.com/contestentries/200054/11318259/5533cc713abfd_thumb900.jpg"
                alt="Recipe App Logo"
                w="40px"
                h="40px"
                borderRadius="lg"
                objectFit="cover"
              />
            </Box>
            <VStack align="flex-start" spacing={0}>
              <Text fontSize="sm" opacity={0.9}>
                Welcome back
              </Text>
              <Heading size="lg">Transaction List</Heading>
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
      </Card>

      {/* Summary Cards */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
        <Card
          p={6}
          bg="white"
          boxShadow="sm"
          borderTop="4px"
          borderColor="teal.500"
        >
          <Stat>
            <StatLabel fontSize="sm" color="gray.500">
              Total Income
            </StatLabel>
            <StatNumber fontSize="2xl" color="teal.500">
              ${totalIncome}
            </StatNumber>
            <StatHelpText>
              <Icon as={ArrowUpIcon} color="green.500" mr={1} />
              This Month
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
              Total Expenses
            </StatLabel>
            <StatNumber fontSize="2xl" color="teal.500">
              ${totalExpense}
            </StatNumber>
            <StatHelpText>
              <Icon as={ArrowDownIcon} color="red.500" mr={1} />
              This Month
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
              ${totalIncome - totalExpense}
            </StatNumber>
            <StatHelpText>
              <Icon as={RepeatIcon} color="teal.500" mr={1} />
              Current Balance
            </StatHelpText>
          </Stat>
        </Card>
      </SimpleGrid>

      {/* Filters Section */}
      <Card p={5} mb={6} bg="white" boxShadow="sm">
        <Text mb={4} fontWeight="medium" color="gray.600">
          Filters
        </Text>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
          <FormControl>
            <Select
              placeholder="Filter by Type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              bg="white"
              size="md"
              borderColor="gray.300"
              _hover={{ borderColor: "teal.500" }}
            >
              <option value="Income">Income</option>
              <option value="Expenses">Expenses</option>
            </Select>
          </FormControl>

          <FormControl>
            <Select
              placeholder="Filter by Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              bg="white"
              size="md"
              borderColor="gray.300"
              _hover={{ borderColor: "teal.500" }}
            >
              <option value="Food">Food</option>
              <option value="Groceries">Groceries</option>
              <option value="Rent">Rent</option>
              <option value="Salary">Salary</option>
              <option value="Business">Business</option>
              <option value="Freelancing">Freelancing</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Utilities">Utilities</option>
            </Select>
          </FormControl>

          <FormControl>
            <Input
              placeholder="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              bg="white"
              size="md"
              borderColor="gray.300"
              _hover={{ borderColor: "teal.500" }}
            />
          </FormControl>

          <FormControl>
            <Input
              placeholder="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              bg="white"
              size="md"
              borderColor="gray.300"
              _hover={{ borderColor: "teal.500" }}
            />
          </FormControl>
        </SimpleGrid>
      </Card>

      {/* Transactions Table */}
      {isLoading ? (
        <Card p={8}>
          <Center>
            <VStack spacing={4}>
              <Spinner size="xl" color="teal.500" thickness="4px" />
              <Text color="gray.600">Loading your transactions...</Text>
            </VStack>
          </Center>
        </Card>
      ) : filteredTransactions.length > 0 ? (
        <Card overflow="hidden" boxShadow="sm">
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th bg="teal.50" color="teal.700">
                    Type
                  </Th>
                  <Th bg="teal.50" color="teal.700">
                    Category
                  </Th>
                  <Th bg="teal.50" color="teal.700" isNumeric>
                    Amount
                  </Th>
                  <Th bg="teal.50" color="teal.700">
                    Date
                  </Th>
                  <Th bg="teal.50" color="teal.700">
                    Description
                  </Th>
                  <Th bg="teal.50" color="teal.700" width="100px">
                    Actions
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredTransactions.map((transaction) => (
                  <Tr
                    key={transaction.id}
                    _hover={{ bg: "teal.50" }}
                    transition="all 0.2s"
                  >
                    <Td>
                      <Tag
                        size="md"
                        variant="subtle"
                        colorScheme={
                          transaction.transactionType === "Income"
                            ? "teal"
                            : "red"
                        }
                      >
                        <Icon
                          as={
                            transaction.transactionType === "Income"
                              ? ArrowUpIcon
                              : ArrowDownIcon
                          }
                          mr={2}
                        />
                        {transaction.transactionType}
                      </Tag>
                    </Td>
                    <Td>
                      {/* <Tag size="md"  > */}
                        {transaction.category}
                      {/* </Tag> */}
                    </Td>
                    <Td isNumeric fontWeight="medium">
                      <Text
                        color={
                          transaction.transactionType === "Income"
                            ? "teal.500"
                            : "red.500"
                        }
                      >
                        ${transaction.amount.toLocaleString()}
                      </Text>
                    </Td>
                    <Td>
                      {new Date(transaction.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Td>
                    <Td>
                      <Text noOfLines={1}>
                        {transaction.description || "N/A"}
                      </Text>
                    </Td>
                    <Td>
                      <ButtonGroup size="sm" spacing={2}>
                        <Tooltip label="Edit Transaction">
                          <IconButton
                            icon={<EditIcon />}
                            colorScheme="teal"
                            variant="ghost"
                            onClick={() => openEditModal(transaction)}
                            aria-label="Edit transaction"
                            _hover={{ bg: "teal.50" }}
                          />
                        </Tooltip>
                        <Tooltip label="Delete Transaction">
                          <DeleteTransaction
                            transactionId={transaction.id}
                            onDelete={handleDelete}
                          />
                        </Tooltip>
                      </ButtonGroup>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Card>
      ) : (
        <Card p={12}>
          <VStack spacing={4}>
            <Icon as={SearchIcon} w={8} h={8} color="teal.500" />
            <Text color="gray.600" fontSize="lg">
              No transactions found
            </Text>
            <Text color="gray.500" fontSize="sm">
              Try adjusting your filters or add a new transaction
            </Text>
          </VStack>
        </Card>
      )}

      {/* Add Transaction Button */}
      <Tooltip label="Add New Transaction" placement="left">
        <IconButton
          icon={<AddIcon />}
          mb={-5}
          mr={-6}
          colorScheme="teal"
          size="lg"
          isRound
          position="fixed"
          bottom="8"
          right="8"
          boxShadow="xl"
          onClick={() => router.push("/transactionform")}
          _hover={{
            transform: "scale(1.1)",
            boxShadow: "2xl",
          }}
          transition="all 0.2s"
          aria-label={""}
        />
      </Tooltip>

      {/* Edit Modal */}
      <EditTransaction
        transaction={selectedTransaction}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdate}
      />
    </Box>
  );
};

export default TransactionLists;
