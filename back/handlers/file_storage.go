package handlers

import (
	"errors"
	"fmt"
	"io"
	"mime"
	"path"
	"path/filepath"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
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
	UploadFile(reader io.ReadSeeker, fileName string, folders ...string) (string, error)
	DeleteFile(key string) error
	DeleteFolder(folders ...string) error
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
		S3ForcePathStyle: aws.Bool(true), // Virtual-hosted-style: bucket.endpoint/key
	}))

	return &FileStorage{
		s3Client:   s3.New(sess),
		bucketName: bucketName,
		region:     region,
		endpoint:   endpoint,
	}
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

func (f *FileStorage) DeleteFolder(folders ...string) error {
	// Khong cho delete cac StorageFolder
	if len(folders) == 0 {
		return errors.New("folder is required")
	}

	if len(folders) == 1 && f.IsStorageFolder(folders[0]) {
		return errors.New("invalid folder")
	}

	// 1. Tạo prefix từ các tham số truyền vào (ví dụ: folderA/folderB/)
	prefix := strings.Join(folders, "/")
	if prefix != "" && !strings.HasSuffix(prefix, "/") {
		prefix += "/"
	}

	// 2. Liệt kê tất cả objects có prefix này
	listInput := &s3.ListObjectsV2Input{
		Bucket: aws.String(f.bucketName),
		Prefix: aws.String(prefix),
	}

	listOutput, err := f.s3Client.ListObjectsV2(listInput)
	if err != nil {
		return fmt.Errorf("failed to list objects with prefix %s: %v", prefix, err)
	}

	// Nếu không có object nào, coi như đã xóa xong
	if len(listOutput.Contents) == 0 {
		return nil
	}

	// 3. Chuẩn bị danh sách các objects để xóa
	var objectsToDelete []*s3.ObjectIdentifier
	for _, item := range listOutput.Contents {
		objectsToDelete = append(objectsToDelete, &s3.ObjectIdentifier{
			Key: item.Key,
		})
	}

	// 4. Thực hiện xóa hàng loạt (Bulk Delete)
	deleteInput := &s3.DeleteObjectsInput{
		Bucket: aws.String(f.bucketName),
		Delete: &s3.Delete{
			Objects: objectsToDelete,
			Quiet:   aws.Bool(true), // Trả về lỗi nếu có, không cần trả về list thành công
		},
	}

	_, err = f.s3Client.DeleteObjects(deleteInput)
	if err != nil {
		return fmt.Errorf("failed to delete folder %s: %v", prefix, err)
	}

	return nil
}

// godoc Uplaod new file and return key
func (f *FileStorage) UploadFile(reader io.ReadSeeker, fileName string, folders ...string) (string, error) {
	// 1. Nối các folder lại với nhau: folderA/folderB/folderC
	folderPath := strings.Join(folders, "/")

	// 2. Dùng path.Join để đảm bảo key không bị thừa dấu //
	// key sẽ có dạng: folderA/folderB/folderC/filename.jpg
	key := path.Join(folderPath, fileName)

	ext := filepath.Ext(fileName)
	contentType := mime.TypeByExtension(ext)
	if contentType == "" {
		contentType = "application/octet-stream"
	}

	_, err := f.s3Client.PutObject(&s3.PutObjectInput{
		Bucket:             aws.String(f.bucketName),
		Key:                aws.String(key),
		Body:               reader,
		ACL:                aws.String("public-read"),
		ContentType:        aws.String(contentType),
		ContentDisposition: aws.String("inline"),
	})

	// Trả về path bắt đầu bằng /
	return "/" + key, err
}

// go doc Delete file by key
func (f *FileStorage) DeleteFile(key string) error {
	_, e := f.s3Client.DeleteObject(&s3.DeleteObjectInput{
		Bucket: aws.String(f.bucketName),
		Key:    aws.String(key),
	})
	return e
}

func (f *FileStorage) IsStorageFolder(folder string) bool {
	switch StorageFolder(folder) {
	case FolderBookCovers,
		FolderBookFiles,
		FolderAvatars,
		FolderAuthorImages,
		FolderOthers,
		FolderUnzippedBook:
		return true
	default:
		return false
	}
}
