'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { Point } from '@/lib/circle-math'

interface DrawingCanvasProps {
  onDrawingComplete: (points: Point[]) => void
  isDrawing: boolean
  onDrawingStart: () => void
  showOverlay?: boolean
  overlayCircle?: { centerX: number; centerY: number; radius: number }
  drawnPoints?: Point[]
}

export default function DrawingCanvas({
  onDrawingComplete,
  isDrawing,
  onDrawingStart,
  showOverlay = false,
  overlayCircle,
  drawnPoints = []
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentPoints, setCurrentPoints] = useState<Point[]>([])
  const [isCurrentlyDrawing, setIsCurrentlyDrawing] = useState(false)

  const getEventPos = useCallback((e: MouseEvent | TouchEvent): Point => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0]
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
      }
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      }
    }
  }, [])

  const startDrawing = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    if (isDrawing) return

    const pos = getEventPos(e)
    setCurrentPoints([pos])
    setIsCurrentlyDrawing(true)
    onDrawingStart()
  }, [isDrawing, getEventPos, onDrawingStart])

  const draw = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    if (!isCurrentlyDrawing) return

    const pos = getEventPos(e)
    setCurrentPoints(prev => [...prev, pos])
  }, [isCurrentlyDrawing, getEventPos])

  const stopDrawing = useCallback(() => {
    if (!isCurrentlyDrawing) return
    
    setIsCurrentlyDrawing(false)
    onDrawingComplete(currentPoints)
  }, [isCurrentlyDrawing, currentPoints, onDrawingComplete])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleMouseDown = (e: MouseEvent) => startDrawing(e)
    const handleMouseMove = (e: MouseEvent) => draw(e)
    const handleMouseUp = () => stopDrawing()
    const handleTouchStart = (e: TouchEvent) => startDrawing(e)
    const handleTouchMove = (e: TouchEvent) => draw(e)
    const handleTouchEnd = () => stopDrawing()

    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('touchstart', handleTouchStart)
    canvas.addEventListener('touchmove', handleTouchMove)
    canvas.addEventListener('touchend', handleTouchEnd)

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
    }
  }, [startDrawing, draw, stopDrawing])

  // Render the canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw the current drawing
    const pointsToDraw = isCurrentlyDrawing ? currentPoints : drawnPoints
    if (pointsToDraw.length > 1) {
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 4
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      
      ctx.beginPath()
      ctx.moveTo(pointsToDraw[0].x, pointsToDraw[0].y)
      
      for (let i = 1; i < pointsToDraw.length; i++) {
        ctx.lineTo(pointsToDraw[i].x, pointsToDraw[i].y)
      }
      
      ctx.stroke()
    }

    // Draw overlay circle if requested
    if (showOverlay && overlayCircle) {
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      
      ctx.beginPath()
      ctx.arc(overlayCircle.centerX, overlayCircle.centerY, overlayCircle.radius, 0, 2 * Math.PI)
      ctx.stroke()
      
      ctx.setLineDash([])
    }
  }, [currentPoints, drawnPoints, isCurrentlyDrawing, showOverlay, overlayCircle])

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={320}
      className="border-2 border-gray-300 rounded-xl cursor-crosshair bg-white touch-none w-full max-w-[320px] mx-auto"
      style={{ touchAction: 'none' }}
    />
  )
}
