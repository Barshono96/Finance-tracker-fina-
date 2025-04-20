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

const SignUp: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const user = { name, email, password };
    const response = await fetch("http://localhost:5000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      toast({
        title: "Account created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push("/login");
    } else {
      toast({
        title: "Error creating account",
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
          p={6} // Adjusted padding
          borderRadius="md"
          boxShadow="lg"
          bg="white"
          minH="100vh" // Set height to fit screen height
          maxH="100vh" // Limits card height to full viewport height
          display="flex"
          flexDirection="column"
          justifyContent="center" // Center content vertically
        >
          {/* Card content starts here */}
          <VStack spacing={6} align="stretch">
            <Image
              // src="https://cdn2.f-cdn.com/contestentries/200054/11318259/5533cc713abfd_thumb900.jpg"
              src="https://cdn.vectorstock.com/i/1000x1000/68/55/manager-app-icon-vector-28876855.webp"
              alt="Recipe App Logo"
              maxW="120px" // Slightly reduced size
              maxH="100px"
              mx="auto"
              borderRadius="full"
            />
            <Heading textAlign="center" color="teal.500" fontSize="xl">
              Join Our Community
            </Heading>
            <form onSubmit={handleSubmit}>
              <VStack spacing={3}>
                <FormControl isRequired>
                  <FormLabel color="black" fontSize="sm">
                    Name
                  </FormLabel>
                  <Input
                    color="black"
                    type="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel color="black" fontSize="sm">
                    Email
                  </FormLabel>
                  <Input
                    color="black"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel color="black" fontSize="sm">
                    Password
                  </FormLabel>
                  <Input
                    color="black"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel color="black" fontSize="sm">
                    Confirm Password
                  </FormLabel>
                  <Input
                    color="black"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                  />
                </FormControl>
                <Button type="submit" colorScheme="teal" width="full">
                  Sign Up
                </Button>
              </VStack>
            </form>
            <Text textAlign="center" color="black" fontSize="sm">
              Already have an account?
              <Link
                color="teal.500"
                onClick={() => router.push("/login")}
                ml={2}
              >
                Log In
              </Link>
            </Text>
          </VStack>
          {/* Card content ends here */}
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
