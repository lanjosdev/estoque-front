import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

// import "./dropdownmenuexit.css";


DropdownMenuSolicitacoes.propTypes = {
    dataRequest: PropTypes.object, ////Mudar para requestTarget OU itemTarget
    setRequestTarget: PropTypes.func, //// tirar
    handleOpenModalExit: PropTypes.func,
}
export function DropdownMenuSolicitacoes({ dataRequest, setRequestTarget, handleOpenModalExit }) {
    const [statusRequest, setStatusRequest] = useState([]);

    useEffect(()=> {
        const statusRequestDefault = [
            {
                status_name: "Recebido",
                status_done: true
                ////optModal
            },
            {
                status_name: "Em separação",
                status_done: false
            },
            {
                status_name: "Separado",
                status_done: false
            },
            {
                status_name: "Entregue",
                status_done: false
            },
            {
                status_name: "Devolvido",
                status_done: false
            },
        ];
        const index = statusRequestDefault.findIndex(each=> each.status_name == dataRequest.status);

        if(index !== -1) {
            const newStatusRequest = statusRequestDefault.map((each, idx)=> idx <= index ? ({...each, status_done: true}) : each);
            if(dataRequest.order_type == "Saída") {
                newStatusRequest.pop();
            }
                
            // console.log(dataRequest.order_type, newStatusRequest);
            setStatusRequest(newStatusRequest);
        }
    }, [dataRequest]);


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
		<div className="DropdownMenu">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button className="btn secundary">
                        {dataRequest.status}
                        <i className="bi bi-caret-down-fill"></i>
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Content className="dropdown-content">
                    {statusRequest.map((item, idx)=> (
                    <DropdownMenu.Item key={idx} 
                    className={`dropdown-item ${(idx != 0 && !statusRequest[idx-1]?.status_done) ? 'disable' : ''}`} 
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

                    <DropdownMenu.Item className="dropdown-item del" >
                        <i className="bi bi-x-lg"></i>
                        <span> Cancelar</span>
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>           
        </div>
	);
};