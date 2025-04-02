import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import PropTypes from "prop-types";


// import "./dropdownmenuinput.css";


DropdownMenuMovimentacoes.propTypes = {
    dataMovimentation: PropTypes.object,
    setMovimentationSelect: PropTypes.func,
    handleOpenModal: PropTypes.func,
    // setOptionUpdate: PropTypes.func
}
export function DropdownMenuMovimentacoes({ dataMovimentation, setMovimentationSelect, handleOpenModal }) {


    function handleDelInput() {
        ////Fazer uma condição que se NÃO for ADMIN apresentar um modal de aviso que não pode processeguir com o delete
        setMovimentationSelect(dataMovimentation);

        handleOpenModal('delete');
    }

    function handleUpdateInput() {
        setMovimentationSelect(dataMovimentation);

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
                    <DropdownMenu.Item className="dropdown-item" onClick={handleUpdateInput}>Editar entrada</DropdownMenu.Item>
                    {/* <DropdownMenu.Item className="dropdown-item" onClick={()=> handleUpdateProduct('sector')}>Alterar setor</DropdownMenu.Item> */}

                    <DropdownMenu.Separator className="dropdown-separator" />

                    <DropdownMenu.Item className="dropdown-item" onClick={handleDelInput}>Deletar entrada</DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>           
        </div>
	);
};