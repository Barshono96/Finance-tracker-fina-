import React from "react";
import { IconButton } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";

interface DeleteBudgetProps {
    budgetId: string;
  onDelete: (budgetId: string) => void;
}

const DeleteBudget: React.FC<DeleteBudgetProps> = ({
    budgetId,
  onDelete,
}) => {
  const toast = useToast();

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/budgets/${budgetId}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        onDelete(budgetId);
        toast({
          title: "Budget deleted.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error("Failed to delete budget");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <IconButton
      icon={<DeleteIcon />}
      colorScheme="red"
      onClick={handleDelete}
      aria-label="Delete budget"
    />
  );
};

export default DeleteBudget;
