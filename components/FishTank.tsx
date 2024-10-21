import * as THREE from 'three'
import React from 'react'
import { useGLTF } from '@react-three/drei/native'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
    nodes: {
        ['Fish_Tank_Cube003-Mesh']: THREE.Mesh
            ['Fish_Tank_Cube003-Mesh_1']: THREE.Mesh
    ['Fish_Tank_Cube003-Mesh_2']: THREE.Mesh
    ['Fish_Tank_Cube003-Mesh_3']: THREE.Mesh
    ['Fish_Tank_Cube003-Mesh_4']: THREE.Mesh
    ['Fish_Tank_Cube003-Mesh_5']: THREE.Mesh
}
materials: {
    Sand: THREE.MeshStandardMaterial
    Glass: THREE.MeshStandardMaterial
    Water: THREE.MeshStandardMaterial
    DarkGray: THREE.MeshStandardMaterial
    Plant: THREE.MeshStandardMaterial
    Stone: THREE.MeshStandardMaterial
}
}

export default function Model(props: JSX.IntrinsicElements['group']) {
    const { nodes, materials } = useGLTF(require('../assets/FishTank.glb'),) as GLTFResult;

    return (
        <group {...props} dispose={null} scale={1.5} position={[0, -1, 0]} rotation={[0, Math.PI / 2, 0]}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes['Fish_Tank_Cube003-Mesh'].geometry}
                material={materials.Sand}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes['Fish_Tank_Cube003-Mesh_1'].geometry}
                material={materials.Glass}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes['Fish_Tank_Cube003-Mesh_2'].geometry}
                material={materials.Water}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes['Fish_Tank_Cube003-Mesh_3'].geometry}
                material={materials.DarkGray}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes['Fish_Tank_Cube003-Mesh_4'].geometry}
                material={materials.Plant}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes['Fish_Tank_Cube003-Mesh_5'].geometry}
                material={materials.Stone}
            />
        </group>
    )
}

useGLTF.preload(require('../assets/FishTank.glb'));