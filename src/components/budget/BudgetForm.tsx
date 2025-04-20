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
// import { Budget } from "@/interface/interface";

interface Budget {
  category: string;
  amount: number;
  userId: string;
}

const BudgetForm: React.FC = () => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState(0);
  //   const [date, setDate] = useState("");
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
      const budget: Budget = {
        category,
        amount,
        userId,
      };

      const response = await fetch("http://localhost:5000/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budget),
      });

      if (response.ok) {
        toast({
          title: "Budget created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        router.push("/budgetlist");
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
    <Container minHeight="80vh" maxW="container.fit" py={10}>
      <Box
        p={{ base: 2, md: 5 }}
        bg="#F0FFF4"
        borderRadius="lg"
        maxW={{ base: "50%", md: "350px" }}
        minHeight="60vh"
        m="0 auto"
        boxShadow="lg"
        position="relative"
      >
        <Heading mb={6}>Create Budget</Heading>
        <form onSubmit={handleSubmit}>
          
          <FormControl isRequired>
            <FormLabel>Budget Category</FormLabel>
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
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Utilities">Utilities</option>
            </Select>
          </FormControl>
          <FormControl isRequired mt={4}>
            <FormLabel>Budget Amount</FormLabel>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </FormControl>
          
          <Button
            type="submit"
            colorScheme="teal"
            mt={8}
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
export default BudgetForm;
