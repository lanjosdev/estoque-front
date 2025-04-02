// Hooks / Libs:
import PropTypes from "prop-types";

// Components:
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Style:
import './chartkpi.css';


ChartKPI.propTypes = {
    datas: PropTypes.array
}
export function ChartKPI({ datas }) {
    // Calcular o total para determinar as porcentagens
    const total = datas.reduce((sum, item) => sum + item.quantity, 0);

    // Adicionar porcentagem aos dados
    const dadosComPorcentagem = datas.map(item => ({
        ...item,
        percent: ((item.quantity / total) * 100).toFixed(1)
    }));

    // Cores para cada categoria
    const CORES = ['#DC3545', '#FFBB28', '#00C49F'];
    
    // // Formatador personalizado para o tooltip
    // const tooltipFormatter = (value, name, props) => {
    //     if (name === 'quantidade') {
    //     return [`${value} (${props.payload.porcentagem}%)`, 'Quantidade'];
    //     }
    //     return [value, name];
    // };

    // Componente de rótulo personalizado para mostrar a porcentagem dentro das fatias
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const RADIAN = Math.PI / 180;
        // Posiciona o texto no meio da fatia
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        if(dadosComPorcentagem[index].percent > 0) {
            return (
                <text 
                    x={x} 
                    y={y} 
                    fill="white" 
                    textAnchor="middle" 
                    dominantBaseline="central"
                    fontWeight="bold"
                    fontSize="16"
                >
                    {`${dadosComPorcentagem[index].percent}%`}
                </text>
            );
        }
    };


    return (
        <div className="Chart ChartKPI">
            <div className="chart_title">
                <h3>Saúde do Estoque (KPI)</h3>
            </div>

            <div className="chart_data">
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={dadosComPorcentagem}
                            dataKey="quantity"
                            nameKey="status"
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            innerRadius={60}
                            paddingAngle={2}
                            labelLine={false}
                            label={renderCustomizedLabel}
                            // label={({ status, percent })=> `${status}: ${percent}%`}
                        >
                            {dadosComPorcentagem.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                            ))}
                        </Pie>
                        
                        <Tooltip 
                            formatter={(value, name, props) => {
                                if (name === 'quantidade') {
                                    return [`${value} produtos (${props.payload.percent}%)`, 'Quantidade'];
                                }
                                return [`${value} produtos (${props.payload.percent}%)`, name];
                            }}
                        />
                        {/* <Legend 
                            layout="vertical" 
                            verticalAlign="middle" 
                            align="right"
                            formatter={(value, entry) => {
                            const item = dadosComPorcentagem.find(d => d.categoria === value);
                            return `${value} (${item.porcentagem}%)`;
                            }}
                        /> */}
                    </PieChart>
                </ResponsiveContainer>

                {/* <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                        data={dadosComPorcentagem}
                        dataKey="quantidade"
                        nameKey="categoria"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        innerRadius={60}
                        paddingAngle={2}
                        label={({ categoria, porcentagem }) => `${categoria}: ${porcentagem}%`}
                        >
                            {dadosComPorcentagem.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                            ))}
                        </Pie>

                        <Tooltip formatter={tooltipFormatter} />

                        <Legend 
                        layout="vertical" 
                        verticalAlign="middle" 
                        align="right"
                        formatter={(value, entry) => {
                        const item = dadosComPorcentagem.find(d => d.categoria === value);
                        return `${value} (${item.porcentagem}%)`;
                        }}
                        />
                    </PieChart>
                </ResponsiveContainer> */}

                <div className="details">
                    <h4 className="details_title">Detalhamento:</h4>

                    <ul className="details_list">
                        {dadosComPorcentagem.map((item, index) => (
                        <li key={index} className="item">
                            <div 
                            className="item_dot" 
                            style={{ backgroundColor: CORES[index % CORES.length] }}
                            ></div>

                            <span><b>{item.status} ({item.description}):</b> {item.quantity} produtos ({item.percent}%)</span>
                        </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};