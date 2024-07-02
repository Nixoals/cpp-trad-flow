import { useState, useCallback } from 'react';
import ReactFlow, { Controls, Background, applyNodeChanges, applyEdgeChanges, BackgroundVariant, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import treeInfos from '../data/treeInfos';

const startX = 200; // Position X du nœud start
const startY = 300; // Position Y du nœud start
const spacing = 90; // Espacement entre les nœuds

// server colors

function organizeServersByLevelAndParent(servers) {
	// Dictionnaire pour suivre les serveurs par leur id pour un accès facile
	const serverDict = {};
	servers.forEach((server) => {
		serverDict[server.id] = server;
	});

	// Organiser les serveurs par niveau et par direction
	const levels = {};
	servers.forEach((server) => {
		const levelKey = `level${server.level}-${server.position}`;
		if (!levels[levelKey]) {
			levels[levelKey] = [];
		}
		levels[levelKey].push(server);
	});

	// Maintenant, trier les serveurs à chaque niveau en fonction de l'ordre des parents
	Object.keys(levels)
		.sort()
		.forEach((levelKey) => {
			// Assurez-vous de trier uniquement les niveaux après le premier
			const level = parseInt(levelKey.split('-')[0].replace('level', ''), 10);
			if (level > 1) {
				levels[levelKey].sort((a, b) => {
					const aParentIndex = levels[`level${level - 1}-${a.position}`].findIndex((server) => server.id === a.connectedTo);
					const bParentIndex = levels[`level${level - 1}-${b.position}`].findIndex((server) => server.id === b.connectedTo);
					return aParentIndex - bParentIndex;
				});
			}
		});

	// Réorganiser dans un nouvel objet en conservant l'ordre des parents
	const organizedServers = {};
	Object.keys(levels).forEach((levelKey) => {
		organizedServers[levelKey] = levels[levelKey];
	});

	return organizedServers;
}

const organizedServers = organizeServersByLevelAndParent(treeInfos);

const initialEdges = [];
const initialNodes = [];

// main node
initialNodes.push({
	id: 'start',
	data: { label: 'CPP Code' },
	style: { background: 'lightblue', fontSize: 20, fontWeight: 'bold', color:"red" },
	position: { x: startX, y: startY },
});

const getNodePositionById = (id) => {
	const node = initialNodes.find((node) => node.id === id);
	return node ? node.position.x : null; // Retourne null si le parent n'est pas trouvé
};

// Modification de addNode pour prendre en compte les niveaux et la position
const addNodesByLevelAndPosition = (organizedServers) => {
	Object.entries(organizedServers).forEach(([key, servers]) => {
		const [levelStr, position] = key.split('-');
		const level = parseInt(levelStr.replace('level', ''), 10);
		const baseYOffset = level * 120;

		servers.forEach((server, index) => {
			const parentXPosition = getNodePositionById(server.connectedTo) || startX;
			const posX = parentXPosition + (index - (servers.length - 1) / 2) * spacing;
			let posY;
			if (position === 'up') {
				posY = startY - baseYOffset - (index % 2) * 50; // 50 est le décalage quinconce en y
			} else {
				posY = startY + baseYOffset + (index % 2) * 50;
			}

			initialNodes.push({
				id: server.id,
				data: { label: server.label },
				style: server.style,
				position: {
					x: posX + (index % 2) * 20, // Petite variation en x pour quinconce
					y: posY,
				},
			});

			// Ajout des edges
			if (typeof server.connectedTo === 'string') {
				initialEdges.push({
					id: `e-${server.connectedTo}-${server.id}`,
					source: server.connectedTo,
					target: server.id,
					animated: false,
					markerEnd: {
						type: 'arrowclosed',
					},
				});
			} else if (Array.isArray(server.connectedTo)) {
				server.connectedTo.forEach((connectedTo) => {
					initialEdges.push({
						id: `e-${connectedTo}-${server.id}`,
						source: connectedTo,
						target: server.id,
						animated: false,
						markerEnd: {
							type: 'arrowclosed',
						},
					});
				});
			}
		});
	});
};

// Utilisez la fonction pour ajouter les nœuds et les edges selon l'organisation définie
addNodesByLevelAndPosition(organizedServers);

function Flow() {
	const [nodes, setNodes] = useState(initialNodes);
	const [edges, setEdges] = useState(initialEdges);

	const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
	const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

	const onNodeClick = (event, node) => {
		// Mettre à jour les edges pour animer uniquement ceux qui sont connectés au nœud cliqué
		const newEdges = edges.map((edge) => {
			if (edge.source === node.id) {
				// Activer l'animation et changer le style pour les enfants du nœud cliqué
				return {
					...edge,
					animated: true,
					style: { stroke: '#ff0000', strokeWidth: '2px' }, // Changer la couleur en rouge et la taille à 3px
				};
			} else {
				// Désactiver l'animation et réinitialiser le style pour tous les autres edges
				return {
					...edge,
					animated: false,
					style: { stroke: '#c1c1c1', strokeWidth: '1px' }, // Couleur par défaut et taille normale
				};
			}
		});
		setEdges(newEdges);
	};

	return (
		<div
			className="flow-container"
			style={{ position: 'relative', width: '100%', height: '100%' }}
		>
			<div
				className="flow-title"
				style={{ position: 'absolute', top: 10, left: 10 }}
			>
				<h1>CPP Traduction Workflow</h1>
				<div
					className="flow-legend"
					style={{ zIndex: 300, background: 'rgba(255,255,255,0.9) ' }}
				>
					<div style={{ display: 'flex', gap: '5px' }}>
						<span style={{ backgroundColor: '#5D6D7E', width: '50px', height: '20px', border: 'solid 1px gray' }}></span>
						<div>Interface link</div>
					</div>
					<div style={{ display: 'flex', gap: '5px' }}>
						<span style={{ backgroundColor: 'lightblue', width: '50px', height: '20px', border: 'solid 1px gray' }}></span>
						<div>start</div>
					</div>
					<div style={{ display: 'flex', gap: '5px' }}>
						<span style={{ backgroundColor: 'aliceblue', width: '50px', height: '20px', border: 'solid 1px gray' }}></span>
						<div>Code manipulation</div>
					</div>
					<div style={{ display: 'flex', gap: '5px' }}>
						<span style={{ backgroundColor: '#CD6155', width: '50px', height: '20px', border: 'solid 1px gray' }}></span>
						<div>Entry point</div>
					</div>
					<div style={{ display: 'flex', gap: '5px' }}>
						<span style={{ backgroundColor: '#22b573', width: '50px', height: '20px', border: 'solid 1px gray' }}></span>
						<div>Node functions</div>
					</div>
					<div style={{ display: 'flex', gap: '5px' }}>
						<span style={{ backgroundColor: '#D5F5E3', width: '50px', height: '20px', border: 'solid 1px gray' }}></span>
						<div>Primary Nodes</div>
					</div>
					<div style={{ display: 'flex', gap: '5px' }}>
						<span style={{ backgroundColor: '#AF7AC5', width: '50px', height: '20px', border: 'solid 1px gray' }}></span>
						<div>Block Creation</div>
					</div>
					
					<div style={{ display: 'flex', gap: '5px' }}>
						<span style={{ backgroundColor: '#D35400', width: '50px', height: '20px', border: 'solid 1px gray' }}></span>
						<div>Output</div>
					</div>
				</div>
				<div className="flow-title-bg"></div>
			</div>
			<ReactFlow
				nodes={nodes}
				onNodesChange={onNodesChange}
				edges={edges}
				onEdgesChange={onEdgesChange}
				onNodeClick={onNodeClick}
				className="flow-container"
			>
				<Background
					variant={BackgroundVariant.Dots}
					gap={20}
					size={1}
				/>
				<MiniMap
					nodeStrokeWidth={3}
					pannable
					zoomable
				/>
				<Controls />
			</ReactFlow>
		</div>
	);
}

export default Flow;
