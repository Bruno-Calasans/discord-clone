import Mount from "@/components/custom/Mount";
import CreateServerModal from "@/components/modals/CreateServerModal";
import InviteModal from "@/components/modals/InviteModal";
import EditServerModal from "@/components/modals/EditServerModal";
import ManageMembersModal from "@/components/modals/ManageMembersModal";
import CreateChannelModal from "@/components/modals/CreateChannelModal";
import LeaveServerModal from "@/components/modals/LeaveServerModal";
import DeleteServerModal from "@/components/modals/DeleteServerModal";
import EditChannelModal from "@/components/modals/EditChannelModal";
import DeleteChannelModal from "@/components/modals/DeleteChannelModal";
import MessageFileModal from "@/components/modals/MessageFileModal";
import DeleteChannelMessageModal from "@/components/modals/DeleteChannelMessageModal";
import DeleteDirectMessageModal from "@/components/modals/DeleteDirectMessageModal";
import DirectMessageFileModal from "@/components/modals/DirectMessageFileModal";

export default function ModalProvider() {
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
        <MessageFileModal />
        <DirectMessageFileModal />
        <DeleteChannelMessageModal />
        <DeleteDirectMessageModal />
      </>
    </Mount>
  );
}
