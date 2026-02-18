package handlers

import (
	"bytes"
	"fmt"
	"image"
	"image/jpeg"
	"io"
	"mime/multipart"
	"path/filepath"
	"strings"

	"github.com/disintegration/imaging"
)

type ImageProcessor struct{}

type ImageProcessorInterface interface {
	ProcessImage(fh *multipart.FileHeader) (
		io.ReadSeeker,
		io.ReadSeeker,
		io.ReadSeeker,
		string,
		string,
		string,
		error)
}

func NewImageProcessor() *ImageProcessor {
	return &ImageProcessor{}
}

func (p *ImageProcessor) ProcessImage(fh *multipart.FileHeader) (
	io.ReadSeeker,
	io.ReadSeeker,
	io.ReadSeeker,
	string,
	string,
	string,
	error,
) {

	// 1️⃣ Validate extension
	ext := strings.ToLower(filepath.Ext(fh.Filename))
	if ext != ".jpg" && ext != ".jpeg" && ext != ".png" {
		return nil, nil, nil, "", "", "", fmt.Errorf("unsupported file type: %s", ext)
	}

	// 2️⃣ Validate MIME type (double-check)
	contentType := fh.Header.Get("Content-Type")
	if contentType != "image/jpeg" &&
		contentType != "image/jpg" &&
		contentType != "image/png" {
		return nil, nil, nil, "", "", "", fmt.Errorf("invalid content-type: %s", contentType)
	}

	// 3️⃣ Open file
	file, err := fh.Open()
	if err != nil {
		return nil, nil, nil, "", "", "", err
	}
	defer file.Close()

	// 4️⃣ Decode (support jpeg + png)
	img, format, err := image.Decode(file)
	if err != nil {
		return nil, nil, nil, "", "", "", err
	}

	// Extra safety: check a decoded format
	if format != "jpeg" && format != "png" {
		return nil, nil, nil, "", "", "", fmt.Errorf("invalid image format: %s", format)
	}

	variants := map[string]int{
		"xs": 100,
		"sm": 200,
		"md": 500,
	}

	ratio := 1.6

	// 1️⃣ init map
	buf := make(map[string]*bytes.Buffer)

	for v, w := range variants {

		// 2️⃣ resize
		h := int(float64(w) * ratio)
		resized := imaging.Resize(img, w, h, imaging.Lanczos)

		// 3️⃣ create a buffer for each variant
		b := &bytes.Buffer{}

		// 4️⃣ encode
		if err := jpeg.Encode(b, resized, &jpeg.Options{Quality: 80}); err != nil {
			return nil, nil, nil, "", "", "", err
		}

		// 5️⃣ save buffer vào map
		buf[v] = b
	}

	n := strings.TrimSuffix(fh.Filename, filepath.Ext(fh.Filename))
	// 6️⃣ convert sang io.ReadSeeker
	return bytes.NewReader(buf["xs"].Bytes()),
		bytes.NewReader(buf["sm"].Bytes()),
		bytes.NewReader(buf["md"].Bytes()),
		"xs" + "_" + n + ".jpeg",
		"sm" + "_" + n + ".jpeg",
		"md" + "_" + n + ".jpeg",
		nil

}
