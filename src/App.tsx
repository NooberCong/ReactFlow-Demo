import {useEffect, useMemo, useState} from 'react';
import ReactFlow, {Background, Edge, FitViewOptions, MarkerType, Node, Position} from 'react-flow-renderer';
import CircleNode from "./CircleNode";
import dagre from 'dagre';
import ReactTooltip from "react-tooltip";
import {APIResult, ProcessInstanceDetails} from "./WorkflowTypeDefs";

const fitViewOptions: FitViewOptions = {
    padding: 0.2
}

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 50;
const nodeHeight = 50;

// Auto layout using dagre
const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({rankdir: direction});

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, {width: nodeWidth, height: nodeHeight});
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = isHorizontal ? Position.Left : Position.Top;
        node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };

        return node;
    });

    return {nodes, edges};
};

export default function App() {
    const [nodes, setNodes] = useState<Node[]>([])
    const [edges, setEdges] = useState<Edge[]>([])

    // Custom node component
    const nodeTypes = useMemo(() => ({circle: CircleNode}), []);

    useEffect(() => {
        ReactTooltip.rebuild()
    })

    useEffect(() => {
        fetch("http://120.72.85.78:8000/workflow/processes/c89e83c2-c045-4aa0-aed9-735c13a6cfda", {
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJkMzc3Y2ZmNC1lZTM5LTQyNTQtOGI4MC03Yzg1NGZiN2U0YmUiLCJ1bmlxdWVfbmFtZSI6ImxpYnJhcnkiLCJlbWFpbCI6InRlc3RlcjEyQGdtYWlsLmNvbSIsIm5iZiI6MTY0ODgyMDU1NSwiZXhwIjoxNjQ4ODM0OTU1LCJpYXQiOjE2NDg4MjA1NTUsImlzcyI6IkRNU19BdXRoIn0.HCKka_E0cHcTQ8ixpQnYGBlWykTBK9Y3PyZagimcBXo"
            }
        }).then<APIResult<ProcessInstanceDetails>>(res => res.json()).then(res => {
            const {nodes: layoutNodes, edges: layoutEdges} = getLayoutedElements(res.result.activities.map(act => {
                return {
                    id: act.name,
                    type: 'circle',
                    data: {name: act.name, isCurrent: act.isCurrent, isVisited: act.isVisited},
                    position: {x: 0, y: 0}
                }
            }), res.result.transitions.map(trans => {
                return {
                    id: `e${trans.from}-${trans.to}`,
                    source: trans.from,
                    target: trans.to,
                    markerEnd: {type: MarkerType.Arrow}
                };
            }))

            setNodes(layoutNodes)
            setEdges(layoutEdges)
        })
    }, [])

    return (
        <div style={{width: "100vw", height: "100vh"}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                draggable={false}
                fitView
                fitViewOptions={fitViewOptions}
            >
                <Background color={"green"}/>
            </ReactFlow>
            <ReactTooltip/>
        </div>

    )
}