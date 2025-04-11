import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

import "./dropdownmenusolicitacoes.css";


DropdownMenuSolicitacoes.propTypes = {
    itemTarget: PropTypes.object,
    handleOpenModal: PropTypes.func,
}
export function DropdownMenuSolicitacoes({ itemTarget, handleOpenModal }) {
    const [statusRequest, setStatusRequest] = useState([]);

    useEffect(()=> {
        const statusRequestDefault = [
            {
                status_name: "Recebido",
                status_done: true,
                option_modal: 'recebido'
            },
            {
                status_name: "Em separação",
                status_done: false,
                option_modal: 'inseparation'
            },
            {
                status_name: "Separado",
                status_done: false,
                option_modal: 'separado'
            },
            {
                status_name: "Entregue",
                status_done: false,
                option_modal: 'entregue'
            },
            {
                status_name: "Retornado",
                status_done: false,
                option_modal: 'retornado'
            },
        ];
        const index = statusRequestDefault.findIndex(each=> each.status_name == itemTarget.status);

        if(index !== -1) {
            const newStatusRequest = statusRequestDefault.map((each, idx)=> idx <= index ? ({...each, status_done: true}) : each);
            if(itemTarget.order_type == "Saída") {
                newStatusRequest.pop();
            }
                
            // console.log(dataRequest.order_type, newStatusRequest);
            setStatusRequest(newStatusRequest);
        }
    }, [itemTarget]);


    // function handleDelExit() {
    //     setExitSelect(dataExit);

    //     handleOpenModalExit('delete');
    // }

    // function handleUpdateExit() {
    //     setExitSelect(dataExit);

    //     handleOpenModalExit('update');
    // }
    // function handleDetailsExit() {
    //     setExitSelect(dataExit);

    //     handleOpenModalExit('details');
    // }



	return (
		<div className="DropdownMenu DropdownMenuSolicitacoes">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button className={`btn secundary ${itemTarget.status == "Recebido" ? 'indicator' : ''}`}>
                        {itemTarget.status}
                        <i className="bi bi-caret-down-fill"></i>
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Content className="dropdown-content">
                    {statusRequest.map((item, idx)=> (
                    <DropdownMenu.Item key={idx} 
                    className={`dropdown-item ${(idx != 0 && !statusRequest[idx-1]?.status_done) ? 'disable' : ''}`}
                    onClick={(!item.status_done && statusRequest[idx-1]?.status_done) ? ()=> handleOpenModal(itemTarget, item.option_modal) : null} 
                    // onClick={()=> handleOpenModal(itemTarget, item.option_modal)} 
                    disabled={item.status_done || !statusRequest[idx-1].status_done}
                    >
                        {item.status_done && (
                        <i className="bi bi-check-circle-fill"></i>
                        )}

                        <span> {item.status_name}</span>
                    </DropdownMenu.Item>
                    ))}

                    {/* <DropdownMenu.Item className="dropdown-item" >
                        <i className="bi bi-check-circle-fill"></i>
                        <span> Recebido</span>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item className="dropdown-item" >
                        <i className="bi bi-check-circle-fill"></i>
                        <span> Em separação</span>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item className="dropdown-item" >
                        <i className="bi bi-check-circle-fill"></i>
                        <span> Separado</span>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item className="dropdown-item" >
                        <i className="bi bi-check-circle-fill"></i>
                        <span> Entregue</span>
                    </DropdownMenu.Item>

                    {dataRequest.order_type == "Empréstmo" && (
                    <DropdownMenu.Item className="dropdown-item" >
                        <i className="bi bi-check-circle-fill"></i>
                        <span> Devolvido</span>
                    </DropdownMenu.Item>
                    )} */}


                    <DropdownMenu.Separator className="dropdown-separator" />

                    <DropdownMenu.Item className="dropdown-item del" onClick={()=> handleOpenModal(itemTarget, 'cancelado')}>
                        <i className="bi bi-x-lg"></i>
                        <span> Cancelar</span>
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>           
        </div>
	);
};