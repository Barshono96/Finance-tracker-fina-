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
  Image,
  Heading,
  Spinner,
  useToast,
  Flex,
  IconButton,
  Tag,
  Text,
  VStack,
  Card,
  CardBody,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Center,
  Tooltip,
  ButtonGroup,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { AddIcon, ArrowBackIcon, EditIcon, RepeatIcon } from "@chakra-ui/icons";
import { Goal } from "../../interface/interface";
import DeleteGoal from "../goal/DeleteGoal";

const GoalList: React.FC = () => {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [filteredGoal, setFilteredGoal] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [netBalance, setNetBalance] = useState(0);
  const toast = useToast();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch("http://localhost:5000/goals");
        if (!response.ok) throw new Error("Failed to fetch goals");
        const data = await response.json();
        setGoals(data);
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
    fetchGoals();
  }, [toast]);

  useEffect(() => {
    const storedNetBalance = localStorage.getItem("netBalance");
    if (storedNetBalance) {
      setNetBalance(Number(storedNetBalance));
    } else {
      const initialNetBalance = 0;
      setNetBalance(initialNetBalance);
      localStorage.setItem("netBalance", String(initialNetBalance));
    }
  }, []);

  const totalGoalAmount = goals.reduce((sum, goal) => sum + goal.amount, 0);
  const needBalance =   netBalance - totalGoalAmount;

  const handleDelete = (goalId: string) => {
    console.log(`Removing goal with ID: ${goalId} from local state`);
    setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== goalId));
    setFilteredGoal((prevFilteredGoals) =>
      prevFilteredGoals.filter((goal) => goal.id !== goalId)
    );
  };

  return (
    <Box p={6} maxW="1400px" mx="auto" bg="gray.50" minH="100vh">
      {/* Header Section */}
      <Card mb={6} bg="teal.500" color="white" boxShadow="lg">
        <CardBody>
          {/* <Flex justifyContent="space-between" alignItems="center">
            <Heading size="lg">Goal List</Heading>
          </Flex>
          <Button
                leftIcon={<ArrowBackIcon />}
                colorScheme="whiteAlpha"
                variant="solid"
                size="md"
                onClick={() => router.push("/dashboard")}
                _hover={{ bg: "whiteAlpha.300" }}
              >
                Home
              </Button> */}
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
            </Flex>
          </Flex>
        </CardBody>
      </Card>

      {/* Net Balance Display */}
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
              Total Savings
            </StatLabel>
            <StatNumber fontSize="2xl" color="teal.500">
              ${netBalance.toLocaleString()}
            </StatNumber>
            <StatLabel>
              <RepeatIcon color="teal.500" mr={1} />
              This month
            </StatLabel>
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
              Total Goal Amount
            </StatLabel>
            <StatNumber fontSize="2xl" color="teal.500">
              ${totalGoalAmount.toLocaleString()}
            </StatNumber>
            <StatLabel>
              <RepeatIcon color="teal.500" mr={1} />
              This month
            </StatLabel>
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
              Need Savings
            </StatLabel>
            <StatNumber fontSize="2xl" color="teal.500">
              ${needBalance.toLocaleString()}
            </StatNumber>
            <StatLabel>
              <RepeatIcon color="teal.500" mr={1} />
              This month
            </StatLabel>
          </Stat>
        </Card>
      </SimpleGrid>

      {/* Goal Table */}
      {isLoading ? (
        <Center py={8}>
          <VStack spacing={4}>
            <Spinner thickness="4px" speed="0.65s" color="teal.500" size="xl" />
            <Text color="gray.600">Loading goals...</Text>
          </VStack>
        </Center>
      ) : goals.length > 0 ? (
        <Card boxShadow="sm">
          <CardBody p={0}>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th bg="teal.50" color="teal.700">
                      Goal Category
                    </Th>
                    <Th bg="teal.50" color="teal.700">
                      Description
                    </Th>
                    <Th bg="teal.50" color="teal.700" isNumeric>
                      Goal Amount
                    </Th>
                    <Th bg="teal.50" color="teal.700" isNumeric>
                      Savings
                    </Th>
                    <Th bg="teal.50" color="teal.700" width="5%">
                      Actions
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {goals.map((goal) => (
                    <Tr key={goal.id} _hover={{ bg: "teal.50" }}>
                      <Td>
                        <Tag size="md" variant="subtle" colorScheme="teal">
                          {goal.goalCategory}
                        </Tag>
                      </Td>
                      <Td>
                        <Text noOfLines={1}>{goal.description || "N/A"}</Text>
                      </Td>
                      <Td isNumeric fontWeight="medium">
                        ${goal.amount.toLocaleString()}
                      </Td>
                      <Td isNumeric fontWeight="medium" color="green.500">
                        ${netBalance.toLocaleString()}
                      </Td>

                      <Td>
                        <ButtonGroup size="sm">
                          <DeleteGoal
                            goalId={goal.id || ""}
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
        <Center py={8}>
          <VStack spacing={4}>
            <Text color="gray.600" fontSize="lg">
              No goals found
            </Text>
            <Text color="gray.500" fontSize="sm">
              Consider adding a new goal
            </Text>
          </VStack>
        </Center>
      )}

      {/* Add Goal Button */}
      <Tooltip label="Add New Goal" placement="left" hasArrow>
        <IconButton
          icon={<AddIcon />}
          colorScheme="teal"
          size="lg"
          isRound
          position="fixed"
          bottom="8"
          right="8"
          boxShadow="xl"
          onClick={() => router.push("/goalform")}
          _hover={{ transform: "scale(1.1)", boxShadow: "2xl" }}
          transition="all 0.2s"
          aria-label="Add new goal"
        />
      </Tooltip>
    </Box>
  );
};

export default GoalList;
