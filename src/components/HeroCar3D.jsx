import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const MODEL_URL = `${import.meta.env.BASE_URL}models/formula-car.glb`

function getMeshComponents(mesh, root) {
  const geometry = mesh.geometry
  const position = geometry.getAttribute('position')
  const index = geometry.getIndex()
  if (!position || !index || index.count % 3 !== 0) {
    throw new Error(`Cannot split wheel geometry for ${mesh.name}`)
  }

  const parents = new Uint32Array(position.count)
  for (let i = 0; i < parents.length; i += 1) parents[i] = i

  const find = value => {
    let rootIndex = value
    while (parents[rootIndex] !== rootIndex) {
      parents[rootIndex] = parents[parents[rootIndex]]
      rootIndex = parents[rootIndex]
    }
    return rootIndex
  }
  const join = (first, second) => {
    const firstRoot = find(first)
    const secondRoot = find(second)
    if (firstRoot !== secondRoot) parents[secondRoot] = firstRoot
  }

  const verticesByPosition = new Map()
  for (let i = 0; i < position.count; i += 1) {
    const key = [
      position.getX(i),
      position.getY(i),
      position.getZ(i),
    ].map(value => Math.round(value * 100000)).join(':')
    const existing = verticesByPosition.get(key)
    if (existing === undefined) verticesByPosition.set(key, i)
    else join(i, existing)
  }

  for (let i = 0; i < index.count; i += 3) {
    const first = index.getX(i)
    join(first, index.getX(i + 1))
    join(first, index.getX(i + 2))
  }

  const components = new Map()
  for (let i = 0; i < index.count; i += 3) {
    const first = index.getX(i)
    const key = find(first)
    let component = components.get(key)
    if (!component) {
      component = { indices: [], vertices: new Set(), bounds: new THREE.Box3() }
      component.bounds.makeEmpty()
      components.set(key, component)
    }

    for (let j = 0; j < 3; j += 1) {
      const vertex = index.getX(i + j)
      component.indices.push(vertex)
      component.vertices.add(vertex)
    }
  }

  return [...components.values()].map(component => {
    component.vertices.forEach(vertex => {
      component.bounds.expandByPoint(new THREE.Vector3(
        position.getX(vertex),
        position.getY(vertex),
        position.getZ(vertex),
      ))
    })
    const center = component.bounds.getCenter(new THREE.Vector3())
    mesh.localToWorld(center)
    root.worldToLocal(center)
    component.center = center
    return component
  })
}

function makeComponentMesh(sourceMesh, components) {
  const geometry = new THREE.BufferGeometry()
  Object.entries(sourceMesh.geometry.attributes).forEach(([name, attribute]) => {
    geometry.setAttribute(name, attribute)
  })
  geometry.morphAttributes = sourceMesh.geometry.morphAttributes
  geometry.morphTargetsRelative = sourceMesh.geometry.morphTargetsRelative
  geometry.setIndex(components.flatMap(component => component.indices))
  geometry.boundingBox = components.reduce(
    (bounds, component) => bounds.union(component.bounds),
    new THREE.Box3().makeEmpty(),
  )
  geometry.boundingSphere = geometry.boundingBox.getBoundingSphere(new THREE.Sphere())

  const mesh = new THREE.Mesh(geometry, sourceMesh.material)
  mesh.name = sourceMesh.name
  mesh.castShadow = sourceMesh.castShadow
  mesh.receiveShadow = sourceMesh.receiveShadow
  return mesh
}

function attachComponentMesh(root, group, sourceMesh, components) {
  const mesh = makeComponentMesh(sourceMesh, components)
  mesh.matrixAutoUpdate = false
  mesh.matrix.copy(root.matrixWorld.clone().invert().multiply(sourceMesh.matrixWorld))
  root.add(mesh)
  group.attach(mesh)
}

