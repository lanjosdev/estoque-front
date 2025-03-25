import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import PropTypes from "prop-types";


// import "./dropdownmenuproduct.css";


DropdownMenuProduct.propTypes = {
    dataProduct: PropTypes.object,
    setProductSelect: PropTypes.func,
    handleOpenModal: PropTypes.func,
    setOptionUpdate: PropTypes.func
}
export function DropdownMenuProduct({ dataProduct, setProductSelect, handleOpenModal, setOptionUpdate }) {


    function handleDelProduct() {
        setProductSelect(dataProduct);

        handleOpenModal('delete');
    }

    function handleUpdateProduct(optUpdate) {
        setProductSelect(dataProduct);
        setOptionUpdate(optUpdate);

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
                    <DropdownMenu.Item className="dropdown-item" onClick={()=> handleUpdateProduct('product')}>
                        Editar produto
                    </DropdownMenu.Item>

                    <DropdownMenu.Item className="dropdown-item" onClick={()=> handleUpdateProduct('sector')}>
                        Alterar setor
                    </DropdownMenu.Item>

                    <DropdownMenu.Item className="dropdown-item" onClick={()=> handleUpdateProduct('obs')}>
                        Editar observação
                    </DropdownMenu.Item>
                    
                    <DropdownMenu.Separator className="dropdown-separator" />

                    <DropdownMenu.Item className="dropdown-item" onClick={handleDelProduct}>
                        Deletar produto
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>           
        </div>
	);
};