import React from "react";
import { IconButton } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";

interface DeleteTransactionProps {
  transactionId: string;
  onDelete: (transactionId: string) => void;
}

const DeleteTransaction: React.FC<DeleteTransactionProps> = ({
  transactionId,
  onDelete,
}) => {
  const toast = useToast();

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/transactions/${transactionId}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        onDelete(transactionId);
        toast({
          title: "Transaction deleted.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error("Failed to delete transaction");
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
      aria-label="Delete transaction"
    />
  );
};

export default DeleteTransaction;
