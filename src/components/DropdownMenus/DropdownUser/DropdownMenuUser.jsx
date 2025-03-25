import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import PropTypes from "prop-types";


import "./dropdownmenuuser.css";


DropdownMenuUser.propTypes = {
    dataUser: PropTypes.object,
    setUserSelect: PropTypes.func,
    setOptionModal: PropTypes.func,
    setOptionUpdate: PropTypes.func,
    setShowModal: PropTypes.func
}
export function DropdownMenuUser({ dataUser, setUserSelect, setOptionModal, setOptionUpdate, setShowModal }) {
	// const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
	// const [urlsChecked, setUrlsChecked] = React.useState(false);
	// const [person, setPerson] = React.useState("pedro");

    function handleDelUser() {
        setUserSelect(dataUser);

        setOptionModal('delete');
        setShowModal(true);
    }
    function handleRestoreUser() {
        setUserSelect(dataUser);

        setOptionModal('restore');
        setShowModal(true);
    }

    function handleUpdateUser(opt) {
        console.log(opt)
        setUserSelect(dataUser);

        setOptionModal('update');
        setOptionUpdate(opt);
        setShowModal(true);
    }


	return (
		<div className="DropdownMenu">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button className="btn secundary">
                        <i className="bi bi-three-dots"></i>
                        <span>Opções</span>
                    </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className="dropdown-content">
                    {!dataUser?.deleted_at ? (
                        
                    <>
                    <DropdownMenu.Item className="dropdown-item" onClick={()=> handleUpdateUser('password')}>Mudar senha</DropdownMenu.Item>
                    <DropdownMenu.Item className="dropdown-item" onClick={()=> handleUpdateUser('perfil')}>Mudar dados</DropdownMenu.Item>
                    <DropdownMenu.Item className="dropdown-item" onClick={()=> handleUpdateUser('level')}>Alterar nível</DropdownMenu.Item>

                    <DropdownMenu.Separator className="dropdown-separator" />

                    <DropdownMenu.Item className="dropdown-item" onClick={handleDelUser}>Deletar usuário</DropdownMenu.Item>
                    </>

                    ) : (

                    <DropdownMenu.Item className="dropdown-item" onClick={handleRestoreUser}>Restaurar usuário</DropdownMenu.Item>

                    )}
                </DropdownMenu.Content>
            </DropdownMenu.Root>           
        </div>
	);
};