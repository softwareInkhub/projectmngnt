// import React, { useState } from "react";
// import CreateTeamModal from "./CreateTeamModal";

// export default function CreateTeamPage({ onClose }: { onClose?: () => void }) {
//   const [showModal, setShowModal] = useState(true);

//   const handleClose = () => {
//     setShowModal(false);
//     onClose?.();
//   };

//   const handleCreate = (team: {
//     name: string;
//     description: string;
//     department: string;
//     company: string;
//     manager: string;
//     whatsappGroupId?: string;
//     whatsappGroupName?: string;
//     startDate: string;
//     teamMembers: string[];
//   }) => {
//     console.log("Creating team:", team);
//     // Here you would typically save the team to your state or API
//     handleClose();
//   };

//   return (
//     <div className="w-full h-full bg-neutral-50 flex items-center justify-center">
//       <CreateTeamModal
//         open={showModal}
//         onClose={handleClose}
//         onCreate={handleCreate}
//       />
//     </div>
//   );
// } 