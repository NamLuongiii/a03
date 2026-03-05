package services

import (
	"errors"
	"mime/multipart"
)

type EpubServiceInterface interface {
	Confirm(f *multipart.FileHeader) error
}

type EpubServiceImpl struct{}

func NewEpubService() EpubServiceInterface {
	return &EpubServiceImpl{}
}

func (e *EpubServiceImpl) Confirm(f *multipart.FileHeader) error {
	if mime := f.Header.Get("Content-Type"); mime != "application/epub+zip" {
		return errors.New("file is not epub")
	}
	return nil
}
