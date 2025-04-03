import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import PropTypes from "prop-types";
import { toast } from "react-toastify";


// import "./dropdownmenuinput.css";


DropdownMenuInput.propTypes = {
    dataInput: PropTypes.object,
    setInputSelect: PropTypes.func,
    handleOpenModalInput: PropTypes.func,
    // setOptionUpdate: PropTypes.func
}
export function DropdownMenuInput({ dataInput, setInputSelect, handleOpenModalInput }) {


    function handleDelInput() {
        ////Fazer uma condição que se NÃO for ADMIN apresentar um modal de aviso que não pode processeguir com o delete
        setInputSelect(dataInput);

        handleOpenModalInput('delete');
    }

    function handleUpdateInput() {
        setInputSelect(dataInput);

        handleOpenModalInput('update');
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
                    <DropdownMenu.Item className="dropdown-item" onClick={()=> toast.warn('Sem função')}>
                        Ver detalhes
                    </DropdownMenu.Item>

                    {!dataInput.sub_type && (
                    <>
                    <DropdownMenu.Item className="dropdown-item" onClick={handleUpdateInput}>
                        Editar entrada
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="dropdown-separator" />

                    <DropdownMenu.Item className="dropdown-item" onClick={handleDelInput}>
                        Deletar entrada
                    </DropdownMenu.Item>
                    </>
                    )}
                </DropdownMenu.Content>
            </DropdownMenu.Root>           
        </div>
	);
};