import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import PropTypes from "prop-types";


// import "./dropdownmenusector.css";


DropdownMenuSector.propTypes = {
    dataSector: PropTypes.object,
    setSectorSelect: PropTypes.func,
    handleOpenModal: PropTypes.func
}
export function DropdownMenuSector({ dataSector, setSectorSelect, handleOpenModal }) {
	// const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
	// const [urlsChecked, setUrlsChecked] = React.useState(false);
	// const [person, setPerson] = React.useState("pedro");

    function handleDelSector() {
        setSectorSelect(dataSector);

        handleOpenModal('delete');
    }
    function handleRestoreSector() {
        setSectorSelect(dataSector);

        handleOpenModal('restore');
    }

    function handleUpdateSector() {
        setSectorSelect(dataSector);

        handleOpenModal('update');
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
                    {!dataSector?.deleted_at ? (
                        <>
                        <DropdownMenu.Item className="dropdown-item" onClick={handleUpdateSector}>Editar setor</DropdownMenu.Item>

                        <DropdownMenu.Separator className="dropdown-separator" />

                        <DropdownMenu.Item className="dropdown-item" onClick={handleDelSector}>Deletar setor</DropdownMenu.Item>
                        </>
                    ) : (
                        <DropdownMenu.Item className="dropdown-item" onClick={handleRestoreSector}>Restaurar setor</DropdownMenu.Item>
                    )}
                    
                </DropdownMenu.Content>
            </DropdownMenu.Root>           
        </div>
	);
};