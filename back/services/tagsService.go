package services

import "quickstart/models"

type TagsServiceInterfaceInterface interface {
	GetAll() (tags []models.Tags, err error)
}

type TagsServiceImpl struct {
	tagsRepository models.TagsRepository
}

func NewTagsService(tagsRepository models.TagsRepository) TagsServiceImpl {
	return TagsServiceImpl{
		tagsRepository: tagsRepository,
	}
}

func (t *TagsServiceImpl) GetAll() (tags []models.Tags, err error) {
	return t.tagsRepository.GetAll()
}
