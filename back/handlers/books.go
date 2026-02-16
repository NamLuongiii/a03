package handlers

import (
	"quickstart/models"

	"github.com/gin-gonic/gin"
)

type BooksHandler struct {
	bookRepository          models.BookRepositoryInterface
	categoryRepository      models.CategoryRepositoryInterface
	authorRepository        models.AuthorRepositoryInterface
	commentRepository       models.CommentRepositoryInterface
	featuredGroupRepository models.FeaturedBookGroupRepositoryInterface
	digitalBookRepository   models.DigitalBookRepositoryInterface
	bookSeriesRepository    models.BookSeriesRepositoryInterface
	bookRatingRepository    models.BookRatingRepositoryInterface
	fileStorage             FileStorageInterface
}

type BookParams struct {
	BookRepository          models.BookRepositoryInterface
	CategoryRepository      models.CategoryRepositoryInterface
	AuthorRepository        models.AuthorRepositoryInterface
	CommentRepository       models.CommentRepositoryInterface
	FeaturedGroupRepository models.FeaturedBookGroupRepositoryInterface
	DigitalBookRepository   models.DigitalBookRepositoryInterface
	BookSeriesRepository    models.BookSeriesRepositoryInterface
	BookRatingRepository    models.BookRatingRepositoryInterface
	FileStorage             FileStorageInterface
}

func NewBooksHandler(params BookParams) *BooksHandler {
	return &BooksHandler{
		bookRepository:          params.BookRepository,
		categoryRepository:      params.CategoryRepository,
		authorRepository:        params.AuthorRepository,
		commentRepository:       params.CommentRepository,
		featuredGroupRepository: params.FeaturedGroupRepository,
		digitalBookRepository:   params.DigitalBookRepository,
		bookSeriesRepository:    params.BookSeriesRepository,
		bookRatingRepository:    params.BookRatingRepository,
		fileStorage:             params.FileStorage,
	}
}

// GetBooks godoc
//
//	@Summary	Get all books
//	@Tags		books
//	@Router		/books [get]
//	@Success	200	{array}	models.Book	"OK"
func (h *BooksHandler) GetBooks(c *gin.Context) {
	books := make([]*models.Book, 0)
	c.JSON(200, books)
}

// GetFeaturedBooks godoc
//
//	@Summary	Get featured books
//	@Tags		books
//	@Router		/books/featured [get]
func (h *BooksHandler) GetFeaturedBooks(c *gin.Context) {
	return
}

// GetBookByID godoc
//
//	@Summary	Get a book by ID
//	@Tags		books
//	@Router		/books/{id} [get]
//	@Param		id	path	int	true	"Book ID"
func (h *BooksHandler) GetBookByID(c *gin.Context) {
	return
}

// GetCategories godoc
//
//	@Summary	Get all categories
//	@Tags		books
//	@Router		/books/categories [get]
func (h *BooksHandler) GetCategories(c *gin.Context) {
	return
}

// GetPopularBooks godoc
//
//	@Summary	Get popular books
//	@Tags		books
//	@Router		/books/popular [get]
func (h *BooksHandler) GetPopularBooks(c *gin.Context) {
	return
}

// GetAuthors godoc
//
//	@Summary	Get all authors
//	@Tags		books
//	@Router		/books/authors/{authorID} [get]
func (h *BooksHandler) GetAuthors(c *gin.Context) {
	return
}

// AddComment godoc
//
//	@Summary	Add a comment to a book
//	@Tags		books
//	@Router		/books/{bookID}/comments [post]
func (h *BooksHandler) AddComment(c *gin.Context) {
	return
}

// AddRating godoc
//
//	@Summary	Add a rating to a book
//	@Tags		books
//	@Router		/books/{bookID}/ratings [post]
func (h *BooksHandler) AddRating(c *gin.Context) {
	return
}

// GetBooksInSeries godoc
//
//	@Summary	Get books in a series
//	@Tags		books
//	@Router		/books/{bookId}/get-by-series [get]
func (h *BooksHandler) GetBooksInSeries(c *gin.Context) {
	return
}

// CreateBook godoc
//
//	@Summary	Create a new book
//	@Tags		books
//	@Router		/books [post]
//	@Accept		multipart/form-data
//	@Param		name		formData	string	true	"Book name"
//	@Param		description	formData	string	false	"Description"
//	@Param		summary		formData	string	false	"Summary"
//	@Param		category_id	formData	string	true	"Category ID"
//	@Param		author_id	formData	string	true	"Author ID"
//	@Param		cover		formData	file	true	"Cover image"
//	@Success	200			{object}	types.CommonResponse{data=models.Book}
//	@Security	BearerAuth
func (h *BooksHandler) CreateBook(c *gin.Context) {
	// Get file from the form
	file, err := c.FormFile("cover")
	if err != nil {
		c.JSON(400, gin.H{
			"success": false,
			"message": "Cover image is required",
		})
		return
	}

	// Upload file to DigitalOcean Spaces
	coverURL, err := h.fileStorage.UploadFile(file, FolderBookCovers)
	if err != nil {
		c.JSON(500, gin.H{
			"success": false,
			"message": "Failed to upload cover image: " + err.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"success": true,
		"data":    coverURL,
	})
}
