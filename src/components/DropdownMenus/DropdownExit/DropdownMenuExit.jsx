import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import PropTypes from "prop-types";


// import "./dropdownmenuexit.css";


DropdownMenuExit.propTypes = {
    dataExit: PropTypes.object,
    setExitSelect: PropTypes.func,
    handleOpenModalExit: PropTypes.func,
    // setOptionUpdate: PropTypes.func
}
export function DropdownMenuExit({ dataExit, setExitSelect, handleOpenModalExit }) {


    function handleDelExit() {
        ////Fazer uma condição que se NÃO for ADMIN apresentar um modal de aviso que não pode processeguir com o delete
        setExitSelect(dataExit);

        handleOpenModalExit('delete');
    }

    function handleUpdateExit() {
        setExitSelect(dataExit);

        handleOpenModalExit('update');
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
                    <DropdownMenu.Item className="dropdown-item">
                        Ver detalhes
                    </DropdownMenu.Item>

                    {dataExit.sub_type == 'DESCARTE' && (
                    <>
                    <DropdownMenu.Item className="dropdown-item" onClick={handleUpdateExit}>
                        Editar {dataExit.discarded ? 'descarte' : 'saída'}
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="dropdown-separator" />

                    <DropdownMenu.Item className="dropdown-item" onClick={handleDelExit}>
                        Deletar {dataExit.discarded ? 'descarte' : 'saída'}
                    </DropdownMenu.Item>
                    </>
                    )}
                </DropdownMenu.Content>
            </DropdownMenu.Root>           
        </div>
	);
};