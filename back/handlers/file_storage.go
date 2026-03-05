package handlers

import (
	"fmt"
	"io"
	"mime"
	"path/filepath"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/google/uuid"
)

type StorageFolder string

const (
	FolderBookCovers   StorageFolder = "book-covers"
	FolderBookFiles    StorageFolder = "book-files"
	FolderAvatars      StorageFolder = "avatars"
	FolderAuthorImages StorageFolder = "author-images"
	FolderOthers       StorageFolder = "others"
	FolderUnzippedBook StorageFolder = "unzipped-book"
)

type FileStorageInterface interface {
	UploadFile(reader io.ReadSeeker, fileName string, folder StorageFolder) (string, error)
	DeleteFile(fileURL string, folder StorageFolder) error
	UploadFileNoUUID(reader io.ReadSeeker, fileName string, folder StorageFolder) (string, error)
	DeleteFolder(folderPath string) error
}

type FileStorage struct {
	s3Client   *s3.S3
	bucketName string
	region     string
	endpoint   string
}

func NewFileStorage(accessKey, secretKey, bucketName, region, endpoint string) FileStorageInterface {
	// Format endpoint với https:// nếu chưa có
	if endpoint != "" && !strings.HasPrefix(endpoint, "http") {
		endpoint = "https://" + endpoint
	}

	sess := session.Must(session.NewSession(&aws.Config{
		Credentials:      credentials.NewStaticCredentials(accessKey, secretKey, ""),
		Endpoint:         aws.String(endpoint),
		Region:           aws.String(region),
		S3ForcePathStyle: aws.Bool(false), // Virtual-hosted-style: bucket.endpoint/key
	}))

	return &FileStorage{
		s3Client:   s3.New(sess),
		bucketName: bucketName,
		region:     region,
		endpoint:   endpoint,
	}
}

func (f *FileStorage) UploadFile(
	reader io.ReadSeeker,
	fileName string,
	folder StorageFolder,
) (string, error) {
	// generate filename
	ext := filepath.Ext(fileName)
	name := strings.TrimSuffix(fileName, ext)

	key := fmt.Sprintf("%s/%s_%s%s", folder, name, uuid.New().String(), ext)

	// detect content type (optional but recommended)
	contentType := mime.TypeByExtension(ext)
	if contentType == "" {
		contentType = "application/octet-stream"
	}

	// upload directly (streaming)
	_, err := f.s3Client.PutObject(&s3.PutObjectInput{
		Bucket:             aws.String(f.bucketName),
		Key:                aws.String(key),
		Body:               reader,
		ACL:                aws.String("public-read"),
		ContentType:        aws.String(contentType),
		ContentDisposition: aws.String("inline"),
	})
	if err != nil {
		return "", err
	}

	publicURL := fmt.Sprintf(
		"https://%s.%s.digitaloceanspaces.com/%s",
		f.bucketName,
		f.region,
		key,
	)

	return publicURL, nil
}

func (f *FileStorage) UploadFileNoUUID(
	reader io.ReadSeeker,
	fileName string,
	folder StorageFolder,
) (string, error) {
	// generate filename
	ext := filepath.Ext(fileName)
	name := strings.TrimSuffix(fileName, ext)

	key := fmt.Sprintf("%s/%s%s", folder, name, ext)

	// detect content type (optional but recommended)
	contentType := mime.TypeByExtension(ext)
	if contentType == "" {
		contentType = "application/octet-stream"
	}

	// upload directly (streaming)
	_, err := f.s3Client.PutObject(&s3.PutObjectInput{
		Bucket:             aws.String(f.bucketName),
		Key:                aws.String(key),
		Body:               reader,
		ACL:                aws.String("public-read"),
		ContentType:        aws.String(contentType),
		ContentDisposition: aws.String("inline"),
	})
	if err != nil {
		return "", err
	}

	publicURL := fmt.Sprintf(
		"https://%s.%s.digitaloceanspaces.com/%s",
		f.bucketName,
		f.region,
		key,
	)

	return publicURL, nil
}

func (f *FileStorage) DeleteFile(fileURL string, folder StorageFolder) error {
	// Extract filename from URL
	filename := filepath.Base(fileURL)
	key := fmt.Sprintf("%s/%s", folder, filename)

	_, err := f.s3Client.DeleteObject(&s3.DeleteObjectInput{
		Bucket: aws.String(f.bucketName),
		Key:    aws.String(key),
	})

	return err
}

// DeleteFolder xóa toàn bộ object có chung prefix (dưới 1000 items)
func (f *FileStorage) DeleteFolder(folderPath string) error {
	if !strings.HasSuffix(folderPath, "/") {
		folderPath += "/"
	}

	// 1. Liệt kê danh sách object
	listOutput, err := f.s3Client.ListObjectsV2(&s3.ListObjectsV2Input{
		Bucket: aws.String(f.bucketName),
		Prefix: aws.String(folderPath),
	})
	if err != nil {
		return err
	}

	if len(listOutput.Contents) == 0 {
		return nil
	}

	// 2. Gom danh sách key để xóa
	var objects []*s3.ObjectIdentifier
	for _, item := range listOutput.Contents {
		objects = append(objects, &s3.ObjectIdentifier{Key: item.Key})
	}

	// 3. Thực thi xóa hàng loạt
	_, err = f.s3Client.DeleteObjects(&s3.DeleteObjectsInput{
		Bucket: aws.String(f.bucketName),
		Delete: &s3.Delete{
			Objects: objects,
			Quiet:   aws.Bool(true),
		},
	})

	return err
}
