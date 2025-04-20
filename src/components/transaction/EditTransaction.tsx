import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import { Transaction } from "../../interface/interface";

interface EditTransactionProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (transaction: Transaction) => void;
}

const EditTransaction: React.FC<EditTransactionProps> = ({
  transaction,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [updatedTransaction, setUpdatedTransaction] =
    React.useState<Transaction | null>(transaction);

  const handleEditSubmit = async () => {
    if (!updatedTransaction) return;

    // API call to update transaction
    const response = await fetch(
      `http://localhost:5000/transactions/${updatedTransaction.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTransaction),
      }
    );

    if (response.ok) {
      onUpdate(updatedTransaction);
      onClose();
    } else {
      // Handle error (optional)
      console.error("Failed to update transaction");
    }
  };

  React.useEffect(() => {
    setUpdatedTransaction(transaction);
  }, [transaction]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="whiteAlpha.200" />
      <ModalContent maxH="100vh" overflowY="auto" bg="white">
        <ModalHeader>Edit Transaction</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {updatedTransaction && (
            <>
              <FormControl>
                <FormLabel>Transaction Type</FormLabel>
                <Select
                  value={updatedTransaction.transactionType}
                  onChange={(e) =>
                    setUpdatedTransaction({
                      ...updatedTransaction,
                      transactionType: e.target.value,
                    })
                  }
                >
                  <option value="Income">Income</option>
                  <option value="Expenses">Expenses</option>
                </Select>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Category</FormLabel>
                <Select
                  value={updatedTransaction.category}
                  onChange={(e) =>
                    setUpdatedTransaction({
                      ...updatedTransaction,
                      category: e.target.value,
                    })
                  }
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

              <FormControl mt={4}>
                <FormLabel>Amount</FormLabel>
                <Input
                  type="number"
                  value={updatedTransaction.amount}
                  onChange={(e) =>
                    setUpdatedTransaction({
                      ...updatedTransaction,
                      amount: parseFloat(e.target.value),
                    })
                  }
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Date</FormLabel>
                <Input
                  type="date"
                  value={new Date(updatedTransaction.date)
                    .toISOString()
                    .slice(0, 10)}
                  onChange={(e) =>
                    setUpdatedTransaction({
                      ...updatedTransaction,
                      date: new Date(e.target.value).toISOString(),
                    })
                  }
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Description</FormLabel>
                <Input
                  value={updatedTransaction.description || ""}
                  onChange={(e) =>
                    setUpdatedTransaction({
                      ...updatedTransaction,
                      description: e.target.value,
                    })
                  }
                />
              </FormControl>
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={handleEditSubmit}>
            Save
          </Button>
          <Button onClick={onClose} ml={3}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditTransaction;
