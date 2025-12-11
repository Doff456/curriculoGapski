"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  ExternalLink,
  Github,
  Calendar,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { OptimizedImage } from "@/components/optimized-image"

interface ProjectModalProps {
  project: any
  isOpen: boolean
  onClose: () => void
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<"details" | "gallery">("details")
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop")

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    setCurrentImageIndex(0)
  }, [viewMode])

  if (!project) return null

  const hasGallery = project.gallery && project.gallery[0]?.images?.length > 0
  const galleryImages = hasGallery ? project.gallery[0].images : []

  const nextImage = () => {
    const currentGallery = project.gallery.find((g) => g.type === viewMode) || project.gallery[0]
    setCurrentImageIndex((prev) => (prev + 1) % currentGallery.images.length)
  }

  const prevImage = () => {
    const currentGallery = project.gallery.find((g) => g.type === viewMode) || project.gallery[0]
    setCurrentImageIndex((prev) => (prev - 1 + currentGallery.images.length) % currentGallery.images.length)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 hidden"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>

            {/* Tabs Header */}
	            <div className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                    activeTab === "details"
                      ? "text-gray-900 border-b-2 border-gray-900 bg-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Info className="h-4 w-4" />
                  Detalhes do Projeto
                </button>
                {hasGallery && (
                  <button
                    onClick={() => setActiveTab("gallery")}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                      activeTab === "gallery"
                        ? "text-gray-900 border-b-2 border-gray-900 bg-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <ImageIcon className="h-4 w-4" />
                    Imagens do Projeto ({galleryImages.length})
                  </button>
                )}
              </div>
            </div>

            {/* Tab Content */}
	            <div className="overflow-y-auto max-h-[calc(90vh-60px)]">
              {activeTab === "details" && (
                <div>
                  {/* Header */}
                  <div className="relative p-8 pb-6 bg-gradient-to-br from-gray-50 to-white">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge variant="secondary" className="text-xs font-medium">
                            {project.category}
                          </Badge>
                          <span className="text-sm text-gray-500">{project.year}</span>
                          <button
                            onClick={onClose}
                            className="ml-auto p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-200 hover:scale-105"
                          >
                            <X className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4 leading-tight">
                          {project.title}
                        </h1>
                        <p className="text-lg text-gray-600 font-light leading-relaxed mb-6">{project.description}</p>

                        {/* Project Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{project.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="h-4 w-4" />
                            <span>{project.team}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{project.year}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                          {project.liveUrl && (
                            <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Ver Site
                            </Button>
                          )}
                          {project.githubUrl && (
                            <Button size="sm" variant="outline">
                              <Github className="h-4 w-4 mr-2" />
                              Código
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Project Image */}
                      <div className="lg:w-80 flex-shrink-0">
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                          <OptimizedImage
                            src={project.image}
                            alt={project.title}
                            width={320}
                            height={240}
                            className="w-full h-full object-cover"
                            quality={85}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="px-8 py-6 border-b border-gray-100">
                    <h2 className="text-xl font-light text-gray-900 mb-4">Tecnologias Utilizadas</h2>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  {project.features && (
                    <div className="px-8 py-6 border-b border-gray-100">
                      <h2 className="text-xl font-light text-gray-900 mb-4">Principais Funcionalidades</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {project.features.map((feature: string, index: number) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700 font-light">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Detailed Description */}
                  {project.detailedDescription && (
                    <div className="px-8 py-6">
                      <h2 className="text-xl font-light text-gray-900 mb-4">Descrição Detalhada</h2>
                      <div className="prose prose-gray max-w-none">
                        <div
                          className="text-sm text-gray-700 font-light leading-relaxed whitespace-pre-line"
                          dangerouslySetInnerHTML={{
                            __html: project.detailedDescription
                              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                              .replace(/## (.*?)$/gm, "<h3 class='text-lg font-medium text-gray-900 mt-6 mb-3'>$1</h3>")
                              .replace(/\*\*(.*?):\*\*/g, "<strong>$1:</strong>")
                              .replace(/- \*\*(.*?)\*\*/g, "- <strong>$1</strong>"),
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "gallery" && hasGallery && (
                <div className="p-8">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-light text-gray-900 mb-2">Imagens do Projeto</h2>
                    <p className="text-gray-600">Visualize todas as telas e seções do projeto</p>

                    {/* View Mode Toggle Buttons */}
                    {project.gallery.length > 1 && (
                      <div className="flex justify-center mt-4 mb-6">
                        <div className="bg-gray-100 rounded-lg p-1 flex">
                          <button
                            onClick={() => setViewMode("desktop")}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                              viewMode === "desktop"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                          >
                            Desktop
                          </button>
                          <button
                            onClick={() => setViewMode("mobile")}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                              viewMode === "mobile"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                          >
                            Mobile
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Get current gallery based on view mode */}
                  {(() => {
                    const currentGallery = project.gallery.find((g) => g.type === viewMode) || project.gallery[0]
                    const currentImages = currentGallery.images

                    return (
                      <>
                        {/* Main Gallery Image */}
                        <div className="relative mb-6">
                          <div className="relative bg-gray-100 rounded-xl overflow-hidden">
                            <OptimizedImage
                              src={currentImages[currentImageIndex]}
                              alt={`${project.title} - ${viewMode === "mobile" ? "Mobile" : "Desktop"} - Imagem ${currentImageIndex + 1}`}
                              width={viewMode === "mobile" ? 400 : 1200}
                              height={viewMode === "mobile" ? 800 : 800}
                              className={`w-full h-auto object-contain ${viewMode === "mobile" ? "max-h-[70vh]" : "max-h-[60vh]"}`}
                              quality={95}
                            />

                            {/* Navigation Arrows */}
                            {currentImages.length > 1 && (
                              <>
                                <button
                                  onClick={prevImage}
                                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                                >
                                  <ChevronLeft className="h-6 w-6 text-gray-600" />
                                </button>
                                <button
                                  onClick={nextImage}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                                >
                                  <ChevronRight className="h-6 w-6 text-gray-600" />
                                </button>
                              </>
                            )}

                            {/* Image Counter */}
                            {currentImages.length > 1 && (
                              <div className="absolute bottom-4 right-4 px-4 py-2 bg-black/70 text-white text-sm rounded-full">
                                {currentImageIndex + 1} de {currentImages.length}
                              </div>
                            )}

                            {/* View Mode Indicator */}
                            <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 text-white text-xs rounded-full">
                              {viewMode === "mobile" ? "📱 Mobile" : "🖥️ Desktop"}
                            </div>
                          </div>
                        </div>

                        {/* Thumbnail Grid */}
                        {currentImages.length > 1 && (
                          <div
                            className={`grid gap-3 ${viewMode === "mobile" ? "grid-cols-3 sm:grid-cols-4 md:grid-cols-5" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"}`}
                          >
                            {currentImages.map((image, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`relative overflow-hidden rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                                  viewMode === "mobile" ? "aspect-[9/16]" : "aspect-[4/3]"
                                } ${
                                  index === currentImageIndex
                                    ? "border-gray-900 ring-2 ring-gray-900/20"
                                    : "border-gray-200 hover:border-gray-400"
                                }`}
                              >
                                <OptimizedImage
                                  src={image}
                                  alt={`Thumbnail ${index + 1}`}
                                  width={viewMode === "mobile" ? 90 : 120}
                                  height={viewMode === "mobile" ? 160 : 90}
                                  className="w-full h-full object-cover"
                                  quality={70}
                                />
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200" />
                                {index === currentImageIndex && <div className="absolute inset-0 bg-gray-900/20" />}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Image Description */}
                        <div className="mt-6 text-center">
                          <p className="text-sm text-gray-600">
                            {viewMode === "mobile" ? "📱 Versão Mobile" : "🖥️ Versão Desktop"} - Imagem{" "}
                            {currentImageIndex + 1}:
                            {viewMode === "mobile"
                              ? " Interface otimizada para dispositivos móveis com navegação touch-friendly"
                              : " Layout completo para desktop com todas as funcionalidades visíveis"}
                          </p>
                        </div>
                      </>
                    )
                  })()}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
