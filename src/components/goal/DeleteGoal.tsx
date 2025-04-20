// import React from "react";
// import { IconButton } from "@chakra-ui/react";
// import { DeleteIcon } from "@chakra-ui/icons";
// import { useToast } from "@chakra-ui/react";

// interface DeleteGoalProps {
//     goalId: string;
//   onDelete: (goalId: string) => void;
// }

// const DeleteGoal: React.FC<DeleteGoalProps> = ({
//     goalId,
//   onDelete,
// }) => {
//   const toast = useToast();

//   const handleDelete = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/goals/${goalId}`,
//         { method: "DELETE" }
//       );
//       if (response.ok) {
//         onDelete(goalId);
//         toast({
//           title: "Goal deleted.",
//           status: "success",
//           duration: 3000,
//           isClosable: true,
//         });
//       } else {
//         throw new Error("Failed to delete goal");
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "An unknown error occurred",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     }
//   };

//   return (
//     <IconButton
//       icon={<DeleteIcon />}
//       colorScheme="red"
//       onClick={handleDelete}
//       aria-label="Delete budget"
//     />
//   );
// };

// export default DeleteGoal;

import React from "react";
import { IconButton, useToast } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

interface DeleteGoalProps {
  goalId: string;
  onDelete: (goalId: string) => void;
}

const DeleteGoal: React.FC<DeleteGoalProps> = ({ goalId, onDelete }) => {
  const toast = useToast();

  const handleDelete = async () => {
    try {
      console.log(`Attempting to delete goal with ID: ${goalId}`);
      
      
      const response = await fetch(`http://localhost:5000/goals/${goalId}`, {
        method: "DELETE",
      });
      
   
      if (response.ok) {
        console.log("Goal successfully deleted on the server");
        
       
        onDelete(goalId);

       
        toast({
          title: "Goal deleted.",
          description: "The goal was successfully deleted.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        console.error("Failed to delete goal on the server");
        throw new Error("Failed to delete goal");
      }
    } catch (error) {
      console.error("Error deleting goal:", error);
      
      
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
      aria-label="Delete goal"
    />
  );
};

export default DeleteGoal;
