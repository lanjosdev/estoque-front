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
    function handleDetailsExit() {
        setExitSelect(dataExit);

        handleOpenModalExit('details');
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
                    <DropdownMenu.Item className="dropdown-item" onClick={handleDetailsExit}>
                        <i className="bi bi-info-circle"></i>
                        <span> Exibir detalhes</span>
                    </DropdownMenu.Item>

                    {dataExit.sub_type == 'DESCARTE' && (
                    <>
                    <DropdownMenu.Item className="dropdown-item" onClick={handleUpdateExit}>
                        <i className="bi bi-pencil-square"></i>
                        <span> Editar {dataExit.discarded ? 'descarte' : 'saída'}</span>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="dropdown-separator" />

                    <DropdownMenu.Item className="dropdown-item del" onClick={handleDelExit}>
                        <i className="bi bi-x-octagon"></i>
                        <span> Deletar {dataExit.discarded ? 'descarte' : 'saída'}</span>
                    </DropdownMenu.Item>
                    </>
                    )}
                </DropdownMenu.Content>
            </DropdownMenu.Root>           
        </div>
	);
};