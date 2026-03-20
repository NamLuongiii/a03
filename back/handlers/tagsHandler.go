package handlers

import (
	"net/http"
	"quickstart/services"
	"quickstart/types"

	"github.com/gin-gonic/gin"
)

type TagsHandlerInterface interface {
	GetAll(c *gin.Context)
}

type TagsHandler struct {
	tagsService services.TagsServiceImpl
}

func NewTagsHandler(tagsService services.TagsServiceImpl) TagsHandlerInterface {
	return &TagsHandler{tagsService: tagsService}
}

// GetAll godoc
//
//	@Summary		Get all tags
//	@Description	Get all tags
//	@Tags			Tags
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	types.CommonResponse{data=[]models.Tags}
//	@Router			/tags [get]
func (t *TagsHandler) GetAll(c *gin.Context) {
	tags, err := t.tagsService.GetAll()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, types.CommonResponse{
		Success: true,
		Data:    tags,
	})
}
