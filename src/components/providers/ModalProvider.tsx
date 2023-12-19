import Mount from "@/components/custom/Mount"
import CreateServerModal from "@/components/modals/CreateServerModal"

type ModalProviderProps = {
  children: React.ReactNode
}

function ModalProvider({ children }: ModalProviderProps) {
  return (
    <Mount>
      <>
        <CreateServerModal />
        {children}
      </>
    </Mount>
  )
}

export default ModalProvider
