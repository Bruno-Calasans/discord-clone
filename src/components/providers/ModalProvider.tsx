import Mount from "@/components/custom/Mount"
import CreateServerModal from "@/components/modals/CreateServerModal"
import InviteModal from "@/components/modals/InviteModal"
import EditServerModal from "@/components/modals/EditServerModal"
import ManageMembersModal from "../modals/ManageMembersModal"

type ModalProviderProps = {
  children: React.ReactNode
}

function ModalProvider({ children }: ModalProviderProps) {
  return (
    <Mount>
      <>
        <CreateServerModal />
        <InviteModal />
        <EditServerModal />
        <ManageMembersModal />
        {children}
      </>
    </Mount>
  )
}

export default ModalProvider
