"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  useToast,
  Container,
  Image,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/users");
    const users = await response.json();

    const foundUser = users.find(
      (u: { email: string; password: string }) =>
        u.email === email && u.password === password
    );

    if (foundUser) {
      // Store user info in localStorage after successful login
      localStorage.setItem("loggedInUser", JSON.stringify(foundUser));

      toast({
        title: "Login successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push("/dashboard");
    } else {
      toast({
        title: "Invalid credentials",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" p={0}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="100vh"
      >
        <Box
          w={{ base: "full", md: "50%" }}
          p={8}
          bg="white" // Card background color
          borderRadius="md" // Rounded corners
          boxShadow="lg" // Card shadow for depth
        >
          <VStack spacing={8} align="stretch">
            <Image
              // src="https://cdn2.f-cdn.com/contestentries/200054/11318259/5533cc713abfd_thumb900.jpg"
              src="https://cdn.vectorstock.com/i/1000x1000/68/55/manager-app-icon-vector-28876855.webp"
              alt="Recipe App Logo"
              maxW="150px"
              mx="auto"
              borderRadius="full"
            />
            <Heading textAlign="center" color="teal.500">
              Welcome Back!
            </Heading>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel color="black">Email</FormLabel>
                  <Input
                    color="black"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel color="black">Password</FormLabel>
                  <Input
                    color="black"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </FormControl>
                <Button type="submit" colorScheme="teal" width="full">
                  Log In
                </Button>
              </VStack>
            </form>
            <Text textAlign="center" color="black">
              Don't have an account?
              <Link
                color="teal.500"
                onClick={() => router.push("/signup")}
                ml={2}
              >
                Sign Up
              </Link>
            </Text>
          </VStack>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
