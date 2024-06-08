export const handleAddUpdateForm = (
  purpose: string,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setAction: React.Dispatch<React.SetStateAction<"add" | "update" | null>>,
  id?: string
) => {
  setIsModalOpen(true);
  setAction(purpose === "add" ? "add" : "update");
};
