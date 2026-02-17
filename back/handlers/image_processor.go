package handlers

import (
	"fmt"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/disintegration/imaging"
	"github.com/gin-gonic/gin"
)

type ImageProcessor struct{}

type ImageProcessorInterface interface {
	ProcessHandler(c *gin.Context)
	ProcessImage(file *multipart.FileHeader) (*multipart.FileHeader, error)
}

func NewImageProcessor() *ImageProcessor {
	return &ImageProcessor{}
}

// Processor godoc
//
//	@Summary	image processing flow
//	@Tags		processor
//	@Router		/processor [post]
//	@Param		cover	formData	file	true	"Image to process"
func (p *ImageProcessor) ProcessHandler(c *gin.Context) {
	fh, err := c.FormFile("cover")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	file, err := fh.Open()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	defer file.Close()

	// decode ảnh
	img, err := imaging.Decode(file)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid image"})
		return
	}

	// tạo folder
	if err := os.MkdirAll("processed", os.ModePerm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ext := strings.ToLower(filepath.Ext(fh.Filename))
	baseName := strings.TrimSuffix(fh.Filename, ext)

	variants := map[string]int{
		"xs": 150,
		"sm": 300,
		"md": 500,
	}

	for v, w := range variants {
		h := int(float64(w) * 1.6)

		resized := imaging.Resize(img, w, h, imaging.Lanczos)

		filename := fmt.Sprintf("%s_%s%s", v, baseName, ext)
		fullPath := filepath.Join("processed", filename)

		out, err := os.Create(fullPath)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// encode theo đúng format gốc
		switch ext {
		case ".jpg", ".jpeg":
			err = imaging.Encode(out, resized, imaging.JPEG, imaging.JPEGQuality(80))
		case ".png":
			err = imaging.Encode(out, resized, imaging.PNG)
		default:
			out.Close()
			c.JSON(http.StatusBadRequest, gin.H{"error": "unsupported format"})
			return
		}

		out.Close()

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "processed successfully",
	})
}

func (p *ImageProcessor) ProcessImage(file *multipart.FileHeader) (*multipart.FileHeader, error) {
	return file, nil
}

// input multipart.FileHeader
// output 3 io.ReadSeeker
