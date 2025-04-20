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
import { Goal } from "@/interface/interface";

const GoalForm: React.FC = () => {
  const [goalCategory, setGoalCategory] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
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
        description: "Please log in to create a Goal.",
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
      const newGoal: Goal = { 
        goalCategory,
        amount,
        savings: "", // you may want to calculate or set savings elsewhere
        description,
        userId,
      };

      const response = await fetch("http://localhost:5000/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGoal),
      });

      if (response.ok) {
        toast({
          title: "Goal created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        router.push("/goallist");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error creating Goal");
      }
    } catch (error) {
      toast({
        title: "Error creating Goal",
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
    <Container>
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
        <Heading mb={6}>Create Goal</Heading>
        <form onSubmit={handleSubmit}>
          <FormControl isRequired>
            <FormLabel>Goal Category</FormLabel>
            <Input
              placeholder="Enter goal category"
              value={goalCategory}
              onChange={(e) => setGoalCategory(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired mt={4}>
            <FormLabel>Goal Amount</FormLabel>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              placeholder="Describe your goal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="teal"
            mt={8}
            isLoading={isSubmitting}
            loadingText="Creating Goal"
          >
            Submit
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default GoalForm;
