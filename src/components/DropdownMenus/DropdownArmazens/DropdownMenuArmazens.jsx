import PropTypes from "prop-types";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";


// import "./dropdownmenustorage.css";


DropdownMenuArmazens.propTypes = {
    dataArmazem: PropTypes.object,
    setArmazemSelect: PropTypes.func,
    handleOpenModal: PropTypes.func
}
export function DropdownMenuArmazens({ dataArmazem, setArmazemSelect, handleOpenModal }) {
	

    function handleUpdateStorage() {
        setArmazemSelect(dataArmazem);

        handleOpenModal('update');
    }
    function handleDelStorage() {
        setArmazemSelect(dataArmazem);

        handleOpenModal('delete');
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
                    <DropdownMenu.Item className="dropdown-item" onClick={handleUpdateStorage}>Editar armazém</DropdownMenu.Item>

                    <DropdownMenu.Separator className="dropdown-separator" />

                    <DropdownMenu.Item className="dropdown-item" onClick={handleDelStorage}>Deletar armazém</DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>           
        </div>
	);
};