function disposeModel(root) {
  const geometries = new Set()
  const materials = new Set()
  const textures = new Set()

  root.traverse(object => {
    if (object.geometry) geometries.add(object.geometry)
    if (!object.material) return

    const objectMaterials = Array.isArray(object.material) ? object.material : [object.material]
    objectMaterials.forEach(material => {
      materials.add(material)
      Object.values(material).forEach(value => {
        if (value?.isTexture) textures.add(value)
      })
    })
  })

  geometries.forEach(geometry => geometry.dispose())
  materials.forEach(material => material.dispose())
  textures.forEach(texture => texture.dispose())
}

function makePart(group, offset, rotation, delay) {
  return {
    group,
    basePosition: group.position.clone(),
    baseRotation: group.rotation.clone(),
    offset: new THREE.Vector3(...offset),
    rotation: new THREE.Euler(...rotation),
    delay,
    progress: 0,
  }
}

export default function HeroCar3D() {
  const canvasRef = useRef(null)
  const runtimeRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [latched, setLatched] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [prepared, setPrepared] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [loadError, setLoadError] = useState('')
  const isActive = hovered || latched

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    } catch (error) {
      console.error('Unable to initialize the F1 car renderer:', error)
      setLoadError('3D preview needs WebGL support.')
      return undefined
    }

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-2, 2, 1, -1, 0.1, 100)
    camera.position.set(2.8, 2.4, 7)
    camera.lookAt(0, 0, 0)

    scene.add(new THREE.HemisphereLight(0xfff0e8, 0x22131a, 2.2))
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2)
    keyLight.position.set(4, 7, 5)
    scene.add(keyLight)
    const rimLight = new THREE.DirectionalLight(0xff4653, 1.8)
    rimLight.position.set(-4, 2, -3)
    scene.add(rimLight)

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2

    let disposed = false
    let preparationFrame = 0
    let preparationTimer = 0
    let resizeObserver
    let loadedScene
    let viewHeight = 2
    const render = () => renderer.render(scene, camera)
    const updateCamera = () => {
      const { width, height } = canvas.getBoundingClientRect()
      if (!width || !height) return
      const aspect = width / height
      camera.left = -viewHeight * aspect / 2
      camera.right = viewHeight * aspect / 2
      camera.top = viewHeight / 2
      camera.bottom = -viewHeight / 2
      camera.updateProjectionMatrix()
    }
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect()
      if (!width || !height) return
      renderer.setSize(width, height, false)
      updateCamera()
      render()
    }

    resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    const loader = new GLTFLoader()
    loader.load(
      MODEL_URL,
      gltf => {
        try {
          loadedScene = gltf.scene
          if (disposed) {
            disposeModel(loadedScene)
            return
          }

          scene.add(loadedScene)

          const meshes = []
          loadedScene.traverse(object => {
            if (object.isMesh) meshes.push(object)
          })

          loadedScene.rotation.y = Math.PI / 2
          loadedScene.updateMatrixWorld(true)
          const bounds = new THREE.Box3().setFromObject(loadedScene)
          const size = bounds.getSize(new THREE.Vector3())
          const center = bounds.getCenter(new THREE.Vector3())
          const modelCenter = loadedScene.worldToLocal(center.clone())
          // Show the COMPLETE original 3D car as soon as glTF parsing ends.
          // The expensive exploded-view mesh separation can happen after the
          // browser has had a chance to paint this assembled model.
          const scale = 3.7 / Math.max(size.x, size.y, size.z)
          loadedScene.scale.setScalar(scale)
          loadedScene.position.set(-center.x * scale, -center.y * scale, -center.z * scale)
          viewHeight = Math.max(size.y * scale * 1.8, size.x * scale / 2.4 * 1.35)
          resize()
          performance.mark('portfolio:f1-complete-model-rendered')
          setLoadProgress(1)
          setLoaded(true)

          // rAF followed by a new task yields at least one paint opportunity
          // before splitting and regrouping wheel/body geometry on the main thread.
          preparationFrame = window.requestAnimationFrame(() => {
            preparationTimer = window.setTimeout(() => {
              if (disposed) return
              try {
          const materialNamesFor = mesh => {
            const meshMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
            return meshMaterials.map(material => material?.name?.toLowerCase() || '').join(' ')
          }
          const treadMesh = meshes.find(mesh => /tread/.test(materialNamesFor(mesh)))
          if (!treadMesh) throw new Error('The model is missing its tire tread mesh.')

          const wheelComponents = getMeshComponents(treadMesh, loadedScene)
            .sort((a, b) => b.indices.length - a.indices.length)
            .slice(0, 4)
            .sort((a, b) => a.center.y - b.center.y || a.center.x - b.center.x)
          if (wheelComponents.length !== 4) {
            throw new Error(`Expected four separate tires; found ${wheelComponents.length}.`)
          }

          const centerFor = objects => {
            const partBounds = objects.reduce(
              (current, object) => current.union(new THREE.Box3().setFromObject(object)),
              new THREE.Box3().makeEmpty(),
            )
            return loadedScene.worldToLocal(partBounds.getCenter(new THREE.Vector3()))
          }
          const createPartGroup = (name, partCenter) => {
            const group = new THREE.Group()
            group.name = `F1 ${name}`
            group.position.copy(partCenter)
            loadedScene.add(group)
            return group
          }
          const driverMeshes = meshes.filter(mesh => /mcl35m_h|helmet|driver/.test(materialNamesFor(mesh)))
          const steeringMeshes = meshes.filter(mesh => /st_wheel/.test(materialNamesFor(mesh)))
          const bodyMeshes = meshes.filter(mesh => (
            !/rim|wheel|tread|tyrewall|mcl35m_h|helmet|driver|st_wheel/.test(materialNamesFor(mesh))
          ))
          const wingComponents = { front: [], rear: [] }
          const bodyComponents = new Map()
          bodyMeshes.forEach(mesh => {
            const remaining = []
            getMeshComponents(mesh, loadedScene).forEach(component => {
              const width = component.bounds.getSize(new THREE.Vector3()).x
              const longitudinal = component.bounds.getCenter(new THREE.Vector3()).y
              const direction = component.vertices.size >= 100 && width > .85
                ? longitudinal < -1.8
                  ? 'front'
                  : longitudinal > 2.8
                    ? 'rear'
                    : null
                : null
              if (direction) wingComponents[direction].push({ mesh, component })
              else remaining.push(component)
            })
            bodyComponents.set(mesh, remaining)
          })
          if (!wingComponents.front.length || !wingComponents.rear.length) {
            throw new Error('Could not identify the front and rear wing assemblies.')
          }

          const wingCenter = components => components.reduce(
            (point, entry) => point.add(entry.component.center),
            new THREE.Vector3(),
          ).divideScalar(components.length)
          const bodyGroup = createPartGroup('bodywork', modelCenter)
          const frontWingGroup = createPartGroup('front wing', wingCenter(wingComponents.front))
          const rearWingGroup = createPartGroup('rear wing', wingCenter(wingComponents.rear))
          const driverGroup = createPartGroup('driver', centerFor(driverMeshes))
          const steeringGroup = createPartGroup('steering wheel', centerFor(steeringMeshes))
          const wheelGroups = wheelComponents.map((component, index) => ({
            center: component.center,
            group: createPartGroup(`wheel assembly ${index + 1}`, component.center),
          }))

          meshes.forEach(mesh => {
            mesh.castShadow = true
            mesh.receiveShadow = true

            const materialNames = materialNamesFor(mesh)
            if (/rim|tread|tyrewall/.test(materialNames)) {
              const components = mesh === treadMesh
                ? wheelComponents
                : getMeshComponents(mesh, loadedScene)
              const componentsByWheel = wheelGroups.map(() => [])
              components.forEach(component => {
                let nearestWheel = 0
                let nearestDistance = Infinity
                wheelGroups.forEach((wheel, index) => {
                  const distance = component.center.distanceToSquared(wheel.center)
                  if (distance < nearestDistance) {
                    nearestWheel = index
                    nearestDistance = distance
                  }
                })
                componentsByWheel[nearestWheel].push(component)
              })

              componentsByWheel.forEach((wheelComponentsForMesh, index) => {
                if (!wheelComponentsForMesh.length) return
                attachComponentMesh(loadedScene, wheelGroups[index].group, mesh, wheelComponentsForMesh)
              })
              mesh.removeFromParent()
              return
            }

            if (bodyMeshes.includes(mesh)) {
              const bodyParts = bodyComponents.get(mesh)
              if (bodyParts.length) attachComponentMesh(loadedScene, bodyGroup, mesh, bodyParts)
              for (const direction of ['front', 'rear']) {
                const wingParts = wingComponents[direction]
                  .filter(entry => entry.mesh === mesh)
                  .map(entry => entry.component)
                if (!wingParts.length) continue
                const group = direction === 'front' ? frontWingGroup : rearWingGroup
                attachComponentMesh(loadedScene, group, mesh, wingParts)
              }
              mesh.removeFromParent()
              return
            }

            const group = driverMeshes.includes(mesh) ? driverGroup : steeringGroup
            group.attach(mesh)
          })

          const parts = [
            makePart(bodyGroup, [0, 0, .8], [.04, -.04, .08], 0),
            makePart(frontWingGroup, [0, -.55, 1], [.08, -.08, .06], 65),
            makePart(rearWingGroup, [0, .55, 1], [.08, .08, -.06], 115),
            makePart(driverGroup, [0, 0, 1.35], [.1, .06, .08], 160),
            makePart(steeringGroup, [0, 0, 1.7], [.2, .08, .12], 205),
            ...wheelGroups.map((wheel, index) => {
              const offset = wheel.center.clone().sub(modelCenter).normalize().multiplyScalar(1.45)
              const rotationDirection = wheel.center.x < modelCenter.x ? -1 : 1
              return makePart(
                wheel.group,
                offset.toArray(),
                [.08, rotationDirection * .12, rotationDirection * .08],
                250 + index * 55,
              )
            }),
          ]

          const baseViewHeight = viewHeight
          const originalTransforms = parts.map(({ group }) => ({
            position: group.position.clone(),
            rotation: group.rotation.clone(),
          }))
          parts.forEach(part => {
            part.group.position.copy(part.basePosition).add(part.offset)
            part.group.rotation.set(
              part.baseRotation.x + part.rotation.x,
              part.baseRotation.y + part.rotation.y,
              part.baseRotation.z + part.rotation.z,
            )
          })
          loadedScene.updateMatrixWorld(true)
          camera.updateMatrixWorld(true)
          const separatedBounds = new THREE.Box3()
            .setFromObject(loadedScene)
            .applyMatrix4(camera.matrixWorldInverse)
          const viewport = canvas.getBoundingClientRect()
          const aspect = viewport.width && viewport.height ? viewport.width / viewport.height : 2.4
          const horizontalExtent = Math.max(
            Math.abs(separatedBounds.min.x),
            Math.abs(separatedBounds.max.x),
          ) / aspect
          const verticalExtent = Math.max(
            Math.abs(separatedBounds.min.y),
            Math.abs(separatedBounds.max.y),
          )
          const expandedViewHeight = Math.max(baseViewHeight, Math.max(horizontalExtent, verticalExtent) * 2.2)
          parts.forEach((part, index) => {
            part.group.position.copy(originalTransforms[index].position)
            part.group.rotation.copy(originalTransforms[index].rotation)
          })
          loadedScene.updateMatrixWorld(true)

          runtimeRef.current = {
            parts,
            renderer,
            scene,
            camera,
            baseViewHeight,
            expandedViewHeight,
            currentViewHeight: baseViewHeight,
            updateViewHeight: value => {
              viewHeight = value
              updateCamera()
            },
          }
                resize()
                performance.mark('portfolio:f1-exploded-controls-ready')
                setPrepared(true)
              } catch (error) {
                console.error('Unable to prepare F1 exploded view:', error)
                setLoadError('Full 3D car visible; exploded view unavailable.')
              }
            }, 0)
          })
        } catch (error) {
          console.error('Unable to prepare the F1 car model:', error)
          setLoadError('Could not prepare the 3D car model.')
        }
      },
      event => {
        if (event.total > 0) setLoadProgress(event.loaded / event.total)
      },
      error => {
        if (disposed) return
        console.error('Unable to load the F1 car GLB:', error)
        setLoadError('Could not load the 3D car model.')
      },
    )

    return () => {
      disposed = true
      window.cancelAnimationFrame(preparationFrame)
      window.clearTimeout(preparationTimer)
      resizeObserver.disconnect()
      runtimeRef.current = null
      renderer.dispose()
      if (loadedScene) {
        scene.remove(loadedScene)
        disposeModel(loadedScene)
      }
    }
  }, [])

  useEffect(() => {
    const runtime = runtimeRef.current
    if (!runtime) return undefined

    const target = isActive ? 1 : 0
    const startTime = performance.now()
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = reducedMotion ? 1 : 560
    const tracks = runtime.parts
      .filter(part => part.progress !== target)
      .map(part => ({ part, from: part.progress }))
    const targetViewHeight = isActive ? runtime.expandedViewHeight : runtime.baseViewHeight
    const startViewHeight = runtime.currentViewHeight
    const maxDelay = reducedMotion ? 0 : Math.max(...runtime.parts.map(part => part.delay))
    const viewDuration = duration + maxDelay
    const isViewAnimating = Math.abs(startViewHeight - targetViewHeight) > .001
    if (!tracks.length && !isViewAnimating) return undefined

    let frame = 0

    const animate = now => {
      const viewProgress = THREE.MathUtils.clamp((now - startTime) / viewDuration, 0, 1)
      const viewEased = viewProgress * viewProgress * (3 - 2 * viewProgress)
      runtime.currentViewHeight = THREE.MathUtils.lerp(startViewHeight, targetViewHeight, viewEased)
      runtime.updateViewHeight(runtime.currentViewHeight)
      let isAnimating = viewProgress < 1
      tracks.forEach(({ part, from }) => {
        const delay = reducedMotion ? 0 : part.delay
        const progress = THREE.MathUtils.clamp((now - startTime - delay) / duration, 0, 1)
        const eased = progress * progress * (3 - 2 * progress)
        const value = THREE.MathUtils.lerp(from, target, eased)
        part.progress = value
        part.group.position.copy(part.basePosition).addScaledVector(part.offset, value)
        part.group.rotation.set(
          part.baseRotation.x + part.rotation.x * value,
          part.baseRotation.y + part.rotation.y * value,
          part.baseRotation.z + part.rotation.z * value,
        )
        if (progress < 1) isAnimating = true
      })

      runtime.renderer.render(runtime.scene, runtime.camera)
      if (isAnimating) frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [isActive, prepared])

  return (
    <button
      className="hero-car"
      type="button"
      aria-pressed={isActive}
      aria-label="Interactive Formula 1 car. Hover with a mouse or press to toggle its exploded view."
      onPointerEnter={event => {
        if (event.pointerType !== 'touch') setHovered(true)
      }}
      onPointerLeave={event => {
        if (event.pointerType !== 'touch') setHovered(false)
      }}
      onClick={event => {
        // Mouse users still get hover-to-disassemble; touch and keyboard
        // users can toggle the same interaction without a sticky hover state.
        const isTouch = event.nativeEvent.pointerType === 'touch'
          || window.matchMedia('(hover: none)').matches
        if (isTouch || event.detail === 0) setLatched(previous => !previous)
      }}
      onBlur={() => setLatched(false)}
    >
      <span className="hero-car__viewport">
        <canvas ref={canvasRef} className="hero-car__canvas" aria-hidden="true" />
      </span>
      <span className={'hero-car__status' + (loadError ? ' hero-car__status-error' : '')}>
        {loadError || (loaded ? (isActive ? 'Expanded • move away or press to reset' : 'Hover or press to disassemble') : `Loading 3D car... ${Math.round(loadProgress * 100)}%`)}
      </span>
    </button>
  )
}
