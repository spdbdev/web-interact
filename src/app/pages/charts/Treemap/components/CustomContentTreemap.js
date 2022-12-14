import React from 'react';
import {ResponsiveContainer, Treemap} from 'recharts';
import data from './data';
import JumboDemoCard from "@jumbo/components/JumboDemoCard";
import code from '../demo-code/custom-content-treemap.txt';

const COLORS = ['#8889DD', '#9597E4', '#8DC77B', '#A5D297', '#E2CF45', '#F8C12D'];

const CustomizedContent = props => {
    const {root, depth, x, y, width, height, index, colors, name} = props;

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: depth < 2 ? colors[Math.floor((index / root.children.length) * 6)] : 'none',
                    stroke: '#fff',
                    strokeWidth: 2 / (depth + 1e-10),
                    strokeOpacity: 1 / (depth + 1e-10),
                }}
            />
            {depth === 1 ? (
                <text x={x + width / 2} y={y + height / 2 + 7} textAnchor="middle" fill="#fff" fontSize={14}>
                    {name}
                </text>
            ) : null}
            {depth === 1 ? (
                <text x={x + 4} y={y + 18} fill="#fff" fontSize={16} fillOpacity={0.9}>
                    {index + 1}
                </text>
            ) : null}
        </g>
    );
};

const CustomContentTreemap = () => (
    <JumboDemoCard title={"Custom Content Treemap"} demoCode={code} wrapperSx={{pt: 0, backgroundColor: 'background.paper'}}>
        <ResponsiveContainer width="100%" height={200}>
            <Treemap
                data={data}
                dataKey="size"
                ratio={4 / 3}
                stroke="#fff"
                fill={"#1e88e5"}
                content={<CustomizedContent colors={COLORS}/>}
            />
        </ResponsiveContainer>
    </JumboDemoCard>
);

export default CustomContentTreemap;
