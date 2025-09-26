// import React, { useState } from "react";
// import CreateTaskModal from "./CreateTaskModal";

// export default function CreateTaskPage({ onClose }: { onClose?: () => void }) {
//   const [showModal, setShowModal] = useState(true);

//   const handleClose = () => {
//     setShowModal(false);
//     onClose?.();
//   };

//   const handleCreate = async (task: any) => {
//     console.log("Creating task:", task);
//     // The actual API call is now handled in CreateTaskModal
//     handleClose();
//   };

//   return (
//     <div className="w-full h-full bg-neutral-50 flex items-center justify-center">
//       <CreateTaskModal
//         open={showModal}
//         onClose={handleClose}
//         context={{ company: "Whapi Project Management" }}
//         onTaskCreated={handleCreate}
//       />
//     </div>
//   );
// } 