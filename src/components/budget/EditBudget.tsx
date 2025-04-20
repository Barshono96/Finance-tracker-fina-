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
import { Budget } from "../../interface/interface";

interface EditBudgetProps {
  budget: Budget | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (budget: Budget) => void;
}

const EditBudget: React.FC<EditBudgetProps> = ({
  budget,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [updatedBudget, setUpdatedBudget] = React.useState<Budget | null>(
    budget
  );

  const handleEditSubmit = async () => {
    if (!updatedBudget) return;

    
    const response = await fetch(
      `http://localhost:5000/budgets/${updatedBudget.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBudget),
      }
    );

    if (response.ok) {
      onUpdate(updatedBudget);
      onClose();
    } else {
      // Handle error (optional)
      console.error("Failed to update transaction");
    }
  };

  React.useEffect(() => {
    setUpdatedBudget(budget);
  }, [budget]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="whiteAlpha.200" />
      <ModalContent maxH="100vh" overflowY="auto" bg="white">
        <ModalHeader>Edit Budget</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {updatedBudget && (
            <>
              <FormControl mt={4}>
                <FormLabel>Budget Category</FormLabel>
                <Select
                  value={updatedBudget.category}
                  onChange={(e) =>
                    setUpdatedBudget({
                      ...updatedBudget,
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
                <FormLabel>Budget Amount</FormLabel>
                <Input
                  type="number"
                  value={updatedBudget.amount}
                  onChange={(e) =>
                    setUpdatedBudget({
                      ...updatedBudget,
                      amount: parseFloat(e.target.value),
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

export default EditBudget;
