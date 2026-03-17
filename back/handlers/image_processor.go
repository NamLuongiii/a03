package handlers

import (
	"bytes"
	"fmt"
	"image"
	"image/jpeg"
	"io"
	"mime/multipart"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/disintegration/imaging"
)

type ProcessedImage struct {
	Xs []byte
	Sm []byte
	Md []byte
}

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
	CropImage(fh *multipart.FileHeader) (*ProcessedImage, error)
	CreateFileNameJPEG(filename string) string
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
		if err := jpeg.Encode(b, resized, &jpeg.Options{Quality: 96}); err != nil {
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

func (p *ImageProcessor) CropImage(fh *multipart.FileHeader) (*ProcessedImage, error) {
	// Mở file gốc
	srcFile, e := fh.Open()
	if e != nil {
		return nil, e
	}
	defer srcFile.Close()

	// Decode ảnh
	img, e := imaging.Decode(srcFile)
	if e != nil {
		return nil, e
	}

	// Cắt bỏ 8% phần bottom (ngắn gọn nhất bằng CropAnchor)
	// Giữ lại 92% chiều cao tính từ Top
	newHeight := int(float64(img.Bounds().Dy()) * 0.92)
	dst := imaging.CropAnchor(img, img.Bounds().Dx(), newHeight, imaging.Top)

	// resize
	resizedMd := imaging.Fill(dst, 300, 480, imaging.Center, imaging.Lanczos)
	resizedSm := imaging.Fill(resizedMd, 150, 240, imaging.Center, imaging.Lanczos)
	resizedXs := imaging.Fill(resizedSm, 50, 80, imaging.Center, imaging.Lanczos)

	encodeToJpeg := func(img image.Image) ([]byte, error) {
		buf := new(bytes.Buffer)
		e := jpeg.Encode(buf, img, &jpeg.Options{Quality: 80})
		if e != nil {
			return nil, e
		}
		return buf.Bytes(), nil
	}

	bufMd, e := encodeToJpeg(resizedMd)
	bufSm, e := encodeToJpeg(resizedSm)
	bufXs, e := encodeToJpeg(resizedXs)
	if e != nil {
		return nil, e
	}

	return &ProcessedImage{
		Xs: bufXs,
		Sm: bufSm,
		Md: bufMd,
	}, nil
}

func (p *ImageProcessor) CreateFileNameJPEG(filename string) string {
	// 1. Lấy tên gốc và loại bỏ phần mở rộng
	base := filepath.Base(filename)
	ext := filepath.Ext(base)
	name := strings.TrimSuffix(base, ext)

	// 2. Làm sạch tên file:
	// - Chuyển sang chữ thường (Lower)
	// - Thay khoảng trắng bằng dấu gạch ngang (Slug)
	cleanName := strings.ToLower(name)
	cleanName = strings.ReplaceAll(cleanName, " ", "-")

	// 3. Có thể dùng regex để xóa ký tự đặc biệt nếu muốn cực kỳ an toàn
	reg, _ := regexp.Compile("[^a-z0-9-]+")
	cleanName = reg.ReplaceAllString(cleanName, "")

	return cleanName + ".jpeg"
}
