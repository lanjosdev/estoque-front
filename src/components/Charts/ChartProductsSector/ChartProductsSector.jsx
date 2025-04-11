// Hooks / Libs:
import PropTypes from "prop-types";

// Components:
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Style:
import './chartproductssector.css';


ChartProductsSector.propTypes = {
    datas: PropTypes.array
}
export function ChartProductsSector({ datas }) {
    // Dados de exemplo - quantidade de produtos por categoria
    // const dados = [
    //     {
    //         name_category: "Administração",
    //         quantity_products: 2
    //     },
    //     {
    //         name_category: "Cenografia",
    //         quantity_products: 0
    //     },
    //     {
    //         name_category: "Eletrônica",
    //         quantity_products: 0
    //     },
    //     {
    //         name_category: "Oficina",
    //         quantity_products: 0
    //     },
    //     {
    //         name_category: "Produção",
    //         quantity_products: 0
    //     },
    //     {
    //         name_category: "TI",
    //         quantity_products: 0
    //     }
    // ];

    // Ordenar os dados por quantidade (do maior para o menor)
    const dadosOrdenados = [...datas].sort((a, b) => b.quantity_products - a.quantity_products);


    return (
        <div className="Chart ChartProductsSector w-full max-w-3xl p-6 bg-white rounded-lg shadow-md">
            <div className="chart_title">
                <h3 className="text-xl font-bold mb-6 text-gray-800">Produtos catalogados por setor</h3>
            </div>

            <div className="chart_data">
                <ResponsiveContainer className='chart_component' width="100%" height={450}>
                    <BarChart layout="vertical" data={dadosOrdenados} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name_category" tick={{ fill: '#656362' }} width={100} />

                        <Tooltip
                        formatter={(value) => [`${value} produtos`, 'Quantidade']}
                        labelFormatter={(label) => `Setor: ${label}`}
                        />

                        <Bar
                        dataKey="quantity_products"
                        // name="Quantidade de Produtos"
                        fill="#3483fa"
                        barSize={30}
                        />

                        {/* <Legend /> */}
                    </BarChart>
                </ResponsiveContainer>

                <div className="text_bottom mt-8 text-sm text-gray-500">
                    Total de produtos catalogados: {dadosOrdenados.reduce((total, item) => total + item.quantity_products, 0)}
                </div>
            </div>
        </div>
    );
};