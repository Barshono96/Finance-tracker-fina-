"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

interface Transaction {
  category: string;
  amount: number;
  date: string;
  description: string;
  transactionType: string;
  userId: string;
}

const TrasactionForm: React.FC = () => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [userId, setUserId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser") || "{}"
    );
    if (loggedInUser && loggedInUser.id) {
      setUserId(loggedInUser.id);
    } else {
      toast({
        title: "User not logged in",
        description: "Please log in to create a Transaction.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      router.push("/login");
    }
  }, [toast, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const transaction: Transaction = {
        category,
        amount,
        date,
        description,
        transactionType,
        userId,
      };

      const response = await fetch("http://localhost:5000/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      });

      if (response.ok) {
        toast({
          title: "Transaction created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        router.push("/transactionlist");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error creating Transaction");
      }
    } catch (error) {
      toast({
        title: "Error creating Transaction",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Container minHeight="100vh" maxW="container.fit" py={10}>
      <Box
        p={{ base: 2, md: 5 }}
        bg="#F0FFF4"
        borderRadius="lg"
        maxW={{ base: "100%", md: "700px" }}
        minHeight="70vh"
        m="0 auto"
        boxShadow="lg"
        position="relative"
      >
        <Heading mb={6}>Create Transaction</Heading>
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormControl isRequired>
              <FormLabel>Transaction Type</FormLabel>
              <Select
                placeholder="Select type"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
              >
                <option value="Income">Income</option>
                <option value="Expenses">Expenses</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Amount</FormLabel>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </FormControl>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Date</FormLabel>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Transaction Category</FormLabel>
            <Select
              placeholder="Select category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
            <FormLabel>Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Say something"
              minH="150px"
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="teal"
            mt={4}
            isLoading={isSubmitting}
            loadingText="Creating Recipe"
          >
            Submit
          </Button>
        </form>
      </Box>
     </Container>
  );
};
export default TrasactionForm;
