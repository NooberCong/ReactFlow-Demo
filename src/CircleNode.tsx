import {Handle, Position} from "react-flow-renderer";
import {Activity} from "./WorkflowTypeDefs";

export default function CircleNode({data}: { data: Activity }) {
    const color = data.isCurrent ? "rgb(173, 216, 230, .75)" : data.isVisited ? "rgba(144, 238, 144, .75)" : "rgba(211, 211, 211, .75)"
    return (
        <div data-tip={data.name} onClick={() => console.log(data)} style={{
            height: "50px",
            width: "50px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: color
        }}>
            <Handle style={{width: 0, height: 0}} type={"target"} position={Position.Top}/>
            <Handle style={{width: 0, height: 0}} type={"source"} position={Position.Bottom}/>
            <span>{data.name.at(0)}</span>
        </div>
    );
}