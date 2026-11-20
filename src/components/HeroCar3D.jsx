import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const MODEL_URL = `${import.meta.env.BASE_URL}models/formula-car.glb`

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
  const [focused, setFocused] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [loadError, setLoadError] = useState('')
  const isActive = hovered || focused

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
    let resizeObserver
    let loadedScene
    let viewHeight = 2
    const render = () => renderer.render(scene, camera)
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect()
      if (!width || !height) return
      renderer.setSize(width, height, false)
      const aspect = width / height
      camera.left = -viewHeight * aspect / 2
      camera.right = viewHeight * aspect / 2
      camera.top = viewHeight / 2
      camera.bottom = -viewHeight / 2
      camera.updateProjectionMatrix()
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

          const body = new THREE.Group()
          const wheels = new THREE.Group()
          const driver = new THREE.Group()
          body.name = 'F1 body'
          wheels.name = 'F1 wheels'
          driver.name = 'F1 driver'
          loadedScene.add(body, wheels, driver)

          const meshes = []
          loadedScene.traverse(object => {
            if (object.isMesh) meshes.push(object)
          })

          loadedScene.updateMatrixWorld(true)
          meshes.forEach(mesh => {
            mesh.castShadow = true
            mesh.receiveShadow = true
            const meshMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
            const materialNames = meshMaterials.map(material => material?.name?.toLowerCase() || '').join(' ')
            // The GLB uses generic node names; material names identify its wheels and driver.
            const part = /rim|wheel|tread|tyrewall/.test(materialNames)
              ? wheels
              : /mcl35m_h|helmet|driver/.test(materialNames)
                ? driver
                : body
            part.attach(mesh)
          })

          loadedScene.rotation.y = Math.PI / 2
          loadedScene.updateMatrixWorld(true)
          const bounds = new THREE.Box3().setFromObject(loadedScene)
          const size = bounds.getSize(new THREE.Vector3())
          const center = bounds.getCenter(new THREE.Vector3())
          const scale = 3.7 / Math.max(size.x, size.y, size.z)
          loadedScene.scale.setScalar(scale)
          loadedScene.position.set(-center.x * scale, -center.y * scale, -center.z * scale)

          viewHeight = Math.max(size.y * scale * 1.8, size.x * scale / 2.4 * 1.35)
          const parts = [
            makePart(body, [0, .7, 0], [0, 0, -.035], 0),
            makePart(wheels, [-.8, -.1, 0], [0, 0, -.08], 90),
            makePart(driver, [0, 1.15, 0], [0, 0, .06], 150),
          ]

          runtimeRef.current = { parts, renderer, scene, camera }
          resize()
          setLoadProgress(1)
          setLoaded(true)
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
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 560
    const tracks = runtime.parts
      .filter(part => part.progress !== target)
      .map(part => ({ part, from: part.progress }))
    if (!tracks.length) return undefined

    let frame = 0

    const animate = now => {
      let isAnimating = false
      tracks.forEach(({ part, from }) => {
        const progress = THREE.MathUtils.clamp((now - startTime - part.delay) / duration, 0, 1)
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
  }, [isActive, loaded])

  return (
    <div
      className="hero-car"
      role="img"
      tabIndex={0}
      aria-label="Formula 1 car. Hover or focus to disassemble; move away to reassemble."
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <div className="hero-car__viewport">
        <canvas ref={canvasRef} className="hero-car__canvas" aria-hidden="true" />
      </div>
      <span className={loadError ? 'hero-car__status-error' : ''}>
        {loadError || (loaded ? 'Hover to disassemble' : `Loading 3D car... ${Math.round(loadProgress * 100)}%`)}
      </span>
    </div>
  )
}
