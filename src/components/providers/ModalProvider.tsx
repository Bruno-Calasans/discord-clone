import Mount from "@/components/custom/Mount"
import CreateServerModal from "@/components/modals/CreateServerModal"
import InviteModal from "@/components/modals/InviteModal"
import EditServerModal from "@/components/modals/EditServerModal"
import ManageMembersModal from "@/components/modals/ManageMembersModal"
import CreateChannelModal from "@/components/modals/CreateChannelModal"
import LeaveServerModal from "@/components/modals/LeaveServerModal"
import DeleteServerModal from "@/components/modals/DeleteServerModal"
import EditChannelModal from "@/components/modals/EditChannelModal"
import DeleteChannelModal from "@/components/modals/DeleteChannelModal"

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
        <CreateChannelModal />
        <LeaveServerModal />
        <DeleteServerModal />
        <EditChannelModal />
        <DeleteChannelModal />
        {children}
      </>
    </Mount>
  )
}

export default ModalProvider
