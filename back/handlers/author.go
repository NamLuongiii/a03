package handlers

import (
	"net/http"
	"quickstart/middleware"
	"quickstart/models"
	"quickstart/types"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/gosimple/slug"
)

type AuthorHandler struct {
	authorRepository models.AuthorRepositoryInterface
}

func NewAuthorHandler(authorRepository models.AuthorRepositoryInterface) *AuthorHandler {
	return &AuthorHandler{authorRepository: authorRepository}
}

// GetAll godoc
//
//	@Summary		Get all authors
//	@Description	Get all authors
//	@Tags			Authors
//	@Accept			json
//	@Produce		json
//	@Param			page	query		int		false	"Page number"
//	@Param			size	query		int		false	"Number of items per page"
//	@Param			search	query		string	false	"Search term"
//	@Success		200		{object}	types.CommonResponse{data=types.PaginationData{items=[]models.Author}}
//	@Router			/authors [get]
func (ah *AuthorHandler) GetAll(c *gin.Context) {
	page, size, search := c.Query("page"), c.Query("size"), c.Query("search")
	// parse page to int
	pageInt, e := strconv.Atoi(page)
	if e != nil {
		pageInt = 1
	}
	// parse size to int
	sizeInt, e := strconv.Atoi(size)
	if e != nil {
		sizeInt = 12
	}

	pg, e := ah.authorRepository.GetAll(pageInt, sizeInt, search)
	if e != nil {
		c.Error(middleware.NewServerInternalError(e.Error()))
		return
	}
	c.JSON(http.StatusOK, types.CommonResponse{Success: true, Data: pg})
}

// Create godoc
//
//	@Summary		Create a new author
//	@Description	Create a new author
//	@Tags			Authors
//	@Accept			json
//	@Produce		json
//	@Param			author	body		models.Author	true	"Author object"
//	@Success		200		{object}	types.CommonResponse{data=models.Author}
//	@Router			/authors [post]
func (ah *AuthorHandler) Create(c *gin.Context) {
	var author models.Author

	if err := c.ShouldBindJSON(&author); err != nil {
		c.Error(middleware.NewBadRequestError(err.Error()))
		return
	}

	if author.Name == "" {
		c.Error(middleware.NewBadRequestError("name is required"))
		return
	}

	author.ID = slug.Make(author.Name)

	e := ah.authorRepository.Create(&author)
	if e != nil {
		c.Error(middleware.NewServerInternalError(e.Error()))
		return
	}

	c.JSON(http.StatusOK, types.CommonResponse{Success: true, Data: author})
}
