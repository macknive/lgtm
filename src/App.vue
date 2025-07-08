<template>
  <div class="lgtm-overlay">
    <input type="file" accept="image/*" @change="onFileChange" />

    <div v-if="imageLoaded">
      <canvas ref="canvasRef"></canvas>
      <button @click="downloadImage">Download Result</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from "vue"

// Refs for the canvas and state
const canvasRef = ref<HTMLCanvasElement | null>(null)
const imageLoaded = ref(false)
const baseImage = ref<HTMLImageElement | null>(null)

// Handle file upload
const onFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || !target.files[0]) return

  const file = target.files[0]
  const img = new Image()
  img.onload = async () => {
    baseImage.value = img

    // Make sure canvas is rendered
    imageLoaded.value = true
    await nextTick()

    drawImageWithOverlay()
  }
  img.src = URL.createObjectURL(file)
}

// Draw image and text on the canvas
const drawImageWithOverlay = () => {
  if (!canvasRef.value || !baseImage.value) return

  const canvas = canvasRef.value
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  const img = baseImage.value

  // Resize canvas to match image
  canvas.width = img.width
  canvas.height = img.height

  // Draw the base image
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(img, 0, 0)

  // Add text overlay styles
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillStyle = "white"

  // Optional shadow for contrast
  ctx.shadowColor = "black"
  ctx.shadowBlur = 4

  // Large LGTM text
  const bigFontSize = Math.floor(img.width / 5)
  ctx.font = `bold ${bigFontSize}px Arial`
  ctx.fillText("L G T M", img.width / 2, img.height / 2)

  //margin
  const verticalMargin = 15
  // Smaller "Looks Good To Me" text
  const smallFontSize = Math.floor(img.width / 30)
  ctx.font = `${smallFontSize}px Arial`
  ctx.fillText(
    "L  o  o  k  s   G  o  o  d   T  o   M  e",
    img.width / 2,
    img.height / 2 + bigFontSize / 2 + verticalMargin
  )
}

// Download result
const downloadImage = () => {
  if (!canvasRef.value) return
  const link = document.createElement("a")
  link.download = "lgtm_overlay.png"
  link.href = canvasRef.value.toDataURL("image/png")
  link.click()
}
</script>

<style scoped>
.lgtm-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

canvas {
  max-width: 100%;
  border: 1px solid #ccc;
}
</style>
